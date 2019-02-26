import React from 'react'
import {withRouter} from "react-router-dom";
import {Grid} from "semantic-ui-react";


//TODO: Only show header if logged in
//Component that surrounds all Account components to all interaction with redux forms
const PageContainer = (props) => {

    return (
        <div style={{ marginTop: '6em' }}>
            <Grid>
                <Grid.Column>
                    {props.children}
                </Grid.Column>
            </Grid>
        </div>


    )
};


export default withRouter(PageContainer);