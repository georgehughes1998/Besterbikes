import React, {Component} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker} from "google-maps-react";
import {Segment, Loader, Dimmer, Container} from "semantic-ui-react"

import {getJSONFromFile} from '../../handleJSON.js'

//TODO: Implement loader correctly
//TODO: pass styling in as props
//TODO: map JSON to markers
/*global google*/
export class BesterbikesMap extends Component {
    constructor(props) {
        super(props);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.state = {
            showingInfoWindow: true,
            activeMarker: {},
            selectedPlace: {},
            mapJSON:{}
        };
    }

    onMarkerClick(props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }


    componentDidMount(){
        //TODO: Only re-render once
        if (!(this.state.mapJSON === {})) {
            this.getMapJSON()
        }
    }

    async getMapJSON(){
        const stations = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
        console.log("MAP JSON RETRIVED");
        console.log(stations);
        this.setState({mapJSON: stations})
    }


    renderMarkers(){
        const stations = this.state.mapJSON;

        console.log("Rendering markers");
        console.log(stations);

        if (!(stations === {})){
            return Object.values(stations).map(station => {
                return(
                    <Marker position={{lat: 55.953053, lng: -3.190277}}
                            onClick={this.onMarkerClick}
                            name={station.name}
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
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        marginRight: "14px",
                        marginLeft: "-14px",
                        marginTop: "-14px",
                        marginBottom: "20px",
                        position: "absolute"
                    }}
                    initialCenter={{
                        lat: 55.9533,
                        lng: -3.1883
                    }}
                    google={this.props.google}
                    zoom={14}
                    streetViewControl={false}
                    mapTypeControl = {false}
                    fullscreenControl = {false}
                >

                    {this.renderMarkers()}

                    {/*TODO: Extract correct co-ordinates and place in JSON file*/}
                    <Marker position={{lat: 55.953053, lng: -3.190277}}
                            onClick={this.onMarkerClick}
                            name={"Waverley Station"}/>
                    <Marker position={{lat: 55.9097, lng: -3.32}}
                            onClick={this.onMarkerClick}
                            name={"Heriot-Watt University"}/>
                    <Marker position={{lat: 55.94566667, lng: -3.21777778}}
                            onClick={this.onMarkerClick}
                            name={"Haymarket Station"}/>
                    <Marker position={{lat: 55.94716667, lng: -3.19083333}}
                            onClick={this.onMarkerClick}
                            name={"National Museum of Scotland"}/>
                    <Marker position={{lat: 55.94208333, lng: -3.26916667}}
                            onClick={this.onMarkerClick}
                            name={"Edinburgh Zoo"}/>
                    <Marker position={{lat: 55.942444444, lng: -3.18972222}}
                            onClick={this.onMarkerClick}
                            name={"Edinburgh University Library"}/>
                    <Marker position={{lat: 55.95250000, lng: -3.1747222}}
                            onClick={this.onMarkerClick}
                            name={"Scottish Parliament"}/>
                    <Marker position={{lat: 55.93388889, lng: -3.21083333}}
                            onClick={this.onMarkerClick}
                            name={"Merchiston Crossroads"}/>
                    <Marker position={{lat: 55.96416667, lng: -3.2125000}}
                            onClick={this.onMarkerClick}
                            name={"Royal Botanic Garden"}/>
                    <Marker position={{lat: 55.95805556, lng: -3.11805556}}
                            onClick={this.onMarkerClick}
                            name={"Portobello Beach North"}/>
                    <Marker position={{lat: 55.95000000, lng: -3.09833333}}
                            onClick={this.onMarkerClick}
                            name={"Portobello Beach East"}/>

                    <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}
                    >
                        <div>
                            <h1>{this.state.selectedPlace.name}</h1>
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
