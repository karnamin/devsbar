const express = require('express'); // importing express function
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route       request type: GET, endpoint - api/profile/me
// @desc        Get current user's profile
// @access      Private
router.get('/me', auth, async (req, res) => {
    try {
        // get user based on id and get name and avatar of user
        const profile = await await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'avatar']); // get name and avatar of user

        // if profile doesn't exist:
        if (!profile) {
            return res
                .status(400)
                .json({ msg: 'There is no profile for this user' });
        }

        // send profile in response
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.send(500).send('Server Error');
    }
});

module.exports = router;
