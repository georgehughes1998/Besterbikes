import * as firebase from "firebase";

//Function to sign in to firebase using props from redux form
export const signIn = async ({email, password}) => {

    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);

        return promise
            .then(user => {
                return user;
            })
            //TODO: Return and display any error messages
            .catch(async err => {
                return err;
            });

};

//Function to sign up to firebase with auth using props from redux form
export const signUp = ({email, password, forename, surname, dateOfBirth}) => {
    const auth = firebase.auth();
    //TODO: Store name and birthdates and password in firetstore
    const promise = auth.createUserWithEmailAndPassword(email, password);

    return promise
        .then(user => {
            return user;
        })
        //TODO: Return and display any error messages
        .catch(async err => {
            return err;
        });
};

//Function to sign out of firebase
export const signOut = () => {
    const promise = firebase.auth().signOut();

    return promise
        .then(user => {
            return user;
        })
        //TODO: Return and display any error messages
        .catch(async err => {
            return err;
        });
};

//Function to Edit users account details on firebase
export const editDeatils = () => {
    //TODO: Complete function to return promise with user if successful or error if not
};


//Function to return current user
export const authenticate = async () => {
  const auth = firebase.auth();
  return await auth.currentUser;
};