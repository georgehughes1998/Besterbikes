import React from 'react'
import {Button, Container, Dropdown, Form, Header} from "semantic-ui-react";
import {connect} from "react-redux";
import PageContainer from "./PageContainer";
import {loadStations, loadTrips} from "../redux/actions";
import {getUnlockedBikes, returnBike, unlockBike} from "../firebase/stationSystem";


//Simulation for stage 1 testing purposes to unlock and return bike
class StationSystemSimulation extends React.Component {

    constructor() {
        super();
        this.state = {
            unlockStation: "",
            unlockTrip: "",
            returnStation: "",
            returnBikes: [],
            returnBike: ""
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

    getAvailableBikes = () => {
        return getUnlockedBikes().
            then((obj) => {this.setState({returnBikes: obj})});
    };

    renderAvailableBikes = () => {
        let DropdownArray = [];

        let availableBikes = this.state.returnBikes;

        for (var i = 0, len = availableBikes.length; i < len; i++) {
            DropdownArray.push({key: (availableBikes[i]), value: (availableBikes[i]), text: (availableBikes[i])});;
        }

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
            })
    };



    handleReturn = () => {
        console.log(this.state);
        returnBike(this.state.returnBike, this.state.returnStation)
            .then((obj) => {
                console.log(obj)
            })
            .catch((err) => {
                console.log(err);
            })
    };

    componentDidMount() {
        // this.retrieveFirebaseTrips()
        this.getAvailableBikes();
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
                                fluid
                                selection
                                options={this.renderStations()}
                                value={ this.state.returnStation }
                                onChange={(param, data) => this.handleChange("returnStation", data) }
                                name="returnStation"
                            />

                            <Dropdown
                                fluid
                                selection
                                options={this.renderAvailableBikes()}
                                value={ this.state.returnBike }
                                onChange={(param, data) => this.handleChange("returnBike", data) }
                                name="returnBike"
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