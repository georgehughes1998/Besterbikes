import React from 'react'
import {CalumMap} from "./CalumMap";
import {GoogleApiWrapper} from "google-maps-react";

//TODO: Contact Calum to get map working
class Map extends React.Component {
    render() {
        return (
            <div>
                <GoogleApiWrapper/>
            </div>
        )
    }

};

export default Map
