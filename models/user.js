const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    }
});

// plugin must be a FUNCTION
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
