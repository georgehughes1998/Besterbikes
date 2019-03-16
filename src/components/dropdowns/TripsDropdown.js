import React from "react";
import {Dropdown} from "semantic-ui-react";
import withRouter from "react-router/es/withRouter";
import {getPrettyString} from "../../dataHandling/prettyString";

class TripsDropdown extends React.Component {

    renderTrips = () => {
        let DropdownArray = [];

        if (this.props.trips) {
            let keys = Object.keys(this.props.trips);
            console.log(keys);

            Object.values(this.props.trips).map((key, index) => {
                DropdownArray.push({
                    key: keys[index],
                    value: keys[index],
                    text:
                        `My ${getPrettyString(key.status)} trip from 
                        ${getPrettyString(key.start["station"])} on 
                        ${getPrettyString(key.start["time"]["date"])} at 
                        ${key.start["time"]["time"]}`
                });

                return DropdownArray;
            });

            return DropdownArray;
        }
    };

    render() {
        return (
            <Dropdown
                selection
                placeholder={this.props.placeholder}
                options={this.renderTrips()}
                onChange={this.props.onChange}
            />
        )
    }
};

export default withRouter(TripsDropdown)
