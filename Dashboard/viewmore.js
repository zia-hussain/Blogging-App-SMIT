import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlpLk8NjMNvY3aFWvzTLp9uX_wVOX4TRY",
  authDomain: "auth-blog-app-assignment.firebaseapp.com",
  projectId: "auth-blog-app-assignment",
  storageBucket: "auth-blog-app-assignment.appspot.com",
  messagingSenderId: "939311478935",
  appId: "1:939311478935:web:dc29fa6e41142a622651d2",
};

// Firebase Variables
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let loader = document.getElementById('t-spinner')

// Use DOMContentLoaded event for better performance
window.addEventListener("DOMContentLoaded", () => {
    loader.style.display = 'flex'
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      const userUid = user.uid;
      console.log("User UID:", userUid);
      // Call the function to fetch and display blog details
      fetchBlogDetails(userUid);
    } else {
      // No user is signed in
      console.error("User not signed in");
    }
  });
});

// Function to fetch and display blog details
const fetchBlogDetails = async (userUid) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const blogId = urlParams.get("blogId");
  
      // Check if blogId is present in the URL
      if (!blogId) {
        console.error("No blogId found in the URL");
        // Handle this case (e.g., redirect or display an error message)
        return;
      }
  
      // Fetch the user data
      const userRef = ref(db, `UsersUid/${userUid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();
  
      const blogRef = ref(db, `BlogData/${userUid}/${blogId}`);
      console.log("Blog Reference:", blogRef.toString());
  
      const blogSnapshot = await get(blogRef);
  
      setTimeout(() => {
        if (blogSnapshot.exists()) {
          const blogData = blogSnapshot.val();
          
          // Assuming allBlogsContainer is defined elsewhere in your code
          let allBlogsContainer = document.querySelector(".main-container");
  
          const blogElement = document.createElement("article");
          blogElement.innerHTML = `
    <div class="image-container">
      <img id="img" src="${blogData.imgUrl}" alt="" />
    </div>
    <div class="container">
      <div class="postingDets">
        <span id="title">${blogData.titleofBlog}</span>
        <p class="author">By: <span id="author">${userData.nameofuser}</span></p>
        <p class="date">Published on: <span id="date">${blogData.publishDate}</span></p>
      </div>
      <div class="desc" id="desc">${blogData.descofBlog}</div>
    </div>
  `;
  
          allBlogsContainer.appendChild(blogElement);
        } else {
          console.error("Blog not found");
        }
    loader.style.display = 'none'
      }, 3000);
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  };
  