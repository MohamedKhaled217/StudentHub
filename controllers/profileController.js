const User = require('../models/User');


const GetProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        res.render('profile', { title: 'My Profile', profile: user, isOwner: true });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}

const GetEdit = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        res.render('edit-profile', { title: 'Edit Profile', user });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}

const EditProfile = async (req, res) => {
    try {
        const { bio, interests, phone, linkedin, github, portfolio, visibility } = req.body;

        const updateData = {
            bio,
            interests: interests ? interests.split(',').map(i => i.trim()).filter(i => i) : [],
            contactInfo: { phone, linkedin, github, portfolio },
            visibility
        };

        if (req.file) {
            updateData.profilePhoto = '/uploads/profiles/' + req.file.filename;
        }

        await User.findByIdAndUpdate(req.session.user._id, updateData);

        req.session.success_msg = 'Profile updated successfully!';
        res.redirect('/profile/me');
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Failed to update profile';
        res.redirect('/profile/edit');
    }
}

const AddSkill = async (req, res) => {
    try {
        const { name, level } = req.body;
        await User.findByIdAndUpdate(req.session.user._id, {
            $push: { skills: { name, level: parseInt(level) } } // push into skills array
        });
        req.session.success_msg = 'Skill added successfully!';
        res.redirect('/profile/edit');
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Failed to add skill';
        res.redirect('/profile/edit');
    }
}

const AddProject = async (req, res) => {
    try {
        const { name, description, githubLink, liveLink } = req.body;
        await User.findByIdAndUpdate(req.session.user._id, {
            $push: { projects: { name, description, githubLink, liveLink } }
        });
        req.session.success_msg = 'Project added successfully!';
        res.redirect('/profile/edit');
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Failed to add project';
        res.redirect('/profile/edit');
    }
}

const ProfileByUsername = async (req, res) => {
    try {
        const { userName } = req.params
        const user = await User.findOne({ username: userName });

        if (!user) {
            return res.status(404).render('404', { title: 'Profile Not Found' });
        }

        // Check visibility permissions
        if (user.visibility === 'private' && (!req.session.user || req.session.user.role !== 'admin')) {
            req.session.error_msg = 'This profile is private';
            return res.redirect('/');
        }

        if (user.visibility === 'university' && !req.session.user) {
            req.session.error_msg = 'Please login to view this profile';
            return res.redirect('/auth/login');
        }

        const isOwner = req.session.user && req.session.user._id.toString() === user._id.toString();

        res.render('profile', { title: user.name, profile: user, isOwner });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}

module.exports = {
    GetProfile,
    GetEdit,
    EditProfile,
    AddSkill,
    AddProject,
    ProfileByUsername
}