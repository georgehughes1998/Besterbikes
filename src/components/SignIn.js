import React from 'react'

const SignIn = () =>{
    return(
        <div>

             {/*Besterbikes Logo */}{/*TODO Get new logo and put here*/}
            <img className="ui centered medium image"
                 alt="Besterbikes Logo"
                 src={require('../images/logo.png')}
            />
            {/*require() from Apswak on StackOverFlow*/}

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