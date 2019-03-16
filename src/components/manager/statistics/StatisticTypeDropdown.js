import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";

const DMYDropdown = (props) => {
    return(
        <Dropdown
            placeholder="Statistic Type"
            fluid
            selection
            options={
                [
                    { key: 'authentication', icon: 'user cicle', text: 'Authentication', value: 'Authentication' },
                    { key: 'reservations', icon: 'calendar', text: 'Reservations', value: 'Reservations' },
                    { key: 'stations', icon: 'bicycle', text: 'Stations', value: 'Stations' },
                    { key: 'tasks', icon: 'tasks', text: 'Tasks', value: 'Tasks' }
                ]
            }
            onChange={(param, data) => props.onChange(param, data)}
        />
    )
};

export default DMYDropdown
