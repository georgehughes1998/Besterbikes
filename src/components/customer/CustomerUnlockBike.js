import React from 'react'
import {getUser} from "../../firebase/authentication";
import connect from "react-redux/es/connect/connect";
import {loadStations, loadTrips} from "../../redux/actions/index";
import {getTrips} from "../../firebase/reservations";
import {unlockBike} from "../../firebase/stationSystem";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import FirebaseError from "../FirebaseError";
import {Form} from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import ConfirmationModal from "../ConfirmationModal";
import CustomLoader from "../CustomLoader";
import TripsDropdown from "../dropdowns/TripsDropdown";


//TODO: Implement web api NFC features
//Component to unlock a bike
export class UnlockBike extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        this.setState({"currentUser": user.uid});
        return user
    };

    retrieveFirebaseTrips = async () => {
        const obj = await getTrips("active", this.state.currentUser);
        if (obj) {
            this.props.loadTrips(obj);
            this.setState({"readyToDisplay": true})
        } else {

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
            firebaseError: null,
            currentUser: null,
            readyToDisplay: false
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
        if (!this.state.readyToDisplay) {
            console.log("loading");
            return (
                <CustomLoader
                    text={"5, 4, 3, 2, ... 2.5, 1, ..."}
                    icon={"lock"}
                />
            );
        } else if (Object.keys(this.props.trips).length === 0) {
            return (
                <ConfirmationModal
                    icon='lock'
                    header='No bikes to unlock'
                    text={`None of your rservations are ready to be unlocked, check out My trips to see the status of your reservations`}
                    link="/mytrips"
                    linkText="My trips"
                />
            )
        } else {
            return (
                <div>
                    <TripsDropdown
                        fluid
                        selection
                        trips={this.props.trips}
                        placeholder={"Please select a valid reservation to unlock a bike"}
                        onChange={(param, data) => this.setState({unlockTrip: data.value})}
                        name="unlockTrip"
                    />

                    <br/>
                    <br/>

                    <Button onClick={() => this.handleUnlock()}>
                        Unlock bike
                    </Button>

                    {this.state.firebaseError ? <FirebaseError error={this.state.firebaseError}/> : null}

                    {this.state.activeBikeID ?
                        <ConfirmationModal
                            icon='lock open'
                            header='Bike Unlocked'
                            text={`Your bike ID reference number is ${this.state.activeBikeID}`}
                            link="/"
                            linkText="Return to main menu"
                        />
                        : null}

                </div>
            )
        }
    }
};

const mapStateToProps = (state) => {
    return {
        trips: state.JSON.trips,
        stations: state.JSON.stations
    }
};

export default connect(mapStateToProps, {loadTrips, loadStations})(UnlockBike);