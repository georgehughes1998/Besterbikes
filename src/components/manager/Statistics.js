import React from 'react'
import PageContainer from "../PageContainer";
import {getStatistics} from '../../firebase/statistics'
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Menu from "semantic-ui-react/dist/commonjs/collections/Menu/Menu";
import StatisticSegment from "./StaticticSegment";
import {SubmissionError} from "redux-form";

class Statistics extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            statisticDMY: "d"
        };
    }

    retrieveStatistic = async (statistic,year , month, day) => {

        console.log(statistic, year, month, day);
        const obj = await getStatistics(statistic, year, month, day);
        if (obj) {
            console.log(obj);
            console.log(obj[statistic]);
            console.log(obj["authentication_signIn"]);
            console.log(obj[statistic][year][month][day]);
            return obj[year][`0${month}`][day];
        } else {
            throw new SubmissionError({
                _error: obj.message
            });
        }
    };

    render(){
        return(
            <PageContainer>
                <br/>
                <Container textAlign='center'>
                    <Header as={"h1"}>Statistics</Header>
                </Container>
                <br/>

                <Menu pointing secondary widths={3}>
                    <Menu.Item name="Daily" active={this.state.statisticDMY === "d"}
                               onClick={() => this.setState({"statisticDMY": "d"})}/>
                    <Menu.Item name="Monthly" active={this.state.statisticDMY === "m"}
                               onClick={() => this.setState({"statisticDMY": "m"})}/>
                    <Menu.Item name="Yearly" active={this.state.statisticDMY === "y"}
                               onClick={() => this.setState({"statisticDMY": "y"})}/>
                </Menu>

                <StatisticSegment
                    name = "Authentication"
                    icon = "user"
                    values = {
                        [
                            {name: "Sign Ins", value: this.retrieveStatistic(["authentication_signIn"], 2019, 3, 12)},
                            {name: "Sign Ups", value: 1},
                            {name: "Update Details", value: 2}
                        ]
                    }
                />

            </PageContainer>
        )
    }
}

export default Statistics