// Import the functions you need from the SDKs you need

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBvInz1S2iNx7kD-3-q0zehHaybWg67Uc",
  authDomain: "new-mock-discord.firebaseapp.com",
  projectId: "new-mock-discord",
  storageBucket: "new-mock-discord.appspot.com",
  messagingSenderId: "768323066178",
  appId: "1:768323066178:web:82a6e6d5a3042773aa90db",
  measurementId: "G-3MRX2D620V"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const d = new Date();
//let time = d.getTime();
let db = rtdb.getDatabase(app);
let titleRef = rtdb.ref(db, "/");
let serverListRef = rtdb.child(titleRef, "server_list");
let defaultServerRef = rtdb.child(serverListRef, "default server");
let currentServerRef = defaultServerRef;
//var thesender = null;



/* to add a new server, add a button that calls a function that runs this on user input for server name

let tmpserver = "server 3";
let newserverRef = rtdb.child(serverListRef, tmpserver);

let welcomeMessage = {sender:0,message:"heyo",time:d.getTime()};
rtdb.push(newserverRef, welcomeMessage);
*/



let userListRef = rtdb.child(titleRef, "user_list");
//let currentUser = NULL;

var currentUser = null;
var pages = ['login', 'home'];
var currentPageIndex = 0;
var logoutFunc = function(){
    let currentUser = null;
    document.getElementById("home").classList.add('hidden');
    currentPageIndex = 0;
    document.getElementById("login").classList.remove('hidden');
}
let numUsers = 0;

var RshowNextPage = function(){
/* if someone's username or email already exists, ignore and tell them to use login*/
    numUsers = 0;
    rtdb.get(userListRef).then(ss=>{
        ss.forEach(function(item){
            console.log(item.val().email);
            numUsers+=1;
            console.log(numUsers);
            if(item.val().username === document.getElementById("usernameR").value){
                alert("Username taken!");
                return;
            }
            else if(item.val().email === document.getElementById("emailR").value){
                alert("You have already registered! Please use login.");
                return;
            }
        });
        if(document.getElementById("passwordAR").value == ""){
            alert("Password field cannot be empty.")
            return;
        }
        if(document.getElementById("passwordAR").value === document.getElementById("passwordBR").value){
            console.log("numUsers here = " + numUsers);
            let RegisterPerson = {username:document.getElementById("usernameR").value, UID:numUsers, email:document.getElementById("emailR").value,password:document.getElementById("passwordAR").value};
            rtdb.push(userListRef,RegisterPerson);
            currentUser = RegisterPerson;
            alert("Register! Successful! Welcome " + currentUser.username + "!");
            document.getElementById('usernameR').value = '';
            document.getElementById('emailR').value = '';
            document.getElementById(pages[currentPageIndex]).classList.add('hidden');
            currentPageIndex = (currentPageIndex + 1) % pages.length;
            document.getElementById(pages[currentPageIndex]).classList.remove('hidden');
            refreshChat();
            }
        else{
            alert("Passwords did not match. Try again!");
            return;
        } 
    });
}

var LoginFunc = function(){
    /*if username OR email exists, check for password being correct, then login ? and show home page*/
    rtdb.get(userListRef).then(ss=>{
        ss.forEach(function(item){
            if(item.val().email === document.getElementById("usernameL").value || item.val().username === document.getElementById("usernameL").value){
                if(item.val().password === document.getElementById("passwordL").value){
                    console.log("success");
                    currentUser = item.val();
                    document.getElementById(pages[currentPageIndex]).classList.add('hidden');
                    currentPageIndex = (currentPageIndex + 1) % pages.length;
                    document.getElementById(pages[currentPageIndex]).classList.remove('hidden');
                    alert("Login Successful! Welcome " + currentUser.username + "!");
                    document.getElementById('usernameL').value = '';
                    document.getElementById('usernameR').value = '';
                    document.getElementById('emailR').value = '';
                    document.getElementById('passwordL').value = '';
                    refreshChat();
                }
                else{
                    document.getElementById('usernameL').value = '';
                    document.getElementById('usernameR').value = '';
                    document.getElementById('emailR').value = '';
                    document.getElementById('passwordL').value = '';
                    alert("Login Failed. Try again!");
                }
            }
        });
    });
  }
var refreshChat = function(){
    //document.getElementById("Chat").splice(0,document.getElementById("Chat").length); //A.splice(0, A.length);
    document.getElementById("Chat").innerHTML = '';
    rtdb.get(currentServerRef).then(ss=>{
        ss.forEach(function(item){
            document.getElementById("Chat").append(
                item.val().message + " \t"
              );
            //   document.getElementById("Chat").append(
            //     item.val().message + " \t"
            //   );
        });
    });
}
var sendMessageFunc = function(){
    console.log("send success");
    let pushedMessage = {sender:currentUser.UID,message:document.getElementById("chatInput").value,time:d.getTime()};
    rtdb.push(currentServerRef, pushedMessage);
    document.getElementById('chatInput').value = '';
    refreshChat();
}

var whoamiFunc = function(){
    alert("You are: " + currentUser.username + ", your email is: " + currentUser.email + ", and UID is: " + currentUser.UID);
}

document.getElementById("chatSendButton").addEventListener('click', sendMessageFunc);
document.getElementById("whoamiButton").addEventListener('click', whoamiFunc);
document.getElementById("logoutButton").addEventListener('click', logoutFunc);
document.getElementById("registerButton").addEventListener('click', RshowNextPage);
document.getElementById("loginButton").addEventListener('click', LoginFunc);
