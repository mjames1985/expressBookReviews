const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });

  // Save token in session
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) return res.status(403).json({ message: "Login required" });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!review) return res.status(400).json({ message: "Review text required" });

  // Add or update review for this user
  books[isbn].reviews[username] = review;

  res.json({ message: "Review saved", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) return res.status(403).json({ message: "Login required" });
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
    }
  
    // Delete only this user's review
    delete books[isbn].reviews[username];
  
    res.json({ message: "Review deleted", reviews: books[isbn].reviews });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
