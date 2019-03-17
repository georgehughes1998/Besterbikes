import React from 'react'
import PageContainer from "../../PageContainer";
import {getAuthenticationStatistics, getStatistics} from "../../../firebase/statistics";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import StatisticSegment from "../StatisticSegment";
import StatisticTypeDropdown from "./StatisticTypeDropdown";
import TimeScaleDropdown from "./TimeScaleDropdown";
import DMYDropdown from "./DMYDropdowns";

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

    getIndividualValues = () => {

        let keys = Object.keys(this.state.retrievedStatistics);
        let groupStatisticArray = [];

        Object.values(this.state.retrievedStatistics).map((key, index) => {
            groupStatisticArray.push({name: keys[index], value: this.sumFirestoreStatObj(key)})
        });

        return groupStatisticArray;
    };

    constructor(props) {
        super(props);
        this.state = {
            statisticType: "Authentication",
            timescale: "daily",
            day: new Date().getDate(),
            month: new Date().getMonth()+1,
            year: new Date().getFullYear(),
            retrievedStatistics: {}
        };
    }


    componentDidMount () {
        this.retrieveStatistics();
    }

    async retrieveStatistics() {

        let retrievedStatistics;

        switch (this.state.statisticType) {
            case "authentication":
                retrievedStatistics = await getAuthenticationStatistics();
                this.setState({retrievedStatistics});
                return ;
            case "reservations":
                // retrievedStatistics = await getStationStatistics();
                // this.setState({retrievedStatistics});
                return ;
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
                        this.setState({"statisticType": data.value})
                    }}
                />
                <TimeScaleDropdown
                    onChange={(param, data) => {
                        this.setState({"timescale": data.value})
                    }}
                />
                <DMYDropdown/>
                <br/>

                <StatisticSegment
                    name = {this.state.statisticType}
                    icon = "user"
                    values = {this.getIndividualValues()}
                />

                </Container>
            </PageContainer>
        )
    }


}

export default Statistics