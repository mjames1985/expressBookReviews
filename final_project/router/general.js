const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Save new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;   // retrieve ISBN from request
  const book = books[isbn];       // lookup in books object

  if (book) {
    res.send(JSON.stringify(book, null, 2));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);   // get all ISBN keys
  let results = [];

  keys.forEach((isbn) => {
    if (books[isbn].author === author) {
      results.push(books[isbn]);
    }
  });

  if (results.length > 0) {
    res.send(JSON.stringify(results, null, 2));
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const keys = Object.keys(books);
  let results = [];

  keys.forEach((isbn) => {
    if (books[isbn].title === title) {
      results.push(books[isbn]);
    }
  });

  if (results.length > 0) {
    res.send(JSON.stringify(results, null, 2));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    res.send(JSON.stringify(book.reviews, null, 2));
  } else {
    res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});

module.exports.general = public_users;
