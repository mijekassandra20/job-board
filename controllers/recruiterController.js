// const Recruiter = require('../models/Recruiter')
const RecruiterJob = require('../models/RecruiterJob')
const crypto = require('crypto')

// FOR ROOT '/' ENDPOINT
const getRecruiters = async(req, res, next) => {

    const filter = {}; // filters to returns only selected fields eg. userName, gender
    const options = {}; // sorting, pagination , limit 20 data to come back, sorting by asc userName


    if (Object.keys(req.query).length){
        const { 
            userName,
            firstName,
            lastName,
            email,
            gender,
            limit, 
            sortByFirstName 
        } = req.query

        if (userName) filter.userName = true
        if (firstName) filter.firstName = true
        if (lastName) filter.lastName = true
        if (email) filter.email = true
        if (gender) filter.gender = true
        
        if (limit) options.limit  = limit;
        if (sortByFirstName) options.sort = {
            user: sortByFirstName === 'asc'? 1 : -1
        }     
    }

    try {
        const recruiters = await Recruiter.find({}, filter, options);

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(recruiters)

    } catch (err) {
        throw new Error (`Error retrieving all recruiters: ${err.message}`);
    }
}

const postRecruiter = async(req, res, next) => {

    try {

        const recruiter = await Recruiter.create(req.body);

        sendTokenResponse(recruiter, 201, res)
        
    } catch (err) {
        throw new Error(`Error creating a new recruiter: ${err.message}`)
    }
    
}

const deleteRecruiters = async(req, res, next) => {
    
    try {
        await Recruiter.deleteMany();

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json ({ success: true, msg: 'Successfully deleted all recruiters!!'})
        
    } catch (err) {
        throw new Error(`Error deleting all recruiters: ${err.message}`)
    }

}

// FOR '/:recruiterId' ENDPOINT

const getRecruiter = async (req, res, next) => {

    try {
        const recruiter = await Recruiter.findById(req.params.recruiterId);

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(recruiter)
        
    } catch (err) {
        throw new Error(`Error retrieving recruiter with ID ${req.params.recruiterId}: ${err.message}`)
    }

}

const updateRecruiter = async (req, res, next) => {

    try {
        const recruiter = await Recruiter.findByIdAndUpdate(
            req.params.recruiterId, 
            {$set: req.body}, 
            {new: true}
        )

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(recruiter)
        
    } catch (err) {
        throw new Error(`Error updating recruiter with ID ${req.params.recruiterId}: ${err.message}`)
    }

}

const deleteRecruiter = async (req, res, next) => {

    try {
        await Recruiter.findByIdAndDelete(req.params.recruiterId)

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({ success: true, msg: `Successfully deleted recruiter with ID: ${req.params.recruiterId}`})

        
    } catch (err) {
        throw new Error(`Error deleting recruiter with ID ${req.params.recruiterId}: ${err.message}`)
    }

}

// FOR '/login' ENDPOINT --------------------------------------------------------------------

const login = async (req, res, next) => {
    const {
        email,
        password
    } = req.body

    if (!email || !password) throw new Error('Please input your email and password')

    const recruiter = await Recruiter.findOne({email}).select('+password')

    if(!recruiter) throw new Error('Invalid credentials')

    const isMatch = await recruiter.matchPassword(password);

    if(!isMatch) throw new Error('Credentials do not match!')

    sendTokenResponse(recruiter, 200, res)
}

// FOR '/forgotPassword' ENDPOINT

const forgotPassword = async (req, res, next) => {
    const recruiter = await Recruiter.findOne({ email: req.body.email })

    if(!recruiter) throw new Error('Recruiter not found!!')

    const resetToken = recruiter.getResetPasswordToken();

    try {
        await recruiter.save({ validateBeforeSave: false});

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true,
            msg: `Password has been reset with token: ${resetToken}` 
        })
        
    } catch (err) {
        recruiter.resetPasswordToken = undefined;
        recruiter.resetPasswordExpire = undefined;

        await recruiter.save({ validateBeforeSave: false});

        throw new Error('Failed to save reset password token')
        
    }
}

// FOR '/resetPassword' ENDPOINT
const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.query.resetToken).digest('hex');

    const recruiter = await Recruiter.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!recruiter) throw new Error('Invalid token!')

    recruiter.password = req.body.password;
    recruiter.resetPasswordToken = undefined;
    recruiter.resetPasswordExpire = undefined;

    await recruiter.save()

    sendTokenResponse(recruiter, 200, res)
}

// FOR '/updatePassword' ENDPOINT
const updatePassword = async (req, res, next) => {

    const {
        email
    } = req.body

    const recruiter = await Recruiter.findOne({email}).select('+password')

    const passwordMatches = await recruiter.matchPassword(req.body.password)

    if(!passwordMatches) throw new Error('Password is incorrect');

    recruiter.password = req.body.newPassword;

    await recruiter.save()

    sendTokenResponse(recruiter, 200, res)

}

// FOR '/logout' ENDPOINT
const logout = async (req, res, next) => {

    res
    .status(200)
    .cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
        
    })

    .json({ success: true, msg: 'Successfully logged out!'})
    
}

const sendTokenResponse = (recruiter, statusCode, res) => {

    // generates a jwt token 
    const token = recruiter.getSignedJwtToken();
    
    const options = {
        // set expiration for cookie to be ~2 hrs
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true // security to hide/encrypt payload
    }

    if (process.env.NODE_ENV === 'production') options.secure = true;

    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({success: true, token})

}

// -------------------------------------------

const postJobs = async (req, res, next) => {
    
}

module.exports = {
    getRecruiters,
    postRecruiter,
    deleteRecruiters,
    getRecruiter,
    updateRecruiter,
    deleteRecruiter,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout
}


