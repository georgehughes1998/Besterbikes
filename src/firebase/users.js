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




const getUsersOfType = async (userType) => {
    //TODO: Test

    const customersArray = [];

    const db = firebase.firestore();
    const usersCollection = db.collection('users');
    const customersCollection = usersCollection.where('type','==',userType);

    const customersSnapshot = await customersCollection.get();

    for (let doc in customersSnapshot)
    {
        let customerID = doc.id;
        let customerData = doc.data();

        customersArray[customerID] = customerData;

    }

    return customersArray;

};