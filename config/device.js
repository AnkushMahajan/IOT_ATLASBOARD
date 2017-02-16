var awsIot = require('aws-iot-device-sdk');
var path = require('path');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourAWSRegion>'
// with a unique client identifier and the AWS region you created your
// certificate in (e.g. 'us-east-1').  NOTE: client identifiers must be
// unique within your AWS account; if a client attempts to connect with a
// client identifier which is already in use, the existing connection will
// be terminated.
//

var device = function() {
        return awsIot.device({
                keyPath: path.join('/Users/amahajan/sprout14-iot/config/certs/aws_iot.pem.key'),
                certPath: path.join('/Users/amahajan/sprout14-iot/config/certs/aws_iot.pem.crt'),
                caPath: path.join('/Users/amahajan/sprout14-iot/config/certs/rootCA.pem'),
                clientId: "SproutPi",
                region: "ap-southeast-2"
        });
}

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
module.exports = device;