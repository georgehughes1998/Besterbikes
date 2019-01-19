import React from 'react'

import AccountForm from "./AccountHandlingForm";
import PageContainer from "../PageContainer";


//Component that passes relevant fields to PageContainer for a sign out
const SignOut =() =>{

        return(
            <PageContainer>

                {/*Sign Out Form*/}
                <AccountForm
                    fields={""}

                    operation={{
                        text: "Sign Out",
                        link: "/signin"
                    }}

                />
            </PageContainer>
        )
};

export default SignOut