import * as firebase from "firebase";

//Task statuses:
//  Pending
//  Active
//  Complete
//  Reassigned



export const makeTask = async ({operatorID, category, deadline, comment, reportID, bikeID, stationID}) => {
    //TODO: implement

    //TODO: Create task and populate with the given data (not all of the inputs are guaranteed to be there)

};


//Return a list of task objects
export const getTasks = async () => {
    //TODO: Test

    const theTasks = [];

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const operatorTasksCollection = tasksCollection.where('operatorID','==',uid);

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
    //TODO: implement

    const db = firebase.firestore();
    const tasksCollection = db.collection('tasks');
    const taskDocument = tasksCollection.doc(taskID);

    await taskDocument.update({status:newStatus});

    return 0;
};


export const reassignTask = async (taskID, comment, operatorID) => {
    //TODO: implement
};


export const addTaskComment = async (taskID, comment) => {
    //TODO: implement
};


export const updateTaskDeadline = async (taskID, newDate) => {
    //TODO: implement
};


