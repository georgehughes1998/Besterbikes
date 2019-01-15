import React from 'react'
import {connect} from "react-redux";

import {ackAuthChange} from "../../redux/actions";
import {withRouter} from "react-router-dom";


//Component that surrounds all Account components to all interaction with redux forms
class AccountPageContainer extends React.Component{

    render(){
        return(
            <div>
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn }
};

export default withRouter(connect(
    mapStateToProps,
    { ackAuthChange }
)(AccountPageContainer));