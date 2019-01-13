import React from 'react'
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'

//TODO: Make pretty, display logo and link back
const Header = (props) => {


    //Function to display title of page based on pathname in react router dom
    const getDisplayTitle = (pathname) =>{
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
    }

    return(
        <div className="ui inverted blue three item menu">

            {/*TODO: Change back button to side menu as web already has back button*/}
            <div className="item">
                <i className="bars  icon"/>
            </div>
            <div className="item">
                { getDisplayTitle(props.location.pathname) }
            </div>
            <Link to="/" className="item">
                <i className="bicycle icon"/>
            </Link>
        </div>
    )
};

export default withRouter(Header)