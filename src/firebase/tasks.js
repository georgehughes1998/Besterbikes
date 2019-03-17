import * as firebase from "firebase";
// import * as time from "time";
import {getCurrentDateString, getCurrentTimeString, getDateString, getTimeString} from "./time";
import {incrementStatistic} from "./statistics";
import {parseDate} from "tough-cookie";

const FieldValue = firebase.firestore.FieldValue;


//Task statuses:
//  pending     - Operator hasn't accepted the task yet
//  accepted    - Operator has accepted the task and is in the process of doing it
//  complete    - Operator has completed the task
//  reassigned  - Operator has shifted responsibility of task to another operator


export const makeNewTask = async ({operator, category, deadlineDate, deadlineTime, comment, report, bike, station}) => {
    //TODO: Test

    const theTask = {};

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');


    //Assign status to the task
    theTask['status'] = "pending";

    //Assign operator to the task
    if (operator)
        theTask['operator'] = operator;
    else
        theTask['operator'] = await chooseRandomOperator();


    //Assign category to the task
    if (category)
        theTask['category'] = category;
    else
        throw new Error("No category was specified");


    //Assign deadline to the task
    if (deadlineDate && deadlineTime)
        theTask['deadline'] = {
            date: deadlineDate,
            time: deadlineTime
        };
    else
        theTask['deadline'] = getNextWeekDateObject();


    //Assign comment to the task
    if (comment && comment !== "")
        theTask['comments'] = [{
            user: uid,
            comment: comment,
            time: {date: getCurrentDateString(), time: getCurrentTimeString()}
        }];
    else
        throw new Error('No comment was specified');


    //Assign report to the task
    if (report)
        theTask['report'] = report;

    //Assign bike to the task
    if (bike)
        theTask['bike'] = bike;

    //Assign station to the task
    if (station)
        theTask['station'] = station;


    //Add task to the firestore
    await tasksCollection.add(theTask);

    // console.log(theTask);

    await incrementStatistic("task.make");

    return theTask['operator'];

};


//Return a list of task objects
export const getTasks = async (operatorID) => {
    //TODO: Test

    //TODO: Add operatorID as argument

    const theTasksCollection = {};
    const theTasksArray = [];
    let counter = 0;

    const auth = firebase.auth();
    let uid = auth.currentUser.uid;

    if (operatorID) uid = operatorID;

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const operatorTasksCollection = tasksCollection.where('operator', '==', uid);

    const operatorTasksSnapshot = await operatorTasksCollection.get();
    const operatorTasksDocs = operatorTasksSnapshot.docs;

    for (let doc in operatorTasksDocs) {
        const operatorTaskDoc = operatorTasksDocs[doc];

        const operatorTaskID = operatorTaskDoc.id;
        const operatorTaskData = operatorTaskDoc.data();

        operatorTaskData['comments'] = operatorTaskData['comments'].reverse();

        theTasksArray[counter++] = {id: operatorTaskID, data: operatorTaskData};
    }

    theTasksArray.sort(function (obj1, obj2) {

        const date1 = obj1['data']['deadline']['date'];
        const time1 = obj1['data']['deadline']['time'];
        const status1 = obj1['data']['status'];

        const date2 = obj2['data']['deadline']['date'];
        const time2 = obj2['data']['deadline']['time'];
        const status2 = obj2['data']['status'];

        const theDate1 = Date.parse(date1 + " " + time1);
        const theDate2 = Date.parse(date2 + " " + time2);

        const statusPriorityMap = {
            pending: 2,
            active: 2,
            complete: 1,
            reassigned: 0
        };

        //TODO: Test
        if (statusPriorityMap[status1] < statusPriorityMap[status2])
            return 1;
        if (statusPriorityMap[status1] > statusPriorityMap[status2])
            return -1;


        if (theDate1 < theDate2)
            return -1;
        if (theDate1 > theDate2)
            return 1;
        else
            return 0;
    });

    theTasksArray.forEach(obj => {
        const id = obj.id;
        const data = obj.data;

        theTasksCollection[id] = data;

    });

    return theTasksCollection;

};


