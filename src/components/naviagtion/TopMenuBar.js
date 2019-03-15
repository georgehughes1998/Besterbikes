import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";

import {Header, Icon, Menu} from 'semantic-ui-react'
import {changeSideBar} from "../../redux/actions";
import {getUser} from "../../firebase/authentication";
import {getPrettyString} from "../../prettyString";


//TODO: Make TopMenuBar Sticky
class TopMenuBar extends React.Component {

    handleHideClick = () => this.props.changeSideBar("Hide");
    handleShowClick = () => this.props.changeSideBar("Show");

    authenticateUser = async () => {
        const user = await getUser();
        if (user !== null && this.state.currentUser === "") {
            const userDetails = await getUser();
            this.setState({currentUser: userDetails.name.firstName});
        } else if (user === null && this.state.currentUser !== "") {
            this.setState({currentUser: ""});
        }
        return user
    };
    //Function to display title of page based on pathname in react router dom
    getDisplayTitle = (pathname) => {
        return getPrettyString(pathname);
    };

    constructor(props) {
        super(props);
        this.state = {
            currentUser: ""
        };
    }

    componentDidUpdate() {
        this.authenticateUser();
    }

    render() {

        return (
            <Menu color="blue" inverted widths={3} fixed='top'>

                {/*{console.log(this.state.currentUser)}*/}

                <Menu.Item disabled={this.props.sideBarVisible || this.state.currentUser === ""}
                           onClick={this.props.sideBarVisible ? this.handleHideClick : this.handleShowClick}>
                    <Icon name="bars"/>
                </Menu.Item>

                <Menu.Item>
                    <Header as='h5' inverted>
                        {this.getDisplayTitle(this.props.location.pathname)}
                    </Header>
                </Menu.Item>

                <Menu.Item>
                    <Link to="/editaccount" className="item">
                        {this.state.currentUser === "" ? <div/> : <Icon name="user Circle"/>}
                        {this.state.currentUser}
                    </Link>
                </Menu.Item>

            </Menu>

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