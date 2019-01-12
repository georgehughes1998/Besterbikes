import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import MainMenu from './MainMenu'
import SignIn from './SignIn'
import SignUp from './SignUp'

const App = () => {
    return(
        <div>
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={MainMenu}/>
                    <Route path="/signin" exact component={SignIn}/>
                    <Route path="/signup" exact component={SignUp}/>
                </div>
            </BrowserRouter>
        </div>
    )
};

export default App