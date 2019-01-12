import React from 'react'

const SignIn = ({names}) =>{

    const renderWelcomes = (names.map(name => {
        return(
            <div key={names.indexOf(name)}>
                {console.log(names)}
                Welcome {name}
            </div>
        )
    }));

    return(
        <div>
            {renderWelcomes}
        </div>
    )
};

export default SignIn