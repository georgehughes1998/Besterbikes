import * as firebase from "firebase";

//Accessories
//  Status:
//      available
//      reserved
//      unlocked
//
//  Type:
//      bikelock
//      helmet


//Get an array of the accessories as objects from a certain station
export const getAccessories = async (stationID, filterStatus = "") => {

    const accessoriesObject = {};

    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const accessoriesCollection = db.collection('accessories');

    let accessoriesQuery;

    if (filterStatus !== "")
        accessoriesQuery = accessoriesCollection.where('status', "==", filterStatus);
    else
        accessoriesQuery = accessoriesCollection;

    const accessoriesSnapshot = await accessoriesQuery.get();
    const accessoriesDocs = accessoriesSnapshot.docs;

    const stationDocument = stationsCollection.doc(stationID);
    const stationDoc = await stationDocument.get();
    const stationData = stationDoc.data();
    const accessoriesArray = stationData['accessories']['accessoriesArray'];


    accessoriesDocs.forEach(accessoryDoc => {

        const accessoryID = accessoryDoc.id;
        const accessoryData = accessoryDoc.data();

        if (accessoriesArray.includes(accessoryID)) {
            accessoriesObject[accessoryID] = accessoryData;
        }

    });

    return accessoriesObject;

};