//Return a single task object
const getTask = async (taskID) => {

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    const taskSnapshot = await taskDocument.get();
    if (!taskSnapshot.exists)   throw new Error("Task does not exist.");
    return taskSnapshot.data();

};


export const updateTaskStatus = async (taskID, newStatus) => {

    if (!(newStatus === "accepted" || newStatus === "complete" || newStatus === "reassigned"))
        throw new Error("newStatus must be one of 'accepted', 'complete' or 'reassigned'.");

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    await taskDocument.update({status: newStatus});

    if (newStatus === "complete")
        await incrementStatistic("task.complete");

};


export const reassignTask = async (taskID, comment, operatorID) => {

    if (!taskID)                    throw new Error("No task was specified.");
    if (!operatorID)                throw new Error("No operator was specified.");
    if (!comment || comment === "") throw new Error("No comment was given.");

    const db = firebase.firestore();
    const auth = firebase.auth();
    const tasksCollection = db.collection('tasks');

    if (auth.currentUser)
        if (auth.currentUser.uid === operatorID)
            throw new Error("Can't reassign a task to yourself");

    //Add the comment to the task
    await addTaskComment(taskID, comment);

    //Change the operator ID for the new task
    const theTask = await getTask(taskID);
    theTask['operator'] = operatorID;
    theTask['status'] = "pending";

    //Add the new task to the firestore
    await tasksCollection.add(theTask);

    //Update the task status for the old task
    await updateTaskStatus(taskID, 'reassigned');

    await incrementStatistic("task.reassign");

};


export const addTaskComment = async (taskID, comment) => {

    if (!taskID)                    throw new Error("No task was specified.");
    if (!comment || comment === "") throw new Error("No comment was given.");

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    const timeObject = {date: getCurrentDateString(), time: getCurrentTimeString()};
    const commentObject = {user: uid, comment: comment, time: timeObject};

    await taskDocument.update({comments: FieldValue.arrayUnion(commentObject)});

};


export const updateTaskDeadline = async (taskID, newDate, newTime) => {

    if (!Date.parse(newDate)) throw new Error("Invalid date.");
    if (!Date.parse(newTime)) throw new Error("Invalid time.");

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    const taskDoc = await taskDocument.get();

    if (!taskDoc.exists) throw new Error("Task not found.");

    const taskData = taskDoc.data();
    const taskDeadline = taskData['deadline'];
    const taskDeadlineString = taskDeadline['date'] + " " + taskDeadline['time'];
    const taskDeadlineTime = Date.parse(taskDeadlineString);

    const newTaskDeadlineTime = Date.parse(newDate + " " + newTime);

    if (taskDeadlineTime > newTaskDeadlineTime) throw new Error("New deadline must be after old deadline.");

    await taskDocument.update({
        'deadline.date': newDate,
        'deadline.time': newTime
    });

    await incrementStatistic("task.extend");

};


const chooseRandomOperator = async () => {

    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const operatorsCollection = usersCollection.where('type', '==', "operator");

    const operatorsSnapshot = await operatorsCollection.get();
    const operatorsArray = operatorsSnapshot.docs;


    if (operatorsArray.length > 0) {
        //Select a random operator
        const randomNumber = Math.round(Math.random() * (operatorsArray.length - 1));

        const operatorID = operatorsArray[randomNumber].id;

        return operatorID;
    }
    else {
        throw new Error("There are no operators.");
    }

};

const getNextWeekDateObject = () => {
    //TODO: Test

    const nextWeek = new Date();

    nextWeek.setDate(nextWeek.getDate() + 7);

    const dateString = getDateString(nextWeek);
    const timeString = getTimeString(nextWeek);

    const dateObject = {
        date: dateString,
        time: timeString
    };

    return dateObject;

};