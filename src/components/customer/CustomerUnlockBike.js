import React from 'react'
import {Dropdown} from "semantic-ui-react";
import {getUser} from "../../firebase/authentication";
import connect from "react-redux/es/connect/connect";
import {loadStations, loadTrips} from "../../redux/actions/index";
import {getTrips} from "../../firebase/reservations";
import {unlockBike} from "../../firebase/stationSystem";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import UnlockConfirmation from "./UnlockConfirmation";
import FirebaseError from "../FirebaseError";
import {Form} from "semantic-ui-react/dist/commonjs/collections/Form/Form";


//TODO: Implement web api NFC features
//Component to unlock a bike
export class UnlockBike extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        return user
    };
    retrieveFirebaseTrips = async () => {
        const obj = await getTrips("active");
        if (obj) {
            this.props.loadTrips(obj);
        } else {

        }
    };
    renderTrips = () => {
        let DropdownArray = [];

        if (this.props.trips) {
            let keys = Object.keys(this.props.trips);
            console.log(this.props.trips);

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
                if (bikeID) {
                    this.setState({activeBikeID: bikeID})
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({firebaseError: err.message})
            })
    };

    constructor() {
        super();
        this.state = {
            unlockTrip: "",
            activeBikeID: null,
            firebaseError: null
        };
    }

    componentDidMount() {
        this.authenticateUser()
            .then((user) => {
                if (user)
                    this.retrieveFirebaseTrips();
            })
    };

    render() {
        return (

            <div>
                <Dropdown
                    fluid
                    selection
                    options={this.renderTrips()}
                    // value={ this.state.unlockTrip }
                    onChange={(param, data) => this.setState({unlockTrip: data.value})}
                    name="unlockTrip"
                />

                <br/>

                <Button onClick={() => this.handleUnlock()}>
                    Unlock bike
                </Button>

                {this.state.firebaseError ? <FirebaseError error={this.state.firebaseError}/> : null}

                {this.state.activeBikeID ? <UnlockConfirmation activeBikeID={this.state.activeBikeID}/> : null}

            </div>
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