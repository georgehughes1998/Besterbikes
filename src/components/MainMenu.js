import React from 'react'

import SignOut from "./account/SignOut";
import {authenticate} from "../firebase/authentication";


class MainMenu extends React.Component{

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () =>{
        const user = await authenticate();
        if(user === null)
            this.props.history.push("signin");
        return user
    };

    componentDidMount(){
        this.authenticateUser().then((user) => console.log(user));
    }

    render(){
        return(
            <div>
                <SignOut/>
            </div>
        )
    }

}

export default MainMenu