// ==================================================== //
//            Reports Firestore Functionality           //
// ==================================================== //

import * as firebase from "firebase";

import {getCurrentDateString, getCurrentTimeString} from "./time";
import {makeNewTask} from "./tasks";
import {incrementStatistic} from "./statistics";


//Make a customer report and attach it to a task, assigning that task to an operator
export const makeReport = async (reservationID, category, comment) => {

    //Return errors if the inputs aren't given
    if (!reservationID) throw new Error("No reservation was given");
    if (!category) throw new Error("No category was given");
    if (!comment || comment === "") throw new Error("No comment was given");

    //Set up empty report object
    const theReport = {};

    //Get the logged in user's user ID
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    //Set up firestore links
    const db = firebase.firestore();
    const reportsCollection = db.collection('reports');

    //Populate the report object
    theReport['user'] = uid;
    theReport['reservation'] = reservationID;
    theReport['category'] = category;
    theReport['comment'] = comment;
    theReport['time'] = { //Report's time object has two parts: one for date and one for time
        //which are specified by the functions for getting time strings
        date: getCurrentDateString(),
        time: getCurrentTimeString()
    };

    //Add the report object to the firestore and record its id
    const reportDocument = await reportsCollection.add(theReport);
    const reportID = reportDocument.id;

    //Make new task with the report attached
    //Make a note of the operator assigned to it
    const operatorID = await makeNewTask({
        reportID,
        category: "User Report",
        comment: "See attached report..."
    });

    //Increment the statistic for making a report
    await incrementStatistic("report.make");

    //Return the operator so that it can be displayed to the customer
    return operatorID

};

