const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Import promise functions
const {
    getAllBooks,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle
  } = require("./promisescript");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', async (req, res) => {
    try {
      const bookList = await getAllBooks();
      return res.status(200).json(bookList);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

  public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const book = await getBookByISBN(isbn);
      return res.status(200).json(book);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });

  public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
      const booksByAuthor = await getBooksByAuthor(author);
      return res.status(200).json(booksByAuthor);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });
  

  public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
      const booksByTitle = await getBooksByTitle(title);
      return res.status(200).json(booksByTitle);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });
  

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    if (Object.keys(reviews).length > 0) {
      return res.status(200).json(JSON.stringify(reviews, null, 2));
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;