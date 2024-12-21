const express = require("express");

const mongoose = require("mongoose");

const userRoutes = require("./routes/user");

// api connection to database
mongoose.connect("mongodb+srv://mongoUser:iysWCCum0vEh2LTB@cluster0.xvtfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", 
    { useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => console.log("Connected to database! "))
    .catch(() => console.log("Connexction to database failed !"));

// app creation
const app = express();
// allow access to POST request body
app.use(express.json());

app.use((req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use("/api/books", (req, resp, next)=>{
    const book = [
        {
            id: "1",
            userId: "idCkfd1000BMgDb2024",
            title: "Germinal",
            author: "Émile Zola",
            imageUrl: "https://cdn.pixabay.com/photo/2015/11/05/18/59/book-cover-1024644_1280.jpg",
            year: 1885,
            genre: "Roman",
            ratings: [
                {
                    userId: "idCkfd1000BMgDb2024",
                    grade: 3
                }
            ],
            averageRating: 4
        },
        {
            id: "2",
            userId: "idCkfd1001BMgDb2024",
            title: "Charlie et la chocolaterie",
            author: "Rohald Dahl",
            imageUrl: "https://cdn.pixabay.com/photo/2015/11/05/18/59/book-cover-1024644_1280.jpg",
            year: 1964,
            genre: "Fiction",
            ratings: [
                {
                    userId: "idCkfd1001BMgDb2024",
                    grade: 4
                }
            ],
            averageRating: 5
        }
    ];
    resp.status(200).json(book);
    next();
})
app.use("/api/auth", userRoutes);
module.exports = app;