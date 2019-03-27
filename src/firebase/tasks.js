import * as firebase from "firebase";
// import * as time from "time";
import {getCurrentDateString, getCurrentTimeString, getDateString, getTimeString} from "./time";
import {incrementStatistic} from "./statistics";

const FieldValue = firebase.firestore.FieldValue;


//Task statuses:
//  pending     - Operator hasn't accepted the task yet
//  accepted    - Operator has accepted the task and is in the process of doing it
//  complete    - Operator has completed the task
//  reassigned  - Operator has shifted responsibility of task to another operator


//Make a new task with the given information
export const makeNewTask = async ({operator, category, deadlineDate, deadlineTime, comment, report, bike, station}) => {
    //Not all the information is required
    //The only necessary information is category and comment

    //Create empty task object
    const theTask = {};

    //Get the user's ID
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    //Set up firestore links
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

    //Increment the making task statistics
    await incrementStatistic("task.make");

    //Return the operator for displaying to a user
    return theTask['operator'];

};


//Return a list of task objects
export const getTasks = async (operatorID) => {

    //Prepare variables
    const theTasksCollection = {};
    const theTasksArray = [];
    let counter = 0;

    //Get user's User ID
    const auth = firebase.auth();
    let uid = auth.currentUser.uid;

    //If there is a given operator, then the user id variable is set to it
    if (operatorID) uid = operatorID;

    //Set up firestore links
    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');

    //Query to get the tasks for the given operator
    const operatorTasksCollection = tasksCollection.where('operator', '==', uid);

    //Get the tasks data
    const operatorTasksSnapshot = await operatorTasksCollection.get();
    const operatorTasksDocs = operatorTasksSnapshot.docs;

    //For every task
    for (let doc in operatorTasksDocs) {

        //Store appropriate information
        const operatorTaskDoc = operatorTasksDocs[doc];
        const operatorTaskID = operatorTaskDoc.id;
        const operatorTaskData = operatorTaskDoc.data();

        //Reverse the comments array since displaying it must be most recent first
        operatorTaskData['comments'] = operatorTaskData['comments'].reverse();

        //Add the task to an array
        theTasksArray[counter++] = {id: operatorTaskID, data: operatorTaskData};
    }

    //Below is a function very similar to the sorting function from getTrips. Refer to that for more information
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

    //Same as getTrips
    theTasksArray.forEach(obj => {
        const id = obj.id;
        const data = obj.data;

        theTasksCollection[id] = data;

    });

    //Return the collection object
    return theTasksCollection;

};


//Return a single task object using the given task ID
const getTask = async (taskID) => {

    //Set up firestore links
    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    //Get the task data
    const taskSnapshot = await taskDocument.get();

    //If the task doesn't exist, throw an error
    if (!taskSnapshot.exists) throw new Error("Task does not exist.");

    //Return the task data
    return taskSnapshot.data();

};


//Update the status of a given task to the given status
export const updateTaskStatus = async (taskID, newStatus) => {

    //Ensure the given status is an appropriate string
    if (!(newStatus === "accepted" || newStatus === "complete" || newStatus === "reassigned"))
        throw new Error("newStatus must be one of 'accepted', 'complete' or 'reassigned'.");

    //Set up firestore links
    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    //Update the status in the firestore to the new given status
    await taskDocument.update({status: newStatus});

    //If the new status was complete, then increment the statistic for completed tasks
    if (newStatus === "complete")
        await incrementStatistic("task.complete");

};


//Function to reassign a task to a new operator
export const reassignTask = async (taskID, comment, operatorID) => {

    //Ensure all inputs are given
    if (!taskID) throw new Error("No task was specified.");
    if (!operatorID) throw new Error("No operator was specified.");
    if (!comment || comment === "") throw new Error("No comment was given.");

    //Set up firestore links
    const db = firebase.firestore();
    const auth = firebase.auth();
    const tasksCollection = db.collection('tasks');

    //Ensure that the given operator is not the logged in user
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


//Add a comment to a given task
export const addTaskComment = async (taskID, comment) => {

    //Ensure the inputs are given
    if (!taskID) throw new Error("No task was specified.");
    if (!comment || comment === "") throw new Error("No comment was given.");

    //Get the user's ID
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    //Set up firestore links
    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    //Create a comment object storing the user, the comment and the time of creation
    const timeObject = {date: getCurrentDateString(), time: getCurrentTimeString()};
    const commentObject = {user: uid, comment: comment, time: timeObject};

    //Add the comment to the comments array in the task document in the firestore
    await taskDocument.update({comments: FieldValue.arrayUnion(commentObject)}); //Array union is a firestore function which

};


//Function to update the deadline of a task... not currently in use
export const updateTaskDeadline = async (taskID, newDate, newTime) => {

    //Ensure dates are valid
    if (!Date.parse(newDate)) throw new Error("Invalid date.");
    if (!Date.parse(newTime)) throw new Error("Invalid time.");

    //Set up firestore links
    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    //Get the task document
    const taskDoc = await taskDocument.get();

    //If the task doesn't exist, throw an error
    if (!taskDoc.exists) throw new Error("Task not found.");

    //Get the deadline date of the task
    const taskData = taskDoc.data();
    const taskDeadline = taskData['deadline'];
    const taskDeadlineString = taskDeadline['date'] + " " + taskDeadline['time'];
    const taskDeadlineTime = Date.parse(taskDeadlineString);

    //Get a value for the new given deadline date/time
    const newTaskDeadlineTime = Date.parse(newDate + " " + newTime);

    //If the old date is after the new date, then throw an error
    //Deadlines must be extended, not "contracted"
    if (taskDeadlineTime > newTaskDeadlineTime) throw new Error("New deadline must be after old deadline.");

    //Update the task data in the firestore
    await taskDocument.update({
        'deadline.date': newDate,
        'deadline.time': newTime
    });

    //Increment the statistics for extending task deadlines
    await incrementStatistic("task.extend");

};


//Function to pick a random operator
const chooseRandomOperator = async () => {

    //Set up firestore links
    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const operatorsCollection = usersCollection.where('type', '==', "operator");

    //Get all operators data
    const operatorsSnapshot = await operatorsCollection.get();
    const operatorsArray = operatorsSnapshot.docs;

    //If there exists at least one operator
    if (operatorsArray.length > 0) {
        //Select a random integer based on the size of the operator array
        const randomNumber = Math.round(Math.random() * (operatorsArray.length - 1));

        //Get the id of the randomly selected operator and return it
        const operatorID = operatorsArray[randomNumber].id;
        return operatorID;
    }
    else {
        //Throw an error if there exists no operators
        throw new Error("There are no operators.");
    }

};

//TODO: Move this to time.js
//Function to get a date object for a week from now
const getNextWeekDateObject = () => {

    //Get current date object
    const nextWeek = new Date();

    //Set the objects day to be 7 days from current
    //TODO: Ensure this works when the date is less than seven days away from the end of the month,
    // e.g. if today is 29th, what happens when you add 7?
    nextWeek.setDate(nextWeek.getDate() + 7);

    //Get strings for the date and time
    const dateString = getDateString(nextWeek);
    const timeString = getTimeString(nextWeek);

    //Create object with those strings
    const dateObject = {
        date: dateString,
        time: timeString
    };

    //Return that object
    return dateObject;

};