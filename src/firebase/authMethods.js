import firebase from "firebase";
import Firebaseconfig from "./FirebaseConfig";
import { dbMethods } from "./dbMethods";
export const authMethods = {
  // firebase auth helper methods go here...
  signup: (email, password, setErrors, setToken, username) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      //make res asynchronous so that we can make grab the token before saving it.
      .then(async (res) => {
        const token = await Object.entries(res.user)[5][1].b;
        //set token to localStorage
        await localStorage.setItem("token", token);
        //grab token from local storage and set to state.
        setToken(window.localStorage.token);
        console.log(res);
        dbMethods.create(email, username);
      })

      .catch((err) => {
        setErrors((prev) => [...prev, err.message]);
      });
  },
  signin: (email, password, setErrors, setToken) => {
    //change from create users to...
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      //everything is almost exactly the same as the function above
      .then(async (res) => {
        const token = await Object.entries(res.user)[5][1].b;
        //set token to localStorage
        await localStorage.setItem("token", token);
        setToken(window.localStorage.token);
      })
      .catch((err) => {
        setErrors((prev) => [...prev, err.message]);
      });
  },
  //no need for email and password
  signout: (setErrors, setToken) => {
    // signOut is a no argument function
    firebase
      .auth()
      .signOut()
      .then((res) => {
        //remove the token
        localStorage.removeItem("token");
        //set the token back to original state
        setToken(null);
      })
      .catch((err) => {
        //there shouldn't every be an error from firebase but just in case
        setErrors((prev) => [...prev, err.message]);
        //whether firebase does the trick or not i want my user to do there thing.
        localStorage.removeItem("token");
        setToken(null);
        console.error(err.message);
      });
  },
};
