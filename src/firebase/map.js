import * as firebase from "firebase";


export const getStationsFilter = async ({isSpacesAvailable, isRoadBikes, isMountainBikes}) =>
{
    //TODO: Implement
    const db = firebase.firestore;

    const stationsCollection = db.collection('stations')


};

export const getBikesAt = async (stationID) => {
    //TODO: Return the bike object, not just the bike ID

    const db = firebase.firestore();

    const stationsCollection = db.collection('stations');
    const bikesCollection = db.collection('bikes');

    const stationDocument = stationsCollection.doc(stationID);

    return stationDocument.get()
        .then(async doc => {

            const stationData = doc.data();

            console.log("Station Data:");
            console.log(stationData);
            const roadBikesArray = stationData['bikes']['road']['bikesArray'];
            const mountainBikesArray = stationData['bikes']['mountain']['bikesArray'];

            const bikesArray = {road: {}, mountain: {}};

            for (let b in roadBikesArray) {
                const currentBike = roadBikesArray[b];

                bikesArray['road'][currentBike] = await getBike(currentBike);

            }

            for (let b in mountainBikesArray) {
                const currentBike = mountainBikesArray[b];

                bikesArray['mountain'][currentBike] = await getBike(currentBike);
            }

            return bikesArray;
        });
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
