import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import {connect} from "react-redux";
import {Segment, Sidebar} from "semantic-ui-react";

import MainMenu from './MainMenu'
import SignIn from './account/SignIn'
import SignUp from './account/SignUp'
import EditAccount from "./account/EditAccount";
import SideBarContent from "./SideBarContent";
import {changeSideBar} from "../redux/actions";


class App extends React.Component{
//TODO: Add prop types

    render(){
        return(
            <div>
                {/*BrowserRouter handles the pages and their associated URLs for the entire App*/}
                <BrowserRouter>
                    <div style={{height: '100vh'}}>
                        <Sidebar.Pushable as={Segment}>
                            <SideBarContent/>

                            <Sidebar.Pusher>
                                <Route path="/" exact component={MainMenu}/>
                                <Route path="/signin" exact component={SignIn}/>
                                <Route path="/signup" exact component={SignUp}/>
                                <Route path="/editaccount" exact component={EditAccount}/>

                            </Sidebar.Pusher>

                        </Sidebar.Pushable>
                    </div>
                </BrowserRouter>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return { sideBarHidden: state.ui.sideBarHidden }
};

export default connect(
    mapStateToProps,
    { changeSideBar }
)(App);