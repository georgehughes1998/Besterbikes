import React from 'react'
import {Dropdown, Input, Placeholder, Container, Icon, Segment, Header, Grid} from "semantic-ui-react";
import {getUser, signIn} from "../../firebase/authentication";
import {getTrips} from "../../firebase/reservations";
import {SubmissionError} from "redux-form";

//TODO: Implement retriveTrips to pull trips from firebase
//TODO: Show google maps on active trips
//TODO: Review columns and mobile compatability
class MyTrips extends React.Component{

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = () => {
        return getUser()
            .then(user => {
                if (user === null)
                    this.props.history.push("signin");
                return user
            });
    };

    async componentDidMount() {

        const user = await this.authenticateUser();
        console.log(user);

        if(user){
            console.log("2");
            this.retrieveTrips();
        }

    }
    renderTrip = (color, iconName, iconColor, headerContent, headerSub, status) => {
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
                                <Icon name={iconName} color={iconColor} size ="big"/>
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
    renderTrips = (status) => {
        switch(status){
            case "active":
                return this.renderTrip(
                    "purple",
                    "cancel",
                    "red",
                    "Waverley Station",
                    "Available from 16:00 to 16:30",
                    "Reserved"
                );
            case "inactive":
                return this.renderTrip(
                    "yellow",
                    "cancel",
                    "red",
                    "Haymarket Stationn",
                    "Bike available until 16:15",
                    "Ready to unlock"
                );
            case "unlocked":
                return this.renderTrip(
                    "green",
                    "exclamation circle",
                    "red",
                    "Heriot Watt Univeristy",
                    "Current duration: 4hrs 3mins",
                    "In Progress"
                );
            case "complete":
                return this.renderTrip(
                    "grey",
                    "exclamation circle",
                    "red",
                    "Edinburgh Zoo",
                    "To Edinburgh University Library lasting 4hrs 3mins",
                    "Complete"
                );
            case "cancelled":
                return this.renderTrip(
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

    retrieveTrips = async () => {
        const obj = await getTrips();

        if (obj) {
            console.log(obj)
        } else {
            throw new SubmissionError({
                _error: obj.message
            });
        }
    };

    render(){
        return (
            <div>
                <Dropdown text='Filter Posts' icon='filter' floating labeled fluid button className='icon'>
                    <Dropdown.Menu>
                        <Input icon='search' iconPosition='left' className='search'/>
                    </Dropdown.Menu>
                </Dropdown>

                {this.renderTrips("active")}
                {this.renderTrips("inactive")}
                {this.renderTrips("unlocked")}
                {this.renderTrips("complete")}
                {this.renderTrips("cancelled")}

            </div>
        )
    }

};

export default MyTrips