const express = require("express");

const mongoose = require("mongoose");

const bookRoutes = require("./routes/book");

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
    
const path = require("path");
app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;