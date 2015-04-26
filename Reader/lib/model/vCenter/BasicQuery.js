module.exports = (function () {
  function BasicQuery (json, startTime, endTime) {
    try {
      this.key = json.MOR.val;
    } catch (e) {
      this.key = null;
    }
    this.name = json.name;
    this.validFrom = startTime;
    this.validTo = endTime;
  }

  return BasicQuery;
})();
