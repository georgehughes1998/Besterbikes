import * as firebase from "firebase";



export const unlockBike = async (stationID, reservationID) => {

    const db = firebase.firestore();

    const reservationsCollection = db.collection('reservations');
    const reservationDocument = reservationsCollection.doc(reservationID);

    const reservationDoc = await reservationDocument.get();
    const reservationData = reservationDoc.data();

    if ( !validateReservation(reservationData) )
    {
        throw Error("Reservation is not valid.");
    }

    const bikeType = reservationData['bikeType'];

    const bikeID = await selectBike(bikeType);
    const bikesCollection = db.collection('bikes');
    const bikeDocument = bikesCollection.doc(bikeID);

    // let reservationObject = {};
    // reservationObject[`start.station`] = stationID;

    await reservationDocument.update('status','unlocked');
    await reservationDocument.update('start.station',stationID);
    await reservationDocument.update('bike',bikeID);


    await removeBike(stationID,bikeID,bikeType);

    await bikeDocument.update('status','unlocked');
    await bikeDocument.update('reservation',reservationID);


    return "success";
};


export const validateReservation = (reservationData) =>
{
    console.log(reservationData);
    return true;
};

export const removeBike = async (stationID,bikeID,bikeType) =>
{
    const db = firebase.firestore();

    const stationsCollection = db.collection('station');
    const stationDocument = stationsCollection.doc(stationID);

    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();

    const bikesArray = stationData['bikes'][bikeType]['bikesArray'];
    const newBikesArray = bikesArray.filter(tempBikeID =>
    {
        return bikeID !== tempBikeID
    });

    return await stationDocument.update('bikes.bikeType.bikesArray',newBikesArray);

};

export const selectBike = async (stationID, bikeType) => {
    const db = firebase.firestore();

    const stationsCollection = db.collection('station');
    const stationDocument = stationsCollection.doc(stationID);

    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();

    const bikesArray = stationData['bikes'][bikeType]['bikesArray'];
    const bikeID = bikesArray[0];

    return bikeID;

};

export const returnBike = async (bikeID, stationID) => {
    //TODO return the given bike to the given station and mark the reservation as complete
    return 0;
};