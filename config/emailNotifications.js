var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');

exports.emailSender = (emailIds, mailOptions, callback) => {
    if (!mailOptions && !(emailIds && emailIds.length)) {
        return callback('Provide emails ids and mailOptions to send emails');
    }

    var accessKeyId = '';
    var secretAccessKey = '';

    // accessKeys are blank because a IAM policy would be defined on the AWS build agent
    var transporter = nodemailer.createTransport(sesTransport({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }));
    // counter to keep track of emails sent
    // since we don't want all email ids to be sent in to field
    var sentPacket = {};

    emailIds.forEach((email, index) => {
        mailOptions.to = email;
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, result) {
        // sent packet is an object that has accumulation of all email packets received
        sentPacket[index] = {
            sentTo: result ? result.envelope.to : null,
            from: 'mahajan.ankush27@gmail.com',
            messageId: result ? result.messageId : null,
            error: error ? error : null
        };
        if (Object.keys(sentPacket).length === emailIds.length) {
            return callback(sentPacket);
        }
    });
});
};