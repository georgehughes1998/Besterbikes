import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";

import {Header, Icon, Menu} from 'semantic-ui-react'
import {changeSideBar} from "../../redux/actions";


//TODO: Make TopMenuBar Sticky
class TopMenuBar extends React.Component {

    handleHideClick = () => this.props.changeSideBar("Hide");
    handleShowClick = () => this.props.changeSideBar("Show");


    //Function to display title of page based on pathname in react router dom
    getDisplayTitle = (pathname) => {
        switch (pathname) {
            //TODO: Use JSON/API to load details of web pages
            case "/":
                return "Main Menu";
            case "/signin":
                return "Sign In";
            case "/signout":
                return "Sign Out";
            case "/signup":
                return "Sign Up";
            case "/editaccount":
                return "Edit Account";
            case "/reservebike":
                return "Reserve Bikes";
            case "/map":
                return "Map";
            case "/unlockbike":
                return "Unlock Bike";
            case "/mytrips":
                return "My Trips";
            default:
                return null;
        }
    };

    render() {
        return (
            <div>
                <Menu color="blue" inverted widths={3}>

                    <Menu.Item disabled={this.props.sideBarVisible}
                               onClick={this.props.sideBarVisible ? this.handleHideClick : this.handleShowClick}>
                        <Icon name="bars"/>
                    </Menu.Item>

                    <Menu.Item>
                        <Header as='h5' inverted>
                            {this.getDisplayTitle(this.props.location.pathname)}
                        </Header>
                    </Menu.Item>

                    <Menu.Item>
                        <Link to="/" className="item">
                            <Icon name="bicycle"/>
                        </Link>
                    </Menu.Item>

                </Menu>
            </div>

        )
    }

}


const mapStateToProps = (state) => {
    return {sideBarVisible: state.ui.sideBarVisible}
};

export default withRouter(connect(
    mapStateToProps,
    {changeSideBar}
)(TopMenuBar));