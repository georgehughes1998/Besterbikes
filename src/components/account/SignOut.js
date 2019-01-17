import React from 'react'

import AccountForm from "./AccountHandlingForm";
import AccountPageContainer from "../PageContainer";


//Component that passes relevant fields to AccountPageContainer for a sign out
const SignOut =() =>{

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
};

export default SignOut