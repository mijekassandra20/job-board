const nodemailer = require('nodemailer')

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'crrcompass@gmail.com',
        pass: 'careercomp'
    }
});

const mailOptions = {
    from: 'crrcompass@gmail.com',
    to: 'kassandra.mije@supportzebra.com',
    subject: 'Sending email using node.js',
    text: `This is just a test!`
}

emailTransporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
    }
})