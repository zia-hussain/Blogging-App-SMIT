const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const skipBtn = document.getElementById("skip");
const loginSkip = document.getElementById("l-skip");
let forgot = document.getElementById("forgot");
let username = document.getElementById("username");
let signInForm = document.getElementById("signin-btn");
let signUpForm = document.querySelector(".sign-up-form");
const fb = document.getElementById("fb");
let email = document.getElementById("email");
let password = document.getElementById("password");

if (forgot) {
  forgot.addEventListener("click", forgotPass);
} else {
  console.log("Element with ID 'forgot' not found.");
}

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
skipBtn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
loginSkip.addEventListener("click", () => {
  localStorage.removeItem("Uid");
  window.open("./Dashboard/dashboard.html", "_blank");
});

//   +++++++++++++++++++++++++++++++++++++++++

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  child,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const dbref = ref(db);
const provider = new FacebookAuthProvider();

let addData = () => {
  // Assume user is authenticated and you have user.uid defined
  const user = auth.currentUser;

  set(ref(db, "UsersUid/" + user.uid), {
    nameofuser: username.value,
    uid: user.uid,
  })
    .then(() => {
      alert("Data Saved in firebase database");
    })
    .catch((error) => {
      console.log(error);
    });
};

let RetData = () => {
  const user = auth.currentUser;
  const dbRef = ref(db, "UsersUid/" + user.uid);
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      username.value = snapshot.val().nameofuser.name;
    } else {
      alert("Employee Does Not Exist");
    }
  });
};

let registerUser = (e) => {
  e.preventDefault();

  let signupEmail = document.getElementById("signup-email");
  let signupPass = document.getElementById("signup-password");

  createUserWithEmailAndPassword(auth, signupEmail.value, signupPass.value)
    .then((credential) => {
      console.log(credential);
      addData();
      alert("You're now one of us!");
      container.classList.remove("sign-up-mode");
      signupEmail.value = "";
      signupPass.value = "";
      username.value = "";
    })
    .catch((error) => {
      alert(error.message);
    });
};
signUpForm.addEventListener("submit", function (event) {
  registerUser(event); // Call your registerUser function
});

let SignInUser = (e) => {
  e.preventDefault();

  signInWithEmailAndPassword(auth, email.value, password.value)
  .then((credential) => {
    console.log("Sign-in successful", credential);
    localStorage.setItem("Uid", credential.user.uid);
    window.open("./Dashboard/dashboard.html", "_blank");
    email.value = "";
    password.value = "";
  })
  .catch((error) => {
    console.error("Sign-in error:", error);
    alert("Please Insert Correct Credential");
    if (!email) {
      forgot.style.display = "block";
    }
  });
};
signInForm.addEventListener("click", SignInUser);



// ++++++++++++v @@@@@@@@@@@@@###########        FOR FACEBOOK AUTHENTICATION      ###########@@@@@@@@@@@@+++++++++++


// let fbbc = () => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       const user = result.user;

//       const credential = FacebookAuthProvider.credentialFromResult(result);
//       const accessToken = credential.accessToken;
//       console.log(accessToken);
//       alert(`Welcome ${user.displayName}`);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       const emaill = error.customData.email;
//       const credential = FacebookAuthProvider.credentialFromError(error);
//       console.log(error);
//       console.log(errorCode, errorMessage, emaill);
//     });
// };
// fb.addEventListener("click", fbbc);

function forgotPass() {
  console.log("first");
  sendPasswordResetEmail(auth, email.value)
    .then(() => {
      alert("A Password Reset Link is Sent To Your Email");
      password.value = "";
    })
    .catch((error) => {
      console.log(error.message);
      console.log(error.code);
    });
}

// function validation() {

// }
