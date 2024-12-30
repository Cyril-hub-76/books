const multer = require("multer");

const MIME_TYPES = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpeg",
    "image/png" : "png",
    "image/webp" : "webp"
}

const storage = multer.memoryStorage(); // Buffer using

const fileFilter = (req, file, ca) => {
    const extension = MIME_TYPES[file.mimetype];
    extension ? ca(null, true) : ca(new Error("Unsupported file type!!"), false);
    
}
module.exports = multer({ storage , fileFilter}).single("image");