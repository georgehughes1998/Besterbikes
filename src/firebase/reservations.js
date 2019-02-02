import * as firebase from "firebase";

export const makeReservations = async ({startDate,startTime, station, mountainBikes, regularBikes}) => {

    const numberOfAvailableBikes = getNumberOfAvailableBikes(station,"road");

    //TODO check regular and mountain bikes are valid
    if (numberOfAvailableBikes > regularBikes) {

        const db = firebase.firestore();

        const auth = firebase.auth();
        const uid = auth.currentUser.uid;

        const reservationsCollection = db.collection('reservations');

        const reservationDocument = {
            start: {
                time: {
                    date: startDate,
                    time: startTime
                },
                station: station
            },
            user: uid,
            status: 'inactive'
        };

        const promise = getNestedPromise(makeSingleReservation,{reservationsCollection,reservationDocument},0,regularBikes);

        return promise.then (() => {
            const newNumberOfAvailableBikes = numberOfAvailableBikes - regularBikes;
            return setNumberOfAvailableBikes(station,newNumberOfAvailableBikes,"road");
        })
        .then(() => {
            return "success"
        })
        .catch(err => {
            return err
        });

    }

    throw new Error("Not enough bikes available at selected station");

};


export const getNumberOfAvailableBikes = async (station,bikeType) =>
{
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(station);


    return thisStationDocument.get()
        .then (doc => {

            const thisStationData = doc.data();


            console.log("thisStationData:");
            console.log(thisStationData);


            const bikes = thisStationData['bikes'][bikeType];
            const numberOfAvailableBikes = bikes['numberOfAvailableBikes'];

            console.log("Number of available bikes is " + numberOfAvailableBikes);

            return numberOfAvailableBikes;

        })
        .catch(err => {return err});

};

export const setNumberOfAvailableBikes = async (station,numberOfAvailableBikes,bikeType) => {

    const db = firebase.firestore();
    console.log("Setting number of available bikes...");

    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(station);

    let bikesObject = {};
    bikesObject["bikes"][bikeType] = {numberOfAvailableBikes : numberOfAvailableBikes};

    const promise = thisStationDocument.update(bikesObject);

    return promise
        .then(() => {return "success"})
        .catch(err => {return err});

};

export const appendUserReservationsArray = async (reservationReference) =>
{
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();

    const usersCollection = db.collection('users');
    const currentUserDocument = usersCollection.doc(uid);

    return currentUserDocument.get()
        .then (doc => {

            const currentUserData = doc.data();

            let reservationsArray = currentUserData['reservationsArray'];

            if (reservationsArray)
            {
                reservationsArray.push(reservationReference);
            } else {
                reservationsArray = [reservationReference];
            }

            const promise = currentUserDocument.update({reservationsArray : reservationsArray});

            return promise
                .then(() => {return "success"})
                .catch(err => {return err});
        })
        .catch(err => {return err});

};

export const makeSingleReservation = async ({reservationsCollection,reservationDocument}) => {

    const addPromise = reservationsCollection.add(reservationDocument);

    addPromise
        .then(ref => {
            console.log("Single Reservation Added!")

            const appendPromise = appendUserReservationsArray(ref.id);

            return appendPromise
                .then(() => {return "success"})
                .catch(err => {return err});
        })
        .catch(err => {return err});

};

export const getNestedPromise = async (promiseFunction,args,counter,max) =>
{
    counter++;
    if (counter<=max)
    {
        return promiseFunction(args)
            .then(() => {return getNestedPromise(promiseFunction,args,counter,max)})
            .catch(err => {return err});
    }


};




export const getTrip = async () =>
{

    const db = firebase.firestore();

    const auth = firebase.auth();

    if (!auth){
        throw new Error("No user is logged in");
    }

    const uid = auth.currentUser.uid;

    const usersCollection = db.collection('users');

    const currentUserDocument = usersCollection.doc(uid);

    return currentUserDocument.get()
        .then (async doc => {

            const currentUserData = doc.data();

            const reservationsArray = currentUserData['reservationsArray'];

            let fullReservationsArray = [];

            for (let r in reservationsArray)
            {
                const reservationData = await getReservation(r);
                fullReservationsArray.push(reservationData);
            }

            return fullReservationsArray;

        })
        .catch(err => {return err});

};


export const getReservation = async (reservationID) =>
{
    const db = firebase.firestore();
    const reservationsCollection = db.collection('reservations');

    const reservationDocument = reservationsCollection.doc(reservationID);

    return reservationDocument.get()
        .then(doc => {

            const reservationData = doc.data();
            return reservationData;

        })
        .catch(err => {return err});

};