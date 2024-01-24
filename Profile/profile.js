import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  onValue,
  remove,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  deleteUser,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
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

// Firebase Variables
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase();
const auth = getAuth(app);

const allUsersRef = ref(db, "UsersUid");
const dbRef = ref(getDatabase());

// Other Variables
let title = document.getElementById("title");
let img = document.querySelector("#photo");
let ifLoginBtn = document.querySelectorAll(".if-login");
let nav = document.querySelector(".nav");
const fullLoader = document.getElementById("t-spinner");
let deleteBtn = document.getElementById("delete");
let id;
onAuthStateChanged(auth, (user) => {
  if (user) {
    id = user.uid;
  } else {
    id = null;
  }
  getUserData();
});

// Function to get user data from the database
const getUserData = async () => {
  try {
    if (id) {
      console.log("Fetching user data...");
      const snapshot = await get(child(dbRef, `UsersUid/${id}`));
      if (snapshot.exists()) {
        const userData = snapshot.val();
        updateUI(userData.nameofuser, userData.profileImageUrl);
      } else {
        updateUI("Guest");
      }
    } else {
      updateUI("Guest");
    }
  } catch (error) {
    console.error("Error getting user data:", error);
  }
};

// Function to update the UI based on the user's name and profile picture
const updateUI = (userName, profileImageUrl) => {
  nav.classList.add("enlarged");
  ifLoginBtn.forEach((element) => {
    element.style.display = userName !== "Guest" ? "block" : "none";
  });

  // Update the UI elements with user-specific information
  title.innerHTML = userName;

  // Check if profileImageUrl is provided and update the image source
  if (profileImageUrl) {
    img.setAttribute("src", profileImageUrl);
  }

  if (userName && profileImageUrl) {
    setTimeout(() => {
      // fullLoader.style.display = "none";
    }, 2000); // Hide loader after a delay of 2000 milliseconds (2 seconds)
  }
};

getUserData();

// This is specifically for the profile image

const imgDiv = document.querySelector(".profile-pic-div");
const file = document.querySelector("#file");
const uploadBtn = document.querySelector("#uploadBtn");

imgDiv.addEventListener("mouseenter", function () {
  uploadBtn.style.display = "block";
});

imgDiv.addEventListener("mouseleave", function () {
  uploadBtn.style.display = "none";
});

file.addEventListener("change", function () {
  const choosedFile = this.files[0];
  if (choosedFile) {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });
    reader.readAsDataURL(choosedFile);
  }
});

// Storing img

let blogImg = document.getElementById("file");
blogImg.onchange = function () {
  handleImageUpload();
};
let imagePreview;

// Function to show a preview of the selected image
function handleImageUpload() {
  const inputElement = document.getElementById("file");
  const file = inputElement.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview = new Image();
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    console.log("No image selected.");
  }
}

// Function to update user profile with the image URL in the database
// Function to update user profile with the image URL in the database
async function updateUserProfileImage(imageUrl) {
  try {
    const db = getDatabase();
    const userRef = ref(db, `UsersUid/${id}`);
    await update(userRef, {
      profileImageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error updating user profile image:", error);
    throw error;
  }
}

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

      // Update user profile in the database with the image URL
      await updateUserProfileImage(imageUrl);

      console.log("Image URL:", imageUrl);
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

      // Update UI with the obtained image URL
      getUserData();

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  });

let pass = document.getElementById("c-pass");
async function signout() {
  try {
    const user = auth.currentUser;

    if (user) {
      // Get the entered password from the input field
      const enteredPassword = pass.value;

      // Check if the user provided a password
      if (enteredPassword) {
        // Reauthenticate user before deleting the account
        const credential = EmailAuthProvider.credential(
          user.email,
          enteredPassword
        );

        try {
          await reauthenticateWithCredential(user, credential);

          // Now, the user is reauthenticated, proceed with account deletion
          await remove(ref(db, `UsersUid/${user.uid}`));
          await deleteUserBlogData(user.uid);
          await user.delete();

          alert("Done Man");
          location.replace("/index.html");
        } catch (reauthError) {
          // Handle reauthentication error
          console.error("Error during reauthentication:", reauthError);
          alert("Incorrect password. Please try again.");
        }
      } else {
        alert("You must provide your current password to sign out.");
      }
    } else {
      alert("User is not signed in.");
    }
  } catch (error) {
    console.error("Error during signout:", error);
    alert("Error during signout. Please check the console for details.");
  }
}
deleteBtn.addEventListener("click", signout);

