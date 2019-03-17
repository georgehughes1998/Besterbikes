import React from 'react'
import {getUser} from "../../firebase/authentication";
import {makeReport} from "../../firebase/reports";
import {Button, Container, Dropdown, Form, Header, TextArea} from "semantic-ui-react";
import PageContainer from "../PageContainer";
import TripsDropdown from "../dropdowns/TripsDropdown";
import {getTrips} from "../../firebase/reservations";
import connect from "react-redux/es/connect/connect";
import {loadStations, loadTrips} from "../../redux/actions";
import FirebaseError from "../FirebaseError";
import CustomLoader from "../CustomLoader";
import ConfirmationModal from "../ConfirmationModal";

class Report extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        return user
    };

    retrieveFirebaseTrips = async () => {
        const obj = await getTrips();
        if (obj) {
            this.props.loadTrips(obj);
            console.log(this.props);
            this.setState({"readyToDisplay": true})
        }
    };

    //TODO: Add firebase function to make report
    handleSubmit = async () => {
        console.log(this.state);
        this.setState({"readyToDisplay": false});
        return makeReport(this.state.reservation, this.state.category, this.state.description)
            .then((obj) => {
                this.setState({"reportSubmitted": true, "readyToDisplay": true})
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    constructor(props) {
        super(props);
        this.state = {
            category: "",
            description: "",
            reservation: "",
            error: "",
            readyToDisplay: false,
            reportSubmitted: false
        }
    };

    componentDidMount() {
        this.authenticateUser()
            .then((user) => {
                if (user)
                    this.retrieveFirebaseTrips();
            })
    };

    render() {
        if (!this.state.readyToDisplay) {
            console.log("loading");
            return (
                <CustomLoader
                    text={"We're all ears"}
                    icon={"exclamation circle"}
                />
            );
        } else {
            return (

                <PageContainer>
                    <br/>
                    <Container textAlign='center'>
                        <Form>

                            <Header as="h1">How can we help?</Header>

                            <br/>
                            <Dropdown
                                selection
                                search
                                placeholder='Select Category'
                                options={[{key: "bikeFault", value: "Bike Fault", text: "Bike Fault"},
                                    {key: "stationFault", value: "Station Fault", text: "Station Fault"},
                                    {key: "reservationProblem", value: "Reservation Problem", text: "Reservation Problem"},
                                    {key: "feedback", value: "Feedback", text: "Feedback"}
                                ]}
                                onChange={(param, data) => this.setState({"category": data.value})}
                            />

                            <br/>
                            <br/>

                            <TripsDropdown
                                placeholder='Select Reservation'
                                trips={this.props.trips}
                                onChange={(param, data) => this.setState({"reservation": data.value})}
                            />

                            <br/>
                            <br/>
                            <TextArea
                                autoHeight
                                placeholder="Please describe your query here"
                                rows={10}
                                onChange={(param, data) => this.setState({"description": data.value})}
                            />

                            <br/>
                            <br/>
                            <Button
                                content="Send Report"
                                onClick={() => this.handleSubmit(this.state)}
                            />

                            {this.state.error != "" ? <FirebaseError error={this.state.error}/> : null}

                        </Form>
                    </Container>

                    {this.state.reportSubmitted ?
                        <ConfirmationModal
                            icon='send'
                            header='Report Submitted'
                            text={`Your report has been submitted, one of our team will be in touch shortly`}
                            link="/"
                            linkText="Return to main menu"
                        />
                        : null}

                </PageContainer>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        trips: state.JSON.trips,
        stations: state.JSON.stations
    }
};

export default connect(mapStateToProps, {loadTrips, loadStations})(Report);



