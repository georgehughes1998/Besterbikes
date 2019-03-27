import React from 'react'
import PageContainer from "../../PageContainer";
import {
    getAllReservationStatistics,
    getAllStationStatistics,
    getAuthenticationStatistics,
    getTasksStatistics,
} from "../../../firebase/statistics";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import StatisticTypeDropdown from "./StatisticTypeDropdown";
import TimeScaleRadios from "./TimeScaleRadios";
import DMYDropdown from "./DMYDropdowns";
import {getJSONFromFile} from "../../../dataHandling/handleJSON";
import connect from "react-redux/es/connect/connect";
import {loadStations} from "../../../redux/actions";
import LoadedStatistics from "./LoadedStatistics";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";
import {getUser} from "../../../firebase/authentication";

class Statistics extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (!user) {
            this.props.history.push("/signin");
        } else if (user.type !== "manager" || user.name.firstName !== 'm' || user.name.firstName !== 'm') {
            this.props.history.push("/");
        }
        return user
    };

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            statisticType: "",
            timescale: "Daily",
            y: new Date().getFullYear(),
            m: new Date().getMonth() + 1,
            d: new Date().getDate(),
            retrievedStatistics: {},
            readyToViewLoadedStats: false
        };
    }

    async getStations() {
        const stations = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
        this.loadStations(stations)
    }

    componentDidMount() {
        this.authenticateUser().then((obj)=>{
            if (!this.props.stations)
                this.getStations();
        })

    }

    async retrieveStatistics() {
        let retrievedStatistics = [];

        switch (this.state.statisticType) {
            case "Authentication": {
                retrievedStatistics = await getAuthenticationStatistics();
                // console.log(retrievedStatistics);
                this.setState({retrievedStatistics: retrievedStatistics, readyToViewLoadedStats: true});
                return;
            }
            case "Reservations": {
                // let keys = Object.keys(this.props.stations);
                retrievedStatistics = await getAllReservationStatistics();
                console.log(retrievedStatistics);
                this.setState({retrievedStatistics: retrievedStatistics, readyToViewLoadedStats: true});
                return;
            }

            case "Stations": {
                // let keys = Object.keys(this.props.stations);
                retrievedStatistics = await getAllStationStatistics();
                this.setState({retrievedStatistics: retrievedStatistics, readyToViewLoadedStats: true});
                console.log(retrievedStatistics);
                return;
            }
            case "Tasks": {
                // let keys = Object.keys(this.props.stations);
                retrievedStatistics = await getTasksStatistics();
                console.log(retrievedStatistics);
                this.setState({retrievedStatistics: retrievedStatistics, readyToViewLoadedStats: true});
                return;
            }
        }
    }


    render() {
        // console.log(this.state);
        return (
            <PageContainer>
                <br/>
                <Container textAlign='center'>
                    <Header as={"h1"}>Statistics</Header>

                    <br/>

                    <Segment>
                        <StatisticTypeDropdown
                            onChange={(param, data) => {
                                this.setState({"statisticType": data.value, readyToViewLoadedStats: false});
                            }}
                        />
                        <br/>

                        <Button onClick={() => this.retrieveStatistics()}>
                            Update Statistics
                        </Button>
                    </Segment>
                    <br/>
                    <br/>

                    <Segment>
                        <TimeScaleRadios
                            timescale={this.state.timescale}
                            onChange={(data) => {
                                // console.log(data);
                                this.setState({"timescale": data.value})
                            }}
                        />

                        <br/>

                        <DMYDropdown
                            state={this.state}
                            onChange={(YMD) => {
                                // console.log(YMD);
                                this.setState({"y": YMD.y, "m": YMD.m, "d": YMD.d})
                            }}
                        />

                        <br/>

                        {this.state.readyToViewLoadedStats ?
                            <LoadedStatistics
                                state={this.state}
                            />
                            : null
                        }
                    </Segment>
                </Container>
            </PageContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return {stations: state.JSON.stations}
};

export default connect(mapStateToProps, {loadStations})(Statistics);