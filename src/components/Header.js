import React from 'react'
import { Link, withRouter } from "react-router-dom";
import {connect} from "react-redux";

import {changeSideBar} from "../redux/actions";
import {Menu, Icon} from 'semantic-ui-react'

class Header extends React.Component{

    handleHideClick = () => this.props.changeSideBar("Hide");
    handleShowClick = () => this.props.changeSideBar("Show");

    //Function to display title of page based on pathname in react router dom
    getDisplayTitle = (pathname) =>{
        switch (pathname) {
            case "/":
                return "Main Menu";
            case "/signin":
                return "Sign In";
            case "/signout":
                return "Sign Out";
            case "/signup":
                return "Sign Up";
            default:
                return null;
        }
    };

    render(){
        return(
            <Menu widths={3} color="blue" inverted>

                {/*TODO: Change back button to side menu as web already has back button*/}
                <Menu.Item disabled={this.props.sideBarVisible} onClick={this.props.sideBarVisible?this.handleHideClick:this.handleShowClick}>
                    <Icon name="bars"/>
                </Menu.Item>

                <Menu.Item>
                    { this.getDisplayTitle(this.props.location.pathname) }
                </Menu.Item>

                <Menu.Item>
                    <Link to="/" className="item">
                        <Icon name="bicycle"/>
                    </Link>
                </Menu.Item>

            </Menu>
        )
    }

}


const mapStateToProps = (state) => {
    return { sideBarVisible: state.ui.sideBarVisible }
};

export default withRouter(connect(
    mapStateToProps,
    { changeSideBar }
)(Header));