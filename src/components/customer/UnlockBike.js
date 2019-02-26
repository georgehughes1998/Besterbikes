import React from 'react'
import {Container, Dropdown, Header, Icon, Segment} from "semantic-ui-react";

import PageContainer from "../PageContainer";
import {getUser} from "../../firebase/authentication";
import connect from "react-redux/es/connect/connect";
import {loadStations, loadTrips} from "../../redux/actions/index";
import {getTrips} from "../../firebase/reservations";
import {unlockBike} from "../../firebase/stationSystem";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import UnlockConfirmation from "./UnlockConfirmation";
import FirebaseError from "../FirebaseError";


//TODO: Implement web api NFC features
//Component to unlock a bike
export class UnlockBike extends React.Component {

    constructor() {
        super();
        this.state = {
            unlockTrip: "",
            activeBikeID: null,
            firebaseError: null
        };
    }

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        return user
    };

    componentDidMount() {
        this.authenticateUser()
            .then((user) =>  {
                if(user)
                    this.retrieveFirebaseTrips();
                    console.log(this.props.trips)
            })};

    retrieveFirebaseTrips = async () => {
        const obj = await getTrips();
        if (obj) {
            this.props.loadTrips(obj);
        } else {

        }
    };

    renderTrips = () => {
        let DropdownArray = [];

        if (this.props.trips){
            let keys = Object.keys(this.props.trips);
            console.log(this.props.trips);
            console.log(keys);

            Object.values(this.props.trips).map((key, index) => {
                DropdownArray.push({
                    key: keys[index],
                    value: keys[index],
                    text:
                        `My ${key.status} trip from 
                        ${key.start["station"]} on 
                        ${key.start["time"]["date"]} at 
                        ${key.start["time"]["time"]}`
                });
                return DropdownArray;
            });

            return DropdownArray;
        }
    };

    handleUnlock = async () => {
        console.log(this.state);
        unlockBike(this.state.unlockTrip)
            .then((bikeID) => {
                console.log(bikeID);
                if(bikeID) {
                    this.setState({activeBikeID: bikeID})
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({firebaseError: err.message})
            })
    };

    render(){
        return (
            <PageContainer>
                <Container textAlign='center'>

                    <br/>
                    <br/>
                    <Icon name="wifi" size="massive"/>

                    <Header as="h1">
                        Unlock Bike
                    </Header>

                    <Header.Subheader>
                        Place your mobile device against the reader at one of our bike stands.
                    </Header.Subheader>

                    <br/>

                    {/*<Icon name="mobile alternate" size="huge"/>*/}

                    <Header.Subheader>
                        Alternatively, select your trip below and enter the displayed code
                    </Header.Subheader>

                    <br/>

                    <Dropdown
                        fluid
                        selection
                        options={this.renderTrips()}
                        // value={ this.state.unlockTrip }
                        onChange={(param, data) => this.setState({unlockTrip : data.value})}
                        name="unlockTrip"
                    />

                    <br/>

                    <Button onClick = {() => this.handleUnlock()}>
                        <Segment>
                            <Header as="h1">{this.state.unlockTrip}</Header>
                        </Segment>
                    </Button>

                    {this.state.firebaseError? <FirebaseError error = {this.state.firebaseError}/> : null}

                    {this.state.activeBikeID ? <UnlockConfirmation activeBikeID = {this.state.activeBikeID}/> : null}

                        </Container>
            </PageContainer>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        trips: state.JSON.trips,
        stations: state.JSON.stations
    }
};

export default connect(mapStateToProps, {loadTrips, loadStations})(UnlockBike);