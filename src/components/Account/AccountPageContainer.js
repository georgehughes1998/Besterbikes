import React from 'react'
import * as firebase from "firebase";
import {connect} from "react-redux";

import {ackAuthChange} from "../../redux/actions";


//Component that surrounds all Account components to all interaction with redux forms
class AccountPageContainer extends React.Component{

    //Uses firebase to handle what happens to user if not logged in
    componentDidMount(){
        const auth = firebase.auth();
        auth.onAuthStateChanged((user) => {
            //TODO: Redirect user away from any page if they are not authenticated
            if(this.props.history && (!user || user === null) && (this.props.location !== ("/signin" || "/signup"))){
                this.props.history.push('./signin')
            }
            this.props.ackAuthChange(user);
        })
    }

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

export default connect(
    mapStateToProps,
    { ackAuthChange }
)(AccountPageContainer);