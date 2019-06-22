import * as firebase from "firebase";

import {getNumberOfAvailableBikes, setNumberOfAvailableBikes} from "./reservations";
import {getCurrentDateString, getCurrentTimeString} from "./time";
import {incrementStatistic} from "./statistics";

const FieldValue = firebase.firestore.FieldValue;


//Function to unlock a bike given a reservation
export const unlockBike = async (reservationID) => {

    //Ensure the reservation is given
    if (!reservationID) {
        throw new Error("No reservation selected")
    }

    //Set up firestore links
    const db = firebase.firestore();
    const reservationsCollection = db.collection('reservations');
    const reservationDocument = reservationsCollection.doc(reservationID);

    //Get the reservation data
    const reservationDoc = await reservationDocument.get();
    const reservationData = reservationDoc.data();

    //Ensure the reservation is valid and throw an error if it isn't
    if (!validateUnlockReservation(reservationData)) {
        throw Error("Invalid reservation for unlock.");
    }

    //Get the relevant information from the reservation data
    const bikeType = reservationData['bikeType'];
    const stationID = reservationData['start']['station'];
    const accessoriesArray = reservationData['accessories'];

    //Pick a bike ID from the station and link to the document of it
    const bikeID = await selectBike(stationID, bikeType);
    const bikesCollection = db.collection('bikes');
    const bikeDocument = bikesCollection.doc(bikeID);

    //Update the reservation to an unlocked status and add the bike ID
    await reservationDocument.update('status', 'unlocked');
    await reservationDocument.update('bike', bikeID);

    //Update the bike's status and add the reservation
    await bikeDocument.update('status', 'unlocked');
    await bikeDocument.update('reservation', reservationID);

    //Unlock the reservation's accessories
    await unlockAccessories(accessoriesArray);

    //Increment the statistic
    await incrementStatistic("station." + stationID + ".unlock");

    //Return the bikeID of the unlocked bike upon success
    return bikeID;
};


//Ensure that a reservation is valid for unlocking
const validateUnlockReservation = (reservationData) => {

    //Get user ID
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    //Valid flag starts as true
    let isValid = true;

    //If the current user doesn't own this reservation, can't unlock
    if (!(reservationData['user'] === uid)) {
        isValid = false;
    }

    //If the status is not active, can't unlock
    if (!(reservationData['status'] === "active")) {
        isValid = false;
    }

    //Return the flag
    return isValid;
};


//Ensure a reservation is valid for being returned
const validateReturnReservation = (reservationData) => {

    //Get the current user ID
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    //Flag
    let isValid = true;

    //If the user doesn't own the reservation, can't return
    if (!(reservationData['user'] === uid)) {
        isValid = false;
    }

    //If the reservation isn't unlocked, can't return
    if (!(reservationData['status'] === "unlocked")) {
        isValid = false;
    }

    //Return the flag
    return isValid;
};


//Remove a bike from the station
const removeBike = async (stationID, bikeID, bikeType) => {

    //Set up firestore links
    const db = firebase.firestore();
    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    //Update the given station's array by removing the given bike ID
    return await stationDocument.update(`bikes.${bikeType}.bikesArray`, FieldValue.arrayRemove(bikeID)); //Firestore function arrayRemove to remotely handle array removals

};

//Add a bike to the bike array of the given station
const addBike = async (stationID, bikeID, bikeType) => {

    //Set up firestore links
    const db = firebase.firestore();
    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    //Update the given station's bike array by adding the given bike ID
    return await stationDocument.update(`bikes.${bikeType}.bikesArray`, FieldValue.arrayUnion(bikeID)); //Firestore function to handle adding data to arrays

};


