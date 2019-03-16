import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";
import withRouter from "react-router/es/withRouter";

class OperatorDropdown extends React.Component {

    renderOperators = () => {
        let DropdownArray = [];

        if (this.props.operators !== {}) {
            let keys = Object.keys(this.props.operators);

            console.log(this.props.operators);

            Object.values(this.props.operators).map((key, index) => {
                DropdownArray.push({
                    key: keys[index],
                    value: keys[index],
                    text: `${key.name.firstName} ${key.name.lastName}`
                });
                return DropdownArray;
            });

            return DropdownArray;
        }
    };


    render() {
        return (
            <Dropdown
                clearable
                selection
                search
                placeholder={this.props.placeholder}
                options={this.renderOperators()}
                onChange={(param, data) => this.props.onChange(data.value)}
            />
        )
    }
};

export default withRouter(OperatorDropdown)