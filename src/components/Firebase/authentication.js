import * as firebase from "firebase";

//Function to sign in to firebase using props from redux form
export const signIn = ({email, password}) => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);

    promise.catch(e => console.log(e.message));
    promise.then(e => console.log(e));
};

export const signUp = ({email, password}) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, password);

    promise.catch(e => console.log(e.message));
    promise.then(e => console.log(e));
};