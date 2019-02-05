import React from 'react'
import {Dropdown} from "semantic-ui-react";
import {loadStations} from "../redux/actions";
import connect from "react-redux/es/connect/connect";

const StationDropdown = (props) => {


    const createDropdownObject = () => {

        let DropdownArray = [];

         Object.values(props.stations).map((key, index) => {
            DropdownArray.push({key: key.name, value: index, text : key.name});
        });

        return DropdownArray
    };

    return(
        <Dropdown
            fluid
            selection
            search
            placeholder='Select Station'
            options={createDropdownObject()}
            value={props.input.value}
            onChange={(param, data) => props.input.input.onChange(data.value)}
        >{console.log(createDropdownObject())}</Dropdown>
    )
};

const mapStateToProps = (state) => {
    return { stations: state.JSON.stations };
};

export default connect(
    mapStateToProps,
    { loadStations })
(StationDropdown);
