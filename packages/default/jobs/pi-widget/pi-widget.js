/**
 * Job: pi-job
 *
 * Expected configuration:
 *
 * ## PLEASE ADD AN EXAMPLE CONFIGURATION FOR YOUR JOB HERE
 * { 
 *   myconfigKey : [ 
 *     { serverUrl : 'localhost' } 
 *   ]
 * }
 */
var device = new (require('../../../../config/device'))();
var emailUtil = require('../../../../config/emailNotifications');
var dataObj = {};

module.exports = {

  /**
   * Executed on job initialisation (only once)
   * @param config
   * @param dependencies
   */
  onInit: function (config, dependencies) {

    /*
    This is a good place for initialisation logic, like registering routes in express:

    dependencies.logger.info('adding routes...');
    dependencies.app.route("/jobs/mycustomroute")
        .get(function (req, res) {
          res.end('So something useful here');
        });
    */


      device.on('connect', function() {
          console.log('Hey Connected to IOT - RASPBERRY PI -- for message temperature');
          device.subscribe('temperature');

      });


  },

  /**
   * Executed every interval
   * @param config
   * @param dependencies
   * @param jobCallback
   */
  onRun: function (config, dependencies, jobCallback) {

      stfuEnabled = true;

      emailSenderId = 'amahajan@odecee.com.au'

      var mailOptions = {
          from: '"You have been notified of the temperature"<' + emailSenderId + '>', // sender address
          to: '',
          subject: 'Temperature has gone above 30', // Subject line
          text: 'Temperature in Melbourne', // plaintext body
          html: '<div><span>Please take immediate action</span></div><br/><br/>' +
          '<div><span>Regards,</span></div>' +
          '<div><span>IOT TEAM</span></div>'
      };

      dataObj = {
          topic: config.content,
          value: 'Sensing!!',
          stfuEnabled: stfuEnabled,
          stfuOnly: config.stfuOnly,
          stfuHours: config.stfuHours,
          center: config.center
      };

      device
          .on('message', function(topic, payload) {
              console.log('message', topic, payload.toString());
              var d = new Date();
              dataObj.value = (payload!= undefined || payload!==null)? Math.round(payload * 100) / 100 : 'Sensing!!';
              dataObj.utc = d.toUTCString();

              if(payload > 30){
                  dataObj.stfuEnabled = false;
                  emailUtil.emailSender(['amahajan@odecee.com.au', 'tcockin@odecee.com.au'], mailOptions, function(result) {
                      console.log(result);

                  })
              }

              jobCallback(null, dataObj);
          });



    /*
     1. USE OF JOB DEPENDENCIES

     You can use a few handy dependencies in your job:

     - dependencies.easyRequest : a wrapper on top of the "request" module
     - dependencies.request : the popular http request module itself
     - dependencies.logger : atlasboard logger interface

     Check them all out: https://bitbucket.org/atlassian/atlasboard/raw/master/lib/job-dependencies/?at=master

     */

    var logger = dependencies.logger;

    /*

     2. CONFIGURATION CHECK

     You probably want to check that the right configuration has been passed to the job.
     It is a good idea to cover this with unit tests as well (see test/pi-job file)

     Checking for the right configuration could be something like this:

     if (!config.myrequiredConfig) {
     return jobCallback('missing configuration properties!');
     }


     3. SENDING DATA BACK TO THE WIDGET

     You can send data back to the widget anytime (ex: if you are hooked into a real-time data stream and
     don't want to depend on the jobCallback triggered by the scheduler to push data to widgets)

     jobWorker.pushUpdate({data: { title: config.widgetTitle, html: 'loading...' }}); // on Atlasboard > 1.0


     4. USE OF JOB_CALLBACK

     Using nodejs callback standard conventions, you should return an error or null (if success)
     as the first parameter, and the widget's data as the second parameter.

     This is an example of how to make an HTTP call to google using the easyRequest dependency,
     and send the result to the registered widgets.
     Have a look at test/pi-job for an example of how to unit tests this easily by mocking easyRequest calls

     */

  }
};