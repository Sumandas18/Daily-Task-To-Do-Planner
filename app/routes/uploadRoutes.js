const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const UploadController = require('../controllers/uploadController');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

router.use(protect);

router.post('/profile-picture', upload.single('image'), UploadController.uploadProfilePicture);
router.post('/task-attachment', upload.single('attachment'), UploadController.uploadTaskAttachment);
router.delete('/:fileId', UploadController.deleteFile);

module.exports = router;
