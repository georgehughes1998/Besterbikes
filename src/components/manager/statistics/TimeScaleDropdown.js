import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";

const TimeScaleDropdown = (props) => {
    return(
        <Dropdown
            placeholder="Time Scale"
            fluid
            selection
            options={
                [
                    { key: 'yearly', text: 'Yearly', value: 'yearly' },
                    { key: 'monthly', text: 'Monthly', value: 'monthly' },
                    { key: 'daily', text: 'Daily', value: 'daily' }
                ]
            }
            onChange={(param, data) => props.onChange(param, data)}
        />
    )
};

export default TimeScaleDropdown
