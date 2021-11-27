const express = require('express'); // importing express function
const router = express.Router(); // importing express router
const gravatar = require('gravatar'); // importing gravatar
const bcrypt = require('bcryptjs'); // import bcryptjs

// importing express validator for checking request parameters
// before sending data to user model/database to create user
const { body, validationResult } = require('express-validator');

// Importing User Model
const User = require('../../models/User');

// @route       POST api/users
// @desc        Register user
// @access      Public
router.post(
    '/',
    // Express validator
    [
        body('name', 'Name is required').notEmpty(), // check if name is not empty
        body('email', 'Please include a valid email').isEmail(), // check if email is a valid email
        // check if password is more than 6 characters
        body(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req); // get all the errors if any
        // if errors, then send 400 response in json format
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructuring res.body to get name, email, password
        const { name, email, password } = req.body;

        try {
            //  See if user exists
            // based on if email of user exists
            let user = await User.findOne({ email });

            //  if user exists, then send error response
            if (user) {
                // trying to keep error message format similar to array format above
                return res.status(400).json({
                    errors: [{ msg: 'User already exists' }],
                });
            }

            // Get users gravatar
            // based on users email
            const avatar = gravatar.url(email, {
                s: '200', // size
                r: 'pg', // no adult images
                d: 'mm', // default image
            });

            // create instance of new User
            user = new User({
                name,
                email,
                avatar,
                password,
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10); // create salt, higher genSalt = more secure but slower

            user.password = await bcrypt.hash(password, salt); // hashing password

            await user.save(); // save user to Database

            // Return jsonwebtoken (log in user as soon as registered)
            res.send('User registered');
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error'); // response with error
        }
    }
);

module.exports = router;
