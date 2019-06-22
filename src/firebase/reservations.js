// ==================================================== //
//         Reservations Firestore Functionality         //
// ==================================================== //

import * as firebase from "firebase";
import {incrementStatistic} from "./statistics";
import {getCurrentDateString, getCurrentTimeString} from "./time";
import {makeNewTask} from "./tasks";

//Firestore functionality for manipulating fields remotely
const FieldValue = firebase.firestore.FieldValue;

//Set up limiting constants
const maxNumberOfBikesCanReserve = 8;
const maxReserveHoursLimit = 24;
const maxActiveHoursLimit = 1;
const stationCapacity = 35;
const maxCapacityPercentage = 0.7;
const minCapacityPercentage = 0.3;


//Function to make a number of reservations using the given data
export const makeReservations = async ({startDate, startTime, station, mountainBikes, roadBikes, accessoriesArray = []}, user) => {

    //Decide upon the time that the reservation cannot be booked after
    //(a reservation can only be booked 24 hours in advance - based on the limiting constants above)
    const startTimeString = startDate + " " + startTime;
    const startTimeDate = Date.parse(startTimeString);
    const currentTime = new Date();
    const futureLimitTime = (new Date).setHours(currentTime.getHours() + maxReserveHoursLimit);

    //Ensure the number of bikes are integers
    roadBikes = parseInt(roadBikes);
    mountainBikes = parseInt(mountainBikes);

    //Ensure the given time is suitable for making a reservation
    if (startTimeDate < currentTime)
        throw new Error("Cannot book a reservation in the past");
    if (startTimeDate > futureLimitTime)
        throw new Error("Cannot book a reservation more than " + maxReserveHoursLimit.toString() + " hours ahead.");

    //In case value is blank and parseInt returns null
    if (!roadBikes)
        roadBikes = 0;
    if (!mountainBikes)
        mountainBikes = 0;

    //If the date or time isn't given, throw an error
    if (!startDate)
        throw new Error("No date was selected.");
    if (!startTime)
        throw new Error("No time was selected.");

    //Get the number of bikes currently available
    const numberOfAvailableRoadBikes = await getNumberOfAvailableBikes(station, "road");
    const numberOfAvailableMountainBikes = await getNumberOfAvailableBikes(station, "mountain");

    //Prevent the user from reserving an absurd number of bikes
    if (roadBikes > maxNumberOfBikesCanReserve || mountainBikes > maxNumberOfBikesCanReserve)
        throw new Error("Cannot reserve more than " + maxNumberOfBikesCanReserve.toString() + " bikes at once.");

    //Ensure that there are enough bikes at the selected station for the order
    if (numberOfAvailableRoadBikes < roadBikes)
        throw new Error("Not enough road bikes available at selected station.");
    if (numberOfAvailableMountainBikes < mountainBikes)
        throw new Error("Not enough mountain bikes available at selected station.");

    //Make sure the number of bikes selected is greater than zero
    if (mountainBikes < 0 || roadBikes < 0)
        throw new Error("Number of bikes selected cannot be less than zero.");


    //Set up firestore links
    const db = firebase.firestore();
    const reservationsCollection = db.collection('reservations');

    //Get the user's id
    const auth = firebase.auth();
    let uid = auth.currentUser.uid;
    if (user)
        uid = user;

    //Empty array to store the reservations made
    const reservationsIDArray = [];

    //Create an object template to be used for the reservations
    const reservationDocument = {
        start: {
            time: {
                date: startDate,
                time: startTime
            },
            station: station
        },
        creation: { //Creation date and time are selected using the current time
            //This is used to order trips upon displaying them
            time: {
                date: getCurrentDateString(),
                time: getCurrentTimeString()
            }
        },
        accessories: accessoriesArray, //Unimplemented
        user: uid,
        status: 'inactive', //Reservations always begin as inactive
    };

    if (roadBikes > 0) {
        //Make a reservation for every road bike
        for (let i = 0; i < roadBikes; i++) {
            const reservationID = await makeSingleReservation(reservationsCollection, reservationDocument, 'road');
            //Add the reservation id to the reservations array
            reservationsIDArray.push(reservationID);
        }

        //Set the new number of available bikes at the station
        const newNumberOfAvailableRoadBikes = numberOfAvailableRoadBikes - roadBikes;
        await setNumberOfAvailableBikes(station, newNumberOfAvailableRoadBikes, "road");
    }

    //Duplicate of previous except for mountain bikes
    if (mountainBikes > 0) {
        for (let i = 0; i < mountainBikes; i++) {
            const reservationID = await makeSingleReservation(reservationsCollection, reservationDocument, 'mountain');
            reservationsIDArray.push(reservationID);
        }

        const newNumberOfAvailableMountainBikes = numberOfAvailableMountainBikes - mountainBikes;
        await setNumberOfAvailableBikes(station, newNumberOfAvailableMountainBikes, "mountain");
    }

    //Call function to add reservations to the user's reservation array... now redundant
    await appendUserReservationsArray(reservationsIDArray);

    //Increment the appropriate statistic
    await incrementStatistic("reservation." + station + ".road.make", roadBikes);
    await incrementStatistic("reservation." + station + ".mountain.make", mountainBikes);

    //Return upon success
    return "success";

};


