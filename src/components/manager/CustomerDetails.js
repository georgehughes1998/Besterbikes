import React from 'react'
import withRouter from "react-router/es/withRouter";
import PageContainer from "../PageContainer";
import ListOfLiveTrips from "../ListOfLiveTrips";
import {getUser} from "../../firebase/authentication";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import {cancelReservation, getTrips} from "../../firebase/reservations";
import {SubmissionError} from "redux-form";
import connect from "react-redux/es/connect/connect";
import {loadStations, loadTrips} from "../../redux/actions";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";

class CustomerDetails extends React.Component {

    //Cancels a reservation using firebase and updates displayed trips
    handleCancelTrip = (tripId) => {
        return cancelReservation(tripId)
            .then((obj) => {
                // console.log(obj);
                this.retrieveFirebaseTrips();
            })
            .catch((err) => {
                console.log(err);
                throw new SubmissionError({
                    _error: err.message
                })
            })
    };
    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user == null) {
            this.props.history.push("/signin");
        } else if (user.type !== "manager") {
            this.props.history.push("/");
        }

        // console.log(user);
        this.setState({"currentUser": user});
        return user;
    };
    //Communicates with firebase to load in all trips
    retrieveFirebaseTrips = async () => {
        console.log(this.state.currentUser.uid);
        console.log(this.props.history.location.state);

        if (this.props.history.location.state.customerID) {
            const obj = await getTrips("", this.props.history.location.state.customerID);

            if (obj) {
                this.props.loadTrips(obj);
                console.log(obj);
            } else {
                throw new SubmissionError({
                    _error: obj.message
                });
            }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            currentUser: {}
        };
    }

    componentDidMount() {
        this.authenticateUser()
            .then((user) => {
                if (user)
                    this.retrieveFirebaseTrips();
            })
    }

    render() {
        return (
            <PageContainer>
                <Segment raised>

                    <br/>
                    <Container textAlign='left'>
                        <Header as={"h1"}>Customer Details</Header>
                        <p>
                            <strong>Forename: </strong>
                            {this.props.history.location.state.customer.name ? this.props.history.location.state.customer.name["firstName"] : null}
                        </p>
                        <p>
                            <strong>Surname: </strong>
                            {this.props.history.location.state.customer.name ? this.props.history.location.state.customer.name["lastName"] : null}
                        </p>
                        <p>
                            <strong>Date of Birth: </strong>
                            {this.props.history.location.state.customer.dateOfBirth ? this.props.history.location.state.customer.dateOfBirth : null}
                        </p>
                        <p>
                            <strong>ID: </strong>
                            {this.props.history.location.state.customerID ? this.props.history.location.state.customerID : null}
                        </p>

                        <Button onClick={() => this.props.history.push("/users")}>
                            Return to all users
                        </Button>

                    </Container>
                    <br/>


                </Segment>

                {/*{console.log(this.props.trips)}*/}
                {/*{console.log(this.props.stations)}*/}

                <ListOfLiveTrips
                    items={this.props.trips}
                    stations={this.props.stations}
                    handleCancelTrip={(tripID) => this.handleCancelTrip(tripID)}
                    handleReport={() => this.handleReport()}
                />
                {/*{this.props.location.state.customerID}*/}
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

export default withRouter(connect(mapStateToProps, {loadTrips, loadStations})(CustomerDetails));