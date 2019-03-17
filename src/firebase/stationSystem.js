import * as firebase from "firebase";

import {getNumberOfAvailableBikes, setNumberOfAvailableBikes} from "./reservations";
import {getCurrentDateString, getCurrentTimeString} from "./time";
import {incrementStatistic} from "./statistics";

const FieldValue = firebase.firestore.FieldValue;


export const unlockBike = async (reservationID) => {
    //Unlocks a bike at the given station and the given reservation

    if (!reservationID) {
        throw new Error("No reservation selected")
    }

    const db = firebase.firestore();

    const reservationsCollection = db.collection('reservations');
    const reservationDocument = reservationsCollection.doc(reservationID);

    const reservationDoc = await reservationDocument.get();
    const reservationData = reservationDoc.data();

    if (!validateUnlockReservation(reservationData)) {
        throw Error("Invalid reservation for unlock.");
    }

    const bikeType = reservationData['bikeType'];
    const stationID = reservationData['start']['station'];
    const accessoriesArray = reservationData['accessories'];

    const bikeID = await selectBike(stationID, bikeType);
    const bikesCollection = db.collection('bikes');
    const bikeDocument = bikesCollection.doc(bikeID);


    await reservationDocument.update('status', 'unlocked');
    await reservationDocument.update('bike', bikeID);

    await bikeDocument.update('status', 'unlocked');
    await bikeDocument.update('reservation', reservationID);

    await unlockAccessories(accessoriesArray);

    await incrementStatistic("station." + stationID + ".unlock");

    return bikeID;
};


const validateUnlockReservation = (reservationData) => {
    //Used by unlockBike to validate a reservation
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    let isValid = true;

    if (!(reservationData['user'] === uid)) {
        isValid = false;
    }
    if (!(reservationData['status'] === "active")) {
        isValid = false;
    }

    return isValid;
};


const validateReturnReservation = (reservationData) => {
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    let isValid = true;

    if (!(reservationData['user'] === uid)) {
        isValid = false;
    }
    if (!(reservationData['status'] === "unlocked")) {
        isValid = false;
    }

    return isValid;
};


const removeBike = async (stationID, bikeID, bikeType) => {
    //Used by unlockBike to remove a bike from the station bike array
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    return await stationDocument.update(`bikes.${bikeType}.bikesArray`, FieldValue.arrayRemove(bikeID));

};

//Add a bike to the bike array of the given station
const addBike = async (stationID, bikeID, bikeType) => {
    //Used by return bike to add the given bike to the appropriate bike array of the given station
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    return await stationDocument.update(`bikes.${bikeType}.bikesArray`, FieldValue.arrayUnion(bikeID));

};


const selectBike = async (stationID, bikeType) => {
    //Used by unlockBike to select a bike and get its bikeID from the given station
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();

    const bikesArray = stationData['bikes'][bikeType]['bikesArray'];
    let bikeID;

    if (bikesArray.length > 0) {
        //Select a random bike
        const randomNumber = Math.round(Math.random() * (bikesArray.length - 1));
        bikeID = bikesArray[randomNumber];
    }
    else {
        throw new Error("There are no bikes at this station");
    }

    await removeBike(stationID, bikeID, bikeType);

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

    const db = firebase.firestore();

    const accessoriesCollection = db.collection('accessories')
        .where('status','==','reserved'); //Only let it be unlocked if it's reserved
    const accessoryDocument = accessoriesCollection.doc(accessoryID);
    const accessorySnapshot = await accessoryDocument.get();

    if (accessorySnapshot.exists)
        await accessoryDocument.update('status','unlocked');
    else
        throw new Error("Accessory is not available for unlocking.");

};


//Return all accessories in an accessories array
const returnAccessories = async (accessories) => {

    accessories.forEach(async accessoryID => {
        returnAccessory(accessoryID);
    })

};

//Return a single accessory
const returnAccessory = async (accessoryID) => {

    const db = firebase.firestore();

    const accessoriesCollection = db.collection('accessories')
        .where('status','==','unlocked'); //Only let it be returned if it's unlocked
    const accessoryDocument = accessoriesCollection.doc(accessoryID);
    const accessorySnapshot = await accessoryDocument.get();

    if (accessorySnapshot.exists)
        await accessoryDocument.update('status','available');
    else
        throw new Error("Accessory is not available for returning.");

};



