const express = require('express'); // importing express function
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs'); // import bcryptjs
const jwt = require('jsonwebtoken'); // importing JWT
const config = require('config'); // importing config JSON file
const { body, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route       GET api/auth
// @desc        Test route
// @access      Public
router.get('/', auth, async (req, res) => {
    try {
        // get user obj without password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   request type: POST, endpoint: api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
    '/',
    // Express validator
    [
        body('email', 'Please include a valid email').isEmail(), // check if email is a valid email
        // check if password exists
        body('password', 'Please is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req); // get all the errors if any
        // if errors, then send 400 response in json format
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructuring res.body to get name, email, password
        const { email, password } = req.body;

        try {
            //  See if user exists
            // based on if email of user exists
            let user = await User.findOne({ email });

            //  if user doesn't exist, then send error response
            if (!user) {
                // trying to keep error message format similar to array format above
                return res.status(400).json({
                    errors: [{ msg: 'Invalid credentials' }],
                });
            }

            // check if password matches
            const isMatch = await bcrypt.compare(password, user.password);
            //  if password doesn't match, then send error response
            if (!isMatch) {
                // trying to keep error message format similar to array format above
                return res.status(400).json({
                    // sending same response as above due to security concern (see above)
                    errors: [{ msg: 'Invalid credentials' }],
                });
            }

            // get payload which includes user id
            const payload = {
                user: {
                    id: user.id, // getting the id from MongoDB
                },
            };

            // sign token
            jwt.sign(
                payload, // pass in payload
                config.get('jwtSecret'), // pass in secret
                { expiresIn: 360000 }, // token expires in TODO: change to 3600 in prod
                (err, token) => {
                    if (err) throw err; // throw err if err
                    res.json({ token }); // else send token back to client
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error'); // response with error
        }
    }
);

module.exports = router;
