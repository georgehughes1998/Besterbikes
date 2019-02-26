import React from 'react'
import {Grid, Header, Icon, Segment} from "semantic-ui-react";
import {SubmissionError} from "redux-form";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';

import {loadStations, loadTrips} from "../../redux/actions";
import PageContainer from "../PageContainer";
import {getUser} from "../../firebase/authentication";
import {cancelReservation, getTrips} from "../../firebase/reservations";


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

    //Cancels a trip using firebase and updates displayed trips
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

    //Function to handle click of an icon depending on it's functionality
    handleIconClick = (status, tripId) => {
        console.log(status);

        switch (status) {
            case "Ready to unlock":
                this.handleCancelTrip(tripId);
                return;
            case "Reserved":
                this.handleCancelTrip(tripId);
                return;
            default:
                this.props.history.push("/report");
                return;
        }
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

    //Displays all trips by mapping over returned trips
    renderTrips = () => {
        if (this.props.trips) {
            return Object.values(this.props.trips).map((key, index) => {
                return (
                    <div>
                        {this.getTripTypeValues(key, index)}
                    </div>

                )
            })
        }
    };

    //Render single trip with provided paramters
    renderTrip = (color, iconName, iconColor, status, headerContent, headerSub, tripId, image) => {
        return (
            //TODO: Make this into own prop
            <Segment color={color} fluid>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={13}>
                            <Header
                                as='h1'
                                content={headerContent}
                                subheader={`Trip ID: ${tripId}`}
                            />

                            <Header as="h4" color={color}>{status}</Header>
                        </Grid.Column>

                        <Grid.Column width={1} verticalAlign='middle'
                                     onClick={() => this.handleIconClick(status, tripId)}>
                            <Icon name={iconName} color={iconColor} size="big"/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            {/*<Segment>*/}
                                {/*/!*<BesterbikesMap/>*!/*/}
                                {/*{console.log(image)}*/}
                                {/*<Image src={image}/>*/}
                            {/*</Segment>*/}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    };

    // const getTripTypeValues = Object.values(TRIPS).map((key, index) => {
    getTripTypeValues = (trip, index) => {

        console.log(trip);

        const stationKey = trip["start"]["station"];
        const stationName = this.props.stations[stationKey]["name"];
        const startTime = trip["start"]["time"]["time"];
        const image = this.props.stations[stationKey]["url"];

        let keys = Object.keys(this.props.trips);

        switch (trip['status']) {
            case "inactive":
                return this.renderTrip(
                    "purple",
                    "cancel",
                    "red",
                    "Reserved",
                    stationName,
                    // `Bike available from ${startTime}`,
                    "",
                    keys[index],
                    image
                );
            case "active":
                return this.renderTrip(
                    "yellow",
                    "cancel",
                    "red",
                    "Ready to unlock",
                    stationName,
                    // `Bike available until ${startTime}`,
                    "",
                    keys[index],
                    image
                );
            case "unlocked":
                return this.renderTrip(
                    "green",
                    "exclamation circle",
                    "red",
                    "In Progress",
                    stationName,
                    //TODO: Implement current duration calculator
                    // "Current duration: 4hrs 3mins"
                    "",
                    keys[index],
                    image
                );

            case "complete":
                return this.renderTrip(
                    "grey",
                    "exclamation circle",
                    "red",
                    "Complete",
                    stationName,
                    //TODO: Implement end station and total duration calculator
                    // "To Edinburgh University Library lasting 4hrs 3mins",
                    "",
                    keys[index],
                    image
                );
            case "cancelled":
                return this.renderTrip(
                    "red",
                    "exclamation circle",
                    "red",
                    "Cancelled",
                    stationName,
                    "",
                    keys[index],
                    image
                );
            default:
                return (<div>No more trips to display</div>)
        }
    };

    render() {

        // if (this.props.trips === {}) {
        //     {console.log("loaidng")}
        //     return (
        //         <Segment>
        //             {console.log("loaidng")}
        //             <Dimmer active>
        //                 <Loader size='large'>Loading</Loader>
        //             </Dimmer>
        //         </Segment>
        //     );
        // }

        return (
            <PageContainer>
                <div>
                    {this.renderTrips()}
                </div>
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