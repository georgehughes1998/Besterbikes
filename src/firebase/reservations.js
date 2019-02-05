import * as firebase from "firebase";


//TODO: Update trips status
//TODO: Make reservation ID key

export const makeReservations = async ({startDate,startTime, station, mountainBikes, regularBikes}) => {

    const numberOfAvailableRoadBikes = await getNumberOfAvailableBikes(station,"road");
    const numberOfAvailableMountainBikes = await getNumberOfAvailableBikes(station,"mountain");

    if (numberOfAvailableRoadBikes < regularBikes)
    {
        throw new Error("Not enough road bikes available at selected station");
    }
    if (numberOfAvailableMountainBikes < mountainBikes) {
        throw new Error("Not enough mountain bikes available at selected station");
    }

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
        status: 'inactive',
    };

    // const roadPromise = getNestedPromise(makeSingleReservation,{reservationsCollection,reservationDocument,bikeType:'road'},0,regularBikes);
    // const mountainPromise = getNestedPromise(makeSingleReservation,{reservationsCollection,reservationDocument,bikeType:'mountain'},0,mountainBikes);

    for (let i=0; i<regularBikes; i++)
    {
      await makeSingleReservation(reservationsCollection,reservationDocument,'road');
    }

    const newNumberOfAvailableRoadBikes = numberOfAvailableRoadBikes - regularBikes;
    await setNumberOfAvailableBikes(station, newNumberOfAvailableRoadBikes, "road");

    for (let i=0; i<mountainBikes; i++)
    {
      await makeSingleReservation(reservationsCollection,reservationDocument,'mountain');
    }

    const newNumberOfAvailableMountainBikes = numberOfAvailableMountainBikes - mountainBikes;
    await setNumberOfAvailableBikes(station, newNumberOfAvailableMountainBikes, "mountain");

    return "success";
    // return roadPromise.then (() => {
    //     console.log("Done road");
    //     return mountainPromise.then(() => {
    //             console.log("Done mountain");
    //             const newNumberOfAvailableRoadBikes = numberOfAvailableRoadBikes - regularBikes;
    //             return setNumberOfAvailableBikes(station, newNumberOfAvailableRoadBikes, "road")
    //                 .then(() => {
    //                     const newNumberOfAvailableMountainBikes = numberOfAvailableMountainBikes - mountainBikes;
    //                     return setNumberOfAvailableBikes(station, newNumberOfAvailableMountainBikes, "mountain")
    //                         .then(() => {return "success"})
    //                         .catch(err => {return err})
    //                 })
    //                 .catch(err => {return err});
    //     })
    // })

};


export const getNumberOfAvailableBikes = async (station,bikeType) =>
{
    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(station);


    return thisStationDocument.get()
        .then (doc => {

            const thisStationData = doc.data();


            // console.log("thisStationData:");
            // console.log(thisStationData);


            const bikes = thisStationData['bikes'][bikeType];
            const numberOfAvailableBikes = bikes['numberOfAvailableBikes'];

            // console.log("Number of available bikes is " + numberOfAvailableBikes);

            return numberOfAvailableBikes;

        })
        .catch(err => {return err});

};

export const setNumberOfAvailableBikes = async (station,numberOfAvailableBikes,bikeType) => {

    const db = firebase.firestore();
    console.log("Setting number of available " + bikeType + " bikes at station " + station);

    const stationsCollection = db.collection('stations');
    const thisStationDocument = stationsCollection.doc(station);


    let bikesObject = {};
    bikesObject[`bikes.${bikeType}.numberOfAvailableBikes`] = numberOfAvailableBikes;

    // console.log(bikesObject);

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

            const promise = currentUserDocument.update({reservationsArray: reservationsArray});

            return promise
                .then(() => {return "success"})
                .catch(err => {return err});
        })
        .catch(err => {return err});

};

export const makeSingleReservation = async (reservationsCollection,reservationDocument,bikeType) => {

    reservationDocument['bikeType'] = bikeType;

    const addPromise = reservationsCollection.add(reservationDocument);

    addPromise
        .then(ref => {
            console.log("Single Reservation of " + bikeType + " bike Added!")

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



export const getTrips = async () =>
{

    const db = firebase.firestore();

    const auth = firebase.auth();

    if (!auth){
        throw new Error("No user is logged in");
    }

    //Run a function here to update any reservations who's start time have passed

    const uid = auth.currentUser.uid;

    const usersCollection = db.collection('users');

    const currentUserDocument = usersCollection.doc(uid);

    return currentUserDocument.get()
        .then (async doc => {

            const currentUserData = doc.data();

            const reservationsArray = currentUserData['reservationsArray'];

            let fullReservationsCollection = {};

            for (let r in reservationsArray)
            {
                const currentReservation = reservationsArray[r];
                const reservationData = await getReservation(currentReservation);

                fullReservationsCollection[currentReservation] = reservationData;
            }

            console.log(fullReservationsCollection);
            return fullReservationsCollection;

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


export const cancelReservation = async (reservationID) =>
{

    const db = firebase.firestore();

    const reservationsCollection = db.collection('reservations');
    const reservationDocument = reservationsCollection.doc(reservationID);

    return reservationDocument.get()
        .then(async doc => {

            const reservationData = doc.data();
            const stationID = reservationData['start']['station'];
            const bikeType = reservationData['bikeType'];

            const numberOfAvailableBikes = await getNumberOfAvailableBikes(stationID,bikeType);
            const newNumberOfAvailableBikes = numberOfAvailableBikes + 1;

            return setNumberOfAvailableBikes(stationID,newNumberOfAvailableBikes,bikeType)
                .then(() => {

                    return reservationDocument.update({status: "cancelled"})
                        .then(() =>{return "success"})
                        .catch(err => {return err})

                })
                .catch(err => {return err});



        })
        .catch(err => {return err});


};
