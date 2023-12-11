const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationHash: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'vendor', 'doctor'],
        default: 'user',
    },
    profilePicture: String,
    bio: String,
    passwordResetToken: String,
    appointments: [mongoose.Schema.Types.Mixed]

}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps to documents
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare a password with the hashed password stored in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;


