import React from 'react'
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import {Container, Form} from "semantic-ui-react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import {getTrips} from "../firebase/reservations";
import {SubmissionError} from "redux-form";


//Simulation for stage 1 testing purposes to unlock and return bike
class StationSystemSimulation extends React.Component {

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
    renderTrips = () => {
        // this.
    };
    handleUnlock = () => {

    };
    handleReturn = () => {

    };

    componentDidMount() {
        this.retrieveFirebaseTrips()
    }

    render() {
        return (
            <div>
                <Container textAlign='center'>
                    <Header>
                        Station System Simulation
                    </Header>

                    {console.log(this.props.trips)}

                    <Container>
                        <Form onSubmit={() => this.handleUnlock()}>

                            <Dropdown
                                fluid
                                selection
                                options={[{key: "Trip 1", value: "Trip 1", text: "Trip 1"}]}
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
                                options={[{key: "Trip 1", value: "Trip 1", text: "Trip 1"}]}
                            />

                            <Button>
                                Return Bike
                            </Button>
                        </Form>
                    </Container>

                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {trips: state.JSON.trips}
};

export default withRouter(connect(
    mapStateToProps
)(StationSystemSimulation));