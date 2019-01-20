import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
/*global google*/


export class CalumMap extends Component {
    constructor(props) {
        super(props);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.state = {
            showingInfoWindow: true,
            activeMarker: {},
            selectedPlace: {}
        };
    }
    onMarkerClick(props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }
    render() {
        if (!this.props.google) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <Map
                    style={{
                        minWidth: "200px",
                        minHeight: "200px"
                    }}
                    initialCenter={{
                        lat: 55.9533,
                        lng: -3.1883
                    }}
                    google={this.props.google}
                    zoom={14}
                    streetViewControl={false}
                >
                    <Marker position = {{lat: 55.953053, lng: -3.190277}}
                        onClick={this.onMarkerClick}
                        name={"Waverley Station"} />
                    <Marker position = {{lat: 55.9097, lng: -3.32}}
                        onClick={this.onMarkerClick}
                        name={"Heriot-Watt University"} />
                    <Marker position = {{lat: 55.94566667, lng:-3.21777778}}
                            onClick={this.onMarkerClick}
                            name={"Haymarket Station"} />
                    <Marker position = {{lat: 55.94716667, lng:-3.19083333}}
                            onClick={this.onMarkerClick}
                            name={"National Museum of Scotland"} />
                    <Marker position = {{lat: 55.94208333, lng:-3.26916667}}
                            onClick={this.onMarkerClick}
                            name={"Edinburgh Zoo"} />
                    <Marker position = {{lat: 55.942444444, lng:-3.18972222}}
                            onClick={this.onMarkerClick}
                            name={"Edinburgh University Library"} />
                    <Marker position = {{lat: 55.95250000, lng:-3.1747222}}
                            onClick={this.onMarkerClick}
                            name={"Scottish Parliament"} />
                    <Marker position = {{lat: 55.93388889, lng:-3.21083333}}
                            onClick={this.onMarkerClick}
                            name={"Merchiston Crossroads"} />
                    <Marker position = {{lat: 55.96416667, lng:-3.2125000}}
                            onClick={this.onMarkerClick}
                            name={"Royal Botanic Garden"} />
                    <Marker position = {{lat: 55.95805556, lng:-3.11805556}}
                            onClick={this.onMarkerClick}
                            name={"Portobello Beach North"} />
                    <Marker position = {{lat: 55.95000000, lng:-3.09833333}}
                            onClick={this.onMarkerClick}
                            name={"Portobello Beach East"} />

                    <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}
                    >
                        <div>
                            <h1>{this.state.selectedPlace.name}</h1>
                        </div>
                    </InfoWindow>
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyB_13gY5K5zg1RoAEzwSxHzPIyBv0Atjcc",
    v: "3"
})(CalumMap);
