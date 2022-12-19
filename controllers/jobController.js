const Job = require('../models/Job');
const Recruiter = require('../models/Recruiter')

// This is a test

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

        const recruiter = await Recruiter.findById(req.params.recruiterId)

        const job = await Job.create(req.body)

        res
        .status(201)
        .setHeader('Content-Type', 'application/json')
        .json(job)
        
    } catch (err) {
        throw new Error(`Error posting new job: ${err.message}`)
    }
}

// const deleteJobs = async (req, res, next) => {

//     try {

//         const recruiters = await Recruiter.find(); 

//         let jobs = recruiters.map(recruiter => recruiter.jobPosting).flat()

//         jobs = []

//         console.log(jobs)

//         // await jobs.save()

//         res
//         .status(200)
//         .setHeader('Content-Type', 'application/json')
//         .json({ success: true, msg: 'Successfully deleted all jobs!'})

//     } catch (err){
//         throw new Error(`Error deleting all jobs: ${err.message}`)
//     }
// }


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
    try {
        
    } catch (err) {
        throw new Error(`Error sending an email to Applicant`)
    }
}

module.exports = {
    getJobs,
    postJob,
    getRecruiterJobs,
    getJob,
    updateJob,
    deleteJob,
    getApplicants
}