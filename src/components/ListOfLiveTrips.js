//Displays all trips by mapping over returned trips
import {Grid, Header, Icon, Segment} from "semantic-ui-react";
import React from "react";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import withRouter from "react-router/es/withRouter";
import TripStatusDropdown from "./dropdowns/TripStatusDropdown";
import {getPrettyString} from "../dataHandling/prettyString";

class ListOfLiveTrips extends React.Component {

    renderItems = () => {
        if (this.props.items) {
            return Object.values(this.props.items).map((key, index) => {
                return (
                    <div>
                        {this.getItemValues(key, index)}
                    </div>

                )
            })
        }
    };
    renderIcons = (iconNames, iconColors, status, taskId) => {
        return Object.values(iconNames).map((key, index) => {
            return (
                <div>
                    <Grid.Row onClick={() => this.handleIconClick(key, taskId)}>
                        <Icon name={key} color={iconColors[index]} size="huge"/>
                    </Grid.Row>
                    <br/>
                </div>

            )
        })
    };
    //Render single reservation with provided paramters
    renderItem = ({color, iconNames, iconColors, status, displayStatus, headerContent, headerSub, tripId, image}) => {
        console.log(this.state.viewTripsWithStatus, status);
        if (this.state.viewTripsWithStatus.length === 0 || this.state.viewTripsWithStatus.includes(status)) {
            return (
                //TODO: Make this into own prop
                <Segment color={color} fluid>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                <Header
                                    as='h1'
                                    content={headerContent}
                                />
                                <Header
                                    as='h5'
                                    content={`${headerSub}`}
                                    subheader={`Trip ID: ${tripId}`}
                                />

                                <Header as="h4" color={color}>{displayStatus}</Header>
                            </Grid.Column>

                            <Grid.Column width={1} verticalAlign='middle'>
                                {this.renderIcons(iconNames, iconColors, status, tripId)}
                            </Grid.Column>
                        </Grid.Row>

                    </Grid>
                </Segment>
            )
        }
    };
    getItemValues = (trip, index) => {

        const stationKey = trip["start"]["station"];
        const stationName = this.props.stations[stationKey]["name"];
        const startTime = trip["start"]["time"]["time"];
        const image = this.props.stations[stationKey]["url"];
        const headerSub = `My ${trip.status} trip from 
                            ${getPrettyString(trip.start["station"])} on 
                            ${getPrettyString(trip.start["time"]["date"])} at 
                            ${trip.start["time"]["time"]}`;

        let keys = Object.keys(this.props.items);

        switch (trip['status']) {
            case "inactive":
                return this.renderItem({
                    color: "purple",
                    iconNames: ["exclamation circle", "cancel"],
                    iconColors: ["orange", "red"],
                    status: "inactive",
                    displayStatus: "Reserved",
                    headerContent: stationName,
                    // `Bike available from ${startTime}`,
                    headerSub,
                    tripId: keys[index],
                    image
                });
            case "active":
                return this.renderItem({
                    color: "yellow",
                    iconNames: ["lock open", "exclamation circle", "cancel"],
                    iconColors: ["blue", "orange", "red"],
                    status: "active",
                    displayStatus: "Ready to Unlock",
                    headerContent: stationName,
                    // `Bike available until ${startTime}`,
                    headerSub,
                    tripId: keys[index],
                    image
                });
            case "unlocked":
                return this.renderItem({
                    color: "green",
                    iconNames: ["exclamation circle"],
                    iconColors: ["orange"],
                    status: "unlocked",
                    displayStatus: "In Progress",
                    headerContent: stationName,
                    //TODO: Implement current duration calculator
                    // "Current duration: 4hrs 3mins"
                    headerSub,
                    tripId: keys[index],
                    image
                });

            case "complete":
                return this.renderItem({
                    color: "grey",
                    iconNames: ["exclamation circle"],
                    iconColors: ["orange"],
                    status: "complete",
                    displayStatus: "Complete",
                    headerContent: stationName,
                    //TODO: Implement end station and total duration calculator
                    // "To Edinburgh University Library lasting 4hrs 3mins",
                    headerSub,
                    tripId: keys[index],
                    image
                });
            case "cancelled":
                return this.renderItem({
                    color: "red",
                    iconNames: ["exclamation circle"],
                    iconColors: ["orange"],
                    status: "cancelled",
                    displayStatus: "Cancelled",
                    headerContent: stationName,
                    headerSub,
                    tripId: keys[index],
                    image
                });
            default:
                return (<div>No more trips to display</div>)
        }
    };
    //Function to handle click of an icon depending on it's functionality
    handleIconClick = (icon, tripId) => {
        console.log(icon);

        switch (icon) {
            case "cancel":
                this.props.handleCancelTrip(tripId);
                return;
            case "exclamation circle":
                this.props.handleReport();
                return;
            case "lock open":
                this.props.history.push("/unlockbike");
                return;
            default:
                this.props.handleReport();
                return;
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            viewTripsWithStatus: []
        };
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <br/>
                <Container textAlign='center'>
                    <TripStatusDropdown
                        onChange={(value) => this.setState({"viewTripsWithStatus": value})}
                    />
                </Container>
                <br/>

                {this.renderItems()}

                <br/>
                <Segment>
                    <Header as='h2' icon textAlign='center'>
                        {/*<Icon name='battery empty'/>*/}
                        <Header.Content>No more trips to display</Header.Content>
                    </Header>
                </Segment>
            </div>
        )
    }
}

export default withRouter(ListOfLiveTrips);
