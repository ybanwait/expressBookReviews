const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user_exist=users.filter((user) => { return user.username === username; });

    if(user_exist.length > 0){
        return true;
    }

    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    
    let useracc = users.filter((user) => { return user.username === username && user.password === password; });

    if(useracc.length > 0){

        return true;
    }

    return false;

}   

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  
  if(!username || !password){
    return res.status(400).json({message: "username or password is missing"});
  }
  
  if(!authenticatedUser(username, password)){
    return res.send(JSON.stringify(users));
    //return res.status(208).json({message: "Invalid username/password"});  
  }

  let accessToken = jwt.sign({
    data: password
  }, "access", {expiresIn: 60 * 60});

  req.session.authorization={accessToken, username};


  return res.status(200).json({message: "User logged in successfully"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
