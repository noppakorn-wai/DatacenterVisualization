var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function PerformanceQuery (json) {
    this.key = json.entity.val;
    var sampleInfoCSV = json.sampleInfoCSV.split(",");
    this.validFrom = toJavascriptDate(sampleInfoCSV[1]).getTime();
    var lastQueryTime = toJavascriptDate(sampleInfoCSV[sampleInfoCSV.length-1]).getTime();
    this.validTo = lastQueryTime;
    this.document = [];
    for (var i in json.value) {
      var data = json.value[i];
      var dataSet = {counterId:data.id.counterId, values:data.value.split(",")};
      this.document.push(dataSet);
    }
    this.pointLabel = [];
    for (var j=1; j<sampleInfoCSV.length; j+=2) {
      this.pointLabel.push(toJavascriptDate(sampleInfoCSV[j]));
    }
    console.log(this.pointLabel[0]);
    console.log(sampleInfoCSV[1]);
    console.log(new Date(sampleInfoCSV[1]));
  }

  function toJavascriptDate (input) {
    var year = input.slice(0, 4);
    var month = input.slice(5,7)-1;
    var day = input.slice(8,10);
    var hr = input.slice(11,13);
    var min = input.slice(14,16);
    var sec = input.slice(17,19);
    return new Date(year, month, day, hr, min, sec);
  }

  return PerformanceQuery;
})();
