import * as firebase from "firebase";

import {getCurrentDateString, getCurrentTimeString} from "./time";
import {makeTask} from "./tasks";


//Make a customer report and attach it to a task, assigning that task to an operator
export const makeReport = async (reservationID, category, comment) => {
    //TODO: Test

    const theReport = {};

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();
    const reportsCollection = db.collection('reservations');


    theReport['user'] = uid;
    theReport['reservation'] = reservationID;
    theReport['category'] = category;
    theReport['comment'] = comment;
    theReport['time']['date'] = getCurrentDateString();
    theReport['time']['time'] = getCurrentTimeString();


    const reportDocument = await reportsCollection.add(theReport);
    const reportID = reportDocument.id;


    await makeTask({reportID,category: "userReport"});

};

