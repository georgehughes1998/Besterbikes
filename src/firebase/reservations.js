import * as firebase from "firebase";

export const makeReservations = async ({startDate,startTime, startStation, numberOfBikes}) => {

    const numberOfAvailableBikes = getNumberOfAvailableBikes(startStation);

    if (numberOfAvailableBikes > numberOfBikes) {

        const db = firebase.firestore();

        const reservationsCollection = db.collection('reservations');

        const reservationDocument = {
            start: {
                time: {
                    date: startDate,
                    time: startTime
                },
                station: startStation
            }
        };

        const promise = getNestedPromise({promiseFunction : makeSingleReservation({reservationsCollection,reservationDocument}),counter : 0, max : numberOfBikes});

        return promise.then (() => {
            const newNumberOfAvailableBikes = numberOfAvailableBikes - numberOfBikes;
            return setNumberOfAvailableBikes({station : startStation,numberOfAvailableBikes : newNumberOfAvailableBikes});
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


export const getNumberOfAvailableBikes = async ({station,bikeType}) =>
{
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(station);


    const thisStationData = thisStationDocument.get()
        .then (doc => {return doc.data()})
        .catch(err => {return err});

    const bikes = thisStationData[bikeType];
    const numberOfAvailableBikes = bikes['numberOfAvailableBikes'];

    console.log("Number of available bikes is " + numberOfAvailableBikes.toString());

    return numberOfAvailableBikes;

};

export const setNumberOfAvailableBikes = async ({station,numberOfAvailableBikes}) => {

    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(station);

    const promise = thisStationDocument.update({numberOfAvailableBikes : numberOfAvailableBikes});

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

    const currentUserData = currentUserDocument.get()
        .then (doc => {return doc.data()})
        .catch(err => {return err});

    const reservationsArray = currentUserData['reservationsArray'];
    reservationsArray.push(reservationReference);

    const promise = currentUserDocument.update({reservationsArray : reservationsArray});

    return promise
        .then(() => {return "success"})
        .catch(err => {return err});

};

export const makeSingleReservation = async ({reservationsCollection,reservationDocument}) => {

    const addPromise = reservationsCollection.add(reservationDocument);

    addPromise
        .then(ref => {
            const appendPromise = appendUserReservationsArray(ref.id);

            appendPromise
                .then(() => {return "success"})
                .catch(err => {return err});
        })
        .catch(err => {return err});

};

export const getNestedPromise = async ({promiseFunction,counter,max}) =>
{
    counter++;
    if (counter<=max)
    {
        return promiseFunction
            .then(() => {return getNestedPromise({promiseFunction,counter,max})})
            .catch(err => {return err});
    }


};