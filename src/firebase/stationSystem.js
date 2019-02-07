import * as firebase from "firebase";



export const unlockBike = async (reservationID) => {
    //Unlocks a bike at the given station and the given reservation

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
    const stationID = reservationData['start']['station'];

    const bikeID = await selectBike(stationID,bikeType);
    const bikesCollection = db.collection('bikes');
    const bikeDocument = bikesCollection.doc(bikeID);


    await reservationDocument.update('status','unlocked');
    await reservationDocument.update('bike',bikeID);


    await removeBike(stationID,bikeID,bikeType);

    await bikeDocument.update('status','unlocked');
    await bikeDocument.update('reservation',reservationID);

    return bikeID;
};


export const validateReservation = (reservationData) =>
{
    //Used by unlockBike to validate a reservation
    return true;
};

export const removeBike = async (stationID,bikeID,bikeType) =>
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

    return await stationDocument.update('bikes.bikeType.bikesArray',newBikesArray);

};


export const selectBike = async (stationID, bikeType) => {
    //Used by unlockBike to select a bike and get its bikeID from the given station
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const stationDocument = stationsCollection.doc(stationID);

    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();

    const bikesArray = stationData['bikes'][bikeType]['bikesArray'];
    const bikeID = bikesArray[0];


    return bikeID;

};

export const returnBike = async (bikeID, stationID) => {
    //Return the given bike to the given station

    const db = firebase.firestore();

    const bikesCollection = db.collection('bikes');
    const stationsCollection = db.collection('stations');
    const reservationsCollection = db.collection('reservations');


    const bikeDocument = bikesCollection.doc(bikeID);
    const stationDocument = stationsCollection.doc(stationID);

    const bikeDoc = await bikeDocument.get();
    const bikeData = bikeDoc.data();

    const reservationID = bikeData['reservation'];
    const reservationDocument = reservationsCollection.doc(reservationID);

    await reservationDocument.update('status','complete');
    await reservationDocument.update('end.time.date',getCurrentDateString());
    await reservationDocument.update('end.time.time',getCurrentTimeString());

    await bikeDocument.update('reservation','');
    //TODO clear the reservation associated with the bike

    //TODO set reservation end date, time and station

    //TODO set bike status to available

    //TODO get bike type
    //TODO add bike to station bike array




    //TODO return the given bike to the given station and mark the reservation as complete
    return 0;
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















const getCurrentDateString = () =>
{
    const time = new Date();

    const currentDate = time.getFullYear() + "-" +
        ("0" + time.getMonth()).slice(-2) //slice(-2) returns the last two chars of the string
        + "-" +
        ("0" + time.getDay()).slice(-2);

    return currentDate;
};

const getCurrentTimeString = () =>
{
    const time = new Date();

    const currentTime =
        ("0" + time.getHours()).slice(-2)
        + ":" +
        ("0" + time.getMinutes()).slice(-2);

    return currentTime;
};