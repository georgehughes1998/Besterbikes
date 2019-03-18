import SimpleStatisticSegment from "./SimpleStatisticSegment";
import TableStatisticSegment from "./TableStatisticSegment";
import Graph from "./Graph"
import React from "react";
import {getIndividualValues} from "./evaluateStatistics";
import {changeNestedToGraphFormat} from "../../../firebase/statistics";


const graph = <Graph />

class LoadedStatistics extends React.Component {

    getGraphableStatistics(statisticValues) {

        // changeNestedToGraphFormat()
        console.log(statisticValues);

        return [{x:1,y:2},{x:2,y:1},{x:3,y:9}];
    }

    renderSingleGraph(statistics) {
        return <Graph
            x={"x"}
            y={"y"}
            data={this.getGraphableStatistics(statistics)}
        />
    }

    renderGraphStatistics() {

        let returnValue = <div></div>;

        console.log(this.props.state.retrievedStatistics);


        if (this.props.state.retrievedStatistics) {

            const retrievedStatistics = this.props.state.retrievedStatistics;
            const retrievedKeys = Object.keys(retrievedStatistics);

            //For each statistic type, make a new graph and append it to the return value
            retrievedKeys.map(statisticKey => {
                    returnValue += <div>{this.renderSingleGraph(retrievedStatistics[statisticKey])}</div>
                }
            );
        }

        //Return value should be a bunch of components
        return returnValue;

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
