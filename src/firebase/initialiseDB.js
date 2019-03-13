//This file is to be run for the sake of preparing the firestore for INITIAL testing/use.


const firebaseAdmin = require("firebase-admin");

const serviceAccount = require("./initData/serviceKey.json");

const data = require("./initData/dbInitData");

const databaseURL = "https://bettersome-a5c8e.firebaseio.com";


firebaseAdmin.initializeApp(
    {
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: databaseURL
    }
);

console.log(data);

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];

    if (nestedContent === -1)
    {
        firebaseAdmin.firestore().collection(key).get().then(snapshot => {

            snapshot.docs.forEach(doc => {firebaseAdmin.firestore().collection(key).doc(doc.id).delete().then(() => {console.log("Deleted" + key + " successfully.")})});

        });
    }

    else if (typeof nestedContent === "object") {
        Object.keys(nestedContent).forEach(docTitle => {
            firebaseAdmin.firestore()
                .collection(key)
                .doc(docTitle)
                .set(nestedContent[docTitle])
                .then((res) => {
                    console.log("Wrote " + key + " successfully!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }
});