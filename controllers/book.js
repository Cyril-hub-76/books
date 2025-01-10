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
    .catch(error => resp.status(500).json({message: "Book proccessing failed!!", error}))
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

            return resp.status(403).json({message: "Unauthorized request!!!"});
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
    .catch(error => resp.status(404).json({message: "Resource could not be found", error}));

    const updateBook = (id, bookObject, resp) => {
        Book.updateOne({ _id: id }, { ...bookObject, _id: id })
            .then(() => resp.status(200).json({ message: "Book successfully updated!" }))
            .catch((error) => resp.status(400).json({ error }));
    };
 };

exports.rating = (req, resp, next) => {

    delete req.body._id;

    const rating = req.body.rating;

    if(rating < 0 || rating > 5){
        return resp.status(404).json({messge: "Rating is out of range!!"});
    }

    Book.findOne({_id: req.params.id})
    .then((book) => {

        const valid = req.auth;
        if(!valid) {
            return (error => resp.status(401).json({error}));
        }
        const rateVerificator = book.ratings.find((rating) => rating.userId === req.auth.userId )

        if(rateVerificator) {
            return resp.status(403).json({messge: "This user allready rated this book!!"});
        }
        const updatedRating = {
            userId: req.auth.userId,
            grade: req.body.rating
        };

        book.ratings.push(updatedRating);
        const allGrades = book.ratings.map((rating) => rating.grade);

        book.averageRating = allGrades.length > 0
        ? parseFloat(allGrades.reduce((acc, grade) => acc + grade, 0) / allGrades.length).toFixed(1)
        : 0;
        
        Book.updateOne({ _id: req.params.id}, { ratings: book.ratings, averageRating: book.averageRating})
        .then(()=> resp.status(200).json(book))
        .catch(error => resp.status(400).json({error}))
    })
    .catch(error => resp.status(500).json({ message: "Internal server error", error}))
};

exports.deleteBook = (req,resp,next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.userId != req.auth.userId) {
            resp.status(403).json({message: "unauthorized!!!"})
        } else {
            const filename = book.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                .then(() => resp.status(200).json({ message: "Book successfully deleted !!!"}))
                .catch(error => resp.status(404).json({message: "Book not found!" ,error}))
            })
        }
    })
    .catch(error => resp.status(500).json({error}))
};

exports.selectBook = (req,resp,next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => resp.status(200).json(book))
    .catch(error => resp.status(400).json({ error}))
};

exports.getAllBooks = (req, resp, next) => {
    Book.find()
    .then(books => resp.status(200).json( books ))
    .catch(error => resp.status(400).json({ error }))
};

exports.getBestRating = (req, resp, next) => {
    Book.find()
    .sort({averageRating: -1}).limit(3)
    .then((books) => resp.status(200).json(books))
    .catch(error => resp.status(400).json({error}))
};