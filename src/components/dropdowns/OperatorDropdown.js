import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";
import withRouter from "react-router/es/withRouter";

class OperatorDropdown extends React.Component {

    renderTrips = () => {
        let DropdownArray = [];

        if (this.props.operators) {
            let keys = Object.keys(this.props.operators);

            console.log(this.props.operators);

            // Object.values(this.props.trips).map((key, index) => {
            //     DropdownArray.push({
            //         key: keys[index],
            //         value: keys[index],
            //         text:
            //             `My ${key.name[firstName]} trip from
            //             ${key.start["station"]} on
            //             ${key.start["time"]["date"]} at
            //             ${key.start["time"]["time"]}`
            //     });
            //     return DropdownArray;
            // });

            return DropdownArray;
        }
    };


    render(){
        return(
            <Dropdown
                selection
                search
                placeholder={this.props.placeholder}
                options={this.renderTrips()}
                onChange={this.props.onChange}
            />
        )
    }
};

export default withRouter(OperatorDropdown)