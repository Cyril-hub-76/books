const { error } = require("console");
const Book = require("../models/Book");
const fs = require ("fs");
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

    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;

    Book.findOne({_id: req.params.id})
    .then((book) => {
        book.userId != req.auth.userId ? resp.status(401).json({message : "unauthorized !!!"}) : Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
        .then(() => resp.status(200).json({message: "book successfully updated !"}))
        .catch(error => resp.status(401).json({error}))
    })
    .catch(error => resp.status(400).json({error}))
 };

exports.deleteBook = (req,resp,next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.userId != req.auth.userId) {
            resp.status(401).json({message: "unauthorized!!!"})
        } else {
            const filename = book.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                .then(() => resp.status(200).json({ message: "Book successfully deleted !!!"}))
                .catch(error => resp.status(401).json({error}))
            })
        }
    })
    .catch(error => resp.status(500).json({error}))
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