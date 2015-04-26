// api.js
// Routes to CRUD nodes.

var nodes = require('../models/nodes');
var edges = require('../models/edges');
var perf = require('../models/performance');

/**
 * GET /nodes
 */

prepareForSerponse = function(res) {
  return function(err, result) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      err: JSON.stringify(err),
      data: result
    }));
  };
};

exports.getRoot = function(req, res, next) {
  nodes.getNodeByKey('group-d1',
    prepareForSerponse(res)
  );
};

exports.getNode = function(req, res, next) {
  nodes.getNode(req.params.node_id,
    prepareForSerponse(res)
  );
};

exports.getAllNode = function(req, res, next) {
  nodes.getAllNode(
    prepareForSerponse(res)
  );
};

exports.getEdge = function(req, res, next) {
  edges.getEdge(req.params.node_id, req.params.direction,
    prepareForSerponse(res)
  );
};

exports.getAllEdge = function(req, res, next) {
  edges.getAllEdge(req.params.node_id, req.params.direction,
    prepareForSerponse(res)
  );
};

exports.getPerformanceCounter = function(req, res, next) {
  perf.get(req.params.id,
    prepareForSerponse(res)
  );
};

exports.getPerformance = function(req, res, next) {
  perf.get(req.params.id, function(err, data) {
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      res.end(JSON.stringify({
        err: JSON.stringify(err),
        data: []
      }));
    } else {
      if (data === null) {
        res.end(JSON.stringify({
          err: "no data",
          data: {}
        }));
      } else {
        try {
          res.end(JSON.stringify({
            err: "",
            data: {
              labels: data.labels,
              values: data.values[req.params.counterId].split(",").map(function(n) {
                return parseInt(n);
              })
            }
          }));
        } catch (e) {
          res.end(JSON.stringify({
            err: e,
            data: {}
          }));
        }
      }
    }
  });
};

exports.getData = function(req, res, next) {
  if (req.params.node_id !== undefined) {
    nodes.getData(req.params.node_id,
      prepareForSerponse(res)
    );
  } else {
    nodes.getNodeByKey('group-d1',
      function(err, data) {
        nodes.getData(data[0].id,
          prepareForSerponse(res)
        );
      }
    );
  }
};