const Book = require("../models/Book");
const fs = require ("fs");
const path = require("path");
const sharp = require("sharp");


exports.addBook = (req, resp, next) => {

    const bookObject = JSON.parse(req.body.book);
    
    delete bookObject._id;
    delete bookObject._userId;

    const filename = `${Date.now()}-${req.file.originalname.split(" ").join("_").split(".")[0]}.webp`;
    const outputPath = path.join("images", filename);

    // Pics compression with sharp

    sharp(req.file.buffer)
    .resize(200)
    .toFormat("webp")
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(()=> {
        // book generating
        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${filename}`

        });
        book.save()
        .then(()=> resp.status(201).json({ messgae: "Book successfully added!"}))
        .catch(error => resp.status(400).json({error}))
    })
}

exports.updateBook = (req, resp, next) => {

    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;

    Book.findOne({_id: req.params.id})
    .then((book) => {
        if (book.userId != req.auth.userId) {

            return resp.status(401).json({message: "Unauthorized!!!"});
        }
        if (req.file) {
            
            const newFileName = `${Date.now()}-${req.file.originalname.split(" ").join("_").split(".")[0]}.webp`;
            const outputPath = path.join("images", newFileName);
            sharp(req.file.buffer)
            .resize(200)
            .toFormat("webp")
            .webp({ quality: 80 })
            .toFile(outputPath)
            .then(() => {
                const oldPic = book.imageUrl.split("/images/")[1];
                
                fs.unlink(`images/${oldPic}`, (error) => {
                    if (error) console.error("Failed to delete oldPic!!!", error)
                });
                
                bookObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${newFileName}`;

                updateBook(req.params.id, bookObject, resp);
            })
            .catch(error => resp.status(500).json({message: "Pic proccessing failed!!", error}))
        } else {
            updateBook(req.params.id, bookObject, resp);
        }
    })
    .catch(error => resp.status(400).json({error}));

    const updateBook = (id, bookObject, resp) => {
        Book.updateOne({ _id: id }, { ...bookObject, _id: id })
            .then(() => resp.status(200).json({ message: "Book successfully updated!" }))
            .catch((error) => resp.status(400).json({ error }));
    };
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