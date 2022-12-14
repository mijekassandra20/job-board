// const mongoose = require('mongoose');
// const Recruiter = require('./RecruiterJob')

// const Schema = mongoose.Schema;

// const JobSchema = new Schema ({
//     jobTitle: {
//         type: String,
//         required: [true, 'Please input a job title!!']
//     },
    
//     jobDescription: {
//         type: String,
//         required: [true, 'Please input a job description!!']
//     },

//     requirements: {
//         type: [String],
//         require: [true, 'Please input the requirements!!']
//     },

//     location: {
//         type: String,
//         required: [true, 'Please input a job location!!']
//     },

//     salary: {
//         type: Number,
//         required: [true, 'Please input a salary!!'],
//         validate: (salary) => {
//             return typeof salary === 'number'
//         }
//     },
    
//     jobType: {
//         type: String,
//         required: [true, 'Please input the job type!!'],
//         enum: [
//             'Full-time',
//             'Part-time',
//             'Contractual',
//             'Internship'
//         ]
//     },

//     isAvailable: {
//         type: Boolean,
//         default: true
//     },

//     company: [RecruiterSchema]
    
// }, {
//     timestamps: true
// })

// module.exports = mongoose.model('Job', JobSchema)