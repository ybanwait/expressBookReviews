const express = require('express');
const axios = require("axios");
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

public_users.get('/all-books',function (req, res) {
    res.json(books);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let promiseBooks = new Promise((resolve, reject) =>{
    axios.get('http://localhost:5000/all-books')
    .then(response=>resolve(response.data))
    .catch(error=>reject(error));

  });

  promiseBooks.then(data => res.status(200).json(data))
  .catch(error => res.status(500).json({message: "Error in getting books", error: error.message}));
});

public_users.get('/books-by-isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if(!books[isbn]) {
        res.status(404).json({message: `Could not find the book with ISBN: ${isbn}`});
    }else{
        res.json(books[isbn]);
    }    
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let promiseBooks = new Promise((resolve, reject) =>{
        axios.get(`http://localhost:5000/books-by-isbn/${req.params.isbn}`)
        .then(response=>resolve(response.data))
        .catch(error=>reject(error));
        
    });  

    promiseBooks.then(data => res.status(200).json(data))
  .catch(error => res.status(500).json({message: "Error in getting books by isbn", error: error.message}));
  
});

public_users.get('/books-by-author/:author',function (req, res) {
    const author = decodeURIComponent(req.params.author);
    let booksbyauthor = Object.values(books).filter((book) => { return book.author == author;});
    
    if(booksbyauthor.length===0){
        res.status(404).json({message: `No book found written by:${author}`});
    }else{
        res.json(booksbyauthor);
    }    
    
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    //Write your code here
    let promiseBooks = new Promise((resolve, reject) =>{
        axios.get(`http://localhost:5000/books-by-author/${req.params.author}`)
        .then(response=>resolve(response.data))
        .catch(error=>reject(error));
    });     

    promiseBooks.then(data => res.status(200).json(data))
  .catch(error => res.status(500).json({message: "Error in getting books by author", error: error.message}));
});


public_users.get('/book-by-title/:title',function (req, res) {
    let title = req.params.title;
    let booksbytitle = Object.values(books).filter((book) => { return book.title == title;});

    if(booksbytitle.length===0){
        res.status(404).json({message: "No book found by this title"});
    }else{
        res.json(booksbytitle);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
    //Write your code here
    
    let promiseBooks = new Promise((resolve, reject) =>{
        axios.get(`http://localhost:5000/book-by-title/${req.params.title}`)
        .then(response=>resolve(response.data))
        .catch(error=>reject(error));
    });     
    
    promiseBooks.then(data => res.status(200).json(data))
      .catch(error => res.status(500).json({message: "Error in getting book by title", error: error.message}));        

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
