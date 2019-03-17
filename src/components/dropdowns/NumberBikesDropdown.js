import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";

const NumberBikesDropdown = (props) => {

    const createDropdownObject = () => {

        let DropdownArray = [];
        let keys = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        keys.map((key, index) => {
            let text;

            if (key === 1) {
                text = `${key} Bike`
            } else {
                text = `${key} Bikes`
            }

            DropdownArray.push({key: key, value: key, text: text});
            return DropdownArray;
        });

        return DropdownArray
    };

    return (
        <Dropdown
            clearable
            fluid
            selection
            search
            placeholder='0 Bikes'
            options={createDropdownObject()}
            value={props.input.value}
            onChange={(param, data) => props.input.input.onChange(data.value)}
        />
    )
};

export default NumberBikesDropdown