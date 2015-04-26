var readline = require("linebyline");
var EventQuery = require('../model/vCenter/EventQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------EventQuery------");
      var results = [];
      var rl = readline(rootPath+'/EventQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new EventQuery(json));
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