//Function to get the number of available bikes
export const getNumberOfAvailableBikes = async (station, bikeType) => {

    //Set up firestore links
    const db = firebase.firestore();
    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(station);

    return thisStationDocument.get()
        .then(doc => {

            //Get the given station data
            const thisStationData = doc.data();

            //Find the number of bikes from the array of the given bike type and return it
            const bikes = thisStationData['bikes'][bikeType];
            return bikes['numberOfAvailableBikes'];

        })
        .catch(err => {
            return err
        }); //Return the error upon failure

};


//Function to set the number of available bikes at a station
export const setNumberOfAvailableBikes = async (stationID, numberOfAvailableBikes, bikeType) => {

    //Don't allow the station to be set to a value that is under/over max capacity
    if (numberOfAvailableBikes > stationCapacity)
        throw new Error("Station is full");
    if (numberOfAvailableBikes < 0)
        throw new Error("Station is empty");

    //Set up firestore links
    const db = firebase.firestore();
    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(stationID);

    //Update the number of available bikes at the station to the new given value
    let bikesObject = {};
    bikesObject[`bikes.${bikeType}.numberOfAvailableBikes`] = numberOfAvailableBikes;
    await thisStationDocument.update(bikesObject);

    //Check for station over capacity threshold and create a task if so
    if ((numberOfAvailableBikes / stationCapacity) > maxCapacityPercentage) {
        const category = "Station Over Capacity Threshold";
        const comment = "Alert: the attached station is over "
            + (maxCapacityPercentage * 100).toString()
            + "% full.";

        const tasksCollection = db.collection('tasks');
        const tasksQuery = tasksCollection.where('category', '==', category)
            .where('status', '==', 'pending')
            .where('station', '==', stationID);

        const tasksSnapshot = await tasksQuery.get();

        if (tasksSnapshot.empty)
            await makeNewTask({category, comment, station: stationID})
    }

    //Check for station under capacity threshold and create a task if so
    else if ((numberOfAvailableBikes / stationCapacity) < minCapacityPercentage) {
        const category = "Station Under Capacity Threshold";
        const comment = "Alert: the attached station is under "
            + (minCapacityPercentage * 100).toString()
            + "% full.";

        const tasksCollection = db.collection('tasks');
        const tasksQuery = tasksCollection.where('category', '==', category)
            .where('status', '==', 'pending')
            .where('station', '==', stationID);

        const tasksSnapshot = await tasksQuery.get();
        if (tasksSnapshot.empty)
            await makeNewTask({category, comment, station: stationID});
    }

    //Return upon success
    return "success"

};


//Now redundant
//Adds a list of reservations to the user's reservation array
const appendUserReservationsArray = async (reservationReferences) => {

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();

    const usersCollection = db.collection('users');
    const currentUserDocument = usersCollection.doc(uid);

    await currentUserDocument.update({reservationsArray: FieldValue.arrayUnion.apply(null, reservationReferences)});

};