async function deleteUserBlogData(userId) {
  try {
    const blogDataRef = ref(db, `BlogData/${userId}`);
    await remove(blogDataRef);
    console.log(`Blog data for user with ID ${userId} deleted.`);
  } catch (error) {
    console.error("Error deleting user's blog data:", error);
    throw error;
  }
}

// Assuming you have a button with id "deleteBtn" in your HTML
deleteBtn.addEventListener("click", signout);

const allBlogsContainer = document.getElementById("articls");

const getAllBlogs = async () => {
  try {
    const usersSnapshot = await get(child(dbRef, "UsersUid"));

    // Set initial value of blogsFound to false
    let blogsFound = false;

    // Loop through users
    for (const [userId, user] of Object.entries(usersSnapshot.val())) {
      const userBlogsRef = ref(db, `BlogData/${userId}`);
      const userBlogsSnapshot = await get(userBlogsRef);

      // Check if user has blogs
      if (userBlogsSnapshot.exists()) {
        // Loop through blogs
        for (const [blogId, blogData] of Object.entries(
          userBlogsSnapshot.val()
        )) {
          // Process blog data and add to UI
          const userRef = ref(db, `UsersUid/${userId}`);
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.val();

          const publishedDate = blogData.publishDate || "Not Available";

          const blogElement = document.createElement("article");
          blogElement.id = blogId;
          console.log(blogId);
          blogElement.classList.add("article__card", "swiper-slide");
          blogElement.innerHTML = `
            <div class="card card1" data-blogid="${blogId}">
              <div class="container">
                <img src="${blogData.imgUrl}" alt="Image 1">
              </div>
              <div class="details">
                <span class="postingInfo">
                  <span class="author">Author: ${userData.nameofuser} </span>
                  <span class="pb-date">Published on: ${publishedDate}</span>
                </span>
                <span id="genre">${blogData.genreofBlog}</span>
                <h3 id="title">${blogData.titleofBlog}</h3>
                <p id="desc">${blogData.descofBlog}</p>
                <div id="btns">
                  <div class="first-btn">
                    <a class="btn" id="viewmore" href="/Dashboard/viewmore.html?blogId=${blogId}&userId=${blogData.createdBy}">View More</a>
                  </div>
                  <div class="second-btn">
                    <i class="fa-regular fa-trash-can"></i>
                    <i class="fa-regular fa-pen-to-square"></i>
                  </div>
                </div>
              </div>
            </div>
          `;

          allBlogsContainer.appendChild(blogElement);
          const trashIcon = blogElement.querySelector(".fa-trash-can");
          trashIcon.addEventListener("click", () => delTask(blogId));

          // Set blogsFound to true since at least one blog is found
          blogsFound = true;
        }
      }
    }

    // Display the notFoundCon only if no blogs are found
    // recentnotFoundCon.style.display = blogsFound ? "none" : "flex";
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors if needed
  }
};
window.addEventListener("load", () => {
  getAllBlogs();
});

//  for deleting blogs

// Function to delete a blog post
function delTask(blogId) {
  // try {
  const user = auth.currentUser;
  console.log(auth.currentUser);

  if (user) {
    const userId = user.uid;
    console.log(blogId);
    // const blogDataRef = ref(db, `BlogData/${userId}/${blogId}`);
    remove(ref(db, `BlogData/${userId}/${blogId}`))
      .then((res) => {
        console.log("data removed successfully", res);
      })
      .catch((error) => {
        alert("error" + error);
      });
  }
  //     await remove(blogDataRef)
  //       .then((result) => {
  //         console.log(result);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });

  //     // Reload the page or update the UI as needed
  //     // location.reload();
  //   } else {
  //     alert("User is not signed in.");
  //   }
  // } catch (error) {
  //   console.error("Error during blog deletion:", error);
  //   alert("Error deleting blog. Please check the console for details.");
  // }
}
