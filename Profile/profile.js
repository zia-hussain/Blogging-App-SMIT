import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  onValue,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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
const fullLoader = document.getElementById("t-spinner");

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
  fullLoader.style.display = "none";
};
getUserData();

//    This is specially for profile image

const imgDiv = document.querySelector(".profile-pic-div");
const img = document.querySelector("#photo");
const file = document.querySelector("#file");
const uploadBtn = document.querySelector("#uploadBtn");
imgDiv.addEventListener("mouseenter", function () {
  uploadBtn.style.display = "block";
});
imgDiv.addEventListener("mouseleave", function () {
  uploadBtn.style.display = "none";
});
file.addEventListener("change", function () {
  //this refers to file
  const choosedFile = this.files[0];
  if (choosedFile) {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });
    reader.readAsDataURL(choosedFile);
  }
});

//  Storing img

let blogImg = document.getElementById("file");
blogImg.onchange = function () {
  handleImageUpload();
};

// Function to show a preview of the selected image
function handleImageUpload() {
  const inputElement = document.getElementById("file");
  const file = inputElement.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imagePreview = new Image();
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    console.log("No image selected.");
  }
}

// Function to upload the selected image to storage
// Function to upload the selected image to storage and update user profile
// Function to upload the selected image to storage and update user profile
async function uploadImage() {
  try {
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];
    let name = fileInput?.files[0]?.name;

    if (file) {
      const imageRef = storageRef(
        storage,
        `profileImg/${name + new Date().getMilliseconds()}`
      );

      // Upload the image to storage and get its URL
      const snapshot = await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Update user profile with the image URL
      await updateProfile(auth.currentUser, {
        photoURL: imageUrl,
      });

      console.log("Image URL:", imageUrl);
      alert("Image uploaded successfully!");

      // Update user profile data in the database with the image URL
      const userId = auth.currentUser.uid;
      const userRef = ref(db, `UsersUid/${userId}`);
      const userSnapshot = await get(userRef);

      // Assuming you have a field named `profileImageUrl` in your database
      const profilePicUrlFromDatabase = userSnapshot.val().profileImageUrl;
      console.log(profilePicUrlFromDatabase);

      // Update user profile data in the database with the image URL
      await update(userRef, { profileImageUrl: imageUrl });

      // You can access the image URL later using auth.currentUser.photoURL

      return imageUrl;
    } else {
      throw new Error("No image selected.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Error uploading image. Please try again.");
    throw error;
  }
}

// Event listener for the upload button to initiate image upload
document
  .getElementById("upload")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    try {
      const imageUrl = await uploadImage();
      // You can use imageUrl as needed, for example, update the UI or store it in the database.
    } catch (error) {
      // Handle errors here
    }
  });

// Event listener for the upload button to initiate image upload
document.getElementById("upload").addEventListener("click", function (event) {
  event.preventDefault();
  uploadImage();
  alert("yes clicked");
});
