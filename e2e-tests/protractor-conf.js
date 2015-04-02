exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '../e2e-tests/*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  //baseUrl: 'http://localhost:8000/app/',
  baseUrl: 'http://local.eatdrinkweb.com/edw-accounts/app/',


  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
