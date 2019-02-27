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
    //TODO: implement
};

//Return a single task object
const getTask = async (taskID) => {
    //TODO: implement
};



//Update
export const updateTaskStatus = async (taskID, newStatus) => {
    //TODO: implement
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


