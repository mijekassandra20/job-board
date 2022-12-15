const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema;

const JobSchema = new Schema ({
    jobTitle: {
        type: String,
        required: [true, 'Please input a job title!!']
    },

    jobDescription: {
        type: String,
        required: [true, 'Please input a job description!!']
    },

    requirements: {
        type: [String],
        require: [true, 'Please input the requirements!!']
    },

    location: {
        type: String,
        required: [true, 'Please input a job location!!']
    },

    salary: {
        type: Number,
        required: [true, 'Please input a salary!!'],
        validate: (salary) => {
            return typeof salary === 'number'
        }
    },
    
    jobType: {
        type: String,
        required: [true, 'Please input the job type!!'],
        enum: [
            'Full-time',
            'Part-time',
            'Contractual',
            'Internship'
        ]
    },

    isAvailable: {
        type: Boolean,
        default: true
    },
    
    date: {
        type: Date,
        default: Date.now
    }
})

const RecruiterSchema = new Schema ({
    companyName: {
        type: String,
        unique: true,
        required: [true, 'Please input a company name!!'],
    },

    companyDescription: {
        type: String,
        required: [true, 'Please input your company description!!']
    }, 

    address: {
        type: String,
        required: [true, 'Please input your company address!!']
    },

    email: {
        type: String,
        required: [true, 'Please input an email!!'],
        unique: true,
        validate: (email) => {
            return validator.isEmail(email);
        }
    },

    password: {
        type: String,
        required: [true, 'Please input a password!!'],
        validate: (password) => {
            return validator.isStrongPassword(password);
        }
    },

    jobPosting: [JobSchema],
    
    isRecruiter: {
        type: Boolean,
        default: true
    },

    resetPasswordToken: {
        type: String
    },

    resestPasswordExpire: {
        type: Date
    }
    
},{
    timestamps: true
})

// bcrypt - pre hook the hashes the password before saving in the database
RecruiterSchema.pre('save', async function(next) {

    // first check if password is not modified
    if (!this.isModified('password')) next(); // login

    // complexity and the length of your string of your hash password
    const salt = await bcrypt.genSalt(10) 
    this.password = await bcrypt.hash(this.password, salt) // resetPassword, create new pass, update pass
})

// retrieve the signed JWT token when user logs in OR creates new account!
RecruiterSchema.methods.getSignedJwtToken = function() {
    return jwt.sign( 
        {id: this._id}, 
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE}
    )
}

// to match password for login
RecruiterSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// reset the password token
RecruiterSchema.methods.getResetPasswordToken = function() {
    // create a hex token with size of 20
    const resetToken = crypto.randomBytes(20).toString('hex')

    // create hash to increase security for the reset token and tell if that came from hex format
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // set expiration for resetting the password for 1 hr

    return resetToken;
}

module.exports = mongoose.model('Recruiter', RecruiterSchema)