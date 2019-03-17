import * as firebase from "firebase";


export const getBikesAt = async (stationID) => {

    if (!stationID)
        throw new Error("Must specify a station.");

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
    const mountainBikesArray = stationData['bikes']['mountain']['bikesArray'];

    bikesDocs.forEach(bikeDoc => {

        const bikeID = bikeDoc.id;
        const bikeData = bikeDoc.data();

        if (roadBikesArray.includes(bikeID)) {
            bikesArray['road'][bikeID] = bikeData;
        }
        else if (mountainBikesArray.includes(bikeID)) {
            bikesArray['mountain'][bikeID] = bikeData;
        }

    });

    return bikesArray;

};