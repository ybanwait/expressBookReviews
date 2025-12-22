const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  
  if(!username || !password){
    return res.status(400).json({message: "username or password is missing"});
  }

  if(isValid(username)){
    return res.status(409).json({message: "user with this username already exist"});  
  }

  users.push({"username":username, "password":password});
  
  return res.status(201).json({message: "User has been registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let promiseBooks = new Promise((resolve, reject) =>{
    setTimeout(() => {
        resolve(JSON.stringify(books,null,4));
      },6000);
  });

  promiseBooks.then((message) => {
    return res.send(message);
  });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let promiseBooks = new Promise((resolve, reject) =>{
        let isbn = req.params.isbn;
        
        if(!books[isbn]) {
            reject(res.status(404).json({message: `Could not find the book with ISBN: ${isbn}`}));
        }else{
            resolve(JSON.stringify(books[isbn]));
        }    
    });  

    promiseBooks.then((message) => {
        return res.send(message);
    });
  
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let promiseBooks = new Promise((resolve, reject) =>{
        let author = req.params.author;
        let booksbyauthor = Object.values(books).filter((book) => { return book.author == author;});
        
        if(booksbyauthor.length===0){
            reject(res.status(404).json({message: "No book found"}));
        }else{
            resolve(JSON.stringify(booksbyauthor));
        }
    });     

    promiseBooks.then((message) => {
        return res.send(message);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let promiseBooks = new Promise((resolve, reject) =>{
        let title = req.params.title;
        let booksbytitle = Object.values(books).filter((book) => { return book.title == title;});

        if(booksbytitle.length===0){
            reject(res.status(404).json({message: "No book found by this title"}));
        }else{
            resolve(JSON.stringify(booksbytitle));
        }
    });

    promiseBooks.then((message) => {
        return res.send(message);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if(!books[isbn]) {
    return res.status(404).json({message: `Could not find the book with ISBN: ${isbn}`});
  }  

  return res.send(JSON.stringify(books[isbn].reviews))
  
});

module.exports.general = public_users;
