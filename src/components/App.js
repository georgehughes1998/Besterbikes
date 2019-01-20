import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import {connect} from "react-redux";
import {Segment, Sidebar} from "semantic-ui-react";

import SideBarContent from "./naviagtion/SideBarContent";
import {changeSideBar} from "../redux/actions";

import TopMenuBar from "./naviagtion/TopMenuBar";
import MainMenu from './MainMenu'
import SignIn from './accountManagement/SignIn'
import SignUp from './accountManagement/SignUp'
import EditAccount from "./accountManagement/EditAccount";
import ReserveBikeContainer from "./reservationHandling/ReserveBikeContainer";
import MapContainer from "./map/BesterbikesMap";


//TODO: Add prop types and typescript to app
//TODO: Move UI props over to JSON
class App extends React.Component {

    render() {
        return (
            <div>
                {/*BrowserRouter handles the pages and their associated URLs for the entire App*/}
                <BrowserRouter>
                    <div style={{height: '100vh'}}>
                        <Sidebar.Pushable as={Segment}>
                            <SideBarContent
                                links={{
                                    Main: {
                                        name: 'Menu',
                                        icon: 'bicycle',
                                        link: '/'
                                    },
                                    Map: {
                                        name: 'MapContainer',
                                        icon: 'map',
                                        link: '/map'
                                    },
                                    Reserve: {
                                        name: 'Reserve',
                                        icon: 'calendar',
                                        link: '/reservebike'
                                    },
                                    Unlock: {
                                        name: 'Unlock',
                                        icon: 'lock',
                                        link: '/unlockbike'
                                    },
                                    MyTrips: {
                                        name: 'My Trips',
                                        icon: 'map signs',
                                        link: '/mytrips'
                                    },
                                    Account: {
                                        name: 'Account',
                                        icon: 'user circle',
                                        link: '/editaccount'
                                    }
                                }}
                            />

                            <Sidebar.Pusher animation='push'>

                                <TopMenuBar/>

                                <Route path="/" exact component={MainMenu}/>
                                <Route path="/map" exact component={MapContainer}/>

                                {/*Account Management Routes*/}
                                <Route path="/signin" exact component={SignIn}/>
                                <Route path="/signup" exact component={SignUp}/>
                                <Route path="/editaccount" exact component={EditAccount}/>

                                {/*Reserving a bike Routes*/}
                                <Route path="/reservebike" component={ReserveBikeContainer}/>

                            </Sidebar.Pusher>

                        </Sidebar.Pushable>
                    </div>
                </BrowserRouter>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {sideBarHidden: state.ui.sideBarHidden}
};

export default connect(
    mapStateToProps,
    {changeSideBar}
)(App);