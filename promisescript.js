// promisescript.js
let books = require("./booksdb.js");

function getAllBooks() {
  return new Promise((resolve, reject) => {
    if (books && Object.keys(books).length > 0) {
      resolve(books);
    } else {
      reject(new Error("No books available"));
    }
  });
}

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Book not found"));
    }
  });
}

function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const matchingBooks = bookKeys
      .filter(isbn => books[isbn].author.toLowerCase() === author.toLowerCase())
      .map(isbn => ({ isbn, ...books[isbn] }));
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error("No books found by this author"));
    }
  });
}

function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const matchingBooks = bookKeys
      .filter(isbn => books[isbn].title.toLowerCase() === title.toLowerCase())
      .map(isbn => ({ isbn, ...books[isbn] }));
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error("No books found with this title"));
    }
  });
}

module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
};
