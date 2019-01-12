import React from 'react'
import * as firebase from "firebase";

class SignIn extends React.Component{

    componentDidMount() {
        const inputEmail = document.getElementById("inputEmail");
        const inputPassword = document.getElementById("inputPassword");
        const buttonLogIn = document.getElementById("buttonLogIn");
        const buttonSignUp = document.getElementById("buttonSignUp");

        buttonLogIn.addEventListener('click', e => {
            const email = inputEmail.value;
            const pass = inputPassword.value;
            const auth = firebase.auth();

            const promise = auth.signInWithEmailAndPassword(email,pass);
            promise.catch(e => console.log(e.message));
            promise.then(e => {});

        });//End of buttonLogIn

        buttonSignUp.addEventListener('click',e=>
        {
            const email = inputEmail.value;
            const pass = inputPassword.value;
            const auth = firebase.auth();

            const promise = auth.createUserWithEmailAndPassword(email,pass);
            promise.catch(e => console.log(e.message));

        });//End of buttonSignUp

    };//End of componentDidMount

    render(){
        return(
            <div>

                {/*Besterbikes Logo */}{/*TODO Get new logo and put here*/}
                <img className="ui centered medium image"
                     alt="Besterbikes Logo"
                     src="https://lh6.googleusercontent.com/jsF13Ay0tZSL5qr7Bcoj1H84O9tePF-U0XsC3Z2mRikOFkE9Bf-lmppDB-V-Kf32etoUP-Aw2vcTXrp2lNqT=w1920-h903"
                />

                {/*Divider Line*/}
                <div className="ui horizontal divider">
                    Log In
                </div>

                {/*Log In Form*/}
                <div className="ui container middle aligned center aligned grid">
                    <div className="column">

                        <div className="ui container">
                            <div className="ui input">
                                <input id="inputEmail" type="text" placeholder="Email Address"/>
                            </div>
                        </div>

                        <br/>

                        <div className="ui container">
                            <div className="ui input">
                                <input id="inputPassword" type="text" placeholder="Password"/>
                            </div>
                        </div>

                        <br/>

                        <button id="buttonLogIn" className="ui big primary button">
                            Log In
                        </button>


                        <button id="buttonSignUp" className="ui big button">
                            Sign Up
                        </button>

                    </div>
                </div>
            </div>
        )
    }
};


export default SignIn