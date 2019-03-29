// ==================================================== //
//                Map Firestore Functionality           //
// ==================================================== //

import * as firebase from "firebase";

//Function to get a collection of bike objects from a given station
export const getBikesAt = async (stationID) => {

    //Error if no station is given
    if (!stationID)
        throw new Error("Must specify a station.");

    //Set up empty collection object
    const bikesArray = {road: {}, mountain: {}};

    //Set up firestore links
    const db = firebase.firestore();
    const stationsCollection = db.collection('stations');
    const bikesCollection = db.collection('bikes');

    //Get all the bikes
    const bikesSnapshot = await bikesCollection.get();
    const bikesDocs = bikesSnapshot.docs;

    //Get the station data and store the required contents
    const stationDocument = stationsCollection.doc(stationID);
    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();
    const roadBikesArray = stationData['bikes']['road']['bikesArray'];
    const mountainBikesArray = stationData['bikes']['mountain']['bikesArray'];

    //For every bike
    bikesDocs.forEach(bikeDoc => {

        const bikeID = bikeDoc.id;
        const bikeData = bikeDoc.data();

        //If this bike is at the given station, add it to the collection object

        if (roadBikesArray.includes(bikeID)) {
            bikesArray['road'][bikeID] = bikeData;
        }
        else if (mountainBikesArray.includes(bikeID)) {
            bikesArray['mountain'][bikeID] = bikeData;
        }

    });

    //Return the collection object
    return bikesArray;

};