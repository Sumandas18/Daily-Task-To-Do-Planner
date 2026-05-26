const User = require('../models/User');

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      // jodi user na thake tahole pore error handling add korte hobe
      if(!user) {
        return res.status(404).json({ success: false, message: 'User paowa jayni' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.log('Profile fetch error:', error);
      res.status(500).json({ success: false, message: 'Server e ki ekta somosya hocche' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, email, profilePicture } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, email, profilePicture },
        { new: true, runValidators: true }
      ).select('-password');
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteProfile(req, res) {
    try {
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = UserController;
