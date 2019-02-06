import React from 'react'
import {Grid, Header, Icon, Segment} from "semantic-ui-react";
import {getUser} from "../../firebase/authentication";
import {cancelReservation, getTrips} from "../../firebase/reservations";
import {SubmissionError} from "redux-form";
import connect from "react-redux/es/connect/connect";
import {loadStations, loadTrips} from "../../redux/actions";
import PageContainer from "../PageContainer";


//TODO: Implement loader
//TODO: Implement cancel a trip
//TODO: Show google maps on active trips
//TODO: Review columns and mobile compatability
//TODO: Complete loading in trips for all reservation types
class MyTrips extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = () => {
        return getUser()
            .then(user => {
                if (user === null)
                    this.props.history.push("signin");
                return user
            });
    };
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
    handleIconClick = (status, tripId) => {
        console.log(status);

        switch (status) {
            case "Ready to unlock":
                this.handleCancelTrip(tripId);
                return;
            default:
                return;
        }
    };
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
    renderTrip = (color, iconName, iconColor, status, headerContent, headerSub, tripId) => {
        return (
            //TODO: Make this into own prop
            <Segment color={color} fluid>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={13}>
                            <Header
                                as='h1'
                                content={headerContent}
                                subheader={headerSub}
                            />

                            <Header as="h4" color={color}>{status}</Header>
                        </Grid.Column>

                        <Grid.Column width={1} verticalAlign='middle'
                                     onClick={() => this.handleIconClick(status, tripId)}>
                            <Icon name={iconName} color={iconColor} size="big"/>
                        </Grid.Column>
                    </Grid.Row>

                    {/*<Grid.Row>*/}
                    {/*<Grid.Column>*/}
                    {/*<Segment>*/}
                    {/*/!*<BesterbikesMap/>*!/*/}
                    {/*<Placeholder fluid>*/}
                    {/*<Placeholder.Image />*/}
                    {/*</Placeholder>*/}
                    {/*</Segment>*/}
                    {/*</Grid.Column>*/}
                    {/*</Grid.Row>*/}
                </Grid>
            </Segment>
        )
    };
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
    // const getTripTypeValues = Object.values(TRIPS).map((key, index) => {
    getTripTypeValues = (trip, index) => {

        const stationKey = trip["start"]["station"];
        const stationName = this.props.stations[stationKey]["name"];
        const startTime = trip["start"]["time"]["time"];

        let keys = Object.keys(this.props.trips);


        switch (trip['status']) {
            case "active":
                return this.renderTrip(
                    "purple",
                    "cancel",
                    "red",
                    "Reserved",
                    "Waverley Station",
                    "Available from 16:00 to 16:30",
                    keys[index]
                );
            case "inactive":
                return this.renderTrip(
                    "yellow",
                    "cancel",
                    "red",
                    "Ready to unlock",
                    stationName,
                    `Bike available until ${startTime}`,
                    keys[index]
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
                    ""
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
                    ""
                );
            case "cancelled":
                return this.renderTrip(
                    "red",
                    "exclamation circle",
                    "red",
                    "Cancelled",
                    stationName,
                    ""
                );
            default:
                return (<div>No more trips to display</div>)
        }
    };

    async componentDidMount() {

        const user = await this.authenticateUser();

        if (user) {
            this.retrieveFirebaseTrips();
        }
    }

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

                {/*<Dropdown text='Filter Posts' icon='filter' floating labeled fluid button className='icon'>*/}
                {/*<Dropdown.Menu>*/}
                {/*<Input icon='search' iconPosition='left' className='search'/>*/}
                {/*</Dropdown.Menu>*/}
                {/*</Dropdown>*/}

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