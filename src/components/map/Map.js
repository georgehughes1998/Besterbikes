import React from 'react'
import {CalumMap} from "./CalumMap";
import {GoogleApiWrapper} from "google-maps-react";


class Map extends React.Component {
    render() {
        return (
            <div>
                <CalumMap/>
            </div>
        )
    }

};

export default Map
