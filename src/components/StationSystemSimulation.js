import React from 'react'
import {Button, Container, Dropdown, Form, Header} from "semantic-ui-react";
import {connect} from "react-redux";
import {SubmissionError} from "redux-form";
import PageContainer from "./PageContainer";
import {loadStations, loadTrips} from "../redux/actions";
import {unlockBike} from "../firebase/stationSystem";


//Simulation for stage 1 testing purposes to unlock and return bike
class StationSystemSimulation extends React.Component {

    constructor() {
        super();
        this.state = {
            unlockStation: "",
            unlockTrip: "",
            returnStation: "",
            returnTrip: ""
        };
    }

        renderTrips = () => {
        let DropdownArray = [];

        if (this.props.trips){
            let keys = Object.keys(this.props.trips);

            Object.values(this.props.trips).map((key, index) => {
                DropdownArray.push({key: keys[index], value: keys[index], text: keys[index]});
                return DropdownArray;
            });

            return DropdownArray;
        }
    };

    renderStations = () => {

        let DropdownArray = [];
        let keys = Object.keys(this.props.stations);

        Object.values(this.props.stations).map((key, index) => {
            DropdownArray.push({key: keys[index], value: keys[index], text: key.name});
            return DropdownArray;
        });

        return DropdownArray
    };

    handleChange(input, data) {
        this.setState({
            [input] : data.value
        });
    }

    handleUnlock = async () => {
        console.log(this.state);
        unlockBike(this.state.unlockTrip)
            .then((obj) => {
                console.log(obj)
            })
            .catch((err) => {
                console.log(err);
                throw new SubmissionError({
                    _error: err.message
                })
            })
    };

    handleReturn = () => {

    };

    componentDidMount() {
        // this.retrieveFirebaseTrips()
    }

    render() {
        return (
            <PageContainer>
                <Container textAlign='center'>
                    <Header>
                        Station System Simulation
                    </Header>

                    {console.log(this.props.stations)}

                    <Container>
                        <Form onSubmit={() => this.handleUnlock()}>

                            <Dropdown
                                onChange
                                fluid
                                selection
                                options={this.renderStations()}
                                value={ this.state.unlockStation }
                                onChange={(param, data) => this.handleChange("unlockStation", data) }
                                name="unlockStation"
                            />

                            <Dropdown
                                fluid
                                selection
                                options={this.renderTrips()}
                                value={ this.state.unlockTrip }
                                onChange={(param, data) => this.handleChange("unlockTrip", data) }
                                name="unlockTrip"
                            />

                            <Button>
                                Unlock bike
                            </Button>
                        </Form>
                    </Container>

                    <br/>

                    <Container>
                        <Form onSubmit={() => this.handleReturn()}>


                            <Dropdown
                                onChange
                                fluid
                                selection
                                options={this.renderStations()}
                                value={ this.state.returnTrip }
                                onChange={(param, data) => this.handleChange("returnTrip", data) }
                                name="returnTrip"
                            />

                            <Dropdown
                                fluid
                                selection
                                options={this.renderTrips()}
                                value={ this.state.returnStation }
                                onChange={(param, data) => this.handleChange("returnStation", data) }
                                name="returnStation"
                            />

                            <Button>
                                Return Bike
                            </Button>
                        </Form>
                    </Container>

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

export default connect(mapStateToProps, {loadTrips, loadStations})(StationSystemSimulation);