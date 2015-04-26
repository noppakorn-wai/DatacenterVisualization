var readline = require('linebyline');
var async = require('async');
//var date = '19-11-2014(10.26.05)';
var date = '23-03-2015(01.10.11)';
var sc = require('./lib/database');

//  NOTE
//  use read with neo4j       -> return simple object
//  use write with node-neo4j -> complex write with transaction

var MongoClient = require('mongodb').MongoClient;
// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");
  var collection = db.collection('datacenter-2-performance');
  var temp = collection.find({}).toArray(function(err, docs) {
    console.log(docs[0].header);
    db.close();
  });
});

// console.log(sc.createNode(['A','B'], {a:'a', b:'b'}));
// console.log(sc.createNode(['A','B'], null));
// console.log(sc.createNode('A', {a:'a'}));
// console.log(sc.createNode(null, {a:'a'}));
// console.log(sc.updateNode(['CURRENT','TEST'],{data:1,key:'A'},{data:23,key:'23'}));
// console.log(sc.deleteNode(['A','B'], null));
// var source = {labels:['CURRENT','TEST'], data:null};
// var target = {labels:['CURRENT','TEST2'], data:{data:2}};
// console.log(sc.createNode(source.labels, source.data));
// console.log(sc.createNode(target.labels, target.data));
// console.log(sc.createRelationshipByLabelsAndProperties(source, target, 'HAS', {data:'A'}));
// console.log(sc.createRelationshipById(5,6,'HAS', {data:'A'}));
// console.log(sc.readRelationshipByLabelsAndProperties(source, target, null, null));
// console.log(sc.readRelationshipById(5,6,'HAS', null));

/*
  object is valid/current  if validFrom <= NOW
                              validTo   > NOW

  PUBLIC FUNCTION UPDATE_MODEL(new)
    START_TRANSACTION(neo4j)
    START_TRANSACTION(mongodb)
    try {
      UPDATE_DOC(new.data)
      UPDATE_NODE(new.data)
      UPDATE_RELATION(new.data)
      COMMIT(neo4j)
      COMMIT(mongodb)
    } catch (ANY ERROR) {
      ROLLBACK(neo4j)
      ROLLBACK(mongodb)
    }
  END FUNCTION
*/

/*
  PRIVATE FUNCTION UPDATE_DOC(new)
    db =  default_database
    FOR EACH data IN new
      APPEND db[data.type] BY data.data
    END FOR
  END FUNCTION
*/

/*
  PRIVATE FUNCTION UPDATE_NODE(new)
    old = GET_CURRENT_NODE_BY_KEY (new.key)
    IF exist(old)
      IF !identical(old.data,new)
        new.validTo = time.max
        old.validTo = new.validFrom
        // REMOVE CURRENT TAG FROM old
        UPDATE old
        new = NEW_NODE_ORI(new)
        relationships = SELECE_RELATIONSHIPS_FROM(old)
        FOR EACH relationd AS relation
          IF relation.validTo > new.validFrom
            relation.validTo = new.validFrom
            // REMOVE CURRENT TAG FROM relation
            UPDATE relation
          END IF
        END FOR
      END IF
    ELSE not exist
      new = NEW_NODE_ORI(new)
    END IF
  END FUNCTION
*/
/*
db.readRelationshipsOfNode(8, 'all', function(data,res){
  console.log(res);
});

function updateNode(labels, data, callback) {
  var old = getCurrentNode(data.key, function(err,res){
    if(old!==null) {
      if(!isIdentical(data, old)) {
        data.validTo = new Date(-8640000000000000);
        old.validTo = data.validFrom;
        db.deleteLabelFromNode (old._id, 'CURRENT', function(data, res){
          db.updateNodeById(old._id, data, function(data, res){
            db.readRelationshipsOfNode(old._id, 'all', function(data,res){
              for(var r in res) {
                if(r.validTo > data.validFrom) {
                  r.validTo = data.validFrom;
                  db.updateRelationship()
                }
              }
            });
          });
        });
      }
    } else {
      db.insertNode(data, ['CURRENT'].concat(labels), function(err, data) {
        if(err) callback(err);
        callback(null, res);
      });
    }
  });
}

function getCurrentNodeByKey(key, callback) {
  db.readNodesWithLabelsAndProperties(['CURRENT'], {key: key}, function(err, res) {
    if(err) return callback(err);
    return callback(null, res[0]);
  });
}

function isUndefined (val) {
  if(typeof val === 'undefined') return true;
  else return false;
}

function isIdentical (ldata, rdata) {
  if(rdata === null || ldata === null) {
    return false;
  }
  var lcount = 0, rcount = 0;
  for(var lkey in ldata) {
    if(lkey!=='_id' && lkey!=='validFrom' && lkey!=='validTo') {
      lcount++;
    }
  }
  for(var rkey in rdata) {
    if(rkey!=='_id' && rkey!=='validFrom' && rkey!=='validTo') {
      rcount++;
    }
  }
  if(lcount!==rcount) {
    return false;
  }
  for(var key in ldata) {
    if(key!=='_id' && key!=='validFrom' && key!=='validTo') {
      if(rdata[key]!==ldata[key]) {
        return false;
      }
    }
  }
  return true;
}*/

