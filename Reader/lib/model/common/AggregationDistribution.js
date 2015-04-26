var BasicNode = require("./BasicNode");

module.exports = (function () {
  function AggregationDistribution (id, key, name, validFrom, validTo) {
    BasicNode.call(this, id, key, name ,"AggregationDistribution", validFrom, validTo);
    this.aggregatesFrom = [];
    this.distributesAs = [];
  }

  AggregationDistribution.prototype = BasicNode.prototype;
  AggregationDistribution.prototype.getAggregatesFrom = getAggregatesFrom;
  AggregationDistribution.prototype.setAggregatesFrom = setAggregatesFrom;
  AggregationDistribution.prototype.getDistributesAs = getDistributesAs;
  AggregationDistribution.prototype.setDistributesAs = setDistributesAs;

  function getAggregatesFrom () {
      return this.aggregate;
  }

  function setAggregatesFrom (aggregatesFrom) {
      this.aggregatesFrom = aggregatesFrom;
  }

  function getDistributesAs () {
      return this.distributesAs;
  }

  function setDistributesAs (distributesAs) {
      this.distributesAs = distributesAs;
  }

  return AggregationDistribution;
})();
