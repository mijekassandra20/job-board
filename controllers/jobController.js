// const Job = require('../models/Job');
const RecruiterJob = require('../models/RecruiterJob')

// This is a test

// GET ALL JOBS 
const getJobs = async(req, res, next) => {

    try {

        const recruiters = await RecruiterJob.find(); 

        const jobs = recruiters.map(recruiter => recruiter.jobPosting).flat()


        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(jobs)
        
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

// const deleteJobs = async (req, res, next) => {

//     try {

//         const recruiters = await RecruiterJob.find(); 

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
        const jobs = await RecruiterJob.findById(req.params.recruiterId)

        const jobPosted = jobs.jobPosting

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(jobPosted)

        
    } catch (err) {
        throw new Error(`Error retrieving all jobs of Recruiter ${recruiterId}: ${err.message}`)
    }
}


// GET A SPECIFIC JOB BY ID OF RECRUITER
const getJob = async (req, res, next) => {

    try {

        const job = await RecruiterJob.findById(req.params.recruiterId);

        let jobPosted = job.jobPosting.find(jobPosted => (jobPosted._id).equals(req.params.jobId)) 

        if (!jobPosted) jobPosted = { success: false, msg: `No job found with job ID: ${req.params.jobId}`}

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(jobPosted)


    } catch (err){
        throw new Error(`Error retrieving a job with ID: ${req.params.jobId}: ${err.message}`)
    }
}

// UPDATE A SPECIFIC JOB BY ID
const updateJob = async (req, res, next) => {

    try {
        const job = await RecruiterJob.findById(req.params.recruiterId)

        let jobPosted = job.jobPosting.find(jobPosted => (jobPosted._id).equals(req.params.jobId))

        if(jobPosted){
            const jobIndexPosition = job.jobPosting.indexOf(jobPosted)
            job.jobPosting.splice(jobIndexPosition, 1, req.body)
            jobPosted = job.jobPosting[jobIndexPosition]
            await job.save()
        } else {
            jobPosted = {
                success: false,
                msg: `No job found with ID: ${req.params.jobId}`
            }
        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(jobPosted)

    } catch (err) {
        throw new Error(`Error updating job with ID: ${req.params.jobId}: ${err.message}`)
    }
}


// DELETE SPECIFIC JOB BY ID OF A RECRUITER
const deleteJob = async (req, res, next) => {

    try {
        const job = await RecruiterJob.findById(req.params.recruiterId)

        let jobPosted = job.jobPosting.find(jobPosted => (jobPosted._id).equals(req.params.jobId)); 

        if (jobPosted) {
            const jobIndexPosition = job.jobPosting.indexOf(jobPosted)
            job.jobPosting.splice(jobIndexPosition, 1)
            jobPosted = {success: true, msg: `Successfully deleted job with ID: ${req.params.jobId}`}
            await job.save()
        } else {
            jobPosted = { success: false, msg: `No job found with ID: ${req.params.jobId}`}
        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(jobPosted)

    } catch (err) {
        throw new Error(`Error deleting job with ID: ${req.params.jobId}: ${err.message}`)
    }
    
}

module.exports = {
    getJobs,
    postJob,
    // deleteJobs,
    getRecruiterJobs,
    getJob,
    updateJob,
    deleteJob
}