import React from 'react'
import {getUser} from "../../firebase/authentication";
import {makeReport} from "../../firebase/reports";
import {Button, Container, Dropdown, Form, Header, TextArea} from "semantic-ui-react";
import PageContainer from "../PageContainer";
import TripsDropdown from "../dropdowns/TripsDropdown";
import {getTrips} from "../../firebase/reservations";
import connect from "react-redux/es/connect/connect";
import {loadOperators, loadStations, loadTrips} from "../../redux/actions";
import FirebaseError from "../FirebaseError";
import CustomLoader from "../CustomLoader";
import ConfirmationModal from "../ConfirmationModal";
import {getOperators} from "../../firebase/users";

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
                console.log(obj);
                const opName = this.getOperatorName(obj);
                this.setState({"operatorName": opName, "readyToDisplay": true})
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    retrieveOperators = async () => {
        const obj = await getOperators();
        if (obj) {
            this.props.loadOperators(obj);
            console.log(this.props.operators)
            // this.setState({"operators": obj});
        }
    };
    getOperatorName = (opID) => {
        let keys = Object.keys(this.props.operators);

        let opName = "";

        Object.values(this.props.operators).map((key, index) => {
            console.log(keys[index], opID, keys[index] === opID);
            if (keys[index] === opID) {
                console.log(key.name.firstName);
                opName = `${key.name.firstName + " " + key.name.lastName}`
            } else {
                return "";
            }
        })

        return opName;
    };

    constructor(props) {
        super(props);
        this.state = {
            category: "NOT SELECTED",
            description: "NOT SELECTED",
            reservation: "NOT SELECTED",
            error: "",
            readyToDisplay: false,
            operatorName: ""
        }
    };

    componentDidMount() {
        this.authenticateUser()
            .then((user) => {
                if (user)
                    this.retrieveFirebaseTrips();
                this.retrieveOperators()
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
                                    {
                                        key: "reservationProblem",
                                        value: "Reservation Problem",
                                        text: "Reservation Problem"
                                    },
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

                    {this.state.operatorName !== "" ?
                        <ConfirmationModal
                            icon='send'
                            header='Report Submitted'
                            text={`Thank you for taking the time to fill out this form,
                                    your report has been submitted to ${this.state.operatorName}
                                    who is one of our trusted operators and will be dealt with shortly.`}
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
        stations: state.JSON.stations,
        operators: state.JSON.operators
    }
};

export default connect(mapStateToProps, {loadTrips, loadStations, loadOperators})(Report);



