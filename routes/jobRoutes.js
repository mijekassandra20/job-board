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
    deleteJobs,
    getJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController')

router.route('/')
    .get(reqLogger, getJobs)
    // .post(reqLogger, jobValidator, postJob)
    .delete(reqLogger, adminValidator, deleteJobs)

router.route('/:recruiterId/jobposting')
    .post(reqLogger, postJob)

router.route('/:jobId')
    .get(reqLogger, getJob)
    .put(reqLogger, updateJob)
    .delete(reqLogger, deleteJob)

module.exports = router;