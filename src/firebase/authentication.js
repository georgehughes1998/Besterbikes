// ==================================================== //
//        Authentication Firestore Functionality        //
// ==================================================== //


import * as firebase from "firebase";
import {incrementStatistic} from "./statistics"; //To allow incrementing of the statistics for logging in and signing up
import {validateDateOfBirth} from "./time"; //To ensure a customer is of age


//Function to sign in to firebase using email and password input
export const signIn = async ({email, password}) => {

    //Firebase authentication functions
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);

    //Async
    return promise
        .then(async user => {

            //Get the newly logged in user's data to ensure that they aren't blacklisted
            const userData = await getUser(auth.currentUser.uid);
            const isDisabled = userData['disabled'];

            if (isDisabled)
                throw new Error("This account is blacklisted.");

            //Increment the statistic for signing in
            await incrementStatistic("authentication.signIn");

            //Return the newly logged in user upon success
            return user;

        })
        .catch(async err => {return err;}); //Return the error upon failure

};

//Function to sign up to firebase with auth using props from redux form
export const signUp = ({email, password, forename, surname, dateOfBirth, imageURL}) => {

    //Ensure customer is of age
    validateDateOfBirth(dateOfBirth);

    //Firebase authentication functions
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, password);

    //Async
    return promise
        .then(async user => {

            //Sign in as the new user
            await auth.signInWithEmailAndPassword(email, password);

            //Set the new user's details in the firestore
            setUserDetails({forename, surname, dateOfBirth, email, imageURL});

            //Increment the statistic for singing up
            await incrementStatistic("authentication.signUp");

            //Return the new user upon success
            return user;
        })
        .catch(async err => {return err}); //Return the error upon failure
};


//Function to sign out of firebase
export const signOut = () => {

    //Firebase authentication sign out function
    const promise = firebase.auth().signOut();

    return promise
        .then(() => {
            //Return upon success
            return "success";
        })
        .catch(async err => {
            //Return the error upon failure
            return err;
        });
};



//Function to return a user's details - without an argument it will return the logged in user's details
export const getUser = async (userID = "") => {

    //Decide whether to use the logged in user or the given user - based on input
    if (userID === "") {
        const currentUser = firebase.auth().currentUser;
        if (currentUser)
            userID = currentUser.uid;
        else
            return null;
    }

    //Given a user ID:
    if (userID) {

        //Set up firestore links
        const db = firebase.firestore();
        const usersCollection = db.collection('users');
        const usersDoc = usersCollection.doc(userID);

        //Get the user document
        const userDetailsSnapshot = await usersDoc.get();

        //If the document was found, return an object with the user's data stored inside
        if (userDetailsSnapshot.exists) {
            const userDetailsData = userDetailsSnapshot.data();
            userDetailsData["uid"] = userID;
            userDetailsData["email"] = firebase.auth().currentUser.email;

            return userDetailsData;
        }
        else {throw new Error("Document '" + userID + "' doesn't exist")} //Return error if user wasn't found

    }
    else {throw new Error("UserID was null");} //Return error if no user was given

};


//Set the current user's details in the firestore
const setUserDetails = ({forename, surname, dateOfBirth, email, imageURL="https://firebasestorage.googleapis.com/v0/b/bettersome-a5c8e.appspot.com/o/default_icon.png?alt=media&token=71282c13-cce6-4687-b9e9-7ac31883ed1a"}) => {

    //Get the logged in user's user ID
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    //Set up Firestore links
    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const usersDoc = usersCollection.doc(uid);

    //Create a JSON object holding the user's details
    const userDetails = {
        name: {
            firstName: forename,
            lastName: surname
        },
        dateOfBirth: dateOfBirth,
        imageURL: imageURL,
        email: email,
        type: "customer", //User type (customer/operator/manager)
        disabled: false //Blacklisted flag
    };

    //Set the user's details in the firestore
    const promise = usersDoc.set(userDetails);

    return promise
        .then(() => {
            return "success"
        })
        .catch(err => {
            return err
        });

};


export const updateUserDetails = async ({updateEmail, updatePassword, updateForename, updateSurname, updateDateOfBirth, updateImageURL}) => {

    //Get the user's uid
    const auth = firebase.auth();
    const uid = auth.currentUser.uid;

    //Set up firestore links
    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const usersDoc = usersCollection.doc(uid);

    //Update given fields
    if (updateForename)       await usersDoc.update("name.firstName",updateForename);
    if (updateSurname)        await usersDoc.update("name.lastName",updateSurname);
    if (updateImageURL)       await usersDoc.update("imageURL",updateImageURL);
    if (updatePassword)       await auth.currentUser.updatePassword(updatePassword); //Firebase authentication function for updating a user's password
    if (updateEmail)          {
        //Update the user's email both in firebase authentication and in their firestore document
        await auth.currentUser.updateEmail(updateEmail);
        await await usersDoc.update("email",updateEmail);
    }
    if (updateDateOfBirth) {
        //Validate and update date of birth
        validateDateOfBirth(updateDateOfBirth);
        await usersDoc.update("dateOfBirth",updateDateOfBirth);
    }

    //Increment statistic for updating details
    await incrementStatistic("authentication.updateDetails");

    //Return upon success
    return "success"

};


//Function to be called by a manager for banning a user from using the system
export const blacklistUser = async (userID) => {

    //Set up firestore links
    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const usersDoc = usersCollection.doc(userID);

    //Set the disabled field to be true in the user's document
    await usersDoc.update('disabled',true);

};