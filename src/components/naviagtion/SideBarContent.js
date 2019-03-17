import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Icon, Menu, Sidebar} from 'semantic-ui-react'

import {changeSideBar} from "../../redux/actions/index";
import {loadWebPages} from "../../redux/actions";

//Component that displays all content within Side Bar
class SideBarContent extends React.Component {

    renderLinks = () => {
        if (this.props.webPages) {
            if (this.props.webPages[0]) {
                var icons = [];

                icons.push(
                    <div key={0}>
                        <Link to={"/"}>
                            <Menu.Item>
                                <Icon name={"home"} size={"massive"}/>
                                Home
                            </Menu.Item>
                        </Link>
                    </div>
                )

                for (let i = 0; i < 4; i++) {
                    icons.push(
                        <div key={i + 1}>
                            <Link to={this.props.webPages[i].link}>
                                <Menu.Item>
                                    <Icon name={this.props.webPages[i].icon}/>
                                    {this.props.webPages[i].name}
                                </Menu.Item>
                            </Link>
                        </div>
                    )
                }
            }
        }

        return icons;
    };

    handleSidebarHide = () => this.props.changeSideBar("Hide");

    render() {
        return (
            <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                onHide={this.handleSidebarHide}
                onClick={this.handleSidebarHide}
                visible={this.props.sideBarVisible}
                width='thin'
                color="blue"
            >
                <br/>

                {this.renderLinks()}
            </Sidebar>

        );
    }

}
;

const mapStateToProps = (state) => {
    return {
        sideBarVisible: state.ui.sideBarVisible,
        webPages: state.user.webPages
    }
};

export default withRouter(connect(
    mapStateToProps,
    {changeSideBar, loadWebPages}
)(SideBarContent));