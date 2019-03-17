import SimpleStatisticSegment from "./SimpleStatisticSegment";
import TableStatisticSegment from "./TableStatisticSegment";
import React from "react";
import {getIndividualValues} from "./evaluateStatistics";

class LoadedStatistics extends React.Component {


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
            </div>
        )
    }
}

export default LoadedStatistics;
