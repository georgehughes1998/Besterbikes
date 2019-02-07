import * as firebase from "firebase";

//Function to sign in to firebase using props from redux form
export const signIn = async ({email, password}) => {

    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);

    return promise
        .then(user => {
            return user;
        })
        .catch(async err => {
            return err;
        });

};

//Function to sign up to firebase with auth using props from redux form
export const signUp = ({email, password, forename, surname, dateOfBirth}) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, password);

    return promise
        .then(user => {

            auth.signInWithEmailAndPassword(email, password);
            setUserDetails({forename, surname, dateOfBirth});

            return user;
        })
        .catch(async err => {
            return err
        });
};

//Function to sign out of firebase
export const signOut = () => {
    const promise = firebase.auth().signOut();

    return promise
        .then(() => {
            return "success";
        })
        .catch(async err => {
            return err;
        });
};

//Function to Edit users accountManagement details on firebase
export const editDetails = () => {
    //TODO:  Complete function to return promise with user if successful or error if not
};


//Function to return current user
export const getUser = async () => {
    const auth = firebase.auth();
    if (auth) {
        return await auth.currentUser;
    }
    else {
        return null;
    }
};

//Function to get an object containing the current user's details from the firestore
export const getUserDetails = async () => {

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();

    const usersCollection = db.collection('users');
    const usersDoc = usersCollection.doc(uid);

    const userDetails = usersDoc.get();

    return userDetails
        .then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                throw new Error("Document doesn't exist");
            }
        })
        .catch(err => {
            return err
        });

};

//TODO: Also update email and password
//Set the current user's details in the firestore
export const setUserDetails = ({forename, surname, dateOfBirth}) => {

    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const usersDoc = usersCollection.doc(uid);


    const userDetails = {
        name: {
            firstName: forename,
            lastName: surname
        },
        dateOfBirth: dateOfBirth,
    };

    const promise = usersDoc.set(userDetails);

    return promise
        .then(() => {
            return "success"
        })
        .catch(err => {
            return err
        });

};
