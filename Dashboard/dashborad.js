import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  ref,
  getDatabase,
  child,
  get,
  set,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlpLk8NjMNvY3aFWvzTLp9uX_wVOX4TRY",
  authDomain: "auth-blog-app-assignment.firebaseapp.com",
  projectId: "auth-blog-app-assignment",
  storageBucket: "auth-blog-app-assignment.appspot.com",
  messagingSenderId: "939311478935",
  appId: "1:939311478935:web:dc29fa6e41142a622651d2",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const db = getDatabase();
const auth = getAuth(app);
let id = localStorage.getItem("Uid");
const dbRef = ref(getDatabase());
let title = document.getElementById("title");
let btn = document.getElementById("btn");
let heroBtn = document.getElementById("h-btn");
let ifLoginBtn = document.querySelectorAll(".if-login");
let nav = document.querySelector(".nav");
let titleall;

const getData = () => {
  get(child(dbRef, `UsersUid/${id}`))
    .then((snapshot) => {
      nav.classList.add("enlarged");
      if (snapshot.exists()) {
        titleall = title.innerHTML = snapshot.val().nameofuser + "";
        btn.innerHTML = "Logout";
        btn.style.display = "block";
        heroBtn.innerHTML = "My Profile";
        heroBtn.style.display = "block";
        // ifLoginBtn.style.display = 'block';

        ifLoginBtn.forEach((element) => {
          element.style.display = "block";
        });
      } else {
        title.innerHTML = "Guest";
        btn.innerHTML = "Login";
        btn.style.display = "block";
        heroBtn.innerHTML = "Be a Member !";
        heroBtn.style.display = "block";
        // ifLoginBtn.style.display = 'none';

        ifLoginBtn.forEach((element) => {
          element.style.display = "none";
        });
      }
    })
    .catch((error) => {});
};
getData();

function heroBtnvalue() {
  if (heroBtn.innerText === "MY PROFILE") {
    window.location.replace("../Profile/Profile.html");
  } else if (heroBtn.innerText === "BE A MEMBER !") {
    window.location.replace("../index.html");
  }
}
heroBtn.addEventListener("click", heroBtnvalue);

// */  BLogs CardData */
let genre = document.getElementById("b-genre");
let bTitle = document.getElementById("b-title");
let desc = document.getElementById("b-desc");
let author = document.getElementById("author");
let publishDate = document.getElementById("pb-date");
// */  BLogs Input Data */
let genreInp = document.getElementById("topic");
let bTitleInp = document.getElementById("titleinp");
let descInp = document.getElementById("desc");
// */  BLogs Input Btn */
let uploadBtn = document.getElementById("upload");
let userUid = localStorage.getItem("Uid");
const show = document.getElementById("blogshow");
function addBlog() {
  if (genreInp.value === "") {
    alert("Please Add Genre/Topic for Your Blog");
    return false;
  }
  if (bTitleInp.value === "") {
    alert("Please Add Title For Your Blog");
    return false;
  }
  if (descInp.value === "") {
    alert("Please Add Description For Yout Blog");
    return false;
  } else {
    addData();
  }
}
function closePopup() {
  popup.classList.remove("open-popup");
  background.style.display = "none";
}
function closemenu() {
  if (window.innerWidth <= 1100) {
    hide.style.display = "none";
    items.style.left = "-35vh";
    show.style.display = "block";
  }
}

uploadBtn.addEventListener("click", addBlog);

// ++++++++++++++++++++++++++++            database             +++++++++++++++++
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

  // Calculate timestamp for 24 hours from now
  const twentyFourHoursLater = time + 24 * 60 * 60 * 1000;

  // Generate a unique key for the new blog entry
  const newBlogRef = push(ref(db, "BlogData/" + userUid));

  // Get the randomly generated key
  const newBlogId = newBlogRef.key;

  // Data to be saved
  const blogData = {
    genreofBlog: genreInp.value,
    titleofBlog: bTitleInp.value,
    descofBlog: descInp.value,
    createdBy: userUid,
    publishDate: date,
    timestamp: twentyFourHoursLater, // Add timestamp field
  };

  set(ref(db, "BlogData/" + userUid + "/" + newBlogId), blogData)
    .then(() => {})
    .catch((err) => {});
};

const allBlogsContainer = document.getElementById("articls");
const getAllBlogs = () => {
  const allUsersRef = ref(db, "BlogData");
  let notFoundCon = document.querySelector(".not-found-container");

  // Attach a listener to retrieve data when it changes
  onValue(
    allUsersRef,
    (snapshot) => {
      // Clear existing content in the container
      notFoundCon.style.display = "none";

      // Check if there are no blogs
      if (!snapshot.hasChildren()) {
        notFoundCon.style.display = "flex";
        return;
      }

      // Iterate over each user
      snapshot.forEach((userSnapshot) => {
        const userId = userSnapshot.key;

        // Get the reference to the user's blogs
        const userBlogsRef = ref(db, `BlogData/${userId}`);

        // Attach a listener to retrieve user's blog data
        onValue(
          userBlogsRef,
          (userBlogsSnapshot) => {
            // Check if the user has no blogs
            if (!userBlogsSnapshot.hasChildren()) {
              notFoundCon.style.display = "flex";
              return;
            }

            // Iterate over each blog entry for the user
            userBlogsSnapshot.forEach((blogSnapshot) => {
              const blogData = blogSnapshot.val();

              // Check if the blog is older than 12 hours
              const currentTimestamp = new Date().getTime();
              const twelveHoursAgo = currentTimestamp - 12 * 60 * 60 * 1000;

              if (blogData.timestamp < twelveHoursAgo) {
                // Blog is older than 12 hours, don't display it
                return;
              }

              // Fetch additional user data
              const userRef = ref(db, `UsersUid/${userId}`);
              get(userRef).then((userSnapshot) => {
                const userData = userSnapshot.val();

                // Get the published date or set a default value
                const publishedDate = blogData.publishDate || "Not Available";

                // Create HTML elements to display the blog data
                const blogElement = document.createElement("article");
                blogElement.classList.add("article__card", "swiper-slide");

                blogElement.innerHTML = `
                  <figure class="article__image">
                    <img src="download (1).jpeg" alt="" />
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
                <a class="btn" id="viewmore" href="#">View More</a>

                `;

                // Append the blog element to the container
                allBlogsContainer.appendChild(blogElement);
              });
            });
          },
          (error) => {
            console.log(error);
          }
        );
      });
    },
    (error) => {
      console.log(error);
    }
  );
};
getAllBlogs();

