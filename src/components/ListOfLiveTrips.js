//Displays all trips by mapping over returned trips
import {Grid, Header, Icon, Segment} from "semantic-ui-react";
import React from "react";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";

class listOfLiveTrips extends React.Component {

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

    //Render single reservation with provided paramters
    renderItem = ({color, iconName, iconColor, status, headerContent, headerSub, tripId, image}) => {
        return (
            //TODO: Make this into own prop
            <Segment color={color} fluid>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={13}>
                            <Header
                                as='h1'
                                content={headerContent}
                            />
                            <Header
                                as='h5'
                                content={`${headerSub}`}
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


    getItemValues = (trip, index) => {

        const stationKey = trip["start"]["station"];
        const stationName = this.props.stations[stationKey]["name"];
        const startTime = trip["start"]["time"]["time"];
        const image = this.props.stations[stationKey]["url"];
        const headerSub = `My ${trip.status} trip from 
                            ${trip.start["station"]} on 
                            ${trip.start["time"]["date"]} at 
                            ${trip.start["time"]["time"]}`

        let keys = Object.keys(this.props.items);

        switch (trip['status']) {
            case "inactive":
                return this.renderItem({
                    color: "purple",
                    iconName: "cancel",
                    iconColor: "red",
                    status: "Reserved",
                    headerContent: stationName,
                    // `Bike available from ${startTime}`,
                    headerSub,
                    tripId: keys[index],
                    image
                });
            case "active":
                return this.renderItem({
                    color: "yellow",
                    iconName: "cancel",
                    iconColor: "red",
                    status: "Ready to unlock",
                    headerContent: stationName,
                    // `Bike available until ${startTime}`,
                    headerSub,
                    tripId: keys[index],
                    image
                });
            case "unlocked":
                return this.renderItem({
                    color: "green",
                    iconName: "exclamation circle",
                    iconColor: "red",
                    status: "In Progress",
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
                    iconName: "exclamation circle",
                    iconColor: "red",
                    status: "Complete",
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
                    iconName: "exclamation circle",
                    iconColor: "red",
                    status: "Cancelled",
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
    handleIconClick = (status, tripId) => {
        console.log(status);

        switch (status) {
            case "Ready to unlock":
                this.props.handleCancelTrip(tripId);
                return;
            case "Reserved":
                this.props.handleCancelTrip(tripId);
                return;
            default:
                this.props.handleReport();
                return;
        }
    };

    render() {
        return (
            <div>
                <br/>
                <Container textAlign='center'>
                    <Header as={"h1"}>Trips</Header>
                </Container>
                <br/>

                {this.renderItems()}
            </div>
        )
    }
}

export default listOfLiveTrips;
