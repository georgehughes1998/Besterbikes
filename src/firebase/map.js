import * as firebase from "firebase";
import * as reservations from 'reservations';

export const getBikesAt = async () => {


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