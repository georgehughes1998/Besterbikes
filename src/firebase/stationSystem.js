import * as firebase from "firebase";


export const unlockBike = (stationID,reservationID) =>
{
    //TODO selects and unlocks a bike, marking the reservations as active

    //TODO set bike status to be in-use
    //TODO update associatedReservation on bike to be the reservationID
    return 0;
};

export const selectBike = (stationID,bikeType) =>
{
    //TODO pick any bike of the appropriate bike type from the given station, return bikeID
    return 0;
};

export const returnBike = (bikeID,stationID) =>
{
    //TODO return the given bike to the given station and mark the reservation as complete
    return 0;
};