import React from 'react'
import {SubmissionError} from "redux-form";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';

import {loadStations, loadTrips} from "../../redux/actions";
import PageContainer from "../PageContainer";
import {getUser} from "../../firebase/authentication";
import {cancelReservation, getTrips} from "../../firebase/reservations";
import ListOfLiveTrips from "../ListOfLiveTrips";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";
import Dimmer from "semantic-ui-react/dist/commonjs/modules/Dimmer";
import Loader from "semantic-ui-react/dist/commonjs/elements/Loader";


//TODO: Implement loader
//TODO: Show google maps on active trips
//TODO: Review columns and desktop/mobile compatability
//TODO: Display cancelled image
//TODO: Make cancel icon a button
//TODO: Render 5 trips at a time
class MyTrips extends React.Component {

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
            })};

    //Cancels a reservation using firebase and updates displayed trips
    handleCancelTrip = (tripId) => {
        return cancelReservation(tripId)
            .then((obj) => {
                console.log(obj);
                this.retrieveFirebaseTrips();
            })
            .catch((err) => {
                console.log(err);
                throw new SubmissionError({
                    _error: err.message
                })
            })
    };

    handleReport = () => {
        this.props.history.push("/report");
    };

    //Communicates with firebase to load in all trips
    retrieveFirebaseTrips = async () => {
        const obj = await getTrips();
        if (obj) {
            this.props.loadTrips(obj);
        } else {
            throw new SubmissionError({
                _error: obj.message
            });
        }
    };


    render() {

        // if (this.props.trips === {}) {
        //     {console.log("loading")}
        //     return (
        //         <Segment>
        //             {console.log("loading")}
        //             <Dimmer active>
        //                 <Loader size='large'>Loading</Loader>
        //             </Dimmer>
        //         </Segment>
        //     );
        // }
        return(


            <PageContainer>
                <ListOfLiveTrips
                    items={this.props.trips}
                    stations={this.props.stations}
                    handleCancelTrip={(tripID) => this.handleCancelTrip(tripID)}
                    handleReport = { () => this.handleReport()}
                />
                {/*TODO: Implement filter*/}

                <Link to={"/stationsim"}>
                    Link to stationSim
                </Link>

            </PageContainer>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        trips: state.JSON.trips,
        stations: state.JSON.stations
    };
};

export default connect(mapStateToProps, {loadTrips, loadStations})(MyTrips);