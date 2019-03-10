import * as firebase from "firebase";
import {getDay, getMonth, getYear} from "./time";


// timeScale Argument Rules:
// 0 - Day
// 1 - Month
// 2 - Year


// ----Updating Fields in statistics table----
//
// Table contains entries with a date map like:
// {date: {day: 2, month: 9, year: 2019}


export const incrementStatistic = async (statisticType,incrementAmount=1) =>
{

    const db = firebase.firestore();
    const statisticsCollection = db.collection('statistics');

    const day = getDay();
    const month = getMonth();
    const year = getYear();

    const statisticsQuery = statisticsCollection
        .where("date.day","==",day)
        .where("date.month","==",month)
        .where("date.year","==",year);

    const statisticSingleQuery = statisticsQuery.limit(1);
    const statisticSnapshot = await statisticSingleQuery.get();


    if (statisticSnapshot.empty) //If there is no document with this date
    {
        const statisticObject = {date: {day,month,year}};
        statisticObject[statisticType] = incrementAmount;

        await statisticsCollection.add(statisticObject);

    }
    else //If there exists a document with this date
    {
        const statisticID = statisticSnapshot.docs[0].id;
        const statisticValue = statisticSnapshot.docs[0].data()[statisticType];

        let newStatisticValue = incrementAmount;

        if (statisticValue)
            newStatisticValue += statisticValue;

        const statisticDocument = statisticsCollection.doc(statisticID);
        await statisticDocument.update(statisticType,newStatisticValue);
    }


};


//Users

export const getNumberOfNewUsers = async (timeScale) => {
    //TODO: Test
    return getStatistic("authentication.signUp",timeScale);

};

export const getNumberOfLogins = async (timeScale) => {
    //TODO: Test
    return getStatistic("authentication.signIn",timeScale);

};


//Trips

export const getNumberOfTripsCreated = async (timeScale) => {
    //TODO: Test
    return getStatistic("reservation.make",timeScale);

};

export const getNumberOfBikesUnlocked = async (timeScale) => {
    //TODO: Test
    return getStatistic("station.unlock",timeScale);

};

export const getNumberOfTripsCompleted = async (timeScale) => {
    //TODO: Test
    return getStatistic("station.return",timeScale);

};

export const getNumberOfTripsCancelled = async (timeScale) => {
    //TODO: Test
    return getStatistic("reservation.cancel",timeScale);

};


//Tasks

export const getNumberOfTasksCreated = async (timeScale) => {
    //TODO: Test
    return getStatistic("task.make",timeScale);

};

export const getNumberOfTasksCompleted = async (timeScale) => {
    //TODO: Test
    return getStatistic("task.complete",timeScale);

};

export const getNumberOfTasksReassigned = async (timeScale) => {
    //TODO: Test
    return getStatistic("task.reassign",timeScale);

};

export const getNumberOfTasksExtended = async (timeScale) => {
    //TODO: Test
    return getStatistic("task.extend",timeScale);

};


//Report

export const getNumberOfReportsCreated = async (timeScale) => {
    //TODO: Test
    return getStatistic("report.make",timeScale);

};


//Station

export const getStationStatistics = async (timeScale) => {
    //TODO: Implement

};



const getStatistic = async (statisticType,timeScale) => {
    //TODO: Test

    const db = firebase.firestore();
    const statisticsCollection = db.collection('statistics');

    const day = getDay();
    const month = getMonth();
    const year = getYear();

    let statisticsQuery;

    if (timeScale === 0)
    {
        statisticsQuery = statisticsCollection
            .where("date.day", "==", day)
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    else if (timeScale === 1)
    {
        statisticsQuery = statisticsCollection
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    else if (timeScale === 2)
    {
        statisticsQuery = statisticsCollection
            .where("date.year", "==", year);
    }
    else
        throw new Error("getStatistic takes an integer argument of either 0 (day), 1 (month), or 2 (year)");


    const statisticsSnapshot = await statisticsQuery.get();
    const statisticsDocs = statisticsSnapshot.docs;

    let statisticSum = 0;

    //Sum the values
    for (let doc in statisticsDocs)
    {
        const statisticData = doc.data();
        const statisticValue = statisticData[statisticType];

        statisticSum += statisticValue;
    }

    return statisticSum;

};