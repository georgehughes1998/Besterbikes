import * as firebase from "firebase";
import {getDay, getMonth, getYear} from "./time";
import {getJSONFromFile} from "../dataHandling/handleJSON";


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
// authentication.updateDetails
//
// reservation.[stationID].[bikeType].make
// reservation.[stationID].[bikeType].cancel
// reservation.update
//
// station.[stationID].unlock
// station.[stationID].unlockOperator
// station.[stationID].return
//
// task.make
// task.complete
// task.reassign
// task.extend
//
// report.make


export const incrementStatistic = async (statisticType, incrementAmount = 1) => {

    const db = firebase.firestore();
    const statisticsCollection = db.collection('statistics');

    const day = getDay();
    const month = getMonth();
    const year = getYear();

    const statisticsQuery = statisticsCollection
        .where("date.day", "==", day)
        .where("date.month", "==", month)
        .where("date.year", "==", year);

    const statisticSingleQuery = statisticsQuery.limit(1);
    const statisticSnapshot = await statisticSingleQuery.get();

    let statisticID;
    let statisticValue;

    if (statisticSnapshot.empty) //If there is no document with this date
    {
        const statisticObject = {date: {day, month, year}};
        //statisticObject[statisticType] = incrementAmount;

        const statisticDoc = await statisticsCollection.add(statisticObject);
        await statisticDoc.update(statisticType, incrementAmount);

    }
    else //If there exists a document with this date
    {
        statisticID = statisticSnapshot.docs[0].id;
        let statisticValue = statisticSnapshot.docs[0].data();
        let doesExist = true;

        //Loop through the string path to get the data at that location
        const statisticSplit = statisticType.split(/[._]/);
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
        await statisticDocument.update(statisticType, newStatisticValue);

    }

};


//Users

export const getNumberOfNewUsers = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("authentication.signUp", timeScale);

};

export const getNumberOfLogins = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("authentication.signIn", timeScale);

};

export const getNumberOfUpdateDetails = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("authentication.updateDetails", timeScale);

};


//Trips

export const getNumberOfTripsCreated = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("reservation.make", timeScale);

};

export const getNumberOfBikesUnlocked = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("station.unlock", timeScale);

};

export const getNumberOfTripsCompleted = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("station.return", timeScale);

};

export const getNumberOfTripsCancelled = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("reservation.cancel", timeScale);

};


//Tasks

export const getNumberOfTasksCreated = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("task.make", timeScale);

};

export const getNumberOfTasksCompleted = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("task.complete", timeScale);

};

export const getNumberOfTasksReassigned = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("task.reassign", timeScale);

};

export const getNumberOfTasksExtended = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("task.extend", timeScale);

};


//Report

export const getNumberOfReportsCreated = async (timeScale) => {
    //TODO: Test
    return getSingleStatistic("report.make", timeScale);

};


export const getAllStationStatistics = async (year = -1, month = -1, day = -1) => {

    const stationsObjects = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
    const stations = Object.keys(stationsObjects);

    const stationStatistics = [];

    stations.forEach(async stationID => {

        stationStatistics[stationID] = await getStationStatistics(stationID,year,month,day);
        // console.log(Object.keys(stationStatistics));

    });

    return stationStatistics;

};


//Station

//Gets all the statistics for a particular station
export const getStationStatistics = async (stationID, year = -1, month = -1, day = -1) => {
    //TODO: Test

    const statisticPaths = [
        `reservation.${stationID}.road.make`,
        `reservation.${stationID}.road.cancel`,
        `reservation.${stationID}.mountain.make`,
        `reservation.${stationID}.mountain.cancel`,
        `station.${stationID}.unlock`,
        `station.${stationID}.unlockOperator`,
        `station.${stationID}.return`
    ];

    return await getStatistics(statisticPaths, year, month, day);

};

export const getAuthenticationStatistics = async (year = -1, month = -1, day = -1) => {

    const statisticPaths = [
        "authentication.signIn",
        "authentication.signUp",
        "authentication.updateDetails"
    ];

    return await getStatistics(statisticPaths, year, month, day);

};

export const getTasksStatistics = async (year = -1, month = -1, day = -1) => {

    const statisticPaths = [
        "task.make",
        "task.complete",
        "task.reassign",
        "task.extend",

        "report.make"

    ];

    return await getStatistics(statisticPaths, year, month, day);

};


