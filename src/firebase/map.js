import * as firebase from "firebase";


export const getStationsFilter = async ({isSpacesAvailable, isRoadBikes, isMountainBikes}) => {
    //TODO: Implement
    const db = firebase.firestore;

    const stationsCollection = db.collection('stations')


};

export const getBikesAt = async (stationID) => {

    const bikesArray = {road: {}, mountain: {}};

    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const bikesCollection = db.collection('bikes');
    const bikesSnapshot = await bikesCollection.get();
    const bikesDocs = bikesSnapshot.docs;

    const stationDocument = stationsCollection.doc(stationID);
    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();
    const roadBikesArray = stationData['bikes']['road']['bikesArray'];
    const mountainBikesArray = stationData['bikes']['road']['bikesArray'];

    bikesDocs.forEach(bikeDoc => {

        const bikeID = bikeDoc.id;
        const bikeData = bikeDoc.data();

        if (roadBikesArray.includes(bikeID))
        {
            bikesArray['road'][bikeID] = bikeData;
        }
        else if (mountainBikesArray.includes(bikeID))
        {
            bikesArray['mountain'][bikeID] = bikeData;
        }

    });

    return bikesArray;

};


const getBike = async (bikeID) => {
    const db = firebase.firestore();
    const bikesCollection = db.collection('bikes');

    const bikeDocument = bikesCollection.doc(bikeID);

    return bikeDocument.get()
        .then(doc => {

            return doc.data();


        })
        .catch(err => {
            return err
        });

};


// export const getNumberOfAvailableBikes = async (stationID) => {
//
//     const numberOfRoadBikes = await reservations.getNumberOfAvailableBikes(stationID, "road");
//     const numberOfMountainBikes = await reservations.getNumberOfAvailableBikes(stationID, "mountain");
//
//     return {
//         road: numberOfRoadBikes,
//         mountain: numberOfMountainBikes
//     };
//
// };
