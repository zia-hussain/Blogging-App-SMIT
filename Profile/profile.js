import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlpLk8NjMNvY3aFWvzTLp9uX_wVOX4TRY",
  authDomain: "auth-blog-app-assignment.firebaseapp.com",
  projectId: "auth-blog-app-assignment",
  storageBucket: "auth-blog-app-assignment.appspot.com",
  messagingSenderId: "939311478935",
  appId: "1:939311478935:web:dc29fa6e41142a622651d2",
};

// Firebase Varialbes
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase();
const auth = getAuth(app);
let id = localStorage.getItem("Uid");
const allUsersRef = ref(db, "UsersUid"); // Adjust the path according to your database structure
const dbRef = ref(getDatabase());

// Other Variables
let title = document.getElementById("title");
let btn = document.getElementById("btn");
let heroBtn = document.getElementById("h-btn");
let ifLoginBtn = document.querySelectorAll(".if-login");
let nav = document.querySelector(".nav");
let titleall;
let viewmore = document.getElementById("viewmore");
let notFoundCon = document.querySelector(".not-found-container");

// Function to get user data from the database
const getUserData = async () => {
  try {
    const snapshot = await get(child(dbRef, `UsersUid/${id}`));

    // If user data exists, update the UI with the user's name; otherwise, display as "Guest"
    if (snapshot.exists()) {
      updateUI(snapshot.val().nameofuser);
    } else {
      updateUI("Guest");
    }
  } catch (error) {
    // Log an error message if there is an issue fetching user data
    console.error("Error getting user data:", error);
  }
};

// Function to update the UI based on the user's name
const updateUI = (userName) => {
  nav.classList.add("enlarged");
  ifLoginBtn.forEach((element) => {
    element.style.display = userName !== "Guest" ? "block" : "none";
  });

  // Update the UI elements with user-specific information
  title.innerHTML = userName;
};
getUserData();