export const returnBike = async (bikeID, stationID) => {
    //Return the given bike to the given station

    const db = firebase.firestore();

    const bikesCollection = db.collection('bikes');
    const reservationsCollection = db.collection('reservations');

    const bikeDocument = bikesCollection.doc(bikeID);

    const bikeDoc = await bikeDocument.get();
    const bikeData = bikeDoc.data();

    const bikeType = bikeData['type'];
    const reservationID = bikeData['reservation'];

    const reservationDocument = reservationsCollection.doc(reservationID);
    const reservationDoc = await reservationDocument.get();
    const reservationData = reservationDoc.data();

    if (!validateReturnReservation(reservationData)) {
        throw Error("Invalid reservation for return.");
    }

    const accessoriesArray = reservationData['accessories'];
    await returnAccessories(accessoriesArray);

    await reservationDocument.update('status', 'complete');
    await reservationDocument.update('end.time.date', getCurrentDateString());
    await reservationDocument.update('end.time.time', getCurrentTimeString());
    await reservationDocument.update('end.station', stationID);

    await bikeDocument.update('reservation', '');
    await bikeDocument.update('status', 'available');

    const numberOfAvailableBikes = await getNumberOfAvailableBikes(stationID, bikeType);
    const newNumberOfAvailableBikes = parseInt(numberOfAvailableBikes) + 1;
    await setNumberOfAvailableBikes(stationID, newNumberOfAvailableBikes, bikeType);

    await addBike(stationID, bikeID, bikeType);

    await incrementStatistic("station." + stationID + ".return");

    return "success";
};


export const getUnlockedBikes = async () => {
    const db = firebase.firestore();

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const reservationsCollection = db.collection('reservations');
    const bikesCollection = db.collection('bikes');
    const unlockedQuery = bikesCollection.where('status', '==', 'unlocked');

    const bikesArray = [];

    const querySnapshot = await unlockedQuery.get();
    const queryDocs = querySnapshot.docs;


    queryDocs.forEach(async singleDoc => {
        const singleDocData = singleDoc.data();
        const reservationID = singleDocData['reservation'];

        if (reservationID) {
            const reservationDocument = reservationsCollection.doc(reservationID);

            const reservationDoc = await reservationDocument.get();
            const reservationData = reservationDoc.data();

            console.log(reservationID);

            if (reservationData['user'] === uid) {
                bikesArray.push(singleDoc.id);
            }
        }
        else
            console.log("Unlocked bike " + singleDoc.id + " found without reservation.");

    });

    return bikesArray;

};


export const unlockBikeOperator = async (bikeID, force=false) => {

    if (!bikeID)    throw new Error("No bike was specified.");

    const db = firebase.firestore();

    const bikesCollection = db.collection('bikes');
    const bikeDocument = bikesCollection.doc(bikeID);
    const bikeSnapshot = await bikeDocument.get();

    if (!bikeSnapshot.exists)   throw new Error("Bike not found.");

    const bikeData = bikeSnapshot.data();
    const bikeType = bikeData['type'];

    const stationsCollection = db.collection('stations');
    const stationsQuery = stationsCollection.where(`bikes.${bikeType}.bikesArray`, "array-contains", bikeID);
    const stationsSnapshot = await stationsQuery.get();

    //Check that the bike is not at multiple stations.
    const numberOfStationsAt = stationsSnapshot.docs.length;
    if (numberOfStationsAt > 1)
        throw new Error("Something somewhere has gone horribly wrong because "
            + bikeID + " is apparently at " + numberOfStationsAt.toString()
            + " stations.");

    const stationDoc = stationsSnapshot.docs.pop();
    const stationData = stationDoc.data();
    const stationID = stationDoc.id;

    if (stationData['bikes'][bikeType]['numberOfAvailableBikes'] === 0 && !force)
        return 1;

    await removeBike(stationID, bikeID, bikeType);
    await bikeDocument.update('status', 'unlocked');

    await incrementStatistic("station." + stationID + ".unlockOperator");

    return 0;

};