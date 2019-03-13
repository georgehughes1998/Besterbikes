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
    else if (key === "users" && typeof nestedContent === "object")
        {
            Object.keys(nestedContent).forEach(docTitle => {

                if (nestedContent[docTitle]['email'] &&
                    nestedContent[docTitle]['password'] &&
                    nestedContent[docTitle]['dateOfBirth'] &&
                    nestedContent[docTitle]['name'] &&
                    nestedContent[docTitle]['name']['firstName'] &&
                    nestedContent[docTitle]['name']['lastName'] &&
                    nestedContent[docTitle]['type'])
                {
                    const email = nestedContent[docTitle]['email'];
                    const password = nestedContent[docTitle]['password'];

                    firebaseAdmin.auth().deleteUser(docTitle)
                        .then(() => {console.log("Overwriting user")})
                        .catch(() => {console.log("There was no user")});
                    firebaseAdmin.auth().createUser({uid: docTitle, email,password})
                        .then(() => {console.log("Successfully created user.")});

                    delete nestedContent[docTitle]['email'];
                    delete nestedContent[docTitle]['password'];

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
                }
                else {console.log("Inadequate data for user.")}
            })
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

console.log("Done!");