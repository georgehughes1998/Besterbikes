import React from 'react'
import {Dropdown, Input, Placeholder, Container, Icon, Segment, Header, Grid} from "semantic-ui-react";
import {SubmissionError} from "redux-form";
import BesterbikesMap from '../map/BesterbikesMap'
// import {getTrips} from "../../firebase/authentication";


//TODO: Implement retriveTrips to pull trips from firebase
//TODO: Show google maps on active trips
//TODO: Review columns and mobile compatability
const MyTrips = (props) => {


    const renderTrip = (color, iconName, iconColor, headerContent, headerSub, status) => {
        return(
            <Segment color={color} fluid>
                <Grid >
                    <Grid.Row>
                        <Grid.Column width={13}>
                            <Header
                                as='h1'
                                content={headerContent}
                                subheader = {headerSub}
                            />
                        </Grid.Column>

                        <Grid.Column width={2} verticalAlign='middle'>
                            <Header as="h4" color={color}>{status}</Header>
                        </Grid.Column>

                        <Grid.Column width={1} verticalAlign='middle'>
                                <Icon name={iconName} color={iconColor} size ="big  "/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                {/*<BesterbikesMap/>*/}
                                <Placeholder fluid>
                                    <Placeholder.Image />
                                </Placeholder>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }

    // const renderTrips = Object.values(TRIPS).map((key, index) => {
    const renderTrips = (status) => {
        switch(status){
            case "active":
                return renderTrip(
                    "purple",
                    "cancel",
                    "red",
                    "Waverley Station",
                    "Available from 16:00 to 16:30",
                    "Reserved"
                );
            case "inactive":
                return renderTrip(
                    "yellow",
                    "cancel",
                    "red",
                    "Haymarket Stationn",
                    "Bike available until 16:15",
                    "Ready to unlock"
                );
            case "unlocked":
                return renderTrip(
                    "green",
                    "exclamation circle",
                    "red",
                    "Heriot Watt Univeristy",
                    "Current duration: 4hrs 3mins",
                    "In Progress"
                );
            case "complete":
                return renderTrip(
                    "grey",
                    "exclamation circle",
                    "red",
                    "Edinburgh Zoo",
                    "To Edinburgh University Library lasting 4hrs 3mins",
                    "Complete"
                );
            case "cancelled":
                return renderTrip(
                    "red",
                    "exclamation circle",
                    "red",
                    "National Museum of Scotland",
                    "",
                    "Cancelled"
                );
            default:
                return (<div>No more trips to display</div>)
        }};
    // });

    // const retriveTrips = async () => {
    //     const obj = await getTrips();
    //
    //     if (obj.trips) {
    //         this.props.history.push("/")
    //     } else {
    //         throw new SubmissionError({
    //             _error: obj.message
    //         });
    //     }
    // };

    return (
        <div>
            <Dropdown text='Filter Posts' icon='filter' floating labeled fluid button className='icon'>
                <Dropdown.Menu>
                    <Input icon='search' iconPosition='left' className='search'/>
                </Dropdown.Menu>
            </Dropdown>

                {renderTrips("active")}
                {renderTrips("inactive")}
                {renderTrips("unlocked")}
                {renderTrips("complete")}
                {renderTrips("cancelled")}


        </div>
    )
};

export default MyTrips