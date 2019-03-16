import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";


const TripStatusDropdown = (props) => {

    const renderItems = () => {

        let DropdownArray = [];
        let options = [
            {status: "inactive", displayStatus: "Reserved", color: "purple"},
            {status: "active", displayStatus: "Ready to unlock", color: "yellow"},
            {status: "unlocked", displayStatus: "In Progress", color: "green"},
            {status: "complete", displayStatus: "Complete", color: "grey"},
            {status: "cancelled", displayStatus: "Cancelled", color: "red"}
        ];

        options.map((key, index) => {
            DropdownArray.push({
                key: key.status,
                text: key.displayStatus,
                value: key.status,
                label: {
                    color: key.color,
                    empty: true,
                    circular: true
                },
            });

            return DropdownArray;
        });

        return DropdownArray
    };

    return (
        <Dropdown
            text='Filter Trips'
            icon='filter'
            labeled
            button
            className='icon'
            clearbale
            multiple
            fluid
            options={renderItems()}
            onChange={(param, data) => props.onChange(data.value)}
        />
    )
}

export default TripStatusDropdown
