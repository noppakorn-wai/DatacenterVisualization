var readline = require("linebyline");
var TaskQuery = require('../model/vCenter/TaskQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------TaskQuery------");
      var results = [];
      var rl = readline(rootPath+'/TaskQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new TaskQuery(json));
      })
      .on('error', function(e) {
        console.log(e);
      })
    	.on('end', function(e) {
    		callback(null, results);
    	});
    }
  };
};
