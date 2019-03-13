import * as firebase from "firebase";
import {incrementStatistic} from "./statistics";
import {getCurrentDateString, getCurrentTimeString} from "./time";
import {makeReport} from "./reports";
import {makeNewTask} from "./tasks";

const FieldValue = firebase.firestore.FieldValue;

const maxNumberOfBikesCanReserve = 8;
const maxHoursLimit = 3;
const stationCapacity = 35;
const maxCapacityPercentage = 0.7;
const minCapacityPercentage = 0.3;


export const makeReservations = async ({startDate, startTime, station, mountainBikes, regularBikes}) => {
    //Function to make reservations with the given data

    const startTimeString = startDate + " " + startTime;
    const startTimeDate = Date.parse(startTimeString);
    const currentTime = new Date();
    const futureLimitTime = (new Date).setHours(currentTime.getHours() + maxHoursLimit);

    regularBikes = parseInt(regularBikes);
    mountainBikes = parseInt(mountainBikes);

    if (startTimeDate < currentTime)
        throw new Error("Cannot book a reservation in the past");
    if (startTimeDate > futureLimitTime)
        throw new Error("Cannot book a reservation more than " + maxHoursLimit.toString() + " hours ahead.");

    //In case value is blank and parseInt returns null
    if (!regularBikes)
        regularBikes = 0;
    if (!mountainBikes)
        mountainBikes = 0;

    if (!startDate)
        throw new Error("No date was selected.");
    if (!startTime)
        throw new Error("No time was selected.");

    const numberOfAvailableRoadBikes = await getNumberOfAvailableBikes(station, "road");
    const numberOfAvailableMountainBikes = await getNumberOfAvailableBikes(station, "mountain");

    //Prevent the user from doing anything absurd
    if (regularBikes > maxNumberOfBikesCanReserve || mountainBikes > maxNumberOfBikesCanReserve)
        throw new Error("Cannot reserve more than " + maxNumberOfBikesCanReserve.toString() + " bikes at once.");

    if (numberOfAvailableRoadBikes < regularBikes)
        throw new Error("Not enough road bikes available at selected station.");

    if (numberOfAvailableMountainBikes < mountainBikes)
        throw new Error("Not enough mountain bikes available at selected station.");

    if (mountainBikes < 0 || regularBikes < 0)
        throw new Error("Number of bikes selected cannot be less than zero.");


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
        creation: {
            time: {
                date: getCurrentDateString(),
                time: getCurrentTimeString()
            }
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

    await incrementStatistic("reservation." + station + ".road.make", regularBikes);
    await incrementStatistic("reservation." + station + ".mountain.make", mountainBikes);

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
        .catch(err => {
            return err
        });

};

export const setNumberOfAvailableBikes = async (stationID, numberOfAvailableBikes, bikeType) => {
    //Sets the number of available bikes at a station to the provided number

    const db = firebase.firestore();
    // console.log("Setting number of available " + bikeType + " bikes at station " + station);

    if (numberOfAvailableBikes > stationCapacity)
        throw new Error("Station is full");
    if (numberOfAvailableBikes < 0)
        throw new Error("Station is empty");

    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(stationID);

    let bikesObject = {};
    bikesObject[`bikes.${bikeType}.numberOfAvailableBikes`] = numberOfAvailableBikes;

    await thisStationDocument.update(bikesObject);

    //Check for station over capacity
    if ( (numberOfAvailableBikes/stationCapacity) > maxCapacityPercentage)
    {
        const category = "Station Over Capacity Threshold";
        const comment = "Alert: the attached station is over "
            + (maxCapacityPercentage*100).toString()
            + "% full.";

        const tasksCollection = db.collection('tasks');
        const tasksQuery = tasksCollection.where('category', '==',category)
            .where('status','==','pending')
            .where('station','==',stationID);

        const tasksSnapshot = await tasksQuery.get();

        if (tasksSnapshot.empty)
            await makeNewTask({category, comment, station: stationID})
    }

    else if ( (numberOfAvailableBikes/stationCapacity) < minCapacityPercentage)
    {
        const category = "Station Under Capacity Threshold";
        const comment = "Alert: the attached station is under "
            + (minCapacityPercentage*100).toString()
            + "% full.";

        const tasksCollection = db.collection('tasks');
        const tasksQuery = tasksCollection.where('category', '==',category)
            .where('status','==','pending')
            .where('station','==',stationID);

        const tasksSnapshot = await tasksQuery.get();
         if (tasksSnapshot.empty)
             await makeNewTask({category, comment, station: stationID});
    }

    return "success"

};

const appendUserReservationsArray = async (reservationReferences) => {
    //Add the given list to the user's reservation array.


    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();

    const usersCollection = db.collection('users');
    const currentUserDocument = usersCollection.doc(uid);

    //TODO: Test
    await currentUserDocument.update({reservationsArray: FieldValue.arrayUnion.apply(null, reservationReferences)});

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
        .catch(err => {
            return err
        });
};


export const getTrips = async (filterStatus = "", userID = "", maxNumberOfTrips = 10) => {
    //Returns a collection of objects containing data about the user's trips

    const db = firebase.firestore();
    const reservationsCollection = db.collection('reservations');


    //This ensures that all trips that should be active will be marked as active.
    await updateTrips();

    let reservationsQuery;
    let fullReservationsArray = [];
    let fullReservationsCollection = {};
    let counter = 0;

    if (userID === "") {
        const currentUser = firebase.auth().currentUser;
        if (currentUser)
            userID = currentUser.uid;
        else
            return null;
    }


    if (filterStatus !== "")
        reservationsQuery = reservationsCollection.where('status', "==", filterStatus);
    else
        reservationsQuery = reservationsCollection;

    reservationsQuery = reservationsQuery.where('user', '==', userID);
    const reservationSnapshot = await reservationsQuery.get();

    reservationSnapshot.docs.forEach(doc => {

        console.log(doc.data());

        fullReservationsArray[counter++] = {id: doc.id, data: doc.data()};

    });

    //Sort the array of reservations based on the date/times
    fullReservationsArray.sort(function (obj1, obj2) {

        const date1 = obj1['data']['creation']['time']['date'];
        const time1 = obj1['data']['creation']['time']['time'];

        const date2 = obj2['data']['creation']['time']['date'];
        const time2 = obj2['data']['creation']['time']['time'];

        const theDate1 = Date.parse(date1 + " " + time1);
        const theDate2 = Date.parse(date2 + " " + time2);


        if (theDate1 < theDate2)
            return 1;
        if (theDate1 > theDate2)
            return -1;
        else
            return 0;
    });

    fullReservationsArray.forEach(obj => {

        const id = obj['id'];
        const data = obj['data'];

        fullReservationsCollection[id] = data;
    });

    return fullReservationsCollection;

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
                        .catch(err => {
                            return err
                        })
                })
                .catch(err => {
                    return err
                });
        })
        .catch(err => {
            return err
        });
};


export const updateTrips = async () => {
    //Ensures that all inactive trips whose time have passed are set to active

    const db = firebase.firestore();

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const reservationsCollection = db.collection('reservations');

    const query = reservationsCollection.where('status', '==', 'inactive');

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

                    const singleDocDateDate = Date.parse(singleDocDate + " " + singleDocTime);

                    if (singleDocDateDate <= time) {
                        const reservationDocument = reservationsCollection.doc(singleDocID);
                        // console.log("Changing status to active");

                        await reservationDocument.update('status', 'active');
                    }

                    await incrementStatistic("reservation.update");
                }

            });

        }).catch(err => {
            return err
        });
};

