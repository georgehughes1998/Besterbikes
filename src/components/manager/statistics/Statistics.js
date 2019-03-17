import React from 'react'
import PageContainer from "../../PageContainer";
import {getAuthenticationStatistics, getStationStatistics, getStatistics} from "../../../firebase/statistics";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import SimpleStatisticSegment from "./SimpleStatisticSegment";
import StatisticTypeDropdown from "./StatisticTypeDropdown";
import TimeScaleDropdown from "./TimeScaleDropdown";
import DMYDropdown from "./DMYDropdowns";
import TableStatisticSegment from "./TableStatisticSegment";
import {getJSONFromFile} from "../../../dataHandling/handleJSON";

class Statistics extends React.Component {

    getDailySum(individualStat, y, m, d){
        let daily = individualStat[y][m][d];
        return Number(daily)
    }

    getMonthlySum(individualStat, y, m){
        let sum = 0;

        Object.values(individualStat[y][m]).map((d) => {
            sum += d;
        });
        return sum;
    }

    getYearlySum(individualStat, y){
        let sum = 0;
        Object.values(individualStat[y]).map((m) => {
            Object.values(m).map((d) => {
                sum += d;
            })

        });
        return sum;
    }

    sumFirestoreStatObj = (individualStat) => {

        switch (this.state.timescale){
            case "daily":
                return this.getDailySum(individualStat, this.state.year, this.state.month, this.state.day);
            case "monthly":
                return this.getMonthlySum(individualStat, this.state.year, this.state.month);
            case "yearly":
                return this.getYearlySum(individualStat, this.state.year);

        }
    };





    constructor(props) {
        super(props);
        this.state = {
            statisticType: "",
            timescale: "daily",
            day: new Date().getDate(),
            month: new Date().getMonth()+1,
            year: new Date().getFullYear(),
            retrievedStatistics: {}
        };
    }

    async getStations() {
        const stations = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
        this.setState({stations})
    }

    getIndividualValues = () => {

        let keys = Object.keys(this.state.retrievedStatistics);
        let groupStatisticArray = [];

        Object.values(this.state.retrievedStatistics).map((key, index) => {
            groupStatisticArray.push({name: keys[index], value: this.sumFirestoreStatObj(key)})
        });

        return groupStatisticArray;
    };

    componentDidMount () {
        if(!this.state.stations)
            this.getStations();
        this.retrieveStatistics(this.state.statisticType)
    }

    async retrieveStatistics(stats) {
        let retrievedStatistics = [];

        switch (stats) {
            case "Authentication":
                retrievedStatistics = await getAuthenticationStatistics();
                this.setState({retrievedStatistics: retrievedStatistics});
                return ;
            case "Reservations":
                let keys = Object.keys(this.state.stations);
                retrievedStatistics = [];
                console.log("Here");

                await Object.values(this.state.stations).map(async (key, index) => {
                    console.log(keys[index], key);
                    await retrievedStatistics.push(await getStationStatistics(keys[index]));
                });

                this.setState({retrievedStatistics: retrievedStatistics});
                return ;
        }
    }

    renderStatistics() {
        switch (this.state.statisticType) {
            case "Authentication":
                return (
                    <SimpleStatisticSegment
                        name={this.state.statisticType}
                        icon="user"
                        values={this.getIndividualValues()}
                    />
                );
            case "Reservations":
                return (
                    <TableStatisticSegment
                        name={this.state.statisticType}
                        icon="calendar"
                        values={this.getIndividualValues()}
                    />
                )

        }
    }

    render() {
        console.log(this.state);
        return (
            <PageContainer>
                <br/>
                <Container textAlign='center'>
                    <Header as={"h1"}>Statistics</Header>

                <br/>

                <StatisticTypeDropdown
                    onChange={(param, data) => {
                        this.setState({"statisticType": data.value});
                        // this.forceUpdate();
                    }}
                />
                <TimeScaleDropdown
                    onChange={(param, data) => {
                        this.setState({"timescale": data.value})
                        // this.retrieveStatistics();
                    }}
                />
                <DMYDropdown/>
                <br/>

                {this.renderStatistics()}

                <Button onClick={() => this.retrieveStatistics(this.state.statisticType)}>
                    Update Statistics
                </Button>

                </Container>
            </PageContainer>
        )
    }


}

export default Statistics