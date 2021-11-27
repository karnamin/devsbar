const express = require('express'); // importing express function
const router = express.Router();
const { body, validationResult } = require('express-validator');

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
    (req, res) => {
        const errors = validationResult(req); // get all the errors if any
        // if errors, then send 400 response in json format
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.send('User route');
    }
);

module.exports = router;
