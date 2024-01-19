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
  btn.innerHTML = userName !== "Guest" ? "Logout" : "Login";
  heroBtn.innerHTML = userName !== "Guest" ? "My Profile" : "Be a Member!";
  btn.style.display = "block";
  heroBtn.style.display = "block";
  fullLoader.style.display = "none";
};
getUserData();

// Function to handle the click event on the hero button
function heroBtnvalue() {
  // Redirect to different pages based on the hero button text
  if (heroBtn.innerText === "MY PROFILE") {
    window.location.replace("../Profile/Profile.html");
  } else if (heroBtn.innerText === "BE A MEMBER !") {
    window.location.replace("../index.html");
  }
}
heroBtn.addEventListener("click", heroBtnvalue);

// Variable declarations for various form input elements
let genre = document.getElementById("b-genre");
let bTitle = document.getElementById("b-title");
let desc = document.getElementById("b-desc");
let author = document.getElementById("author");
let publishDate = document.getElementById("pb-date");
let genreInp = document.getElementById("topic");
let bTitleInp = document.getElementById("titleinp");
let descInp = document.getElementById("desc");
let uploadBtn = document.getElementById("upload");
let userUid = localStorage.getItem("Uid");
const show = document.getElementById("blogshow");
const loaderContainer = document.getElementById("spinner");
const fullLoader = document.getElementById("t-spinner");
let body = document.body;

// Function to add a new blog post
function addBlog() {
  if (genreInp.value === "" || bTitleInp.value === "" || descInp.value === "") {
    alert("Please fill in all fields.");
  } else {
    addData();
    closePopup();
  }
}
const newBlogRef = push(ref(db, "BlogData/" + userUid));
const newBlogId = newBlogRef.key;
console.log(newBlogRef);

// Function to close the popup
function closePopup() {
  popup.classList.remove("open-popup");
  background.style.display = "none";
}

// Function to close the menu on small screens
function closemenu() {
  if (window.innerWidth <= 1100) {
    hide.style.display = "none";
    items.style.left = "-35vh";
    show.style.display = "block";
  }
}
uploadBtn.addEventListener("click", addBlog);

// Function to add data to the database
const currentDate = new Date();
let date = `${currentDate.getDate()}/${
  currentDate.getMonth() + 1
}/${currentDate.getFullYear()}`;
let addData = () => {
  const db = getDatabase();
  const currentDate = new Date();
  let date = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  let time = currentDate.getTime();
  const twentyFourHoursLater = time + 24 * 60 * 60 * 1000;
  const newBlogRef = push(ref(db, "BlogData/" + userUid));
  const newBlogId = newBlogRef.key;

  // Upload image and then add blog data to the database
  uploadImage()
    .then((res) => {
      const blogData = {
        genreofBlog: genreInp.value,
        titleofBlog: bTitleInp.value,
        descofBlog: descInp.value,
        createdBy: userUid,
        publishDate: date,
        timestamp: twentyFourHoursLater,
        imgUrl: res,
      };
      set(ref(db, "BlogData/" + userUid + "/" + newBlogId), blogData)
        .then(() => {
          // After successful upload, refresh blog data on the page
          getAllBlogs();
          getBlogsForAllBLog();
        })
        .catch((err) => {});
    })
    .catch((err) => {});
};

// This is for getting blog data for recents Blogs Section
const allBlogsContainer = document.getElementById("articls");
const getAllBlogs = async () => {
  try {
    const usersSnapshot = await get(child(dbRef, "UsersUid")); // Assuming 'UsersUid' is the path to your users data

    // Clear existing content in the container
    notFoundCon.innerHTML = "";
    allBlogsContainer.innerHTML = "";

    if (!usersSnapshot.exists()) {
      notFoundCon.style.display = "flex";
      if (allBlogsContainer) {
        allBlogsContainer.style.display = "none";
      }
      return;
    } else {
      notFoundCon.style.display = "none";
      if (allBlogsContainer) {
        allBlogsContainer.style.display = "flex";
      }
    }

    const userPromises = Object.entries(usersSnapshot.val()).map(
      async ([userId, user]) => {
        const userBlogsRef = ref(db, `BlogData/${userId}`);
        const userBlogsSnapshot = await get(userBlogsRef);

        if (userBlogsSnapshot.exists()) {
          const blogPromises = Object.entries(userBlogsSnapshot.val()).map(
            async ([blogId, blogData]) => {
              const userRef = ref(db, `UsersUid/${userId}`);
              const userSnapshot = await get(userRef);
              const userData = userSnapshot.val(); // You may need to adjust this based on your data structure

              const publishedDate = blogData.publishDate || "Not Available";

              const blogElement = document.createElement("article");
              blogElement.id = blogId;
              blogElement.classList.add("article__card", "swiper-slide");
              blogElement.innerHTML = `
            <figure class="article__image">
              <img src="${blogData.imgUrl}" alt="" />
            </figure>
            <div class="article__content">
              <a href="#" class="card__category">${blogData.genreofBlog}</a>
              <span class="postingInfo">
                <span class="author">Author: ${userData.nameofuser} </span>
                <span class="pb-date">Published on: ${publishedDate}</span>
              </span>
              <h3 class="card__title">${blogData.titleofBlog}</h3>
              <p class="card__excerpt">${blogData.descofBlog}</p>
            </div>
            <a class="btn" id="viewmore" href="./viewmore.html?blogId=${blogId}&userId=${blogData.createdBy}">View More</a>


          `;

              allBlogsContainer.appendChild(blogElement);
              console.log("Blog added to Recent UI:", blogId);
            }
          );

          // Wait for all blog data promises to resolve before continuing to the next user
          await Promise.all(blogPromises);
        }
      }
    );

    // Wait for all user data promises to resolve before finishing
    await Promise.all(userPromises);

    // Hide loader after everything is loaded
    loaderContainer.style.display = "none";
  } catch (error) {
    console.error("Error fetching data:", error);
    loaderContainer.style.display = "none";
  }
};
window.addEventListener("load", () => {
  getAllBlogs();
});

