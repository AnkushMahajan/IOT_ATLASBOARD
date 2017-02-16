var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourAWSRegion>'
// with a unique client identifier and the AWS region you created your
// certificate in (e.g. 'us-east-1').  NOTE: client identifiers must be
// unique within your AWS account; if a client attempts to connect with a
// client identifier which is already in use, the existing connection will
// be terminated.
//
var thingShadows = awsIot.thingShadow({
    keyPath: "aws_iot.pem.key",
    certPath: "aws_iot.pem.crt",
    caPath: "rootCA.pem",
    clientId: "PiName",
    region: "ap-southeast-2"
});

module.exports = thingShadows;