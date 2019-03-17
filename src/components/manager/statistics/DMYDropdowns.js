import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";

const StatisticTypeDropdown = (props) => {
    return(
        <Grid columns={"equal"}>
            <Grid.Column>
                <Dropdown
                    placeholder="Daily"
                    fluid
                    selection
                    options={
                        [
                            { key: 'yearly', text: 'Yearly', value: 'yearly' },
                            { key: 'monthly', text: 'Monthly', value: 'monthly' },
                            { key: 'daily', text: 'Daily', value: 'daily' }
                        ]
                    }
                    // onChange={(param, data) => this.setState({"timeScale": data.value})}
                />
            </Grid.Column>
            <Grid.Column>

            </Grid.Column>
            <Grid.Column>

            </Grid.Column>
        </Grid>
    )
};

export default StatisticTypeDropdown
