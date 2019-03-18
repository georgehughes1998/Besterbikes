import SimpleStatisticSegment from "./SimpleStatisticSegment";
import TableStatisticSegment from "./TableStatisticSegment";
import Graph from "./Graph"
import React from "react";
import {getIndividualValues} from "./evaluateStatistics";
import {changeNestedToGraphFormat} from "../../../firebase/statistics";
import {getPrettyString} from "../../../dataHandling/prettyString";


const graph = <Graph />

class LoadedStatistics extends React.Component {

    getGraphableStatistics(statisticValues) {

        const theData = changeNestedToGraphFormat(statisticValues);

        console.log(theData);

        return theData;
    }

    renderSingleGraph(statisticType,statistics) {
        return <Graph
            x={"date"}
            y={"value"}
            data={this.getGraphableStatistics(statistics)}
            text={getPrettyString(statisticType)}
        />
    }

    renderGraphStatistics() {

        let returnValue = [];

        switch (this.props.state.statisticType) {
            case "Authentication": {


                console.log(this.props.state.retrievedStatistics);


                if (this.props.state.retrievedStatistics) {

                    const retrievedStatistics = this.props.state.retrievedStatistics;
                    const retrievedKeys = Object.keys(retrievedStatistics);

                    //For each statistic type, make a new graph and append it to the return value
                    retrievedKeys.map(statisticKey => {
                            returnValue.push(
                                <div>{this.renderSingleGraph(statisticKey, retrievedStatistics[statisticKey])}</div>);
                        }
                    );
                }

                //Return value should be a bunch of components
                return returnValue;

            }
            case "Reservations": {

                if (this.props.state.retrievedStatistics) {

                    const retrievedStatistics = this.props.state.retrievedStatistics;
                    const retrievedKeys = Object.keys(retrievedStatistics);

                    retrievedKeys.map(stationID => {

                        const stationKeys = Object.keys(retrievedStatistics[stationID]);

                        stationKeys.map(statisticKey => {
                                returnValue.push(
                                    <div>{this.renderSingleGraph(statisticKey, retrievedStatistics[stationID][statisticKey])}</div>);
                            }
                        );

                    });

                    //For each statistic type, make a new graph and append it to the return value

                }

                //Return value should be a bunch of components
                return returnValue;

            }

        }
    }


    renderStatistics() {
        switch (this.props.state.statisticType) {
            case "Authentication":
                return (
                    <SimpleStatisticSegment
                        name={this.props.state.statisticType}
                        icon="user"
                        values={getIndividualValues(this.props.state)}
                    />
                );
            case "Reservations":
                return (
                    <TableStatisticSegment
                        name={this.props.state.statisticType}
                        icon="calendar"
                        values={this.props.state}
                    />
                );
            case "Stations":
                return (
                    <TableStatisticSegment
                        name={this.props.state.statisticType}
                        icon="bicycle"
                        values={this.props.state}
                    />
                )
            case "Tasks":
                return (
                    <SimpleStatisticSegment
                        name={this.props.state.statisticType}
                        icon="tasks"
                        values={getIndividualValues(this.props.state)}
                    />
                )
        }
    }

    render() {
        return (
            <div>
                {this.renderStatistics()}
                {this.renderGraphStatistics()}
            </div>
        )
    }
}

export default LoadedStatistics;
