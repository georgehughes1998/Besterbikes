import * as firebase from "firebase";

import {getNumberOfAvailableBikes, setNumberOfAvailableBikes} from "./reservations";
import {getCurrentDateString, getCurrentTimeString} from "./time";


export const unlockBike = async (reservationID) => {
    //Unlocks a bike at the given station and the given reservation

    //TODO: Mountain bikes throw up an error when unlocking them. Solve this.

    const db = firebase.firestore();

    const reservationsCollection = db.collection('reservations');
    const reservationDocument = reservationsCollection.doc(reservationID);

    const reservationDoc = await reservationDocument.get();
    const reservationData = reservationDoc.data();

    if ( !validateUnlockReservation(reservationData) )
    {
        throw Error("Invalid reservation for unlock.");
    }

    const bikeType = reservationData['bikeType'];
    const stationID = reservationData['start']['station'];

    const bikeID = await selectBike(stationID,bikeType);
    const bikesCollection = db.collection('bikes');
    const bikeDocument = bikesCollection.doc(bikeID);


    await reservationDocument.update('status','unlocked');
    await reservationDocument.update('bike',bikeID);

    await bikeDocument.update('status','unlocked');
    await bikeDocument.update('reservation',reservationID);

    return bikeID;
};


const validateUnlockReservation = (reservationData) =>
{
    //Used by unlockBike to validate a reservation
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    let isValid = true;

    if (!(reservationData['user'] === uid)) {isValid = false;}
    if (!(reservationData['status'] === "active")) {isValid = false;}

    return isValid;
};


const validateReturnReservation = (reservationData) =>
{
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    let isValid = true;

    if (!(reservationData['user'] === uid)) {isValid = false;}
    if (!(reservationData['status'] === "unlocked")) {isValid = false;}

    return isValid;
};


const removeBike = async (stationID,bikeID,bikeType) =>
{
    //Used by unlockBike to remove a bike from the station bike array
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();

    const bikesArray = stationData['bikes'][bikeType]['bikesArray'];
    const newBikesArray = bikesArray.filter(tempBikeID =>
    {
        return bikeID !== tempBikeID
    });

    return await stationDocument.update(`bikes.${bikeType}.bikesArray`,newBikesArray);

};

//Add a bike to the bike array of the given station
const addBike = async (stationID,bikeID,bikeType) =>
{
    //Used by return bike to add the given bike to the appropriate bike array of the given station
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();

    console.log("Attempting to push bike to " + stationID + "'s " + bikeType + " array...");

    const bikesArray = stationData['bikes'][bikeType]['bikesArray'];
    bikesArray.push(bikeID);

    return await stationDocument.update('bikes.bikeType.bikesArray',bikesArray);

};


const selectBike = async (stationID, bikeType) =>
{
    //Used by unlockBike to select a bike and get its bikeID from the given station
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();

    const bikesArray = stationData['bikes'][bikeType]['bikesArray'];
    const bikeID = bikesArray.pop();


    await removeBike(stationID,bikeID,bikeType);

    return bikeID;

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

    if (!validateReturnReservation(reservationData))
    {
        throw Error("Invalid reservation for return.");
    }

    await reservationDocument.update('status','complete');
    await reservationDocument.update('end.time.date',getCurrentDateString());
    await reservationDocument.update('end.time.time',getCurrentTimeString());
    await reservationDocument.update('end.station',stationID);

    await bikeDocument.update('reservation','');
    await bikeDocument.update('status','available');

    const numberOfAvailableBikes = await getNumberOfAvailableBikes(stationID,bikeType);
    const newNumberOfAvailableBikes = parseInt(numberOfAvailableBikes)+1;
    await setNumberOfAvailableBikes(stationID,newNumberOfAvailableBikes,bikeType);

    await addBike(stationID,bikeID,bikeType);

    return "success";
};




export const getUnlockedBikes = async () =>
{
    const db = firebase.firestore();

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const reservationsCollection = db.collection('reservations');
    const bikesCollection = db.collection('bikes');
    const query = bikesCollection.where('status','==','unlocked');

    const bikesArray = [];

    const queryDoc = await query.get();

    queryDoc.forEach(async singleDoc =>
    {
        const singleDocData = singleDoc.data();

        const reservationID = singleDocData['reservation'];
        const reservationDocument = reservationsCollection.doc(reservationID);

        const reservationDoc = await reservationDocument.get();
        const reservationData = reservationDoc.data();

        if (reservationData['user'] === uid)
        {
            bikesArray.push(singleDoc.id);
        }

    });

    return bikesArray;

};















