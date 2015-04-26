var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function TaskQuery (json) {
    BasicQuery.call(this, json);
  }

  return TaskQuery;
})();
