exports.createNode = createNode;
exports.readNode = readNode;
exports.updateNode = updateNode;
exports.deleteNode = deleteNode;
exports.createRelationshipByNodeLabelsAndProperties = createRelationshipByNodeLabelsAndProperties;
exports.createRelationshipByNodeId = createRelationshipByNodeId;
exports.readRelationshipByNodeLabelsAndProperties = readRelationshipByNodeLabelsAndProperties;
exports.readRelationshipByNodeId = readRelationshipByNodeId;
exports.readRelationshipById = readRelationshipById;
exports.updateRelationshipByLabelsAndProperties = updateRelationshipByLabelsAndProperties;
exports.updateRelationshipByNodeId = updateRelationshipById;
exports.updateRelationshipById = updateRelationshipById;
exports.deleteLabelFromNodeByProperties = deleteLabelFromNodeByProperties;
exports.deleteLabelFromNodeByNodeId = deleteLabelFromNodeByNodeId;

QueryBuilder = function(){ this.query = []; };
QueryBuilder.prototype.concatCommand = concatCommand;
QueryBuilder.prototype.concatLabels = concatLabels;
QueryBuilder.prototype.concatProperties = concatProperties;
QueryBuilder.prototype.toString = toString;

/*
Public function
*/

function createNode (labels, properties) {
  return new QueryBuilder()
    .concatCommand("CREATE(n")
    .concatLabels(labels)
    .concatProperties(properties)
    .concatCommand(")RETURN(n);")
    .toString();
}

function readNode (labels, properties) {
  return new QueryBuilder()
    .concatCommand("MATCH(n")
    .concatLabels(labels)
    .concatProperties(properties)
    .concatCommand(")RETURN(n);")
    .toString();
}

function updateNode (oldLabels, oldProperties, newProperties) {
  var readQuery = new QueryBuilder()
    .concatCommand("MATCH(n")
    .concatLabels(oldLabels)
    .concatProperties(oldProperties)
    .concatCommand(')');
  var setProperties = new QueryBuilder();
  for(var key in newProperties) {
    setProperties.concatCommand("SET n." + key + "=" + newProperties[key]);
  }
  setProperties = setProperties.toString('\n');
  return readQuery
    .concatCommand(setProperties)
    .concatCommand("RETURN n;")
    .toString();
}

function deleteNode (labels, properties) {
  return new QueryBuilder()
    .concatCommand("MATCH(n")
    .concatLabels(labels)
    .concatProperties(properties)
    .concatCommand(')DELETE(n);')
    .toString();
}

function createRelationshipByNodeLabelsAndProperties (source, target, label, properties) {
  var sourceMatch = new QueryBuilder()
    .concatCommand("MATCH(s")
    .concatLabels(source.labels)
    .concatProperties(source.properties)
    .concatCommand(')');
  var targetMatch = new QueryBuilder()
    .concatCommand("MATCH(t")
    .concatLabels(target.labels)
    .concatProperties(target.properties)
    .concatCommand(')');
  var createRelation = new QueryBuilder()
    .concatCommand("CREATE(s)-[r")
    .concatLabels(label)
    .concatProperties(properties)
    .concatCommand("]->(t)RETURN(r);");
  return new QueryBuilder()
    .concatCommand(sourceMatch)
    .concatCommand(targetMatch)
    .concatCommand(createRelation)
    .toString('\n');
}

function createRelationshipByNodeId (sourceId, targetId, label, properties) {
  var createRelation = new QueryBuilder()
    .concatCommand("CREATE(s)-[r")
    .concatLabels(label)
    .concatProperties(properties)
    .concatCommand("]->(t)RETURN(r);");
  return new QueryBuilder()
    .concatCommand('START s=node(' + sourceId + '),t=node(' + targetId + ') ')
    .concatCommand(createRelation)
    .toString('\n');
}

