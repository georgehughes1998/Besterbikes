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
    //TODO: Store name and birth dates and password in firetstore, use display name for forename (Capitalise?)
    const promise = auth.createUserWithEmailAndPassword(email, password);

    return promise
        .then(user => {

            addUserDetails({forename,surname,dateOfBirth});

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
            return "success";
        })
        //TODO: Return and display any error messages
        .catch(async err => {
            return err;
        });
};

//Function to Edit users accountManagement details on firebase
export const editDetails = () => {
    //TODO: Complete function to return promise with user if successful or error if not
};


//Function to return current user
export const getUser = async () => {
  const auth = firebase.auth();
  return await auth.currentUser;
};

export const getUserDetails = async () => {

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.database();
    const dbRef = db.ref().child('users').child(uid);

    const userDetails = dbRef.valueOf();

    return await userDetails;

};

export const addUserDetails = ({forename, surname, dateOfBirth}) => {

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.database();
    const dbRef = db.ref().child('users');

    const userDetails = {
        uid : {
            name : {
                first : forename,
                last : surname
            },
            dob : dateOfBirth
        }
    }

    const promise = dbRef.set(userDetails);

    return promise
        .then(result => {return result})
        .catch(async err => {return err});

};