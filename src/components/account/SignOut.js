import React from 'react'

import AccountForm from "./AccountHandlingForm";
import AccountPageContainer from "./AccountPageContainer";


//Component that passes relevant fields to AccountPageContainer for a sign out
class SignOut extends  React.Component{

    render(){
        return(
            <AccountPageContainer>

                {/*Sign Out Form*/}
                <AccountForm
                    fields={""}

                    operation={{
                        text: "Sign Out",
                        link: "/signin"
                    }}

                />
            </AccountPageContainer>
        )
    }
}

export default SignOut