function readRelationshipByNodeLabelsAndProperties (source, target, label, properties) {
  var sourceMatch = new QueryBuilder()
    .concatCommand("MATCH(s")
    .concatLabels(source.labels)
    .concatProperties(source.properties)
    .concatCommand(')');
  var targetMatch = new QueryBuilder()
    .concatCommand("MATCH(t")
    .concatLabels(target.labels)
    .concatProperties(target.properties)
    .concatCommand(')');
  var relationMatch = new QueryBuilder()
    .concatCommand("MATCH(s)-[r")
    .concatLabels(label)
    .concatProperties(properties)
    .concatCommand("]->(t)RETURN(r);");
  return new QueryBuilder()
    .concatCommand(sourceMatch)
    .concatCommand(targetMatch)
    .concatCommand(relationMatch)
    .toString('\n');
}

function readRelationshipByNodeId (sourceId, targetId, label, properties) {
  var matchRelation = new QueryBuilder()
    .concatCommand("MATCH(s)-[r")
    .concatLabels(label)
    .concatProperties(properties)
    .concatCommand("]->(t)RETURN(r);");
  return new QueryBuilder()
    .concatCommand('START s=node(' + sourceId + '),t=node(' + targetId + ') ')
    .concatCommand(matchRelation)
    .toString('\n');
}

function readRelationshipById (relationshipId) {
  return new QueryBuilder()
    .concatCommand('START r=relation(' + relationshipId + ') RETURN r')
    .toString('');
}


// not tested
function updateRelationshipByLabelsAndProperties (source, target, label, properties) {
  var sourceMatch = new QueryBuilder()
    .concatCommand("MATCH(s")
    .concatLabels(source.labels)
    .concatProperties(source.properties)
    .concatCommand(')');
  var targetMatch = new QueryBuilder()
    .concatCommand("MATCH(t")
    .concatLabels(target.labels)
    .concatProperties(target.properties)
    .concatCommand(')');
  var relationMatch = new QueryBuilder()
    .concatCommand("MATCH(s)-[r")
    .concatLabels(label)
    .concatProperties(properties)
    .concatCommand("]->(t);");
  var setProperties = new QueryBuilder();
  for(var key in newProperties) {
    setProperties.concatCommand("SET r." + key + "=" + newProperties[key]);
  }
  setProperties = setProperties.toString('\n');
  return new QueryBuilder()
    .concatCommand(sourceMatch)
    .concatCommand(targetMatch)
    .concatCommand(relationMatch)
    .concatCommand(setProperties)
    .concatCommand('RETURN r;')
    .toString('\n');
}

// not tested
function updateRelationshipByNodeId (sourceId, targetId, label, properties) {
  var matchRelation = new QueryBuilder()
    .concatCommand("MATCH(s)-[r")
    .concatLabels(label)
    .concatProperties(properties)
    .concatCommand("]->(t);");
  var setProperties = new QueryBuilder();
  for(var key in newProperties) {
    setProperties.concatCommand("SET r." + key + "=" + newProperties[key]);
  }
  setProperties = setProperties.toString('\n');
  return new QueryBuilder()
    .concatCommand('START s=node(' + sourceId + '),t=node(' + targetId + ') ')
    .concatCommand(matchRelation)
    .concatCommand(setProperties)
    .toString('\n');
}

// not tested
function updateRelationshipById (relationshipId) {
  var relationMatch = new QueryBuilder()
    .concatCommand('START r=relation(' + relationshipId + ') RETURN r')
    .toString('');
  var setProperties = new QueryBuilder();
  for(var key in newProperties) {
    setProperties.concatCommand("SET n." + key + "=" + newProperties[key]);
  }
  setProperties = setProperties.toString('\n');
  return new QueryBuilder()
    .concatCommand(relationMatch)
    .concatCommand(setProperties)
    .concatCommand('RETURN r;')
    .toString('\n');
}

