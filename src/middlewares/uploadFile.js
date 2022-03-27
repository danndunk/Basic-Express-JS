const multer = require("multer");
exports.uploadFile = (bookFile, coverBook) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });
  const fileFilter = function (req, file, cb) {
    if (file.fieldname === bookFile) {
      if (!file.originalname.match(/\.(epub|EPUB)$/)) {
        req.fileValidationError = { message: "Please check your file type!" };
        return cb(new Error("Please check your file type!"), false);
      }
    }
    if (file.fieldname === coverBook) {
      if (!file.originalname.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG)$/)) {
        req.fileValidationError = { message: "Please check your file type!" };
        return cb(new Error("Please check your file type!"), false);
      }
    }
    cb(null, true);
  };
  const upload = multer({ storage, fileFilter }).fields([
    { name: bookFile },
    { name: coverBook },
  ]);
  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(200).send(req.fileValidationError);
      }
      if (!req.files.bookFile && !err) {
        return res
          .status(200)
          .send({ message: "Please select file to upload" });
      }
      if (!req.files.bookCover && !err) {
        return res
          .status(200)
          .send({ message: "Please select cover to upload" });
      }
      return next();
    });
  };
};
