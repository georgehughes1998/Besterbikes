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


// ---Types of statistics---
//
// authentication.signUp
// authentication.signIn
//
// reservation.[stationID].[bikeType].make
// reservation.[stationID].[bikeType].cancel
//
// station.[stationID].unlock
// station.[stationID].return
//
// task.make
// task.complete
// task.reassign
// task.extend
//
// report.make




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

    let statisticID;
    let statisticValue;

    if (statisticSnapshot.empty) //If there is no document with this date
    {
        const statisticObject = {date: {day,month,year}};
        statisticObject[statisticType] = incrementAmount;

        await statisticsCollection.add(statisticObject);

    }
    else //If there exists a document with this date
    {
        statisticID = statisticSnapshot.docs[0].id;
        let statisticValue = statisticSnapshot.docs[0].data();
        let doesExist = true;

        //Loop through the string path to get the data at that location
        const statisticSplit = statisticType.split(".");
        for (let s in statisticSplit) {
            if (statisticValue)
                statisticValue = statisticValue[statisticSplit[s]];
            else {
                doesExist = false;
                break;
            }
        }

        let newStatisticValue = incrementAmount;

        if (doesExist) {

            if (statisticValue && ((typeof statisticValue) == "number"))
                newStatisticValue += statisticValue;
        }

        //console.log("Old value: " + statisticValue + ", New value:" + newStatisticValue);

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

//Gets all the statistics for a particular station
export const getStationStatistics = async (stationID,year=-1,month=-1,day=-1) => {
    //TODO: Test

    const statisticPaths = [
        `reservation.${stationID}.road.make`,
        `reservation.${stationID}.road.cancel`,
        `reservation.${stationID}.mountain.make`,
        `reservation.${stationID}.mountain.cancel`,
        `station.${stationID}.unlock`,
        `station.${stationID}.return`
    ];

    return getStatistics(statisticPaths,year,month,day);

};




const getStatistics = async (statisticTypes, year=-1, month=-1, day=-1) =>
{
    //TODO: Test

    const db = firebase.firestore();
    const statisticsCollection = db.collection('statistics');

    const statisticsObject = {};

    let statisticsQuery;

    if (day !== -1 && month !== -1 && year !== -1)
    {
        statisticsQuery = statisticsCollection
            .where("date.day", "==", day)
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    else if (month !== -1 && year !== -1)
    {
        statisticsQuery = statisticsCollection
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    else if (year !== -1)
    {
        statisticsQuery = statisticsCollection
            .where("date.year", "==", year);
    }
    else
    {
        statisticsQuery = statisticsCollection;
    }

    const statisticsSnapshot = await statisticsQuery.get();
    const statisticsDocs = statisticsSnapshot.docs;


    for (let doc in statisticsDocs)
    {
        const statisticData = statisticsDocs[doc].data();

        const day = statisticData.date.day;
        const month = statisticData.date.month;
        const year = statisticData.date.year;

        for (let s in statisticTypes)
        {
            const statisticType = statisticTypes[s]; //Either this or it's actually just s
            const statistic = statisticData[statisticType];

            statisticsObject[statisticType][year][month][day] = statistic;

        }
    }

    return statisticsObject;
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