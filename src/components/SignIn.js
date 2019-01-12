import React from 'react'
import WelcomeScreen from "./WelcomeScreen";

const SignIn = () =>{
    return(
        <div>
            SignIn
            <WelcomeScreen names={['George', 'Jack', 'Dave', 'John']}/>
        </div>
    )
};

export default SignIn