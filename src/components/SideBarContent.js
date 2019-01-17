import React from 'react'
import {withRouter, Link} from "react-router-dom";
import {connect} from "react-redux";
import {Menu, Icon, Sidebar} from 'semantic-ui-react'

import {changeSideBar} from "../redux/actions";


const SideBarContent = (props) =>{

    const handleSidebarHide = () => props.changeSideBar("Hide");

        return(
            <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                onHide={handleSidebarHide}
                onClick={handleSidebarHide}
                visible = {props.sideBarVisible}
                width='thin'
                color = "blue"
            >
                <Link to="/">
                    <Menu.Item>

                            <Icon name='bicycle' />
                            Main Menu

                    </Menu.Item>
                </Link>

                <Link to="/map">
                    <Menu.Item >
                        <Icon name='map' />
                        Map
                    </Menu.Item>
                </Link>

                <Link to="/editaccount">
                    <Menu.Item >
                        <Icon name='user circle' />
                        Account
                    </Menu.Item>
                </Link>
            </Sidebar>

        )

};

const mapStateToProps = (state) => {
    return { sideBarVisible: state.ui.sideBarVisible }
};

export default withRouter(connect(
    mapStateToProps,
    { changeSideBar }
)(SideBarContent));