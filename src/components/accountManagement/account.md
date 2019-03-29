# account
The components in this folder are for use in the authentication process of the application including signing in, up and out

## AccountHandlingForm
This component is responsible for displaying and handling the forms required for the authentication process and handling the objects and errors returned by firebase. 

The component uses redux forms to process the form and awaits a response from the authentication file which directly communicates with firebase 

## SignIn, SignOut, SignUp, EditAccount
Component that passes relevant fields and information to PageContainer