// This is for getting blog data for ALL Blogs Section
const allBlogsArticles = document.getElementById("all-articls");
const getBlogsForAllBLog = async () => {
  try {
    const allUsersRef = ref(db, "UsersUid"); // Assuming 'UsersUid' is the path to your users data
    const usersSnapshot = await get(allUsersRef);
    // Clear existing content in the container
    // notFoundCon.style.display = "none";
    allBlogsArticles.innerHTML = "";
    // if (!usersSnapshot.exists()) {
    //   notFoundCon.style.display = "flex";
    //   return;
    // } else {
    //   notFoundCon.style.display = "none";
    // }
    const userPromises = Object.entries(usersSnapshot.val()).map(
      async ([userId, _]) => {
        const userBlogsRef = ref(db, `BlogData/${userId}`);
        const userBlogsSnapshot = await get(userBlogsRef);
        if (userBlogsSnapshot.exists()) {
          const blogPromises = Object.entries(userBlogsSnapshot.val()).map(
            async ([blogId, blogData]) => {
              const userRef = ref(db, `UsersUid/${userId}`);
              const userSnapshot = await get(userRef);
              const userData = userSnapshot.val(); // You may need to adjust this based on your data structure
              const publishedDate = blogData.publishDate || "Not Available";
              const blogElement = document.createElement("article");
              blogElement.id = blogId;
              blogElement.classList.add("article__card", "swiper-slide");
              blogElement.innerHTML = `
            <figure class=" article__image">
              <img src="${blogData.imgUrl}" alt="" />
            </figure>
            <div class="article__content">
              <a href="#" class="card__category">${blogData.genreofBlog}</a>
              <span class="postingInfo">
                <span class="author">Author: ${userData.nameofuser} </span>
                <span class="pb-date">Published on: ${publishedDate}</span>
              </span>
              <h3 class="card__title">${blogData.titleofBlog}</h3>
              <p class="card__excerpt">${blogData.descofBlog}</p>
            </div>
            <a class="btn" id="viewmore" href="./viewmore.html?blogId=${blogId}&userId=${blogData.createdBy}">View More</a>
          `;
              allBlogsArticles.appendChild(blogElement);
              console.log("Blog added to All Blog UI:", blogId);
            }
          );
          // Wait for all blog data promises to resolve before continuing to the next user
          await Promise.all(blogPromises);
        }
      }
    );

    // Wait for all user data promises to resolve before finishing
    await Promise.all(userPromises);

    // Hide loader after everything is loaded
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
window.addEventListener("load", () => {
  getBlogsForAllBLog();
});

// Function to handle when a new image is selected
let blogImg = document.getElementById("blog-img");
blogImg.onchange = function () {
  handleImageUpload();
};

// Function to show a preview of the selected image
function handleImageUpload() {
  const inputElement = document.getElementById("blog-img");
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
function uploadImage() {
  return new Promise((resolve, reject) => {
    const fileInput = document.getElementById("blog-img");
    const file = fileInput.files[0];
    let name = fileInput?.files[0]?.name;

    if (file) {
      const imageRef = storageRef(
        storage,
        `images/${name + new Date().getMilliseconds()}`
      );

      // Upload the image to storage and get its URL
      uploadBytes(imageRef, file)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          reject(error);
        });
    } else {
      const error = new Error("No image selected.");
      console.error(error.message);
      reject(error);
    }
  });
}

// Event listener for the upload button to initiate image upload
document.getElementById("upload").addEventListener("click", function (event) {
  event.preventDefault();
  uploadImage();
});

// This is for slider
document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".swiper", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    grabCursor: true,
    // centeredSlides: true, // Center the slides
    breakpoints: {
      830: {
        slidesPerView: 2,
      },
      550: {
        slidesPerView: 3,
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
      dynamicBullets: true,
    },
  });

  // Second //
  const swiper2 = new Swiper(".all-blogs", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    grabCursor: true,

    breakpoints: {
      830: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      550: {
        slidesPerView: 3,
        spaceBetween: 30,
        coverflowEffect: {
          rotate: 10,
          slideShadows: true,
        },
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
      dynamicBullets: true,
    },
  });
});