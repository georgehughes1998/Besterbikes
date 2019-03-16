import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import {connect} from "react-redux";
import {Segment, Sidebar} from "semantic-ui-react";

import SideBarContent from "./naviagtion/SideBarContent";
import {changeSideBar, loadStations} from "../redux/actions";

import TopMenuBar from "./naviagtion/TopMenuBar";
import MainMenu from './naviagtion/MainMenu'
import SignIn from './accountManagement/SignIn'
import SignUp from './accountManagement/SignUp'
import EditAccount from "./accountManagement/EditAccount";
import ReserveBikeContainer from "./reservationHandling/ReserveBikeContainer";
import BesterbikesMap from "./map/BesterbikesMap";
import MyTrips from "./customer/MyTrips";
import {getJSONFromFile} from "../dataHandling/handleJSON";
import UnlockBike from "./UnlockBike";
import StationSystemSimulation from "./StationSystemSimulation";
import Report from "./customer/Report";
import CreateTask from "./tasks/CreateTask";

import './naviagtion/sideBarOverride.css'
import OperatorTasks from "./operator/OperatorTasks";
import Users from "./manager/Users";
import CustomerDetails from "./manager/CustomerDetails";
import Statistics from "./manager/Statistics";
import OperatorDetails from "./manager/OperatorDetails";


//TODO: Add prop types and typescript to app
//TODO: Move UI props over to JSON
class App extends React.Component {

    componentDidMount() {
        //TODO: Move to Redux
        if (!(this.props.stations === {})) {
            this.getMapJSON()
        }
    }

    async getMapJSON() {
        const stations = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
        this.props.loadStations(stations)
    }


    render() {
        return (
            <div>
                {/*BrowserRouter handles the pages and their associated URLs for the entire App*/}
                <BrowserRouter>
                    <div style={{height: '100vh'}}>

                        <TopMenuBar fixed='absolute'/>

                        <Sidebar.Pushable style={{minHeight: "100vh"}}>
                            <SideBarContent as={Segment}/>

                            <Sidebar.Pusher animation='push'>

                                <div>
                                    {/*TODO: Refactor to use JSON*/}
                                    <Route path="/" exact component={MainMenu}/>
                                    <Route path="/map" exact component={BesterbikesMap}/>
                                    <Route path="/unlockbike" exact component={UnlockBike}/>

                                    {/*Customer Routes*/}
                                    <Route path="/mytrips" exact component={MyTrips}/>

                                    {/*Account Management Routes*/}
                                    <Route path="/signin" exact component={SignIn}/>
                                    <Route path="/signup" exact component={SignUp}/>
                                    <Route path="/editaccount" exact component={EditAccount}/>

                                    {/*Reserving a bike Routes*/}
                                    <Route path="/reservebike" component={ReserveBikeContainer}/>

                                    {/*Reporting an issue and creating a task Router*/}
                                    <Route path="/report" component={Report}/>
                                    <Route path="/createTask" component={CreateTask}/>

                                    {/*Operator Routes*/}
                                    <Route path="/operatorTasks" component={OperatorTasks}/>
                                    <Route path="/operatordetails" component={OperatorDetails}/>

                                    {/*Manager Routes*/}
                                    <Route path="/users" component={Users}/>
                                    <Route path="/customerdetails" component={CustomerDetails}/>
                                    <Route path="/statistics" component={Statistics}/>

                                    {/*TODO: Remove station simulation once implemnted properly*/}
                                    <Route path="/stationsim" exact component={StationSystemSimulation}/>
                                </div>

                            </Sidebar.Pusher>
                        </Sidebar.Pushable>

                    </div>

                </BrowserRouter>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        stations: state.stations,
        sideBarHidden: state.ui.sideBarHidden
    }
};

export default connect(
    mapStateToProps,
    {loadStations, changeSideBar}
)(App);