// not tested
function deleteRelationshipByLabelsAndProperties (source, target, label, properties) {
  var sourceMatch = new QueryBuilder()
    .concatCommand("MATCH(s")
    .concatLabels(source.labels)
    .concatProperties(source.properties)
    .concatCommand(')');
  var targetMatch = new QueryBuilder()
    .concatCommand("MATCH(t")
    .concatLabels(target.labels)
    .concatProperties(target.properties)
    .concatCommand(')');
  var relationMatch = new QueryBuilder()
    .concatCommand("MATCH(s)-[r")
    .concatLabels(label)
    .concatProperties(properties)
    .concatCommand("]->(t);");
  return new QueryBuilder()
    .concatCommand(sourceMatch)
    .concatCommand(targetMatch)
    .concatCommand(relationMatch)
    .concatCommand('DELETE r;')
    .toString('\n');
}

// not tested
function deleteRelationshipByNodeId (sourceId, targetId, label, properties) {
  var matchRelation = new QueryBuilder()
    .concatCommand("MATCH(s)-[r")
    .concatLabels(label)
    .concatProperties(properties)
    .concatCommand("]->(t);");
  setProperties = setProperties.toString('\n');
  return new QueryBuilder()
    .concatCommand('START s=node(' + sourceId + '),t=node(' + targetId + ') ')
    .concatCommand(matchRelation)
    .concatCommand('DELETE r;')
    .toString('\n');
}

// not tested
function deleteRelationshipById (relationshipId) {
  var relationMatch = new QueryBuilder()
    .concatCommand('START r=relation(' + relationshipId + ') RETURN r')
    .toString('');
  return new QueryBuilder()
    .concatCommand(relationMatch)
    .concatCommand('DELETE r;')
    .toString('\n');
}
// not tested
function deleteLabelFromNodeByProperties (properties, removeLabels) {
  var readQuery = new QueryBuilder()
    .concatCommand("MATCH(n")
    .concatProperties(oldProperties)
    .concatCommand(')');
  var removeLabelQuery = new QueryBuilder();
  for(var key in removeLabels) {
    removeLabelQuery.concatCommand("REMOVE n:" + removeLabels[key]);
  }
  removeLabelQuery = setProperties.toString('\n');
  return readQuery
    .concatCommand(removeLabelQuery)
    .concatCommand("RETURN n;")
    .toString();
}

// not tested
function deleteLabelFromNodeByNodeId (nodeId) {
  var removeLabelQuery = new QueryBuilder();
  for(var key in removeLabels) {
  removeLabelQuery.concatCommand("REMOVE n:" + removeLabels[key]);
  }
  removeLabelQuery = setProperties.toString('\n');
  return new QueryBuilder()
    .concatCommand('START n=node(' + nodeId + ') ')
    .concatCommand(removeLabelQuery)
    .toString('\n');
}


/*
  Private function
*/

function concatCommand (string) {
  var query = this.query;
  this.query = query.concat(string);
  return this;
}

function concatLabels (labels) {
  var query = this.query;
  if (labels !== null) {
    if (typeof labels !== "string") {
        for(var i in labels) {
          query = query.concat(":" + labels[i]);
        }
    } else {
      query = query.concat(":" + labels);
    }
  }
  this.query = query;
  return this;
}

function concatProperties (properties) {
  var query = this.query;
  if (properties !== null && typeof properties === 'object') {
    query = query.concat('{');
    var empty = !0;
    for (var key in properties) {
      empty = !1;
      var val = properties[key];
      if(typeof val === 'string') {
        query = query.concat(key + ":'" + properties[key] + "\'");
      } else {
        query = query.concat(key + ":" + properties[key]);
      }
      query = query.concat(",");
    }
    if(!empty)
      query.pop();
    query = query.concat('}');
  }
  this.query = query;
  return this;
}

function toString (joinUsing) {
  if(!joinUsing) joinUsing = '';
  return this.query.join(joinUsing);
}
