const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcrypt');

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    }, 
    edad: {
        type: String,
        required: true,
    }, 
    email: { 
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date()
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);