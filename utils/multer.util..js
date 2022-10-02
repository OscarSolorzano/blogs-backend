const path = require('path');
const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const destPath = path.join(__dirname, '..', 'imgs');
//     cb(null, destPath);
//   },
//   filename: (req, file, cb) => {
//     console.log(file);

//     const [originalname, ext] = file.originalname.split('.');

//     const filename = `${originalname}-${Date.now()}.${ext}`;

//     cb(null, filename);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = { upload };