//Function to make a single reservation based on a reservation template
const makeSingleReservation = async (reservationsCollection, reservationDocument, bikeType) => {

    //Set the reservation bike type
    reservationDocument['bikeType'] = bikeType;

    //Create a new document for the reservation with the given reservation document
    const addPromise = reservationsCollection.add(reservationDocument);

    return addPromise
        .then(ref => {
            //Return the id of the new reservation
            return ref.id;
        })
        .catch(err => {
            return err
        });
};


//Function to get a collection of trip objects for the purpose of displaying to a user
export const getTrips = async (filterStatus = "", userID = "", maxNumberOfTrips = 10) => {

    //Set up firestore links
    const db = firebase.firestore();
    const reservationsCollection = db.collection('reservations');


    //This ensures that all trips that should be active will be marked as active.
    await updateTrips();

    //Prepare all variables
    let reservationsQuery;
    let fullReservationsArray = [];
    let fullReservationsCollection = {};
    let counter = 0;

    //Use the logged in user's ID if no user was given
    if (userID === "") {
        const currentUser = firebase.auth().currentUser;
        if (currentUser)
            userID = currentUser.uid;
        else
            return null;
    }

    //Filter the query using the filter variable if it was given, otherwise do nothing
    if (filterStatus !== "")
        reservationsQuery = reservationsCollection.where('status', "==", filterStatus);
    else
        reservationsQuery = reservationsCollection;

    //Filter the query to only trips for the given user and retrieve the data
    reservationsQuery = reservationsQuery.where('user', '==', userID);
    const reservationSnapshot = await reservationsQuery.get();

    //Populate an array with all of the reservations
    reservationSnapshot.docs.forEach(doc => {
        fullReservationsArray[counter++] = {id: doc.id, data: doc.data()};
    });

    //Sort the array of reservations based on the date/times
    fullReservationsArray.sort(function (obj1, obj2) {

        //Function used to compare two reservation objects to determine which one should be
        //visually prioritised to the user.

        //Get status, date and time for the first reservation
        const status1 = obj1['data']['status'];
        const date1 = obj1['data']['creation']['time']['date'];
        const time1 = obj1['data']['creation']['time']['time'];

        //Get status, date and time for the second reservation
        const status2 = obj2['data']['status'];
        const date2 = obj2['data']['creation']['time']['date'];
        const time2 = obj2['data']['creation']['time']['time'];

        //Turn the date and times in a number
        const theDate1 = Date.parse(date1 + " " + time1);
        const theDate2 = Date.parse(date2 + " " + time2);

        //Priority map to order reservations by status
        const statusPriorityMap = {
            active: 4,
            inactive: 3,
            unlocked: 2,
            complete: 1,
            cancelled: 0
        };

        //Firstly, order by status
        if (statusPriorityMap[status1] < statusPriorityMap[status2])
            return 1;
        if (statusPriorityMap[status1] > statusPriorityMap[status2])
            return -1;

        //Secondly, (if the status is the same for both the compared reservations) order by date number
        if (theDate1 < theDate2)
            return 1;
        if (theDate1 > theDate2)
            return -1;
        else
            return 0;
    });

    //Fill up the collection object with the now sorted array of reservations.
    //Since objects maintain their order, the reservations can be fed into the object
    //one by one and they will remain in that position upon displaying.
    fullReservationsArray.forEach(obj => {
        const id = obj['id'];
        const data = obj['data'];

        fullReservationsCollection[id] = data;
    });

    //Return the reservations collection
    return fullReservationsCollection;

};


//Reserve an array of accessories
const reserveAccessories = async (accessoriesArray) => {

    //For every given accessory, call the reserve accessory function
    accessoriesArray.forEach(async accessoryID => {
        await reserveAccessory(accessoryID);
    })

};

