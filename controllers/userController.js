const User = require('../models/User')
const Job = require('../models/Job')
const Recruiter = require('../models/Recruiter')

const crypto = require('crypto');
const nodemailer = require('nodemailer')

// FOR ROOT '/' ENDPOINT
const getUsers = async(req, res, next) => {

    try {
        const users = await User.find();

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(users)

    } catch (err) {
        throw new Error (`Error retrieving all users: ${err.message}`);
    }
}

const postUser = async(req, res, next) => {

    try {

        const user = await User.create(req.body);

        sendTokenResponse(user, 201, res)
        
    } catch (err) {
        throw new Error(`Error creating a new user: ${err.message}`)
    }
    
}

const deleteUsers = async(req, res, next) => {
    
    try {
        await User.deleteMany();

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json ({ success: true, msg: 'Successfully deleted all users!!'})
        
    } catch (err) {
        throw new Error(`Error deleting all users: ${err.message}`)
    }

}

// FOR '/:userId' ENDPOINT

const getUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.userId);

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(user)
        
    } catch (err) {
        throw new Error(`Error retrieving user with ID ${req.params.userId}: ${err.message}`)
    }

}

const updateUser = async (req, res, next) => {

    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId, 
            {$set: req.body}, 
            {new: true}
        )

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(user)
        
    } catch (err) {
        throw new Error(`Error updating user with ID ${req.params.userId}: ${err.message}`)
    }

}

const deleteUser = async (req, res, next) => {

    try {
        await User.findByIdAndDelete(req.params.userId)

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({ success: true, msg: `Successfully deleted user with ID: ${req.params.userId}`})

        
    } catch (err) {
        throw new Error(`Error deleting user with ID ${req.params.userId}: ${err.message}`)
    }

}

// FOR '/login' ENDPOINT --------------------------------------------------------------------

const login = async (req, res, next) => {
    const {
        email,
        password
    } = req.body

    if (!email || !password) throw new Error('Please input your email and password')

    const user = await User.findOne({email}).select('+password')

    if(!user) throw new Error('Invalid credentials')

    const isMatch = await user.matchPassword(password);

    if(!isMatch) throw new Error('Credentials do not match!')

    sendTokenResponse(user, 200, res)
}

// FOR '/forgotPassword' ENDPOINT

const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if(!user) throw new Error('User not found!!')

    const resetToken = user.getResetPasswordToken();

    try {
        await user.save({ validateBeforeSave: false});

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true,
            msg: `Password has been reset with token: ${resetToken}` 
        })
        
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false});

        throw new Error('Failed to save reset password token')
        
    }
}

// FOR '/resetPassword' ENDPOINT
const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.query.resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) throw new Error('Invalid token!')

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    sendTokenResponse(user, 200, res)
}

// FOR '/updatePassword' ENDPOINT
const updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    const passwordMatches = await user.matchPassword(req.body.password)

    if(!passwordMatches) throw new Error('Password is incorrect');

    user.password = req.body.newPassword;

    await user.save()

    sendTokenResponse(user, 200, res)

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

const sendTokenResponse = (user, statusCode, res) => {

    // generates a jwt token 
    const token = user.getSignedJwtToken();
    
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

// ------------------------------------------ APPLY JOB

// SEARCH ALL JOBS POSTED
const searchJobs = async (req, res, next) => {

    try {       

        let jobs = await Job.find({isAvailable: true}).select(['-applicants']);

        const {
            sortJobTitle, sortByDate

        } = req.query

        const limit = req.query.limit
        
        if (sortJobTitle === '1'){
            jobs = await Job.find({isAvailable: true}).select(['-applicants']).sort({jobTitle: 1})

        } else if (sortJobTitle === '-1' || sortByDate === '-1'){
            jobs = await Job.find({isAvailable: true}).select(['-applicants']).sort({jobTitle: -1})

        } else if (sortByDate === '1'){
            jobs = await Job.find({isAvailable: true}).select(['-applicants']).sort({date: 1})

        } else if (sortByDate === '-1'){
            jobs = await Job.find({isAvailable: true}).select(['-applicants']).sort({date: -1})

        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(jobs)
        
    } catch (err) {
        throw new Error(`Error retrieving jobs: ${err.message}`)
    }
}

// APPLY A JOB
const applyJob = async (req, res, next) => {

    const emailTransporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'crrcompass@outlook.com',
            pass: 'compass@123'
        }
    });

    try {

        const applicant = await User.findById(req.params.userId)
        const apply = await Job.findById(req.query.jobId).populate('postedBy', ['companyName', 'email'])

        let findJob  = applicant.appliedJobs.find(findJob => (findJob._id).equals(req.query.jobId));

        if(!findJob){

            apply.applicants.push(applicant)
            applicant.appliedJobs.push(apply)

            await apply.save()
            await applicant.save()

            const result = await User.findById(req.params.userId).populate('appliedJobs', ['jobTitle', 'jobDescription', 'requirements', 'location', 'salary', 'jobType'])
            const recipientEmail = apply.postedBy

            const toRecruiterEmail = {
                from: 'crrcompass@outlook.com',
                to: recipientEmail,
                subject: 'New Job Application Received',
                text: `Dear ${recipientEmail.companyName},

                We are pleased to inform you that we have received a new job application for the ${apply.jobTitle} position.
                
                The applicant's information is as follows:
                
                Name: ${applicant.firstName} ${applicant.lastName}
                Email: ${applicant.email}
                Contact Number: ${applicant.contactNumber}
                                                
                Best regards,
                ${'Career Compass'}
                `
            }

            emailTransporter.sendMail(toRecruiterEmail, function(error, info){
                if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                }
            })

            res
            .status(201)
            .setHeader('Content-Type', 'application/json')
            .json(result)

        } else {
            res
            .json({success: false, msg: `You've already applied in this Job!!`})
        }


    } catch (err) {
       throw new Error(`Error applying a job: ${err.message}`) 
    }

}

// GET ALL THE JOBS A USER APPLIED
const getAppliedJobs = async (req, res, next) => {

    try {

        const applicant = await User.findById(req.params.userId).populate('appliedJobs', ['jobTitle', 'jobDescription', 'requirements', 'location', 'salary', 'jobType'])
        const result = applicant.appliedJobs
        
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(result)
        
    } catch (err) {
        throw new Error(`Error retrieving all the Jobs applied`)
    }
}

// DELETE A JOB APPLICATION
const deleteJobApplication = async (req, res, next) => {

    try {
        const applicant = await User.findById(req.params.userId)
        const job = await Job.findById(req.query.jobId)

        let findJob = applicant.appliedJobs.find(findJob => (findJob._id).equals(req.query.jobId));
        let findApplicant = job.applicants.find(findApplicant => (findApplicant._id).equals(req.params.userId));

        if(!findJob){
            findJob = { success: false, msg: `No job application found with ID: ${req.query.jobId}`}

        } else {
            const jobIndexPosition = applicant.appliedJobs.indexOf(findJob)
            applicant.appliedJobs.splice(jobIndexPosition, 1)
            findJob = { success: true, msg: `Succesfully deleted job application with ID: ${req.query.jobId}`}

            const applicantIndex = job.applicants.indexOf(findApplicant)
            job.applicants.splice(applicantIndex, 1)

            await job.save()
            await applicant.save()
        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(findJob)


    } catch (err) {
        throw new Error(`Error deleting job applicaation: ${err.message}`)
    }
}


module.exports = {
    getUsers,
    postUser,
    deleteUsers,
    getUser,
    updateUser,
    deleteUser,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout,
    searchJobs,
    applyJob,
    getAppliedJobs,
    deleteJobApplication
}
