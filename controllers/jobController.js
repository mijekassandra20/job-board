// const Job = require('../models/Job');
const RecruiterJob = require('../models/RecruiterJob')

const getJobs = async(req, res, next) => {

    try {
        const recruiter = await RecruiterJob.findById(req.params.recruiterId)
        const result = recruiter.jobPosting; // access the jobPosting inside the Recruiters

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(result)
        
    } catch (err) {
        throw new Error(`Error retrieving jobs: ${err.message}`)
    }
}

const postJob = async (req, res, next) => {

    try {
        const recruiter = await RecruiterJob.findById(req.params.recruiterId)
        recruiter.jobPosting.push(req.body)

        const result = await recruiter.save()

        res
        .status(201)
        .setHeader('Content-Type', 'application/json')
        .json(result)
        
    } catch (err) {
        throw new Error(`Error posting new job: ${err.message}`)
    }
}

const deleteJobs = async (req, res, next) => {

    try {
        await RecruiterJob.deleteMany();

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({ success: true, msg: 'Successfully deleted all jobs!'})

    } catch (err){
        throw new Error(`Error deleting all jobs: ${err.message}`)
    }
}

const getJob = async (req, res, next) => {

    try {

        const job = await RecruiterJob.findById(req.params.jobId);

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(job)


    } catch (err){
        throw new Error(`Error retrieving a job with ID: ${req.params.jobId}: ${err.message}`)
    }
}

const updateJob = async (req, res, next) => {

    try {
        const job = await RecruiterJob.findByIdAndUpdate(req.params.jobId,
            {$set: req.body}, {new: true});

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(job)

    } catch (err) {
        throw new Error(`Error updating job with ID: ${req.params.jobId}: ${err.message}`)
    }
}

const deleteJob = async (req, res, next) => {

    try {
        await RecruiterJob.findByIdAndDelete(req.params.jobId)

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({ success: true, msg: `Job with ID: ${req.params.jobId} was successfully deleted! `})

    } catch (err) {
        throw new Error(`Error deleting job with ID: ${req.params.jobId}: ${err.message}`)
    }
    
}

module.exports = {
    getJobs,
    postJob,
    deleteJobs,
    getJob,
    updateJob,
    deleteJob
}