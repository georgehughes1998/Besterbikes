import React from 'react'

//TODO: Make pretty, display logo and link back
const Header = () => {
    return(
        <div className="ui inverted blue three item menu">
            <div className="item">
                <i className="arrow left icon"/>
            </div>
            <div className="item">Title of Page</div>
            <div className="item">
                <i className="bicycle icon"/>
            </div>
        </div>
    )
};

export default Header