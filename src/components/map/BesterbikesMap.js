import React, {Component} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker} from "google-maps-react";
import {Header, List} from "semantic-ui-react"

import {getJSONFromFile} from '../../handleJSON.js'
import {getUser} from "../../firebase/authentication";
import {getNumberOfAvailableBikes} from "../../firebase/reservations";
import {withRouter} from "react-router-dom";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import Image from "semantic-ui-react/dist/commonjs/elements/Image/Image";

//TODO: Implement loader correctly
//TODO: Render markers red or green bikes depending on spaces available
//TODO: List of stations displayed beside bike

export class BesterbikesMap extends Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = () => {

        return getUser()
            .then(user => {
                if (user === null)
                    this.props.history.push("signin");
                return user
            });
    };
    handleRedirect = (link) => {
        this.props.history.push(link);
    };

    constructor(props) {
        super(props);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.state = {
            showingInfoWindow: true,
            activeMarker: {},
            selectedPlace: {},
            mapJSON: {},
            bikesAtStations: {}
        };
    }

    //Loads trips if user logged in
    async componentDidMount() {
        const user = await this.authenticateUser();
        if (user) {
            //TODO: Move to Redux
            if (!(this.state.mapJSON === {})) {
                await this.getMapJSON();
            }

            const stations = this.state.mapJSON;
            let keys = Object.keys(stations);

            const bikesAtStations = {};

            await Object.values(stations).map(async (station, index) => {
                bikesAtStations[keys[index]] = {road: 0, mountain: 0};

                bikesAtStations[keys[index]]['road'] = await getNumberOfAvailableBikes(keys[index], "road");
                bikesAtStations[keys[index]]['mountain'] = await getNumberOfAvailableBikes(keys[index], "mountain");

                this.forceUpdate(); //Added so that markers render once the number of available bikes has loaded
                // console.log(bikesAtStations);
            });

            // console.log(stations);

            this.setState({bikesAtStations});
            // console.log(this.state.bikesAtStations);


        }
    }

    onMarkerClick(props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        });
    }

    async getMapJSON() {
        const stations = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
        this.setState({mapJSON: stations})
    }

    renderMarkers() {
        const stations = this.state.mapJSON;
        let keys = Object.keys(stations);
        // console.log(keys);

        const theState = this.state.bikesAtStations;


        if (!(stations === {})) {
            return Object.values(stations).map((station, index) => {

                const stationName = keys[index];

                let bikesAvailable = 0;

                if (theState[stationName]) {
                    const roadBikes = theState[stationName]['road'];
                    const mountainBikes = theState[stationName]['mountain'];

                    if (roadBikes)
                        bikesAvailable += roadBikes;

                    if (mountainBikes)
                        bikesAvailable += mountainBikes;

                    // console.log("At " + stationName + ", there are " + roadBikes + " road bikes and " + mountainBikes +
                    //     " mountain bikes " + " with a total of " + bikesAvailable + " available bikes.");

                }

                return (
                    <Marker position={station.location.geoPoint}
                            onClick={this.onMarkerClick}
                            name={station.name}
                            stationDetails={station}
                            icon={{url: "http://www2.macs.hw.ac.uk/~cmf2/mapicon.png"}}
                            label={{
                                text: bikesAvailable.toString(10),
                                color: "white"
                            }}

                    />
                )
            });
        }

    }

    componentDidUpdate() {
        console.log("Updated");
    }

    render() {
        // if (!this.props.stations) {
        //     return (
        //         <Segment>
        //             <Dimmer active>
        //                 <Loader size='large'>Loading</Loader>
        //             </Dimmer>
        //         </Segment>
        //     );
        // }

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

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                >
                    <div>

                        {this.state.activeMarker.stationDetails ?
                            <div>

                                <Header as='h3'>

                                    {this.state.activeMarker.name}

                                </Header>

                                <Header.Subheader>
                                    {this.state.activeMarker.stationDetails.notes}
                                </Header.Subheader>
                                <br/>
                                <List>
                                    <Header as={"h5"}>Avaiable Bikes</Header>
                                    <List.Item>

                                        {/*<List.Content>*/}
                                        <List.Header>
                                            <Icon name={"bicycle"}/>
                                            Mountain bikes
                                        </List.Header>
                                        <List.Description>
                                            {`There are ${this.state.bikesAtStations[this.state.activeMarker.stationDetails.sid]["mountain"]} avaiable`}
                                        </List.Description>
                                        {/*</List.Content>*/}
                                    </List.Item>

                                    <List.Item>

                                        <List.Header>
                                            <Icon name={"bicycle"}/>
                                            Mountain bikes
                                        </List.Header>
                                        <List.Description>
                                            {`There are ${this.state.bikesAtStations[this.state.activeMarker.stationDetails.sid]["road"]} avaiable`}
                                        </List.Description>
                                    </List.Item>
                                </List>
                                <Image src={this.state.activeMarker.stationDetails["url"]} alt={'new'}
                                       style={{maxWidth: "200px"}}/>

                                <br/>
                                {/*<Grid>*/}
                                {/*<Grid.Column>*/}
                                {/*/!*TODO: On click not working *!/*/}
                                {/*<Container textAlign='center' >*/}
                                {/*<Icon name={"calendar"} color={"blue"} size={"big"} onClick={() => this.handleRedirect("./reservebike")}/>*/}
                                {/*</Container>*/}
                                {/*</Grid.Column>*/}
                                {/*<Grid.Column>*/}
                                {/*<Container textAlign='center'>*/}
                                {/*<Icon name={"exclamation circle"} color={"red"} size={"big"} onClick={() => this.handleRedirect("./report")}/>*/}
                                {/*</Container>*/}
                                {/*</Grid.Column>*/}
                                {/*</Grid>*/}


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

export default withRouter(GoogleApiWrapper({
    apiKey: "AIzaSyB_13gY5K5zg1RoAEzwSxHzPIyBv0Atjcc",
    v: "3"
})(BesterbikesMap));
