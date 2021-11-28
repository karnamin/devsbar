const express = require('express'); // importing express function
const router = express.Router();
const auth = require('../../middleware/auth');

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
        res.staus(500).send('Server Error');
    }
});

module.exports = router;
