import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlpLk8NjMNvY3aFWvzTLp9uX_wVOX4TRY",
  authDomain: "auth-blog-app-assignment.firebaseapp.com",
  projectId: "auth-blog-app-assignment",
  storageBucket: "auth-blog-app-assignment.appspot.com",
  messagingSenderId: "939311478935",
  appId: "1:939311478935:web:dc29fa6e41142a622651d2",
};

const app = initializeApp(firebaseConfig);
let id = localStorage.getItem("Uid");
let title = document.getElementById("title");

const dbRef = ref(getDatabase());
const getData = () => {
  get(child(dbRef, `UsersUid/${id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let names = snapshot.val().nameofuser;
        title.innerHTML = name;
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
getData();
let items = document.querySelectorAll(".show");
function showNavItems() {}
showNavItems();
