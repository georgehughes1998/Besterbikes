import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

const App = () => {
    return(
        <div>
            <BrowserRouter>
                <Route path="/" exact component={MainMenu}/>
                <Route path="/signin" exact component={SignIn}/>
                <Route path="/signup" exact component={SignUp}/>
            </BrowserRouter>
        </div>
    )
};

export default App