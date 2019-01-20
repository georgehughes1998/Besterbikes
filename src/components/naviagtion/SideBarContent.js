import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Icon, Menu, Sidebar} from 'semantic-ui-react'

import {changeSideBar} from "../../redux/actions/index";


const SideBarContent = (props) => {

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
    })

    const handleSidebarHide = () => props.changeSideBar("Hide");
    {/*TODO: Review content of Sidebar and use map*/
    }
    return (
        <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            inverted
            vertical
            onHide={handleSidebarHide}
            onClick={handleSidebarHide}
            visible={props.sideBarVisible}
            width='thin'
            color="blue"
        >

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