// #####################3       Get All Blogs Function       ######################3
const allBlogsArticles = document.getElementById("all-articls");
const getBlogsForAllBLog = () => {
  const allUsersRef = ref(db, "BlogData");
  let notFoundCon = document.querySelector(".not-found-container");

  onValue(
    allUsersRef,
    (snapshot) => {
      notFoundCon.style.display = "none";

      // Check if there are no blogs
      if (!snapshot.hasChildren()) {
        notFoundCon.style.display = "flex";
        return;
      }

      // Iterate over each user
      snapshot.forEach((userSnapshot) => {
        const userId = userSnapshot.key;

        // Get the reference to the user's blogs
        const userBlogsRef = ref(db, `BlogData/${userId}`);

        // Attach a listener to retrieve user's blog data
        onValue(
          userBlogsRef,
          (userBlogsSnapshot) => {
            // Check if the user has no blogs
            if (!userBlogsSnapshot.hasChildren()) {
              notFoundCon.style.display = "flex";
              return;
            }

            // Iterate over each blog entry for the user
            userBlogsSnapshot.forEach((blogSnapshot) => {
              const blogData = blogSnapshot.val();

              // Check if the blog is older than 24 hours
              const currentTimestamp = new Date().getTime();
              if (blogData.timestamp < currentTimestamp) {
                // Blog is older than 24 hours, don't display it
                return;
              }

              // Fetch additional user data
              const userRef = ref(db, `UsersUid/${userId}`);
              get(userRef).then((userSnapshot) => {
                const userData = userSnapshot.val();

                // Get the published date or set a default value
                const publishedDate = blogData.publishDate || "Not Available";

                // Create HTML elements to display the blog data
                const blogElement = document.createElement("article");
                blogElement.classList.add("article__card", "swiper-slide");

                blogElement.innerHTML = `
                  <figure class="article__image">
                    <img src="download (1).jpeg" alt="" />
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
                <a class="btn" id="viewmore" href="#">View More</a>

                `;

                // Append the blog element to the container
                allBlogsArticles.appendChild(blogElement);
              });
            });
          },
          (error) => {
            console.log(error);
          }
        );
      });
    },
    (error) => {
      console.log(error);
    }
  );
};
getBlogsForAllBLog();

// +++++++++++++++++++++++++++++++++++++               Adding image //

// +++++++++++++++++++++++++++++++++++++               Adding image //
document.getElementById("upload").addEventListener("click", function (event) {
  event.preventDefault();
  uploadImage();
});

function uploadImage() {
  console.log("first");
  const imageInput = document.getElementById("blog-img");

  imageInput.addEventListener("change", (event) => {
    const selectedImage = event.target.files[0];

    console.log("Selected Image:", selectedImage);
    if (selectedImage) {
      // Use 'selectedImage' as needed, such as displaying it or uploading it.
      console.log("Selected Image:", selectedImage);
    }
  });
  // var imageFile = document.getElementById('blog-img')
  // console.log(imageFile);

  //   if (!imageFile) {
  //     alert('Please select an image');
  //     return;
  //   }

  //   var imageName = imageFile.name;
  //   var storageRef = storageRef(storage, 'images/' + imageName);
  //   var uploadTask = uploadBytesResumable(storageRef, imageFile);

  //   uploadTask
  //     .then(snapshot => getDownloadURL(snapshot.ref))
  //     .then(downloadURL => {
  //       saveImageToDatabase(downloadURL);
  //     })
  //     .catch(error => {
  //       console.error('Error uploading image:', error);
  //     });
  // }

  // function saveImageToDatabase(downloadURL) {
  //   // Save download URL to your Firebase Realtime Database
  //   var blogData = {
  //     // your other blog data
  //     imageURL: downloadURL
  //   };

  //   // Assuming you have a specific reference for blogs, update this line accordingly
  //   var newBlogRef = push(ref(db, 'BlogData/' + userUid));
  //   set(newBlogRef, blogData);

  //   // You can then use this downloadURL to display the image in your blog card
  //   displayImageInBlogCard(downloadURL);
  // }

  // function displayImageInBlogCard(imageURL) {
  //   // Create HTML elements to display the blog data, including the image
  //   const blogElement = document.createElement('article');
  //   blogElement.classList.add('article__card', 'swiper-slide');

  //   blogElement.innerHTML = `
  //     <figure class="article__image">
  //       <img src="${imageURL}" alt="" />
  //     </figure>
  //     <!-- Rest of your HTML code... -->
  //     <a class="btn" id="viewmore" href="#">View More</a>
  //   `;

  //   // Append the blog element to the container
  //   allBlogsArticles.appendChild(blogElement);
}

const swiper = new Swiper(".swiper", {
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
        rotate: 10, // Set the rotation angle
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
