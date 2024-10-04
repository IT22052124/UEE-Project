import multer from 'multer';
import { v1 as uuidv1 } from 'uuid'; // Use import instead of require

const MiME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileupload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MiME_TYPE_MAP[file.mimetype];
      cb(null, uuidv1() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MiME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type'); // Log an error if invalid
    cb(error, isValid);
  }
});

// Exporting the fileupload variable
export default fileupload; // Use named export if needed
