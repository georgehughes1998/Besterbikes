import React from 'react'
import {connect} from "react-redux";
import {Dropdown} from "semantic-ui-react";

import {loadStations} from "../../redux/actions/index";

//Component that loads a dropdown box with all station details
const StationDropdown = (props) => {

    const createDropdownObject = () => {

        let DropdownArray = [];
        let keys = Object.keys(props.stations);

        Object.values(props.stations).map((key, index) => {
            DropdownArray.push({key: keys[index], value: keys[index], text: key.name});
            return DropdownArray;
        });

        return DropdownArray
    };

    if (props.input) {
        return (
            <Dropdown
                clearable
                fluid
                selection
                search
                placeholder='Select Station'
                options={createDropdownObject()}
                value={props.input.value}
                onChange={(param, data) => props.input.input.onChange(data.value)}
            />
        )
    } else {
        return (
            <Dropdown
                clearable
                fluid
                selection
                search
                placeholder='Select Station'
                options={createDropdownObject()}
                onChange={(param, data) => props.onChange(data.value)}
            />
        )

    }
};

const mapStateToProps = (state) => {
    return {stations: state.JSON.stations};
};

export default connect(mapStateToProps, {loadStations})(StationDropdown);
