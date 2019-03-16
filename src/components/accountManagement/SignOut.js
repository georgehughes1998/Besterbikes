import React from 'react'

import AccountForm from "./AccountHandlingForm";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";


//Component that passes relevant fields to PageContainer for a sign out
const SignOut = () => {

    return (
        <Container>

            {/*Sign Out Form*/}
            <AccountForm
                fields={""}

                operation={{
                    text: "Sign Out",
                    link: "/signin"
                }}

            />
        </Container>
    )
};

export default SignOut