import React from 'react'
import {Dropdown, Input, Placeholder, Container, Icon, Segment, Header, Grid} from "semantic-ui-react";
import {getUser, signIn} from "../../firebase/authentication";
import {getTrips} from "../../firebase/reservations";
import {SubmissionError} from "redux-form";
import connect from "react-redux/es/connect/connect";
import {loadTrips, retrieveTrips} from "../../redux/actions";


//TODO: Implement cancel a trip
//TODO: Show google maps on active trips
//TODO: Review columns and mobile compatability
//TODO: Complete loading in trips for all reservation types
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

        if(user){
            this.retrieveFirebaseTrips();
        }

    }


    renderTrips = () => {

        if(this.props.trips){
            console.log(this.props);
           return this.props.trips.map((trip) => {
                return(
                    <div>
                        {console.log(trip['status'])}
                        {this.getTripTypeValues(trip)}
                    </div>

                )
            })
        }
    };


    renderTrip = (color, iconName, iconColor, status, headerContent, headerSub) => {
        return(
            <Segment color={color} fluid>
                {console.log(color)}
                <Grid>
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
    getTripTypeValues = (trip) => {

        switch(trip['status']){
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
                console.log("inactive here");
                return this.renderTrip(
                    "yellow",
                    "cancel",
                    "red",
                    "Ready to unlock",
                    trip["start"]["station"],
                    `Bike available until ${trip["start"]["time"]["time"]}`
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


    render(){
        return (
            <div>
                <Dropdown text='Filter Posts' icon='filter' floating labeled fluid button className='icon'>
                    <Dropdown.Menu>
                        <Input icon='search' iconPosition='left' className='search'/>
                    </Dropdown.Menu>
                </Dropdown>

                <div>
                    {this.renderTrips()}
                </div>


            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return { trips: state.JSON.trips };
};

export default connect(mapStateToProps, { loadTrips })(MyTrips);