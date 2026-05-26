const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');

class AuthController {
  static getSignedJwtToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '30d',
    });
  }

  static async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const verificationToken = crypto.randomBytes(20).toString('hex');

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        verificationToken,
      });

      const verifyUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
      const message = `Please verify your email by clicking: \n\n ${verifyUrl}`;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Email Verification',
          message,
        });
        res.status(200).json({ success: true, message: 'Verification email sent' });
      } catch (err) {
        user.verificationToken = undefined;
        await user.save();
        res.status(500).json({ success: false, message: 'Email could not be sent' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const user = await User.findOne({ verificationToken: req.params.token });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid token' });
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
      res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // validation check
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // email verify na korle login korte dibo na
      if (!user.isVerified) {
        return res.status(401).json({ success: false, message: 'Please verify your email first' });
      }

      const token = AuthController.getSignedJwtToken(user._id);
      // res.cookie('token', token, { httpOnly: true }); // pore cookie te pathabo bhabchi
      res.status(200).json({ success: true, token });
    } catch (error) {
      console.log('Login error:', error);
      res.status(500).json({ success: false, message: 'Login e somossa hocche' });
    }
  }

  static logout(req, res) {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  static async forgotPassword(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'There is no user with that email' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
      await user.save();

      const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
      const message = `You are receiving this email because you requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Password Reset Token',
          message,
        });
        res.status(200).json({ success: true, message: 'Email sent' });
      } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(500).json({ success: false, message: 'Email could not be sent' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid token' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      const token = AuthController.getSignedJwtToken(user._id);
      res.status(200).json({ success: true, token });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AuthController;