//Randomly choose a bike from the station
const selectBike = async (stationID, bikeType) => {

    //Set up firestore links
    const db = firebase.firestore();
    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    //Retrive the station data and store it
    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();
    const bikesArray = stationData['bikes'][bikeType]['bikesArray'];

    let bikeID;

    //If there are more than one bikes
    if (bikesArray.length > 0) {
        //Select a random number
        const randomNumber = Math.round(Math.random() * (bikesArray.length - 1));

        //Store the bike associated with that random number of the array
        bikeID = bikesArray[randomNumber];
    }
    else {
        //Error if there are no bikes (if this happens, something has gone horribly, horribly wrong)
        throw new Error("There are no bikes at this station");
    }

    //Remove the selected bike from the station
    await removeBike(stationID, bikeID, bikeType);

    //Return the bike ID of the selected bike
    return bikeID;

};


//Unlock all accessories in an array
const unlockAccessories = async (accessories) => {

    accessories.forEach(async accessoryID => {
        unlockAccessory(accessoryID);
    })

};

//Unlock a single accessory
const unlockAccessory = async (accessoryID) => {

    //Set up firestore links
    const db = firebase.firestore();
    const accessoriesCollection = db.collection('accessories')
        .where('status', '==', 'reserved'); //Only let it be unlocked if it's reserved
    const accessoryDocument = accessoriesCollection.doc(accessoryID);

    //Get the accessory from the firestore
    const accessorySnapshot = await accessoryDocument.get();

    //If the accessory exists, set its status to unlocked
    if (accessorySnapshot.exists)
        await accessoryDocument.update('status', 'unlocked');
    else
        throw new Error("Accessory is not available for unlocking.");
    //If it doesn't exist, throw an error

};


//Return all accessories in an accessories array
const returnAccessories = async (accessories) => {

    //For each accessory, return it
    accessories.forEach(async accessoryID => {
        returnAccessory(accessoryID);
    })

};

//Return a single accessory
const returnAccessory = async (accessoryID) => {

    //Set up firestore links
    const db = firebase.firestore();
    const accessoriesCollection = db.collection('accessories')
        .where('status', '==', 'unlocked'); //Only let it be returned if it's unlocked
    const accessoryDocument = accessoriesCollection.doc(accessoryID);

    //Get the accessory from the firestore
    const accessorySnapshot = await accessoryDocument.get();

    //If the accessory exists, set its status to available
    if (accessorySnapshot.exists)
        await accessoryDocument.update('status', 'available');
    else
        throw new Error("Accessory is not available for returning.");
    //Otherwise throw an error

};


//Return a given bike to a given station
export const returnBike = async (bikeID, stationID) => {

    //Set up firestore links
    const db = firebase.firestore();
    const bikesCollection = db.collection('bikes');
    const reservationsCollection = db.collection('reservations');
    const bikeDocument = bikesCollection.doc(bikeID);

    //Get the bike data
    const bikeDoc = await bikeDocument.get();
    const bikeData = bikeDoc.data();

    //Get the relevant information about the bike
    const bikeType = bikeData['type'];
    const reservationID = bikeData['reservation'];

    //Link to the reservation attached to the bike and retrieve its data
    const reservationDocument = reservationsCollection.doc(reservationID);
    const reservationDoc = await reservationDocument.get();
    const reservationData = reservationDoc.data();

    //Ensure the reservation is valid for returning
    if (!validateReturnReservation(reservationData)) {
        //If this error is thrown, something has gone tremendously wrong
        throw Error("Invalid reservation for return.");
    }

    //Return the accessories
    const accessoriesArray = reservationData['accessories'];
    await returnAccessories(accessoriesArray);

    //Due to unforeseen circumstances, your reservation has been automatically cancelled. Please contact an operator immediately.
    await reservationDocument.update('status', 'complete');
    await reservationDocument.update('end.time.date', getCurrentDateString());
    await reservationDocument.update('end.time.time', getCurrentTimeString());
    await reservationDocument.update('end.station', stationID);

    //Update fields for the bike
    await bikeDocument.update('reservation', '');
    await bikeDocument.update('status', 'available');

    //Increase the number of available bikes at the given station by one
    const numberOfAvailableBikes = await getNumberOfAvailableBikes(stationID, bikeType);
    const newNumberOfAvailableBikes = parseInt(numberOfAvailableBikes) + 1;
    await setNumberOfAvailableBikes(stationID, newNumberOfAvailableBikes, bikeType);

    //Add the bike to the station array
    await addBike(stationID, bikeID, bikeType);

    //Increment the return statistic
    await incrementStatistic("station." + stationID + ".return");

    //Return upon success
    return "success";
};


