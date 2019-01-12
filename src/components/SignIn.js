import React from 'react'

const SignIn = () =>{
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
                            <input type="text" placeholder="Email Address"/>
                        </div>
                    </div>

                    <br/>

                    <div className="ui container">
                        <div className="ui input">
                            <input type="text" placeholder="Password"/>
                        </div>
                    </div>

                    <br/>

                    <button className="ui big primary button">
                        Log In
                    </button>


                    <button className="ui big button">
                        Sign Up
                    </button>

                </div>
            </div>
        </div>
    )
};

export default SignIn