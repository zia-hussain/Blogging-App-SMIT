import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
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
const db = getDatabase();

// ... (your other code)
let id =  localStorage.getItem('blogId')
console.log(id)
var blogId = `${id}`;
var blogRef = ref(db, 'blogs').child(blogId);

blogRef.once('value').then(function(snapshot) {
  var blogData = snapshot.val();

  // Check if the blog exists
  if (blogData) {
    // Display the blog content
    document.getElementById('blog-container').innerHTML = `
      <h1>${blogData.title}</h1>
      <p>${blogData.content}</p>
    `;
  } else {
    // Blog not found
    document.getElementById('blog-container').innerHTML = '<p>Blog not found</p>';
  }
}).catch(function(error) {
  console.error("Error fetching blog:", error);
});