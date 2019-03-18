import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Icon, Menu, Sidebar} from 'semantic-ui-react'

import {changeSideBar} from "../../redux/actions/index";
import {loadWebpages} from "../../redux/actions";

//Component that displays all content within Side Bar
class SideBarContent extends React.Component {

    renderLinks = () => {
        if (this.props.webpages) {
            if (this.props.webpages[0]) {
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
                            <Link to={this.props.webpages[i].link}>
                                <Menu.Item>
                                    <Icon name={this.props.webpages[i].icon}/>
                                    {this.props.webpages[i].name}
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
        webpages: state.user.webpages
    }
};

export default withRouter(connect(
    mapStateToProps,
    {changeSideBar, loadWebpages}
)(SideBarContent));