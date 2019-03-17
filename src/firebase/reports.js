import * as firebase from "firebase";

import {getCurrentDateString, getCurrentTimeString} from "./time";
import {makeNewTask} from "./tasks";
import {incrementStatistic} from "./statistics";


//Make a customer report and attach it to a task, assigning that task to an operator
export const makeReport = async (reservationID, category, comment) => {

    if (!reservationID) throw new Error("No reservation was given");
    if (!category) throw new Error("No category was given");
    if (!comment || comment === "") throw new Error("No comment was given");

    const theReport = {};

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();
    const reportsCollection = db.collection('reports');


    theReport['user'] = uid;
    theReport['reservation'] = reservationID;
    theReport['category'] = category;
    theReport['comment'] = comment;
    theReport['time'] = {
        date: getCurrentDateString(),
        time: getCurrentTimeString()
    };

    const reportDocument = await reportsCollection.add(theReport);
    const reportID = reportDocument.id;


    const operatorID = await makeNewTask({
        reportID,
        category: "User Report",
        comment: "See attached report..."
    });

    await incrementStatistic("report.make");

    return operatorID

};

