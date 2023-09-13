const { default: mongoose, mongo } = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    password: String,
    phoneNumber: String,
    privacyPolicyAccept: Boolean,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
