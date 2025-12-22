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
    return res.status(208).json({message: "Invalid username/password"});  
  }

  let accessToken = jwt.sign({
    data: password
  }, "access", {expiresIn: "2h"});

  req.session.authorization={accessToken, username};
  return res.status(200).json({message: "User logged in successfully"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    
    let isbn = req.params.isbn;
    let review = req.body.review;
    let user = req.session.authorization.username;
  
    if(!books[isbn]) {
        return res.status(404).json({message: `Could not find the book with ISBN: ${isbn}`});
    }
    
    if(books[isbn].reviews[user]) {
        msg="review updated";
    }else{
        msg="review added";
    }
    
    books[isbn].reviews[user]=review;
    return res.status(201).json({message: msg});
  
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let user = req.session.authorization.username;

    if(!books[isbn]) {
        return res.status(404).json({message: `Could not find the book with ISBN: ${isbn}`});
    }

    delete books[isbn].reviews[user];
    return res.status(201).json({message: `Review of user: ${user} removed from isbn: ${isbn} `});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
