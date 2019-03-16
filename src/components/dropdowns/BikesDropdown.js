import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";

class BikesDropdown extends React.Component{

    createDropdownObject = () => {

        let DropdownArray = [];

        console.log(this.props.bikes);
        this.props.bikes.map((key, index) => {
            DropdownArray.push({key: key, value: key, text: key});
            return DropdownArray;
        });

        return DropdownArray
    };

    render(){
        return (
            <Dropdown
                clearable
                selection
                search
                options={this.createDropdownObject()}
                onChange={(param, data) => this.props.onChange(data.value)}
            />
        )
    }

};

export default BikesDropdown