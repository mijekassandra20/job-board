const express = require('express')
const router = express.Router()

const reqLogger = require('../middlewares/reqLogger')
const protectedRoute = require('../middlewares/auth')

const {
    jobValidator,
    adminValidator
} = require('../middlewares/utils/validator')

const {
    getJobs,
    postJob,
    getRecruiterJobs,
    getJob,
    updateJob,
    deleteJob,
    getApplicants,
    sendApplicantEmail
} = require('../controllers/jobController')

// GET ALL JOBS OF ALL RECRUITERS
router.route('/')
    .get(reqLogger, getJobs)

// FOR RECRUITER ACCESS ONLY: GET AND POST JOBS UNDER THEM
router.route('/:recruiterId/jobposting')
    .get(reqLogger, protectedRoute, getRecruiterJobs)
    .post(reqLogger, protectedRoute, jobValidator, postJob)

// FOR RECRUITER ACCESS ONLY: RETRIEVE, UPDATE AND DELETE A SPECIFIC JOB
router.route('/:recruiterId/jobposting/:jobId')
    .get(reqLogger, protectedRoute, getJob)
    .put(reqLogger, protectedRoute, updateJob)
    .delete(reqLogger, protectedRoute, deleteJob)

// FOR RECRUITER ACCESS ONLY: RETRIEVE APPLICANTS OF A SPECIFIC JOB
router.route('/:recruiterId/applicants/:jobId')
    .get(reqLogger, protectedRoute, getApplicants)
    .post(reqLogger, protectedRoute, sendApplicantEmail)

module.exports = router;