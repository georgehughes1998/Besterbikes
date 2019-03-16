import React from "react"
import {getUser} from "../../firebase/authentication";
import {getBikesAt} from "../../firebase/map";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import FirebaseError from "../FirebaseError";
import ConfirmationModal from "../ConfirmationModal";
import {getJSONFromFile} from "../../dataHandling/handleJSON";
import connect from "react-redux/es/connect/connect";
import {loadStations} from "../../redux/actions";
import StationDropdown from "../dropdowns/StationDropdown";
import BikesDropdown from "../dropdowns/BikesDropdown";

class OperatorUnlockBike extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        this.setState({"currentUser": user.uid});
        return user
    };

    async getStations() {
        const stations = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
        this.props.loadStations(stations)
    }

    retrieveBikes = async (station) => {

        const obj = await getBikesAt(station);
        if (obj) {
            console.log(obj);
            // const allBikes = [];
            // obj.bikes.mountain.bikesArray.map((key, index) => {
            //     allBikes.push(key)
            // });
            // obj.bikes.road.bikesArray.map((key, index) => {
            //     allBikes.push(key)
            // });
            //
            // this.setState({bikes: allBikes});
        }else {

        }

    };

    handleUnlock = async () => {
        console.log(this.state);
        // unlockBike(this.state.unlockTrip)
        //     .then((bikeID) => {
        //         if (bikeID) {
        //             this.setState({activeBikeID: bikeID})
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         this.setState({firebaseError: err.message})
        //     })
    };

    constructor() {
        super();
        this.state = {
            unlockBike: "",
            firebaseError: null,
            currentUser: null,
            readyToDisplay: false,
            station: "",
            bikes:[]
        };
    }

    componentDidMount() {
        this.authenticateUser()
            .then((user) => {
                if (user)
                    this.getStations();
            })
    };

    render() {
        console.log(this.state);
        // if (!this.state.readyToDisplay) {
        //     console.log("loading");
        //     return (
        //         <CustomLoader
        //             text={"5, 4, 3, 2, ... 2.5, 1, ..."}
        //             icon={"lock"}
        //         />
        //     );
        // }
        return (
            <div>
                <StationDropdown
                    stations = {this.props.stations}
                    onChange={(station) => this.retrieveBikes(station)}
                />

                {this.state.bikes.length>0?
                    <BikesDropdown
                        fluid
                        selection
                        bikes={this.state.bikes}
                        placeholder={"Please select a valid bike to unlock"}
                        onChange={(bike) => this.setState({unlockBike: bike})}
                        name="unlockTrip"
                    />
                    :null
                }


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


const mapStateToProps = (state) => {
    return {stations: state.JSON.stations}
};

export default connect(mapStateToProps, {loadStations})(OperatorUnlockBike);