/* private */
/*function getNodeByInformation (labels, data, callback) {
  var query = [ 'MATCH(n' ];
  if (labels !== null) {
    if (typeof labels !== "string") {
        for(var i in labels) {
          query = query.concat(":" + labels[i]);
        }
    } else {
      query = query.concat(":" + labels);
    }
  }
  if (data !== null && typeof data === 'object') {
    query = query.concat('{');
    var empty = !0;
    for (var key in data) {
      empty = !1;
      var val = data[key];
      if(typeof val === 'string') {
        query = query.concat(key + ":'" + data[key] + "\'");
      } else {
        query = query.concat(key + ":" + data[key]);
      }
      query = query.concat(",");
    }
    if(!empty)
      query.pop();
    query = query.concat('}');
  }
  query = query.concat(')RETURN n');
  query = query.join('');
  db.query(query, null, function (err, results) {
    if(err) callback(err);
    callback(null, results.map(function (result) {
      return result.n;
    }));
  });
}*/

//getCurrentNode('A', function(err, node){console.log(node);});
//var node = db.createNode({a:'a'});
//console.log(node);
//node.save();


/*
  PRIVATE FUNCTION UPDATE_RELATION (sourceKey, targetKey)
    old = GET_CURRENT_RELATION_BETWEEN(sourceKey, targetKey)
    IF exist(old)
      IF identical(old.data,new)
        do nothing
      ELSE not identical
        new.validTo = time.max
        old.validTo = new.validFrom
        // REMOVE CURRENT TAG FROM old
        UPDATE old
        new = NEW_RELATION(sourceKey, targetKey)
      END IF
  END FUNCTION
*/

// var BasicNode = require('./lib/model/common/BasicNode');
// var AggregationDistribution = require('./lib/model/common/AggregationDistribution');
// var ComputeUnit = require('./lib/model/common/ComputeUnit');
// var Device = require('./lib/model/common/Device');
// var Network = require('./lib/model/common/Network');
// var Resource = require('./lib/model/common/Resource');
// var temp = new Resource("a","b","c");
// console.log(temp);

var op = require('./lib/operation')('./data', date, readline);
async.series([
    // [TODO] Fix
    // op.clusterComputeResourceQuery.read,
    // op.computeResourceQuery.read,
    // op.datacenterQuery.read,
    // op.datastoreQuery.read,
    // op.distributedVirtualPortgroupQuery.read,
    // op.folderQuery.read,
    // op.hostSystemQuery.read,
    // op.networkQuery.read,
    // op.resourcePoolQuery.read,
    // [TODO] Fix
    // op.virtualAppQuery.read,
    // [TODO] Fix
    // op.virtualMachineQuery.read,
    // [TODO] Fix
    // op.vmwareDistributedVirtualSwitchQuery.read,
    // op.alarmQuery.read,
    // [TODO] Update
    // op.eventQuery.read,
    // op.taskQuery.read,
    // op.performanceQuery.read
], function (err, results) {
  console.log(results);
});
