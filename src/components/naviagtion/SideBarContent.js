import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Icon, Menu, Sidebar} from 'semantic-ui-react'

import {changeSideBar} from "../../redux/actions/index";

//Component that displays all content within Side Bar
const SideBarContent = (props) => {

    //Renders all links in sidebar from props object
    const renderLinks = Object.values(props.links).map((key, index) => {
        return (
            <div key={index}>
                <Link to={key.link}>
                    <Menu.Item>
                        <Icon name={key.icon}/>
                        {key.name}
                    </Menu.Item>
                </Link>
            </div>

        )
    });

    const handleSidebarHide = () => props.changeSideBar("Hide");

    return (
        <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            vertical
            onHide={handleSidebarHide}
            onClick={handleSidebarHide}
            visible={props.sideBarVisible}
            width='thin'
            color="blue"
        >
            <br/>

            {renderLinks}
        </Sidebar>

    )

};

const mapStateToProps = (state) => {
    return {sideBarVisible: state.ui.sideBarVisible}
};

export default withRouter(connect(
    mapStateToProps,
    {changeSideBar}
)(SideBarContent));