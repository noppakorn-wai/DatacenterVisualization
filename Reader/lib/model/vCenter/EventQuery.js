var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function EventQuery (json) {
    BasicQuery.call(this, json);
  }

  return EventQuery;
})();
