import app from 'firebase/app';

// Initialize firebase
const config = {
    apiKey: "AIzaSyCT2AU-DGb6FIaE5a8v8zLmnPpgev25iys",
    authDomain: "bettersome-a5c8e.firebaseapp.com",
    databaseURL: "https://bettersome-a5c8e.firebaseio.com",
    projectId: "bettersome-a5c8e",
    storageBucket: "bettersome-a5c8e.appspot.com",
    messagingSenderId: "78288933113"
};

class Firebase{
    constructor() {
        app.initializeApp(config);
    }
}


export default Firebase;