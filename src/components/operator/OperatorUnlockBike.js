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
import {unlockBikeOperator} from "../../firebase/stationSystem";

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
            let keys = Object.keys(obj.mountain);
            console.log(obj);
            const allBikes = [];
            Object.values(obj.mountain).map((key, index) => {
                allBikes.push(keys[index])
            });
            keys = Object.keys(obj.road);
            Object.values(obj.road).map((key, index) => {
                allBikes.push(keys[index])
            });
            console.log(allBikes);
            this.setState({bikes: allBikes});
        }else {

        }

    };

    handleUnlock = async () => {
        console.log(this.state);
        unlockBikeOperator(this.state.unlockBike)
            .then((obj) => {
                console.log(obj);
                this.setState({activeBikeID: this.state.unlockBike})
            })
            .catch((err) => {
                console.log(err);
                this.setState({firebaseError: err.message})
            })
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

                <br/>
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