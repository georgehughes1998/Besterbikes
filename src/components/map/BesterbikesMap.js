import React, {Component} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker} from "google-maps-react";
import {Dimmer, Header, List, Loader, Segment} from "semantic-ui-react"

import {getJSONFromFile} from '../../handleJSON.js'

//TODO: Implement loader correctly
//TODO: Render markers red or green bikes depending on spaces available
/*global google*/
export class BesterbikesMap extends Component {
    constructor(props) {
        super(props);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.state = {
            showingInfoWindow: true,
            activeMarker: {},
            selectedPlace: {},
            mapJSON: {}
        };
    }

    onMarkerClick(props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }


    componentDidMount() {
        //TODO: Move to Redux
        if (!(this.state.mapJSON === {})) {
            this.getMapJSON()
        }
    }

    async getMapJSON() {
        const stations = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
        // console.log("MAP JSON RETRIVED");
        // console.log(stations);
        this.setState({mapJSON: stations})
    }


    renderMarkers() {
        const stations = this.state.mapJSON;

        // console.log("Rendering markers");
        // console.log(stations);

        if (!(stations === {})) {
            return Object.values(stations).map(station => {
                return (
                    <Marker position={station.location.geoPoint}
                            onClick={this.onMarkerClick}
                            name={station.name}
                            stationDetails={station}
                    />
                )
            })
        }

    }

    render() {
        if (!this.props.google) {
            return (
                <Segment>
                    <Dimmer active>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                </Segment>
            );
        }

        return (

            <Map
                style={this.props.style}
                initialCenter={{
                    lat: 55.9533,
                    lng: -3.1883
                }}
                google={this.props.google}
                zoom={14}
                streetViewControl={false}
                mapTypeControl={false}
                fullscreenControl={false}
            >

                {this.renderMarkers()}

                {/*TODO: Extract correct co-ordinates and place in JSON file*/}


                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                >
                    <div>
                        {/*TODO: Try load customComponent as JSX*/}
                        {/*<CustomMapIcon activeMaker = {this.state.activeMarker}/>*/}

                        <Header as='h4'>{this.state.activeMarker.name}</Header>

                        {this.state.activeMarker.stationDetails ?
                            <div>
                                <Header.Subheader>{this.state.activeMarker.stationDetails["description"]}</Header.Subheader>
                                <List>
                                    <List.Item>Mountain: {this.state.activeMarker.stationDetails["capacity"]["mountain"]} </List.Item>
                                    <List.Item>Road: {this.state.activeMarker.stationDetails["capacity"]["road"]} </List.Item>
                                </List>
                            </div>

                            :
                            //TODO: Display error
                            null
                        }

                    </div>

                </InfoWindow>
            </Map>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyB_13gY5K5zg1RoAEzwSxHzPIyBv0Atjcc",
    v: "3"
})(BesterbikesMap);