//Reserve a single accessory
const reserveAccessory = async (accessoryID) => {

    //Set up firestore links
    const db = firebase.firestore();
    const accessoriesCollection = db.collection('accessories')
        .where('status', '==', 'available'); //Query to only let it be reserved if it's available

    //Get the given accessory's data
    const accessoryDocument = accessoriesCollection.doc(accessoryID);
    const accessorySnapshot = await accessoryDocument.get();

    //If the accessory was found, set the accessory to be reserved
    if (accessorySnapshot.exists)
        await accessoryDocument.update('status', 'reserved');
    else
    //Otherwise throw an error
        throw new Error("Accessory is not available for reserving.");

};


//Cancel the given reservation
export const cancelReservation = async (reservationID) => {

    //Set up firestore links
    const db = firebase.firestore();
    const reservationsCollection = db.collection('reservations');
    const reservationDocument = reservationsCollection.doc(reservationID);

    //Get the document of the given reservation
    return reservationDocument.get()
        .then(async doc => {

            //Get the data and store the required information
            const reservationData = doc.data();
            const stationID = reservationData['start']['station'];
            const bikeType = reservationData['bikeType'];

            //Increase the number of available bikes at the reservation's station by one
            const numberOfAvailableBikes = await getNumberOfAvailableBikes(stationID, bikeType);
            const newNumberOfAvailableBikes = numberOfAvailableBikes + 1;
            return setNumberOfAvailableBikes(stationID, newNumberOfAvailableBikes, bikeType)
                .then(() => {

                    return reservationDocument.update({status: "cancelled"})
                        .then(() => {

                            incrementStatistic("reservation." + stationID + "." + bikeType + ".cancel");

                            //Return upon success
                            return "success"
                        })
                        .catch(err => {
                            return err
                        })
                })
                .catch(err => {
                    return err
                });
        })
        .catch(err => {
            return err
        });
};


//Function to ensure that all inactive trips whose time have passed are set to active
export const updateTrips = async () => {

    //Set up firestore links
    const db = firebase.firestore();
    const reservationsCollection = db.collection('reservations');

    //Get the logged in user's user ID
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    //Only bother with reservation that are inactive or active
    const inactiveQuery = reservationsCollection.where('status', '==', 'inactive');
    const activeQuery = reservationsCollection.where('status', '==', 'active');

    //Retrieve the reservations for both queries
    const inactiveSnapshot = await inactiveQuery.get();
    const activeSnapshot = await activeQuery.get();

    //For every inactive reservation
    inactiveSnapshot.docs.forEach(async singleDoc => {

        //Get relevant data from the reservation
        const singleDocID = singleDoc.id;
        const singleDocData = singleDoc.data();
        const singleDocUser = singleDocData['user'];

        //Only update documents for this user (this could save race conditions)
        if (uid === singleDocUser) {

            const singleDocDate = singleDocData['start']['time']['date'];
            const singleDocTime = singleDocData['start']['time']['time'];

            const time = new Date();

            const singleDocDateDate = Date.parse(singleDocDate + " " + singleDocTime);

            //Make any reservations whose time are before now active
            if (singleDocDateDate <= time) {
                const reservationDocument = reservationsCollection.doc(singleDocID);
                await reservationDocument.update('status', 'active');
            }
        }
    });

    //For every active reservation
    activeSnapshot.docs.forEach(async singleDoc => {

        //Get the relevant data
        const singleDocID = singleDoc.id;
        const singleDocData = singleDoc.data();
        const singleDocUser = singleDocData['user'];


        //Only update documents for this user (this could save race conditions)
        if (uid === singleDocUser) {

            const singleDocDate = singleDocData['start']['time']['date'];
            const singleDocTime = singleDocData['start']['time']['time'];

            const time = new Date();
            time.setHours(time.getHours() - maxActiveHoursLimit);

            const singleDocDateDate = Date.parse(singleDocDate + " " + singleDocTime);

            //Cancel reservations that have been active for two hours but haven't been unlocked
            if (singleDocDateDate < time.getTime()) {
                const reservationDocument = reservationsCollection.doc(singleDocID);
                await reservationDocument.update('status', 'cancelled');
            }
        }
    });


    //Increment update statistic
    await incrementStatistic("reservation.update");

};

