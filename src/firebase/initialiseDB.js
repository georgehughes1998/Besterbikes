//This file is to be run for the sake of preparing the firestore for INITIAL testing/use.

// It uses the firebase admin functionality and a JSON object stored in a local file
// by looping over each sub-object in the file and adding it's contents to the firestore
// It also adds users by using the firebase admin's authentication functionality

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

    if (nestedContent === -1) {
        firebaseAdmin.firestore().collection(key).get().then(snapshot => {

            snapshot.docs.forEach(doc => {
                firebaseAdmin.firestore().collection(key).doc(doc.id).delete().then(() => {
                    console.log("Deleted" + key + " successfully.")
                })
            });

        });
    }
    else if (key === "users" && typeof nestedContent === "object") {
        Object.keys(nestedContent).forEach(docTitle => {

            if (nestedContent[docTitle]['email'] &&
                nestedContent[docTitle]['password'] &&
                nestedContent[docTitle]['dateOfBirth'] &&
                nestedContent[docTitle]['name'] &&
                nestedContent[docTitle]['name']['firstName'] &&
                nestedContent[docTitle]['name']['lastName'] &&
                nestedContent[docTitle]['type']) {
                const email = nestedContent[docTitle]['email'];
                const password = nestedContent[docTitle]['password'];


                firebaseAdmin.auth().createUser({uid: docTitle, email, password})
                    .then(() => {
                        console.log("Successfully created user" + docTitle + ".")
                    })
                    .catch(() => {

                        firebaseAdmin.auth().deleteUser(docTitle)
                            .then(() => {

                                firebaseAdmin.auth().createUser({uid: docTitle, email, password})
                                    .then(() => {
                                        console.log("Successfully created user" + docTitle + ".")
                                    })
                                    .catch(() => {
                                        console.log("Uh oh. Something went wrong.")
                                    })

                            })
                            .catch(() => {
                                console.log("There was no user")
                            });


                    });

                delete nestedContent[docTitle]['password'];

                firebaseAdmin.firestore()
                    .collection(key)
                    .doc(docTitle)
                    .set(nestedContent[docTitle])
                    .then((res) => {
                        console.log("Wrote " + docTitle + " successfully!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }
            else {
                console.log("Inadequate data for user.")
            }
        })
    }

    else if (typeof nestedContent === "object") {
        Object.keys(nestedContent).forEach(docTitle => {
            firebaseAdmin.firestore()
                .collection(key)
                .doc(docTitle)
                .set(nestedContent[docTitle])
                .then((res) => {
                    console.log("Wrote " + docTitle + " successfully!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }


});