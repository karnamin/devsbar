const express = require('express'); // importing express function
const router = express.Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');

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

// @route       request type: POST, endpoint - api/profile/
// @desc        Create or update user profile
// @access      Private
router.post(
    '/',
    [
        auth,
        [
            // check if inputs are sent
            body('status', 'Status is required').notEmpty(),
            body('skills', 'Skills is required').notEmpty(),
        ],
    ],
    async (req, res) => {
        // check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram,
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            // make skills into array
            profileFields.skills = skills
                .split(',')
                .map((skill) => skill.trim());
        }

        // Build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            // if existing user then just update
            let profile = await Profile.findOne({ user: req.user.id }); // find user by id

            if (profile) {
                // Update existing profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile);
            }

            // Create new Profile
            profile = new Profile(profileFields);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route       request type: GET, endpoint - api/profile/
// @desc        Get all user profile
// @access      Public
router.get('/', async (req, res) => {
    try {
        // get profiles and polulate with name and avatar
        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar',
        ]);
        res.json(profiles); // return all profiles
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route       request type: GET, endpoint - api/profile/user/:user_id
// @desc        Get profile by user ID
// @access      Public
router.get('/user/:user_id', async (req, res) => {
    try {
        // get profiles and polulate with name and avatar
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate('user', ['name', 'avatar']);

        // if profile doesn't exist
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile); // return profile
    } catch (error) {
        console.error(error.message);

        // check if error is profile not found or user error
        // need to do this as url takes in an ObjectId
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route       request type: DELETE, endpoint - api/profile/
// @desc        Delete profile, user and posts
// @access      Private
router.delete('/', auth, async (req, res) => {
    try {
        // @TODO - remove users posts

        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
