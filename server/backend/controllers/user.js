const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer=require('nodemailer')
// Admin login function
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and is an admin
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized: Admin access only' });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch =await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for the admin user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // Use your environment variable for JWT secret
      { expiresIn: '1d' }
    );

    // Set the token in a cookie with HTTP-only flag to prevent client-side access
    res.cookie('token', token, {
      httpOnly: true, // Secure cookie that JavaScript cannot access
      secure: process.env.NODE_ENV === 'production', // Secure cookie in production (HTTPS)
      sameSite: 'strict', // Helps mitigate CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day)
    });

    // Return success message along with user info (without the token in the response body)
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get current logged-in user
const getCurrentUser = async (req, res) => {
    try {
      const token = req.cookies.token; // Get token from cookies
  
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find user by id
      const user = await User.findById(decoded.id).select('-password'); // Exclude password from returned data
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  const registerUser = async (req, res) => {
    const {  email, password, role } =
      req.body;
  
    try {
        
    
    // check if user already exists
    const userExists = await User.findOne({ email });
    console.log(userExists)
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
  
    // Create new user
    const user =new User(req.body);
   
    await user.save()
    
      // user.generateToken(res);
      res.status(201).json({ message: 'Account created successfuly' });
    } catch (error) {
        res.status(500).json({ message: 'Account not created' ,error});
    }
  };

  const Contact = async (req, res) => { 
    const { email, name, message } = req.body;
  
    const transporter = nodemailer.createTransport({
      host:"smtp.gmail.com",
      port:465,
      secure:true, 
      auth: {
        user: 'blandoshoes2024@gmail.com',
        pass: 'utwh ansd ehqk wxvg',
      }
    });
  
    var mailOptions = {
      from: email,
      to: "mnagga@gmail.com",
      subject: "message client",
      html:`
      <p>Client: ${name}</p>
      <p>email: ${email}</p>
      <p>message: ${message}</p>`,
    };
  
    const info = await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).send({message:error});
      } else {
        res.status(200).send({message:"succesfully"});
      }
    });
  };
  
  module.exports = { adminLogin, getCurrentUser,registerUser,Contact };