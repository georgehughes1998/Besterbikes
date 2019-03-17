import React from 'react'
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";
import Table from "semantic-ui-react/dist/commonjs/collections/Table/Table";
import {getIndividualValues} from "./evaluateStatistics";
import {getPrettyString} from "../../../dataHandling/prettyString";

class TableStatisticSegment extends React.Component {


    renderStatisticsColumns = (stationStats) => {
        // console.log(stationStats);
        const individualValues = (getIndividualValues({
            retrievedStatistics: stationStats,
            timescale: this.props.values.timescale,
            y: this.props.values.y,
            m: this.props.values.m,
            d: this.props.values.d
        }));
        // console.log(individualValues);

        return Object.values(individualValues).map((key, index) => {
            // console.log(key);
            // console.log(index);
            return (
                <Table.Cell>
                    {key.value}
                </Table.Cell>
            )
        })
    };

    renderStatisticsRows = () => {
        console.log(this.props);
        // let retrievedStatistics = this.props.values.retrievedStatistics;
        let keys = Object.keys(this.props.values.retrievedStatistics);
        // console.log(retrievedStatistics);

        return Object.values(this.props.values.retrievedStatistics).map((stationStats, index) => {
            // console.log(stationStats);
        //     console.log(keys[index]);
            return (
                <Table.Row>
                    <Table.Cell>
                         {getPrettyString(keys[index])}
                    </Table.Cell>
                    {this.renderStatisticsColumns(stationStats)}
                 </Table.Row>
             )
        })
    };

    renderHeaderRow(){
        if(this.props.name === "Reservations"){
            return(
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell rowSpan='2' >Station Name</Table.HeaderCell>
                        <Table.HeaderCell colSpan='2'>Made</Table.HeaderCell>
                        <Table.HeaderCell colSpan='2'>Cancelled</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>Road</Table.HeaderCell>
                        <Table.HeaderCell>Mountain</Table.HeaderCell>
                        <Table.HeaderCell>Road</Table.HeaderCell>
                        <Table.HeaderCell>Mountain</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }else{
            return(
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell rowSpan='2' >Station Name</Table.HeaderCell>
                            <Table.HeaderCell rowSpan='2'>Returned</Table.HeaderCell>
                            <Table.HeaderCell colSpan='2'>Unlocked</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>Road</Table.HeaderCell>
                            <Table.HeaderCell>Mountain</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                )

        }
}


    render() {
        return (
            <Segment>
                {/*{console.log("Seg", this.props)}*/}
                <Container textAlign='center'>
                    <Header as='h2'>
                        <Icon name={this.props.icon}/>
                        <Header.Content>
                            {this.props.name}
                        </Header.Content>
                    </Header>
                    <br/>
                    <Table columns={5} celled structured textAlign='center'>
                        {this.renderHeaderRow()}
                        <Table.Body>
                            {this.renderStatisticsRows()}
                        </Table.Body>

                    </Table>
                </Container>
            </Segment>
        )
    }
}

export default TableStatisticSegment