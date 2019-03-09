import * as firebase from "firebase";
// import * as time from "time";
import {getDateString, getTimeString} from "./time";

//Task statuses:
//  pending
//  accepted
//  complete
//  reassigned



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
        theTask['deadline'] = {date: deadlineDate,
                               time: deadlineTime};
    else
        theTask['deadline'] = getNextWeekDateObject();

    //Assign comment to the task
    if (comment)
        theTask['comments'] = [{user:uid,comment:comment}];
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

};


//Return a list of task objects
export const getTasks = async () => {
    //TODO: Test

    const theTasks = [];

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const operatorTasksCollection = tasksCollection.where('operator','==',uid);

    const operatorTasksSnapshot = await operatorTasksCollection.get();

    for (let operatorTaskDoc in operatorTasksSnapshot.docs)
    {
        const operatorTaskID = operatorTaskDoc.id;
        const operatorTaskData = operatorTaskDoc.data();
        theTasks[operatorTaskID] = operatorTaskData;
    }


    return theTasks;

};


//Return a single task object
//This function may be redundant...
const getTask = async (taskID) => {
    //TODO: Test

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    const taskSnapshot = await taskDocument.get();
    const taskData = taskSnapshot.data();

    return taskData;

};




export const updateTaskStatus = async (taskID, newStatus) => {
    //TODO: Test

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    await taskDocument.update({status:newStatus});

};


export const reassignTask = async (taskID, comment, operatorID) => {
    //TODO: implement

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');

    //Add the comment to the task
    await addTaskComment(taskID,comment);

    //Change the operator ID for the new task
    const theTask = await getTask(taskID);
    theTask['operator'] = operatorID;

    //Add the new task to the firestore
    await tasksCollection.add(theTask);

    //Update the task status for the old task
    await updateTaskStatus(taskID,'reassigned');

};


export const addTaskComment = async (taskID, comment) => {
    //TODO: Test

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    await taskDocument.update({comments:db.FieldValue.arrayUnion({user:uid,comment:comment})});

};


export const updateTaskDeadline = async (taskID, newDate, newTime) => {
    //TODO: Test

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    await taskDocument.update({'deadline.date':newDate,
                                    'deadline.time':newTime});

};


const chooseRandomOperator = async () => {
    //TODO: Test

    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const operatorsCollection = usersCollection.where('type','==',"operator");

    const operatorsSnapshot = await operatorsCollection.get();
    const operatorsArray = operatorsSnapshot.docs;


    if (operatorsArray.length > 0)
    {
        //Select a random operator
        const randomNumber = Math.random() * (operatorsArray.length - 1);
        const operatorID = operatorsArray[randomNumber].id;

        return operatorID;
    }
    else
    {
        throw new Error("There are no operators.");
    }

};

const getNextWeekDateObject = () => {
    //TODO: Test

    const nextWeek = new Date();

    nextWeek.setDate(nextWeek.getDate()+7);

    const dateString = getDateString(nextWeek);
    const timeString = getTimeString(nextWeek);

    const dateObject = {date: dateString,
                        time: timeString};

    return dateObject;

};