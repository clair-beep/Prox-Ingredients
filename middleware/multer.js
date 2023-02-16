const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(
        new Error(
          'File type is not supported, please upload JPG, JPEG or PNG format'
        ),
        false
      );
      return;
    }
    cb(null, true);
  }
});
