class UploadController {
  static async uploadProfilePicture(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      res.status(200).json({ success: true, message: 'Profile picture uploaded successfully', filePath: `/uploads/${req.file.filename}` });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async uploadTaskAttachment(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      res.status(200).json({ success: true, message: 'Task attachment uploaded successfully', filePath: `/uploads/${req.file.filename}` });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteFile(req, res) {
    try {
      res.status(200).json({ success: true, message: `File ${req.params.fileId} deleted successfully` });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = UploadController;
