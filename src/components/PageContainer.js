import React from 'react'
import {Grid} from "semantic-ui-react";


//TODO: Only show header if logged in
//Component that surrounds all Account components to all interaction with redux forms
class PageContainer extends React.Component {

    //Checks if user is logged in and redirects to sign in if no
    render() {
        return (
            <div style={{marginTop: '6em'}}>
                <Grid>
                    <Grid.Column>
                        {this.props.children}
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
};

export default PageContainer;