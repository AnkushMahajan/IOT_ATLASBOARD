module.exports = {
  onRun: function (config, dependencies, jobCallback) {
    issues = [{"issueType": "Project Name", "frequency": "OneClick"},
      {"issueType": "Project Owner", "frequency": "Raj Prasad"},
      {"issueType": "Project Completion Date", "frequency": "28/Feb/2017"},
      {"issueType": "Project Budget", "frequency": "1 Billion"}];

    jobCallback(null, {issues: issues, title: config.widgetTitle});
  }
};