const getStatistics = async (statisticTypes, year = -1, month = -1, day = -1) => {
    //TODO: Test

    // console.log("---------------------------------------");
    // console.log(statisticTypes);
    // console.log(year, month, day);

    const db = firebase.firestore();
    const statisticsCollection = db.collection('statistics');

    const statisticsObject = {};

    let statisticsQuery;

    if (day !== -1 && month !== -1 && year !== -1) {
        statisticsQuery = statisticsCollection
            .where("date.day", "==", day)
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    else if (month !== -1 && year !== -1) {
        statisticsQuery = statisticsCollection
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    else if (year !== -1) {
        statisticsQuery = statisticsCollection
            .where("date.year", "==", year);
    }
    else {
        statisticsQuery = statisticsCollection;
    }

    const statisticsSnapshot = await statisticsQuery.get();
    const statisticsDocs = statisticsSnapshot.docs;


    for (let doc in statisticsDocs) {
        const statisticData = statisticsDocs[doc].data();

        const day = statisticData.date.day;
        const month = statisticData.date.month;
        const year = statisticData.date.year;

        for (let s in statisticTypes) {

            const statisticType = statisticTypes[s]; //Either this or it's actually just s

            // const statistic = statisticData[statisticType];

            let statisticValue = statisticData;

            //Loop through the string path to get the data at that location
            const statisticSplit = statisticType.split(/[._]/);

            for (let s in statisticSplit) {
                if (statisticValue) {
                    statisticValue = statisticValue[statisticSplit[s]];
                }
                else {
                    statisticValue = 0;
                    break;
                }
            }

            if (!statisticValue)
                statisticValue = 0;


            const statisticTypeStringArray = statisticType.split(/[._]/);
            let statisticTypeString = "";

            statisticTypeStringArray.forEach(s => {
                statisticTypeString += s + "_";
            });


            statisticTypeString = statisticTypeString.slice(0, -1); //All but last char

            if (!statisticsObject[statisticTypeString])
                statisticsObject[statisticTypeString] = {};
            if (!statisticsObject[statisticTypeString][year])
                statisticsObject[statisticTypeString][year] = {};
            if (!statisticsObject[statisticTypeString][year][month])
                statisticsObject[statisticTypeString][year][month] = {};
            if (!statisticsObject[statisticTypeString][year][month][day])
                statisticsObject[statisticTypeString][year][month][day] = {};

            statisticsObject[statisticTypeString][year][month][day] = statisticValue;

        }
    }

    return statisticsObject;
};


export const changeNestedToGraphFormat = (obj) => {

    const newObj = {};

    obj.map(year => {
        const yearObj = obj[year];
        yearObj.map(month => {
            const monthObj = yearObj[month];
            monthObj.map(day => {

                const theValue = monthObj[day];

                const dateString = day.toString() + "-" + month.toString() + "-" + year.toString();

                newObj['date'] = dateString;
                newObj['value'] = theValue;

            })
        })
    });

    return newObj;

};


const getSingleStatistic = async (statisticType, timeScale) => {
    //TODO: Test

    const db = firebase.firestore();
    const statisticsCollection = db.collection('statistics');

    const day = getDay();
    const month = getMonth();
    const year = getYear();

    let statisticsQuery;

    if (timeScale === 0) {
        statisticsQuery = statisticsCollection
            .where("date.day", "==", day)
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    else if (timeScale === 1) {
        statisticsQuery = statisticsCollection
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    else if (timeScale === 2) {
        statisticsQuery = statisticsCollection
            .where("date.year", "==", year);
    }
    else
        throw new Error("getStatistic takes an integer argument of either 0 (day), 1 (month), or 2 (year)");


    const statisticsSnapshot = await statisticsQuery.get();
    const statisticsDocs = statisticsSnapshot.docs;

    let statisticSum = 0;

    //Sum the values
    for (let doc in statisticsDocs) {
        const statisticData = statisticsDocs[doc].data();

        let statisticValue = statisticData;

        //Loop through the string path to get the data at that location
        const statisticSplit = statisticType.split(/[._]/);

        for (let s in statisticSplit) {
            if (statisticValue) {
                statisticValue = statisticValue[statisticSplit[s]];
            }
            else {
                statisticValue = 0;
                break;
            }
        }

        statisticSum += statisticValue;
    }

    return statisticSum;

};