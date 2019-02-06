import * as firebase from "firebase";



export const makeReservations = async ({startDate, startTime, station, mountainBikes, regularBikes}) => {

    const numberOfAvailableRoadBikes = await getNumberOfAvailableBikes(station, "road");
    const numberOfAvailableMountainBikes = await getNumberOfAvailableBikes(station, "mountain");

    if (numberOfAvailableRoadBikes < regularBikes) {
        throw new Error("Not enough road bikes available at selected station");
    }
    if (numberOfAvailableMountainBikes < mountainBikes) {
        throw new Error("Not enough mountain bikes available at selected station");
    }
    if (mountainBikes < 0 || regularBikes < 0) {
        throw new Error("Number of bikes selected cannot be less than zero");
    }

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

    return "success";

};


export const getNumberOfAvailableBikes = async (station, bikeType) => {
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

export const appendUserReservationsArray = async (reservationReferences) => {

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();

    const usersCollection = db.collection('users');
    const currentUserDocument = usersCollection.doc(uid);

    return currentUserDocument.get()
        .then(doc => {

            const currentUserData = doc.data();

            let reservationsArray = currentUserData['reservationsArray'];

            if (reservationsArray) {
                reservationsArray = reservationsArray.concat(reservationReferences);
                // reservationsArray.push(reservationReference);
            } else {
                reservationsArray = reservationReferences;
            }

            const promise = currentUserDocument.update({reservationsArray: reservationsArray});

            return promise
                .then(() => {return "success"})
                .catch(err => {return err});
        })
        .catch(err => {return err});
};


export const makeSingleReservation = async (reservationsCollection, reservationDocument, bikeType) => {

    reservationDocument['bikeType'] = bikeType;

    const addPromise = reservationsCollection.add(reservationDocument);

    return addPromise
        .then(ref => {
            console.log("Single Reservation of " + bikeType + " bike Added!");
            return ref.id;
        })
        .catch(err => {return err});
};


export const getTrips = async (maxNumberOfTrips=10) => {

    //This ensures that all trips that should be active will be marked as active.
    await updateTrips();

    const db = firebase.firestore();
    const auth = firebase.auth();

    if (!auth) {
        throw new Error("No user is logged in");
    }

    const uid = auth.currentUser.uid;

    const usersCollection = db.collection('users');

    const currentUserDocument = usersCollection.doc(uid);

    return currentUserDocument.get()
        .then(async doc => {

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

                fullReservationsCollection[currentReservation] = await getReservation(currentReservation);
            }

            return fullReservationsCollection;
        })
        .catch(err => {return err});
};


export const getReservation = async (reservationID) => {
    const db = firebase.firestore();
    const reservationsCollection = db.collection('reservations');

    const reservationDocument = reservationsCollection.doc(reservationID);

    return reservationDocument.get()
        .then(doc => {return doc.data();})
        .catch(err => {return err});
};



export const cancelReservation = async (reservationID) => {

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
                        .then(() => {return "success"})
                        .catch(err => {return err})
                })
                .catch(err => {return err});
        })
        .catch(err => {return err});
};



export const updateTrips = async () =>
{
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

                    const currentDate = time.getFullYear() + "-" +
                        ("0" + time.getMonth()).slice(-2) //slice(-2) returns the last two chars of the string
                        + "-" +
                        ("0" + time.getDay()).slice(-2);

                    const currentTime =
                        ("0" + time.getHours()).slice(-2)
                        + ":" +
                        ("0" + time.getMinutes()).slice(-2);


                    if ((singleDocDate <= currentDate) && (singleDocTime >= currentTime)) {
                        const reservationDocument = reservationsCollection.doc(singleDocID);
                        // console.log("Changing status to active because " + singleDocDate + " " + singleDocTime + " >= " + currentDate + " " + currentTime);

                        await reservationDocument.update('status', 'active');
                    }


                    if (singleDocData < currentDate) {
                        console.log(singleDocDate + " > " + currentDate);
                    } else {
                        console.log(singleDocDate + " <= " + currentDate);
                    }

                    if (singleDocTime > currentTime) {
                        console.log(singleDocTime + " > " + currentTime);
                    } else {
                        console.log(singleDocTime + " <= " + currentTime);
                    }

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