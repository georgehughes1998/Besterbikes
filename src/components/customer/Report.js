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
        } else {

        }
    };
    //TODO: Add firebase function to make report
    handleSubmit = async (values) => {
        return makeReport(this.state.reservation, this.state.category, this.state.description)
            .then((obj) => {

            })
            .catch((err) => {
                console.log(err.message);
                this.setState({error: err.message});
                // throw new SubmissionError({
                //     _error: err.message
                // })
            })
        console.log(values)
    };

    constructor(props) {
        super(props);
        this.state = {
            category: "",
            description: "",
            reservation: "",
            error: ""
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
                                {key: "feedback", value: "Feedback", text: "Feedback"}
                            ]}
                            onChange={(param, data) => this.setState({"category": data.value})}
                        />

                        <br/>
                        <br/>


                        <TripsDropdown
                            placeholder='Select Reservation'
                            trips={this.props.trips}
                            handleSubmit={(param, data) => this.setState({"reservation": data.value})}
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
            </PageContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        trips: state.JSON.trips,
        stations: state.JSON.stations
    }
};

export default connect(mapStateToProps, {loadTrips, loadStations})(Report);



