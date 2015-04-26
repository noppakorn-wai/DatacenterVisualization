var readline = require("linebyline");
var FolderQuery = require('../model/vCenter/FolderQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------FolderQuery------");
      var results = [];
      var rl = readline(rootPath+'/FolderQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new FolderQuery(json));
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
