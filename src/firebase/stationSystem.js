import * as firebase from "firebase";



export const unlockBike = async (stationID, reservationID) => {

    const db = firebase.firestore();

    const stationsCollection = db.collection('station');
    const stationDocument = stationsCollection.doc(stationID);

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

    await bikeDocument.update('status','unlocked');
    await bikeDocument.update('reservation',reservationID);


    return "success";
};


export const validateReservation = (reservationData) =>
{
    console.log(reservationData);
    return true;
};

export const removeBike = (stationID,bikeID) =>
{

};

export const selectBike = async (stationID, bikeType) => {
    //TODO pick any bike of the appropriate bike type from the given station, return bikeID
    return "";
};

export const returnBike = async (bikeID, stationID) => {
    //TODO return the given bike to the given station and mark the reservation as complete
    return 0;
};