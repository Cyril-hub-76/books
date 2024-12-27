const Book = require("../models/Book");

exports.addBook = (req, resp, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    book.save()
    .then(() => resp.status(201).json({message: "Picture successfully uploaded"}))
    .catch(error => resp.status(400).json({error}))
};


exports.updateBook = (req, resp, next) => {
    Book.updateOne({_id: req.params.id}, {...resp.body, _id: req.params.id})
    .then(() => resp.status(200).json({ message : "Book successfully updated"}))
    .catch(error => resp.status(400).json({ error })) 
 };

exports.deleteBook = (req,resp,next) => {
    Book.deleteOne({_id: req.params.id})
    .then(() => resp.status(200).json({ message : "Book successfully deleted"}))
    .catch(error => resp.status(400).json({ error }))
};

exports.selectBook = (req,resp,next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => resp.status(200).json(book))
    .catch(error => resp.status(404).json({ message : "Book not found !"}))
};

exports.getAllBooks = (req, resp, next) => {
    Book.find()
    .then(books => resp.status(200).json( books ))
    .catch(error => resp.status(400).json({ error }))
};