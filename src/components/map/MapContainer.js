import React from 'react'
import {BesterbikesMap} from "./BesterbikesMap";
import connect from "react-redux/es/connect/connect";
import {retrieveStations} from "../../redux/actions";
import {getUser} from "../../firebase/authentication";


class MapContainer extends React.Component {

    render() {
        return (
            <BesterbikesMap styleAndStations = {{styleAndStations: this.props.stations}}/>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        stations: state.stations,
    }
};

export default connect(
    mapStateToProps,
    {retrieveStations}
)(MapContainer);
