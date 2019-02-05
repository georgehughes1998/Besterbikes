import * as firebase from "firebase";
import * as reservations from 'reservations';


export const getBikesAt = async (stationID) => {

  const db = firebase.firestore();

  const reservationsCollection = db.collection('stations');
  const bikesCollection = db.collection('bikes');

  const stationDocument = reservationsCollection.doc(stationID);

  return stationDocument.get()
      .then (async doc => {

        const stationData = doc.data();

        console.log("Station Data:");
        console.log(stationData);
        const roadBikesArray = stationData['bikes']['road']['bikesArray'];
        const mountainBikesArray = stationData['bikes']['mountain']['bikesArray'];

        const bikesArray = { road: {} , mountain: {} };

        for (let b in roadBikesArray)
        {
          const currentBike = roadBikesArray[b];
          const bikeData = await getBike(currentBike);

          bikesArray['road'][currentBike] = bikeData;
        }

        for (let b in mountainBikesArray)
        {
          const currentBike = mountainBikesArray[b];
          const bikeData = await getBike(currentBike);

          bikesArray['mountain'][currentBike] = bikeData;
        }

        return bikesArray;
      });
};


export const getBike = async (bikeID) =>
{
    const db = firebase.firestore();
    const bikesCollection = db.collection('bikes');

    const bikeDocument = bikesCollection.doc(bikeID);

    return bikeDocument.get()
        .then(doc => {

            const bikeData = doc.data();
            return bikeData;

        })
        .catch(err => {return err});

};

export const getNumberOfBikesAt = async (stationID) => {

    const numberOfRoadBikes = await reservations.getNumberOfAvailableBikes(stationID,"road");
    const numberOfMountainBikes = await reservations.getNumberOfAvailableBikes(stationID,"mountain")

    const numberOfBikes = {
        road: numberOfRoadBikes,
        mountain: numberOfMountainBikes
    };

    return numberOfBikes;
};
