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

// Use DOMContentLoaded event for better performance
window.addEventListener("DOMContentLoaded", () => {
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

    const titleElement = document.getElementById("title");
    const authorElement = document.getElementById("author");
    const dateElement = document.getElementById("date");
    const descElement = document.getElementById("desc");
    const imgElement = document.getElementById("img");

    const blogRef = ref(db, `BlogData/${userUid}/${blogId}`);
    console.log("Blog Reference:", blogRef.toString());

    const blogSnapshot = await get(blogRef);

    if (blogSnapshot.exists()) {
      const blogData = blogSnapshot.val();
      console.log(blogData)

      // Update the HTML elements with the fetched data
      if (titleElement) {
        titleElement.innerText = blogData.titleofBlog || "Untitled Blog";
      }
      if (authorElement) {
        authorElement.innerText = blogData.createdBy || "Unknown Author";
      }
      if (dateElement) {
        dateElement.innerText = blogData.publishDate || "Unknown Date";
      }
      if (descElement) {
        descElement.innerText = blogData.descofBlog || "No description available.";
      }
      if (imgElement && blogData.imageUrl) {
        imgElement.src = blogData.imgUrl;
      }
      // Update other elements as needed
    } else {
      console.error("Blog not found");
    }
  } catch (error) {
    console.error("Error fetching blog data:", error);
  }
};
