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


//Function to increment a statistic in the firestore by a specified amount
export const incrementStatistic = async (statisticType, incrementAmount = 1) => {

    //Set up firestore links
    const db = firebase.firestore();
    const statisticsCollection = db.collection('statistics');

    //Get numbers for the date
    const day = getDay();
    const month = getMonth();
    const year = getYear();

    //Find the document corresponding to the current date
    const statisticsQuery = statisticsCollection
        .where("date.day", "==", day)
        .where("date.month", "==", month)
        .where("date.year", "==", year);

    //Ensure only one document is brought back and retrieve it
    //TODO: Cause an error if there is more than one found
    const statisticSingleQuery = statisticsQuery.limit(1);
    const statisticSnapshot = await statisticSingleQuery.get();

    //Prepare variables
    let statisticID;
    let statisticValue;

    //If there is no document with this date
    if (statisticSnapshot.empty)
    {
        //Create an object with the current date
        const statisticObject = {date: {day, month, year}};

        //Add the object to the firestore
        const statisticDoc = await statisticsCollection.add(statisticObject);

        //Add the statistic to be incremented
        await statisticDoc.update(statisticType, incrementAmount);

    }

    //If there already exists a document with this date
    else
    {
        //Get the id and data from the first document (there should only be one)
        statisticID = statisticSnapshot.docs[0].id;
        let statisticValue = statisticSnapshot.docs[0].data();

        let doesExist = true; //Flag to ensure that the field exists

        //Loop through the string path to get the data at that location
        //
        //Every time a . or _ is found, we use the text between it as a key
        //then we jump into that element of the object until either it doesn't
        //exist or we have reached the end of the string.
        const statisticSplit = statisticType.split(/[._]/);
        for (let s in statisticSplit) {
            if (statisticValue)
                statisticValue = statisticValue[statisticSplit[s]]; //Jump into the next level of the object
            else {
                doesExist = false; //Flag to say that the field doesn't exist yet
                break;
            }
        }

        //Prepare the new statistic value
        let newStatisticValue = incrementAmount;

        //If the value was found
        if (doesExist) {
            //If the value found is a number
            if (statisticValue && ((typeof statisticValue) == "number"))
                newStatisticValue += statisticValue; //Increase the new statistic value by that number
        }

        //Link to the statistic document and update the statistic (which adds it if it doesn't already exist)
        const statisticDocument = statisticsCollection.doc(statisticID);
        await statisticDocument.update(statisticType, newStatisticValue);

    }

};



//Gets all the reservation statistics for all stations
export const getAllReservationStatistics = async (year = -1, month = -1, day = -1) => {

    //Get a list of station names
    const stationsObjects = await JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
    const stations = Object.keys(stationsObjects);

    //Prepare an empty object for storing the statistics
    const stationStatistics = {};

    //For every station name
    for (let stationN in stations) {
        //Get the station ID
        const stationID = stations[stationN];

        //Get the reservation statistics for that station
        stationStatistics[stationID] = await getReservationStatistics(stationID, year, month, day);
    }

    //Return the statistics
    return stationStatistics;

};

//Gets all the reservation statistics for a particular station
export const getReservationStatistics = async (stationID, year = -1, month = -1, day = -1) => {

    //List of paths to be interpreted by the get statistics function
    const statisticPaths = [ //Includes the station ID in the string
        `reservation.${stationID}.road.make`,
        `reservation.${stationID}.mountain.make`,
        `reservation.${stationID}.road.cancel`,
        `reservation.${stationID}.mountain.cancel`,
    ];

    //Get the statistics
    return await getStatistics(statisticPaths, year, month, day);

};


//Gets all the station statistics for all stations
export const getAllStationStatistics = async (year = -1, month = -1, day = -1) => {

    //Reminiscent of above function

    const stationsObjects = await JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
    const stations = Object.keys(stationsObjects);

    const stationStatistics = {};

    for (let stationN in stations) {
        const stationID = stations[stationN];
        stationStatistics[stationID] = await getStationStatistics(stationID, year, month, day);
    }

    return stationStatistics;

};

//Gets all the station statistics for a particular station
export const getStationStatistics = async (stationID, year = -1, month = -1, day = -1) => {

    //Reminiscent of above function

    const statisticPaths = [
        `station.${stationID}.unlock`,
        `station.${stationID}.return`,
        `station.${stationID}.unlockOperator`
    ];

    return await getStatistics(statisticPaths, year, month, day);

};

//Get all authentication statistics
export const getAuthenticationStatistics = async (year = -1, month = -1, day = -1) => {

    //Reminiscent of above function

    const statisticPaths = [
        "authentication.signIn",
        "authentication.signUp",
        "authentication.updateDetails"
    ];

    return await getStatistics(statisticPaths, year, month, day);

};


