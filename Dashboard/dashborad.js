import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  ref,
  getDatabase,
  child,
  get,
  set,
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

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
let id = localStorage.getItem("Uid");
const dbRef = ref(getDatabase());
let title = document.getElementById("title");
let btn = document.getElementById("btn");
let heroBtn = document.getElementById("h-btn");
let ifLoginBtn = document.querySelectorAll(".if-login");
let nav = document.querySelector(".nav");

const getData = () => {
  get(child(dbRef, `UsersUid/${id}`))
    .then((snapshot) => {
      nav.classList.add("enlarged");
      if (snapshot.exists()) {
        title.innerHTML = snapshot.val().nameofuser + "";
        btn.innerHTML = "Logout";
        btn.style.display = "block";
        heroBtn.innerHTML = "My Profile";
        heroBtn.style.display = "block";
        // ifLoginBtn.style.display = 'block';

        ifLoginBtn.forEach((element) => {
          element.style.display = "block";
        });

        console.log(snapshot.val());
      } else {
        console.log("No data available");
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
    .catch((error) => {
      console.error(error);
    });
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
// */  BLogs Input Data */
let genreInp = document.getElementById("topic");
let bTitleInp = document.getElementById("titleinp");
let descInp = document.getElementById("desc");
// */  BLogs Input Btn */
let uploadBtn = document.getElementById("upload");

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
function bothFunctions() {
  // addData();
  // closePopup();
  // addBlog();
  // closemenu();
}
uploadBtn.addEventListener("click", addBlog);

// ++++++++++++++++++++++++++++            database             +++++++++++++++++

let addData = () => {
  // Assume user is authenticated and you have user.uid defined
  const user = auth.currentUser;
  let userUid = localStorage.getItem("Uid");
  set(ref(db, "BlogData/" + userUid), {
    genreofBlog: genreInp.value,
    titleofBlog: bTitleInp.value,
    descofBlog: descInp.value,
  })
    .then(() => {
      closePopup();
      closemenu();
      alert("Data Saved in firebase database");
    })
    .catch((error) => {
      console.log(error);
    });
};

let getBlogs = () => {
  get(child(dbRef, `BlogData/${id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {

        console.log(snapshot.val());
        genre.innerHTML = snapshot.val().genreofBlog;
        bTitle.innerHTML = snapshot.val().titleofBlog;
        desc.innerHTML = snapshot.val().descofBlog;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

getBlogs();


//  Swiper //

const swiper = new Swiper(".swiper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 10,
  grabCursor: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  effect: "coverflow", // Use the "coverflow" effect for a custom transition
  coverflowEffect: {
    rotate: 50,
    slideShadows: true,
  },
  breakpoints: {
    550: {
      slidesPerView: 3,
      spaceBetween: 30,
      coverflowEffect: {
        rotate: 5,
        slideShadows: true,
      },
    },
    830: {
      slidesPerView: 2,
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
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  effect: "coverflow", // Use the "coverflow" effect
  coverflowEffect: {
    rotate: 50, // Set the rotation angle
    slideShadows: true,
  },
  breakpoints: {
    550: {
      slidesPerView: 3,
      spaceBetween: 30,
      coverflowEffect: {
        rotate: 10, // Set the rotation angle
        slideShadows: true,
      },
    },
    830: {
      slidesPerView: 2,
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
