const crypto = require('crypto');
const { User } = require('../../models');
const { baseUrl, sessionSecret } = require('../../config');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../../utils/mailer/');
const baseUrlClient = require('../../config').baseUrlClient;
const jwt = require('jsonwebtoken');


// User registration controller
exports.register = async (req, res) => {
  try {
    // Validate user input (e.g., check if email is unique)
    // Create a new user document and save it to the database
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(501).json({ message: 'Email Already registered' });
    }

    const newUser = new User({ ...req.body, isEmailVerified: false });

    // Generate a unique email verification hash
    const emailVerificationHash = crypto.randomBytes(32).toString('hex');
    newUser.emailVerificationHash = emailVerificationHash;

    // Send an email to the user with the verification link
    const verificationLink = `${baseUrl}/api/user/verify/${emailVerificationHash}`;
    if (await sendVerificationEmail(req.body.email, verificationLink)) {
      await newUser.save();
      res.status(200).json({ message: 'User registered successfully', user: newUser });
    } else {
      res.status(501).json({ message: 'Issue while sending verification email, please try again' });
    }

    // Respond with a success message or user data
  } catch (error) {
    // Handle errors (e.g., duplicate email, validation errors)
    res.status(400).json({ message: error.message });
  }
};


// add new user controller
exports.addNewUser = async (req, res) => {
  try {
    // Validate user input (e.g., check if email is unique)
    // Create a new user document and save it to the database
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(501).json({ message: 'Email Already registered' });
    }

    const newUser = new User({ ...req.body, isEmailVerified: true, password: '12345678' });

    await newUser.save();
    res.status(200).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    // Handle errors (e.g., duplicate email, validation errors)
    res.status(400).json({ message: error.message });
  }
};

// User login controller
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).json({ message: 'User does not exist' });

    const isPasswordValid = await user.comparePassword(req.body.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: 'Incorrect email or password' });

    // if (!user.isEmailVerified)
    //   return res.status(403).json({ message: 'Verify your email first to continue' })

    const token = jwt.sign({
      userId: user._id,
    }, sessionSecret, { expiresIn: '24h' }
    );

    req.session.token = token;

    res.status(200).json({ token: token, user: user, message: 'Login successful' });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { emailVerificationHash } = req.params;
    // Find the user by emailVerificationHash in the database
    const user = await User.findOne({ emailVerificationHash });

    if (!user) {
      return res.status(404).json({ message: 'Invalid verification link' });
    }

    // Mark the user as email verified (update the isEmailVerified field to true)
    user.isEmailVerified = true;
    user.emailVerificationHash = null; // Clear the hash since it's been used
    await user.save();

    return res.json({ message: 'Email verification successful, head back to login page' });
  } catch (error) {
    console.error('Email Verification Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: 'Error logging out' });
      } else {
        res.status(200).json({ message: 'Logged out successfully' });
      }
    },
    );
  } catch (err) {
    res.status(500).json({ message: 'Error destroying session' })
  }
};

// Define the resendVerificationEmail controller function
exports.resendVerificationEmail = async (req, res) => {
  try {
    // Retrieve the user's email from the request body
    const { email } = req.body;

    // Find the user in the database by email
    const user = await User.findOne({ email });


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isEmailVerified = false;

    // Generate a new email verification hash
    const emailVerificationHash = crypto.randomBytes(32).toString('hex');
    user.emailVerificationHash = emailVerificationHash;

    // Send the new verification email
    const verificationLink = `${baseUrl}/api/user/verify/${emailVerificationHash}`;
    // Call your email sending function here, passing in the verificationLink
    if (await sendVerificationEmail(email, verificationLink)) {
      await user.save();
      res.status(200).json({ message: 'Verification email resent successfully' });
    } else {
      res.status(501).json({ message: 'Issue while sending verification email' });
    }
  } catch (error) {
    // Handle errors (e.g., user not found, email sending issue)
    res.status(400).json({ message: error.message });
  }
};

exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = passwordResetToken;
    const passwordResetLink = `${baseUrlClient}/setNewPassword/${passwordResetToken}`;
    if (await sendPasswordResetEmail(email, passwordResetLink)) {
      await user.save();
      res.status(200).json({ message: 'Password reset email sent successfully' });
    } else {
      res.status(501).json({ message: 'Issue while sending password reset email' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { password, passwordResetToken } = req.body;
    if (!password || !passwordResetToken) {
      return res.status(400).json({ message: 'Password and password reset token are required' });
    }

    const user = await User.findOne({ passwordResetToken: passwordResetToken });

    if (!user) {
      return res.status(404).json({ message: 'Invalid password reset link' });
    }

    user.password = password;
    user.passwordResetToken = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.role) {
      user.role = req.body.role;
    }
    if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }
    if (req.body.bio) {
      user.bio = req.body.bio;
    }
    if(req.body.password){
      user.password = req.body.password;
    }
    await user.save();
    res.status(200).json({ user, message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ user: user, message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.bookAppointment = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const dr = await User.findById(req.body.doctorId);

    if (!dr) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.appointments) {
      user.appointments.push({ doctor: dr._id, date: req.body.date, time: req.body.time });
    }
    else {
      user.appointments = [{ doctor: dr._id, date: req.body.date,time: req.body.time }];
    }
    await user.save();

    if (dr.appointments) {
      dr.appointments.push({ patient: user._id, date: req.body.date,time: req.body.time });
    }
    else {
      dr.appointments = [{ patient: user._id, date: req.body.date ,time: req.body.time}];
    }
    await dr.save();

    res.status(200).json({ user, message: 'Appointment added successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
}