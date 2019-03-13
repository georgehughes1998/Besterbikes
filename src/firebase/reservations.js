import * as firebase from "firebase";
import {incrementStatistic} from "./statistics";

const FieldValue = firebase.firestore.FieldValue;


export const makeReservations = async ({startDate, startTime, station, mountainBikes, regularBikes}) => {
    //Function to make reservations with the given data

    regularBikes = parseInt(regularBikes);
    mountainBikes = parseInt(mountainBikes);

    const numberOfAvailableRoadBikes = await getNumberOfAvailableBikes(station, "road");
    const numberOfAvailableMountainBikes = await getNumberOfAvailableBikes(station, "mountain");

    //Prevent the user from doing anything absurd
    if (regularBikes > 8 || mountainBikes > 8)
        throw new Error("Cannot reserve more than 8 bikes at once.");

    if (numberOfAvailableRoadBikes < regularBikes)
        throw new Error("Not enough road bikes available at selected station");

    if (numberOfAvailableMountainBikes < mountainBikes)
        throw new Error("Not enough mountain bikes available at selected station");

    if (mountainBikes < 0 || regularBikes < 0)
        throw new Error("Number of bikes selected cannot be less than zero");


    const db = firebase.firestore();

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const reservationsCollection = db.collection('reservations');

    const reservationsIDArray = [];
    const reservationDocument = {
        start: {
            time: {
                date: startDate,
                time: startTime
            },
            station: station
        },
        user: uid,
        status: 'inactive',
    };


    if (regularBikes > 0) {

        for (let i = 0; i < regularBikes; i++) {
            const reservationID = await makeSingleReservation(reservationsCollection, reservationDocument, 'road');
            // console.log(reservationID);
            reservationsIDArray.push(reservationID);
        }

        const newNumberOfAvailableRoadBikes = numberOfAvailableRoadBikes - regularBikes;
        await setNumberOfAvailableBikes(station, newNumberOfAvailableRoadBikes, "road");
    }

    if (mountainBikes > 0) {

        for (let i = 0; i < mountainBikes; i++) {
            const reservationID = await makeSingleReservation(reservationsCollection, reservationDocument, 'mountain');
            reservationsIDArray.push(reservationID);
        }

        const newNumberOfAvailableMountainBikes = numberOfAvailableMountainBikes - mountainBikes;
        await setNumberOfAvailableBikes(station, newNumberOfAvailableMountainBikes, "mountain");
    }

    await appendUserReservationsArray(reservationsIDArray);

    console.log("Reservations to be added to user:");
    console.log(reservationsIDArray);

    await incrementStatistic("reservation." + station + ".road.make",regularBikes);
    await incrementStatistic("reservation." + station + ".mountain.make",mountainBikes);

    return "success";

};


export const getNumberOfAvailableBikes = async (station, bikeType) => {
    //Returns the number of available bikes at a station

    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(station);

    return thisStationDocument.get()
        .then(doc => {

            const thisStationData = doc.data();

            const bikes = thisStationData['bikes'][bikeType];
            return bikes['numberOfAvailableBikes'];

        })
        .catch(err => {return err});

};

export const setNumberOfAvailableBikes = async (station, numberOfAvailableBikes, bikeType) => {
    //Sets the number of available bikes at a station to the provided number

    const db = firebase.firestore();
    console.log("Setting number of available " + bikeType + " bikes at station " + station);

    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(station);

    let bikesObject = {};
    bikesObject[`bikes.${bikeType}.numberOfAvailableBikes`] = numberOfAvailableBikes;

    const promise = thisStationDocument.update(bikesObject);

    return promise
        .then(() => {return "success"})
        .catch(err => {return err});

};

const appendUserReservationsArray = async (reservationReferences) => {
    //Add the given list to the user's reservation array.


    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();

    const usersCollection = db.collection('users');
    const currentUserDocument = usersCollection.doc(uid);

    //TODO: Test
    await currentUserDocument.update({reservationsArray: FieldValue.arrayUnion.apply(null,reservationReferences)});

};


const makeSingleReservation = async (reservationsCollection, reservationDocument, bikeType) => {
    //Used by makeReservations to make a single reservation

    reservationDocument['bikeType'] = bikeType;

    const addPromise = reservationsCollection.add(reservationDocument);

    return addPromise
        .then(ref => {
            console.log("Single Reservation of " + bikeType + " bike Added!");
            return ref.id;
        })
        .catch(err => {return err});
};