//Get a list of bikes which are currently unlocked by the current user
export const getUnlockedBikes = async () => {

    //Set up an empty array for adding bikes to
    const bikesArray = [];

    //Get the user ID
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    //Set up firestore links
    const db = firebase.firestore();
    const reservationsCollection = db.collection('reservations');
    const bikesCollection = db.collection('bikes');

    //Query to get only unlocked bikes
    const unlockedQuery = bikesCollection.where('status', '==', 'unlocked');

    //Retrieve the unlocked bikes from the firestore
    const querySnapshot = await unlockedQuery.get();
    const queryDocs = querySnapshot.docs;

    //For every bike
    queryDocs.forEach(async singleDoc => {

        //Get the bike's data and store it
        const singleDocData = singleDoc.data();
        const reservationID = singleDocData['reservation'];

        //If there is a reservation attached
        if (reservationID) {

            //Link to and get the data for the reservation
            const reservationDocument = reservationsCollection.doc(reservationID);
            const reservationDoc = await reservationDocument.get();
            const reservationData = reservationDoc.data();

            //If the reservation is associated with the current user, add the bike id to the bikes array
            if (reservationData['user'] === uid) {
                bikesArray.push(singleDoc.id);
            }
        }
        else
            console.log("Unlocked bike " + singleDoc.id + " found without reservation.");
        //A console warning in the case that a bike without a reservation has been found here - this should NOT happen

    });

    //Return the array of bikes
    return bikesArray;

};


//Function to be called by an operator to unlock a bike
export const unlockBikeOperator = async (bikeID, force = false) => {

    //Ensure a bike is specified
    if (!bikeID) throw new Error("No bike was specified.");

    //Set up firestore links
    const db = firebase.firestore();
    const bikesCollection = db.collection('bikes');
    const bikeDocument = bikesCollection.doc(bikeID);

    //Retrieve the bike
    const bikeSnapshot = await bikeDocument.get();

    //Ensure the bike was found
    if (!bikeSnapshot.exists) throw new Error("Bike not found.");

    //Store the bike data
    const bikeData = bikeSnapshot.data();
    const bikeType = bikeData['type'];

    //Link to the stations collection and get the station that the bike is at
    const stationsCollection = db.collection('stations');
    const stationsQuery = stationsCollection.where(`bikes.${bikeType}.bikesArray`, "array-contains", bikeID);
    const stationsSnapshot = await stationsQuery.get();

    //Check that the bike is not at multiple stations - there is a large issue if it is
    const numberOfStationsAt = stationsSnapshot.docs.length;
    if (numberOfStationsAt > 1)
        throw new Error("Something somewhere has gone horribly wrong because "
            + bikeID + " is apparently at " + numberOfStationsAt.toString()
            + " stations.");

    //Store the station data
    const stationDoc = stationsSnapshot.docs.pop();
    const stationData = stationDoc.data();
    const stationID = stationDoc.id;

    //If there are no available bikes and the force flag isn't given, don't continue
    //This is to ensure that any customers who have made reservations shouldn't be
    //cheated out of their ride because an operator has unlocked a bike without being
    //aware of the reservations currently existing.
    if (stationData['bikes'][bikeType]['numberOfAvailableBikes'] === 0 && !force)
        return 1; //1 means it wasn't completed


    //Remove the bike from the station and mark the bike status as unlocked
    await removeBike(stationID, bikeID, bikeType);
    await bikeDocument.update('status', 'unlocked');

    //Increment the operator unlock statistic
    await incrementStatistic("station." + stationID + ".unlockOperator");

    return 0; //0 means it was completed successfully

};