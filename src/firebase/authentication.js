import * as firebase from "firebase";
import {incrementStatistic} from "./statistics";


//Function to sign in to firebase using props from redux form
export const signIn = async ({email, password, updateUserStatus}) => {

    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);

    return promise
        .then(async user => {

            await incrementStatistic("authentication.signIn");

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
        .then(async user => {

            await auth.signInWithEmailAndPassword(email, password);
            setUserDetails({forename, surname, dateOfBirth});

            await incrementStatistic("authentication.signUp");

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

// //Function to Edit users accountManagement details on firebase
// export const editDetails = () => {
//     //TODO:  Complete function to return promise with user if successful or error if not
// };


//Function to return a user's details - without an argument it will return the logged in user's details
export const getUser = async (userID="") => {

    if (userID === "")
    {
        const auth = firebase.auth();
        userID = auth.currentUser.uid;
    }

    if (userID)
    {
        const db = firebase.firestore();

        const usersCollection = db.collection('users');
        const usersDoc = usersCollection.doc(userID);

        const userDetails = await usersDoc.get();

        if (userDetails.exists)
            {return userDetails.data()}
        else
            {throw new Error("Document '" + userID + "' doesn't exist")}

    }
    else {throw new Error("UserID was null");}

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
        type: "customer"
    };

    const promise = usersDoc.set(userDetails);

    return promise
        .then(() => {
            incrementStatistic("authentication.updateDetails");
            return "success"
        })
        .catch(err => {
            return err
        });

};

//
// const mapStateToProps = (state) => {
//     return {user: state.user.status}
// };
//
// export default connect(mapStateToProps, {updateUserStatus})(signIn);