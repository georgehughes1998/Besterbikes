import * as firebase from "firebase";

//Function to sign in to firebase using props from redux form
export const signIn = ({email, password}) => {
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password);

        promise
            .then(obj => {console.log("Success Logging In")})
            //TODO: Return and display any error messages
            .catch(err => {console.log("Problems logging In")});

    };

//Function to sign up to firebase with auth using props from redux form
export const signUp = ({email, password, forename, surname, dateOfBirth}) => {
    const auth = firebase.auth();
    //TODO: Store name and birthdates and passoword in firetsore
    const promise = auth.createUserWithEmailAndPassword(email, password);

    promise
        .then(obj => console.log("Success Signing Up"))
        .catch(err => console.log("Problems Signing Up"));
};

//Function to sign out of firebase
export const signOut = () => {
    const promise = firebase.auth().signOut();

    promise
        .then((obj) => {console.log("Signed Out");})
        .catch((err) => console.log("Problems signing out"))
};