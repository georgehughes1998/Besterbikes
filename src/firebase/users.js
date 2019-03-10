import * as firebase from "firebase";

//The indexes for the arrays returned by the following functions are the user IDs.

//Get list of customers
export const getCustomers = async () => {
    //TODO: Test
    return await getUsersOfType('customer');
};

//Get list of operators
export const getOperators = async () => {
    //TODO: Test
    return await getUsersOfType('operator');
};

//Get list of managers
export const getManagers = async () => {
    //TODO: Test
    return await getUsersOfType('manager');
};



export const getUser = async (userID) => {

    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const userDocument = usersCollection.doc(userID);

    const userSnapshot = await userDocument.get();
    const userData = userSnapshot.data();

    return userData

};


const getUsersOfType = async (userType) => {
    //TODO: Test

    const customersArray = [];

    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const usersTypeCollection = usersCollection.where('type','==',userType);

    const userSnapshot = await usersTypeCollection.get();


    for (let doc in userSnapshot.docs)
    {
        console.log(doc);
        const singleUserSnapshot = userSnapshot.docs[doc];


        const userID = singleUserSnapshot.id;
        const userData = singleUserSnapshot.data();

        customersArray[userID] = userData;

    }

    return customersArray;

};