export const getTrips = async (userID="", maxNumberOfTrips=10) => {
    //Returns a collection of objects containing data about the user's trips

    if (userID === "")
    {
        const currentUser = firebase.auth().currentUser;
        if (currentUser)
            userID = currentUser.uid;
        else
            return null;
    }

    //This ensures that all trips that should be active will be marked as active.
    await updateTrips();

    const db = firebase.firestore();


    const usersCollection = db.collection('users');
    const reservationsCollection = db.collection('reservations');

    const currentUserDocument = usersCollection.doc(userID);


    return currentUserDocument.get()
        .then(async doc => {

            if (!doc.exists) {throw new Error("Document '" + userID + "' doesn't exist")}

            const currentUserData = doc.data();
            const reservationsArray = currentUserData['reservationsArray'];

            const reservationsArrayReversed = reservationsArray.reverse();

            let fullReservationsCollection = {};

            let counter = 0;

            for (let r in reservationsArrayReversed) {

                counter++;

                if (counter > maxNumberOfTrips) {
                    break;
                }

                const currentReservation = reservationsArrayReversed[r];
                const reservationDocument = reservationsCollection.doc(currentReservation);

                fullReservationsCollection[currentReservation] = await getReservation(currentReservation,reservationDocument);
            }

            return fullReservationsCollection;
        })
        .catch(err => {return err});
};


const getReservation = async (reservationID,reservationDocument) => {
    //Used by getTrips to get a single reservation
    return reservationDocument.get()
        .then(doc => {return doc.data();})
        .catch(err => {return err});
};



export const cancelReservation = async (reservationID) => {
    //Cancels the given reservation

    const db = firebase.firestore();

    const reservationsCollection = db.collection('reservations');
    const reservationDocument = reservationsCollection.doc(reservationID);

    return reservationDocument.get()
        .then(async doc => {

            const reservationData = doc.data();
            const stationID = reservationData['start']['station'];
            const bikeType = reservationData['bikeType'];

            const numberOfAvailableBikes = await getNumberOfAvailableBikes(stationID, bikeType);
            const newNumberOfAvailableBikes = numberOfAvailableBikes + 1;

            return setNumberOfAvailableBikes(stationID, newNumberOfAvailableBikes, bikeType)
                .then(() => {

                    return reservationDocument.update({status: "cancelled"})
                        .then(() => {

                            incrementStatistic("reservation." + stationID + "." + bikeType + ".cancel");

                            return "success"
                        })
                        .catch(err => {return err})
                })
                .catch(err => {return err});
        })
        .catch(err => {return err});
};



export const updateTrips = async () => {
    //Ensures that all inactive trips whose time have passed are set to active

    const db = firebase.firestore();

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const reservationsCollection = db.collection('reservations');

    const query = reservationsCollection.where('status','==','inactive');

    return query.get()
        .then(async queryDoc => {

            queryDoc.forEach(async singleDoc => {

                const singleDocID = singleDoc.id;
                const singleDocData = singleDoc.data();
                const singleDocUser = singleDocData['user'];

                //Only update documents for this user (this could save overwriting changes because of local copies not matching the firestore)
                if (uid === singleDocUser) {

                    const singleDocDate = singleDocData['start']['time']['date'];
                    const singleDocTime = singleDocData['start']['time']['time'];

                    const time = new Date();

                    // const currentDate = time.getFullYear() + "-" +
                    //     ("0" + time.getMonth()).slice(-2) //slice(-2) returns the last two chars of the string
                    //     + "-" +
                    //     ("0" + time.getDay()).slice(-2);
                    //
                    // const currentTime =
                    //     ("0" + time.getHours()).slice(-2)
                    //     + ":" +
                    //     ("0" + time.getMinutes()).slice(-2);

                    const singleDocDateDate = Date.parse(singleDocDate+" "+singleDocTime);


                    if (singleDocDateDate <= time) {
                        const reservationDocument = reservationsCollection.doc(singleDocID);
                        // console.log("Changing status to active");

                        await reservationDocument.update('status', 'active');
                    }


                    // if (singleDocData > currentDate) {
                    //     console.log(singleDocDate + " > " + currentDate);
                    // } else {
                    //     console.log(singleDocDate + " <= " + currentDate);
                    // }
                    //
                    // if (singleDocTime > currentTime) {
                    //     console.log(singleDocTime + " > " + currentTime);
                    // } else {
                    //     console.log(singleDocTime + " <= " + currentTime);
                    // }

                }

            });

        }).catch(err => {return err});
};







// export const getNestedPromise = async (promiseFunction, args, counter, max) => {
//     counter++;
//     if (counter <= max) {
//         return promiseFunction(args)
//             .then(() => {
//                 return getNestedPromise(promiseFunction, args, counter, max)
//             })
//             .catch(err => {
//                 return err
//             });
//     }
//
//
// };
