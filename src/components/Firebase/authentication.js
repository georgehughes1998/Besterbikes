import * as firebase from "firebase";

//Function to sign in to firebase using props from redux form
export const signIn = ({email, password}) => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);

    promise
        .then(e => console.log(e, "then"))
        //TODO: Return and display any error messages
        .catch(e => console.log(e.message));

};

//Function to sign up to firebase using props from redux form
export const signUp = ({email, password, forename, surname, dateOfBirth}) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, password);

    promise
        .then(e => console.log(e, "then"))
        .catch(e => console.log(e.message, "catch"));

    //TODO: Store name and birthdates and passoword in firetsore

};