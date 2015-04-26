// edges.js
// graph vis logic

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(
  process.env.NEO4J_URL ||
  process.env.GRAPHENEDB_URL ||
  'http://localhost:7474'
);

// private constructor:

var Edge = module.exports = function Node(_edge) {
  // all we'll really store is the node; the rest of our properties will be
  // derivable or just pass-through properties (see below).
  this._edge = _edge;
};

// public instance properties:

Object.defineProperty(Edge.prototype, 'id', {
  get: function() {
    return '' + this._edge._data.metadata.id;
  }
});

Object.defineProperty(Edge.prototype, 'start', {
  get: function() {
    var startURL = this._edge._data.start.split("/");
    return '' + startURL[startURL.length - 1];
  }
});

Object.defineProperty(Edge.prototype, 'end', {
  get: function() {
    var endURL = this._edge._data.end.split("/");
    return '' + endURL[endURL.length - 1];
  }
});

Object.defineProperty(Edge.prototype, 'type', {
  get: function() {
    return this._edge._data.metadata.type;
  }
});


// static methods:

Edge.getEdge = function(node_id, direction, callback) {
  var query = [
    'MATCH (n1)-[r]->(n2)',
  ];

  if (direction === 'in') {
    query = query.concat(
      ['WHERE id(n2)=' + node_id,
        'RETURN r'
      ]);
  } else if (direction === 'out') {
    query = query.concat(
      ['WHERE id(n1)=' + node_id,
        'RETURN r'
      ]);
  } else {
    query = query.concat(
      ['WHERE id(n1)=' + node_id,
        'OR id(n2)=' + node_id,
        'RETURN r'
      ]);
  }

  query = query.join('\n');

  db.query(query, null, function(err, results) {
    if (err) return callback(err);
    var edges = results.map(function(result) {
      return new Edge(result.r);
    });
    callback(null, edges);
  });
};

Edge.getAllEdge = function(node_id, direction, callback) {
  var query = [
    'MATCH (n1)-[r]->(n2)',
    'RETURN r'
  ];

  query = query.join('\n');

  db.query(query, null, function(err, results) {
    if (err) return callback(err);
    var edges = results.map(function(result) {
      return new Edge(result.r);
    });
    callback(null, edges);
  });
};