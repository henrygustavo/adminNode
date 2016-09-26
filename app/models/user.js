var mongoose = require('mongoose');
var beautifyUnique = require('mongoose-beautiful-unique-validation');

var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');

//User Schema

var userSchema = new Schema({

    name: {
        type: String,
        lowercase: true,
        unique: "El nombre debe ser único",
        required: "El nombre es requerido"

    },
    email: {
        type: String,
        lowercase: true,
        unique: "El email debe ser único",
        required: "El email es requerido"

    },
    emailConfirmed: {
        type: Number,
        default: 0,
        required:"El email de confirmación es requerido"
    },
    password: {
        type: String,
        required: "El password es requerido",
        select: false
    },
    lockoutEndDateUtc: {
        type: Date
    },
    lockoutEnabled: {
        type: Number,
        default: 0,
        //required: true
    },
    accessFailedCount: {
        type: Number,
        default: 0,
        //required: true
    },
    creationDate: {
        type: Date,
        //required: "Fecha de creación requerido",
        default: Date.now
    },
    lastActivityDate: {
        type: Date,
        //required: "Última fecha de actividad es requerida",
        default: Date.now
    },
    disabled: {
        type: Number,
        default: 0,
        //required: true
    },
    role: {
        type: String,
        required: "El rol es requerido",
    }
});

userSchema.pre('save', function(next) {

    var user = this;

    //if the password not changed
    if (!user.isModified('password')) return next();

    //Generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {

        if (err) return next(err);

        //change the password to the hashed version
        user.password = hash;

        next();
    });
});

userSchema.methods.comparePassword = function(password) {

    var user = this;

    return bcrypt.compareSync(password, user.password);

}

// enables beautifying
userSchema.plugin(beautifyUnique);

module.exports = mongoose.model('User', userSchema);
