const express = require('express')

const router = express.Router()

const reqLogger = require('../middlewares/reqLogger')

const {
    userValidator,
    jobValidator,
    adminValidator
} = require('../middlewares/utils/validator')

const {
    getJobs,
    postJob,
    getRecruiterJobs,
    getJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController')

// GET ALL JOBS OF ALL RECRUITERS
router.route('/')
    .get(reqLogger, getJobs)

// FOR RECRUITER ACCESS ONLY: GET AND POST JOBS UNDER THEM
router.route('/:recruiterId/jobposting')
    .get(reqLogger, getRecruiterJobs)
    .post(reqLogger, postJob)

// FOR RECRUITER ACCESS ONLY: RETRIEVE, UPDATE AND DELETE A SPECIFIC JOB
router.route('/:recruiterId/jobposting/:jobId')
    .get(reqLogger, getJob)
    .put(reqLogger, updateJob)
    .delete(reqLogger, deleteJob)

module.exports = router;