var initFilter = function(s) {

  sigma.prototype.resize = function() {
    var nodes = this.graph.nodes();
    nodes.forEach(function(node) {
      node.old_size = node.size;
      node.new_size = s.settings("maxNodeSize") / ((node.vis.extra.depth + 1) * 0.4);
    });
  };

  sigma.prototype.filter = function() {
    var s = this;
    var root = s.getCenter();
    var graph = s.graph;
    var nodes = s.graph.nodes();
    var edges = s.graph.edges();

    nodes.forEach(function(node) {
      node.hidden = true;
    });

    root.hidden = false;

    var firstLevelNode = graph.adjacentNodes(root.id);
    firstLevelNode.forEach(function(n) {
      n.hidden = false;
    });

    if (root.id === s.getRoot().id) {
      firstLevelNode.forEach(function(n) {
        graph.children(n.id).forEach(function(n) {
          n.hidden = false;
          graph.children(n.id).forEach(function(n) {
            n.hidden = false;
          });
        });
      });
    } else if (root.vis.subType === "Datastore") {
      firstLevelNode.filter(function(n) {
          return n.vis.type === "dummy";
        })
        .forEach(function(n) {
          n.hidden = true;
        });
    } else if (root.vis.subType === "VirtualMachine") {
      firstLevelNode.filter(function(n) {
          return n.vis.type === "dummy";
        })
        .forEach(function(n) {
          n.hidden = true;
        });
    } else if (root.vis.subType === "network") {
      firstLevelNode.filter(function(n) {
          return n.vis.type === "dummy";
        })
        .forEach(function(n) {
          n.hidden = true;
        });
    } else if (root.vis.subType === "Datacenter") {
      // Nothing here
    } else if (root.vis.subType === "HostSystem") {
      // Nothing here
    } else if (root.vis.subType === "Hosts" || root.cat === "VMs" || root.cat === "Networks") {
      // Nothing here
    }
  };

  sigma.prototype.applyEdgeStyle = function() {
    var graph = this.graph;
    var edges = this.graph.edges();
    edges.forEach(function(e) {
      var sourceDepth = graph.nodes(e.source).vis.extra.depth;
      var targetDepth = graph.nodes(e.target).vis.extra.depth;
      var maxDepth = sourceDepth > targetDepth ? sourceDepth : targetDepth;
      var minDepth = sourceDepth < targetDepth ? sourceDepth : targetDepth;
      if (minDepth === 0 && maxDepth === 1) {
        e.hidden = false;
        e.color = "#000";
        e.size = 1;
      } else if (minDepth === 1 && maxDepth === 1) {
        e.hidden = false;
        e.color = "#eee";
        e.size = 1;
      } else if (minDepth === 1 && maxDepth === 2) {
        e.hidden = false;
        e.color = "#ddd";
        e.size = 0.6;
      } else if (minDepth === 2 && maxDepth === 2) {
        e.hidden = false;
        e.color = "#ddd";
        e.size = 0.6;
      } else if (minDepth === 0 && maxDepth === 3) {
        e.hidden = false;
        e.color = "#ddd";
        e.size = 0.6;
      } else if (minDepth === 2 && maxDepth === 3) {
        e.hidden = false;
        e.color = "#ddd";
        e.size = 0.6;
      } else {
        e.hidden = true;
      }
    });
  };
};