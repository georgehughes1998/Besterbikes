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

    getDailySum(statObj, year, month, day){
        return statObj[year][month][day]
    }

    getMonthlySum(statObj, year, month){
        let sum = 0;
        console.log(statObj);
        Object.values(statObj[year][month]).map((day) => {
            sum += this.getDailySum(statObj, year, month, day)
        });
        return sum;
    }

    getYearlySum(statObj, year){
        let sum = 0;
        Object.values(statObj[year]).map((month) => {
            sum += this.getMonthlySum(statObj, year, month)
        });
        return sum;
    }

    sumFirestoreStatObj = (groupStat, individualStat, year, month, day) => {
        let statObj = this.state[groupStat][individualStat];

        switch (this.state.statisticDMY){
            case "d":
                return this.getDailySum(statObj, year, month, day);
            case "m":
                return this.getMonthlySum(statObj, year, month);
            case "y":
                return this.getYearlySum(statObj, year);

        }
    };

    retrieveStatistics = async (year, month, day) => {
        console.log("Retrieving stats");
            this.setState({authenticationStat: await getAuthenticationStatistics(year, month, day)});
    };

    constructor(props) {
        super(props);
        this.state = {
            timescale: "daily",
            day: new Date().getDate(),
            month:"",
            year:"",
            authenticationStat: null
        };
    }


    componentDidMount() {
        switch (this.state.timescale){
            case "daily":
                return this.getDailySum(statObj, year, month, day);
            case "monthly":
                return this.getMonthlySum(statObj, year, month);
            case "yearly":
                return this.getYearlySum(statObj, year);

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
                    onChange={(param, data) => this.setState({"statisticType": data.value})}
                />
                <TimeScaleDropdown
                    onChange={(param, data) => this.setState({"timeScale": data.value})}
                />
                <DMYDropdown/>
                <br/>

                <StatisticSegment
                    name = {this.state.statisticType}
                    icon = "user"
                    values = ""
                />

                </Container>
            </PageContainer>
        )
    }
}

export default Statistics