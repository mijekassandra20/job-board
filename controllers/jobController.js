const Job = require('../models/Job');
const Recruiter = require('../models/Recruiter')

const nodemailer = require('nodemailer')

// GET ALL JOBS 
const getJobs = async(req, res, next) => {

    try {

        const job = await Job.find(); 

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(job)
        
    } catch (err) {
        throw new Error(`Error retrieving all jobs: ${err.message}`)
    }
}

//  POST A JOB
const postJob = async (req, res, next) => {

    try {

        const job = await Job.create(req.body)

        res
        .status(201)
        .setHeader('Content-Type', 'application/json')
        .json(job)
        
    } catch (err) {
        throw new Error(`Error posting new job: ${err.message}`)
    }
}

// GET ALL JOBS UNDER A RECRUITER
const getRecruiterJobs = async (req, res, next) => {
    try {
        const recruiter = await Recruiter.findById(req.params.recruiterId);
        const getJobs = await Job.find({ postedBy: recruiter})

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(getJobs)

        
    } catch (err) {
        throw new Error(`Error retrieving all jobs of Recruiter ${recruiterId}: ${err.message}`)
    }
}


// GET A SPECIFIC JOB BY ID OF RECRUITER
const getJob = async (req, res, next) => {

    try {
        const job = await Job.findById(req.params.jobId)

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(job)

    } catch (err){
        throw new Error(`Error retrieving a job with ID: ${req.params.jobId}: ${err.message}`)
    }
}

// UPDATE A SPECIFIC JOB BY ID
const updateJob = async (req, res, next) => {

    try {
        
        const job = await Job.findByIdAndUpdate(req.params.jobId,
            {$set: req.body}, {new: true})

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(job)

    } catch (err) {
        throw new Error(`Error updating job with ID: ${req.params.jobId}: ${err.message}`)
    }
}


// DELETE SPECIFIC JOB BY ID OF A RECRUITER
const deleteJob = async (req, res, next) => {

    try {

        const findJob = await Job.findById(req.params.jobId)

        if (!findJob){
            res
            .status(404)
            .setHeader('Content-Type', 'application/json')
            .json({ success: false, msg: `Job with ID: $${req.params.jobId} does not exist!!`})
            
        } else {
            const job = await Job.findByIdAndDelete(req.params.jobId)

            res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .json({ success: true, msg: `Job with ID: $${req.params.jobId} was successfully deleted!!`})
        }
        

    } catch (err) {
        throw new Error(`Error deleting job with ID: ${req.params.jobId}: ${err.message}`)
    }
    
}

const getApplicants = async (req,res, next) => {

    try {
        
        const findJob = await Job.findById(req.params.jobId).populate('applicants', ['userName','firstName','lastName','email'])
        const result = findJob.applicants

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(result)


    } catch (err) {
        throw new Error(`Error retrieving applicants of jobs: ${req.params.jobId}: ${err.message}`)
    }
}

const sendApplicantEmail = async (req, res, next) => {

    const emailTransporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'crrcompass@outlook.com',
            pass: 'compass@123'
        }
    });

    try {
        const getJob = await Job.findById(req.params.jobId)
        .populate('applicants', ['userName','firstName','lastName','email'])
        .populate('postedBy', ['companyName', 'email'])

        let findApplicant  = getJob.applicants.find(findApplicant => (findApplicant._id).equals(req.query.applicantId));

        const toApplicantEmail = {
            from: 'crrcompass@outlook.com',
            to: findApplicant.email,
            subject: 'Job Application Status',
            html: 
            `<h2> Dear ${findApplicant.firstName} ${findApplicant.lastName},</h2> 

            <p> Thank you for submitting your application for the ${getJob.jobTitle} at ${getJob.postedBy.companyName}. We are pleased to inform you that your application has been reviewed and shortlisted by the ${getJob.postedBy.companyName} for further consideration.</p>

            <p> The company is currently in the process of reviewing all of the applications received and will be in touch with you as soon as a decision has been made regarding your application. Please be patient as this process may take some time. </p>

            </p> In the meantime, if you have any further questions or would like to follow up on the status of your application, you may reach out the Employer: </p>
            
            <p> Company Name: ${getJob.postedBy.companyName} <br>
            Email: ${getJob.postedBy.email} </p>

            <p> Good luck! </p>
                                            
            Best regards, <br>
            <b> ${'Career Compass'}     
            
            `
        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(`Successfully sent an email to the applicant: ${findApplicant.firstName} ${findApplicant.lastName}`)

    } catch (err) {
        throw new Error(`Error sending an email to Applicant: ${err.message}`)
    }
}

module.exports = {
    getJobs,
    postJob,
    getRecruiterJobs,
    getJob,
    updateJob,
    deleteJob,
    getApplicants,
    sendApplicantEmail
}