//Get all task statistics
export const getTasksStatistics = async (year = -1, month = -1, day = -1) => {

    //Reminiscent of above function

    const statisticPaths = [
        "task.make",
        "task.complete",
        "task.reassign",
        "task.extend",

        "report.make"

    ];

    return await getStatistics(statisticPaths, year, month, day);

};


//Auxiliary function to get all statistics of the types given by the specified list
const getStatistics = async (statisticTypes, year = -1, month = -1, day = -1) => {

    //Set up firestore links
    const db = firebase.firestore();
    const statisticsCollection = db.collection('statistics');

    //Prepare a statistics object
    const statisticsObject = {};

    //Prepare a dynamic variable for the query
    let statisticsQuery;

    //If day, month and year are all specified, the query accounts for all
    if (day !== -1 && month !== -1 && year !== -1) {
        statisticsQuery = statisticsCollection
            .where("date.day", "==", day)
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    //If the year and month are specified, the query accounts for both
    else if (month !== -1 && year !== -1) {
        statisticsQuery = statisticsCollection
            .where("date.month", "==", month)
            .where("date.year", "==", year);
    }
    //If the year alone is specified, the query accounts for that
    else if (year !== -1) {
        statisticsQuery = statisticsCollection
            .where("date.year", "==", year);
    }
    //Otherwise it will include all dates
    else {
        statisticsQuery = statisticsCollection;
    }

    //Retrieve the data
    const statisticsSnapshot = await statisticsQuery.get();
    const statisticsDocs = statisticsSnapshot.docs;

    //For every date
    for (let doc in statisticsDocs) {
        //Store the data
        const statisticData = statisticsDocs[doc].data();

        //Make note of the date
        const day = statisticData.date.day;
        const month = statisticData.date.month;
        const year = statisticData.date.year;

        //For every given type
        for (let s in statisticTypes) {

            //Get the type
            const statisticType = statisticTypes[s];

            //Store the value from the document data
            let statisticValue = statisticData;

            //Loop through the string path to get the data at that location
            const statisticSplit = statisticType.split(/[._]/);
            //Reminiscent of increment statistic, refer to that for more details
            for (let s in statisticSplit) {
                if (statisticValue) {
                    statisticValue = statisticValue[statisticSplit[s]];
                }
                else {
                    statisticValue = 0;
                    break;
                }
            }

            //If the value is undefined, then set it to 0
            //This might be redundant
            if (!statisticValue)
                statisticValue = 0;

            //Compile a string consisting of the JSON paths seperated by underscores
            const statisticTypeStringArray = statisticType.split(/[._]/);
            let statisticTypeString = "";

            statisticTypeStringArray.forEach(s => {
                statisticTypeString += s + "_";
            });
            statisticTypeString = statisticTypeString.slice(0, -1); //All but last char

            //Create nested objects if they don't exist
            if (!statisticsObject[statisticTypeString])
                statisticsObject[statisticTypeString] = {};
            if (!statisticsObject[statisticTypeString][year])
                statisticsObject[statisticTypeString][year] = {};
            if (!statisticsObject[statisticTypeString][year][month])
                statisticsObject[statisticTypeString][year][month] = {};
            if (!statisticsObject[statisticTypeString][year][month][day])
                statisticsObject[statisticTypeString][year][month][day] = {};

            //Populate the statistics object for returning
            statisticsObject[statisticTypeString][year][month][day] = statisticValue;

        }
    }

    //Return the statistics object
    return statisticsObject;
};



//Function used by react component to turn the gathered statistics data into a
//format that can be understood by Victory Graph.
export const changeNestedToGraphFormat = (obj) => {

    const newObj = [];

    //Get the keys the object
    const objKeys = Object.keys(obj);

    //For every key (year)
    objKeys.map(yearKey => {
        //The year is the key
        const year = yearKey;

        //Get the months
        const yearObj = obj[yearKey];
        const yearObjKeys = Object.keys(yearObj);

        //Map over the months
        yearObjKeys.map(monthKey => {
            //The month is the key
            const month = monthKey;

            //Get the days
            const monthObj = yearObj[monthKey];
            const monthObjKeys = Object.keys(monthObj);

            //Map over every day
            monthObjKeys.map(dayKey => {
                //The day is the key
                const day = dayKey;

                //Store the statistic value
                const theValue = monthObj[day];

                //Create a string of the date
                const dateString = day.toString() + "-" + month.toString() + "-" + year.toString();

                //Create an entry containing the date and the statistic and add it to the return object
                const newEntry = {date: dateString, value: theValue} ; //Since Victory Graph likes two dimensional objects, date is the x axis and value is the y axis
                newObj.push(newEntry);

            })
        })
    });

    //Return the object
    return newObj;

};