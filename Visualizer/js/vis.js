/*
Copyright (c) 2010, Nicolas Garcia Belmonte
All rights reserved

> Redistribution and use in source and binary forms, with or without
> modification, are permitted provided that the following conditions are met:
>      * Redistributions of source code must retain the above copyright
>        notice, this list of conditions and the following disclaimer.
>      * Redistributions in binary form must reproduce the above copyright
>        notice, this list of conditions and the following disclaimer in the
>        documentation and/or other materials provided with the distribution.
>      * Neither the name of the organization nor the
>        names of its contributors may be used to endorse or promote products
>        derived from this software without specific prior written permission.
>
>  THIS SOFTWARE IS PROVIDED BY NICOLAS GARCIA BELMONTE ``AS IS'' AND ANY
>  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
>  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
>  DISCLAIMED. IN NO EVENT SHALL NICOLAS GARCIA BELMONTE BE LIABLE FOR ANY
>  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
>  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
>  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
>  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
>  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
>  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var wai = wai || {};
wai.jit = wai.jit || {
	root : null,
	init : function (graph, rootId) {
		var nodes = graph.nodes();
		nodes.forEach(function (node) {
			node.extra = {};
			node.extra.pos = {
				theta : 0,
				rho : 0
			}
			node.extra.angleSpan = {
				begin : 0,
				end : 0
			};
			node.extra.dim = 3;
			if (node.id == rootId) {
				root = node;
			}
		});
		nodes.forEach(function (node) {
			var adjs = graph.adjacentNodes(node.id);
		});
		return root;
	},

	computeLevels : function (graph, root, startDepth) {
		startDepth = startDepth || 0;
		var nodes = graph.nodes();
		nodes.forEach(function (node) {
			node.extra.depth = -1;
			node.extra.flag = false;
		});
		root.extra.depth = startDepth;
		var queue = [root];
		while (queue.length != 0) {
			var node = queue.pop();
			node.extra.flag = true;
			var adjs = graph.adjacentNodes(node.id);
			for (var i = 0; i < adjs.length; i++) {
				var adj = adjs[i];
				if (adj.extra.depth < 0) {
					adj.extra = adj.extra || {};
					adj.extra.depth = node.extra.depth + 1 + startDepth;
				}
				if (!adj.extra.flag)
					queue.unshift(adj);
			};
		}
	},

	computeAngularWidths : function (graph) {
		this.setAngularWidthForNodes(graph, this.root);
		this.setSubtreesAngularWidth(graph);
	},

	clean : function (graph) {
		graph.nodes().forEach(function (elem) {
			elem.extra.flag = false;
		});
	},

	eachBFS : function (graph, startNode, action) {
		this.clean(graph);
		var queue = [startNode];
		while (queue.length != 0) {
			var node = queue.pop();
			action(node, node.extra.depth);
			var adjs = graph.adjacentNodes(node.id);
			for (var i = 0; i < adjs.length; i++) {
				var adj = adjs[i];
				if (adj.extra.flag == false) {
					adj.extra.flag = true;
					queue.unshift(adj);
				}
			}
		}
	},

	setAngularWidthForNodes : function (graph, root) {
		this.eachBFS(graph, root, function (elem, i) {
			var diamValue = elem.extra.angularWidth || 5;
			elem.extra.angularWidth = diamValue / i;
		});
	},

	setSubtreesAngularWidth : function (graph) {
		var nodes = graph.nodes();
		for (var i = 0; i < nodes.length; i++) {
			this.setSubtreeAngularWidth(graph, nodes[i]);
		};
	},

	setSubtreeAngularWidth : function (graph, elem) {
		var that = this;
		var nodeAW = elem.extra.angularWidth;
		var sumAW = 0;
		this.eachSubnode(graph, elem, function (graph, child) {
			that.setSubtreeAngularWidth(graph, child);
			sumAW += child.extra.treeAngularWidth;
		});
		elem.extra.treeAngularWidth = Math.max(nodeAW, sumAW);
	},

	eachSubnode : function (graph, node, action) {
		this.eachLevel(graph, node, 1, 1, action);
	},

	eachLevel : function (graph, node, levelBegin, levelEnd, action) {
		var d = node.extra.depth,
		that = this;
		var levelEnd = levelEnd === false ? Number.MAX_VALUE - d : levelEnd;
		(function loopLevel(node, levelBegin, levelEnd) {
			var d = node.extra.depth;
			if (d >= levelBegin && d <= levelEnd) {
				action(graph, node, d);
			}
			if (d < levelEnd) {
				var adjs = graph.adjacentNodes(node.id);
				for (var i = 0; i < adjs.length; i++) {
					var adj = adjs[i];
					if (adj.extra.depth > d)
						loopLevel(adj, levelBegin, levelEnd);
				}
			}
		})(node, levelBegin + d, levelEnd + d);
	},

	createLevelDistanceFunc : function (ld) {
		return function (elem) {
			return (elem.extra.depth + 1) * ld;
		};
	},

	computePositions : function (graph, getLength) {
		var that = this;
		var root = this.root;
		var parent = this.parent;

		root.extra.pos = {};
		root.extra.pos.theta = 0;
		root.extra.pos.rho = 0;
		root.extra.span = Math.PI * 2;

		root.extra.angleSpan = {
			begin : 0,
			end : 2 * Math.PI
		};

		this.eachBFS(graph, this.root, function (elem) {
			var angleSpan = elem.extra.angleSpan.end - elem.extra.angleSpan.begin;
			var angleInit = elem.extra.angleSpan.begin;
			var len = getLength(elem);
			//Calculate the sum of all angular widths
			var totalAngularWidths = 0,
			subnodes = [],
			maxDim = {};
			that.eachSubnode(graph, elem, function (graph, sib) {
				totalAngularWidths += sib.extra.treeAngularWidth;
				//get max dim
				dim = sib.extra.dim;
				maxDim = 3;
				subnodes.push(sib);
			});
			//console.log(subnodes.length);
			//Maintain children order
			//Second constraint for <http://bailando.sims.berkeley.edu/papers/infovis01.htm>
			if (parent && parent.id == elem.id && subnodes.length > 0
				 && subnodes[0].dist) {
				subnodes.sort(function (a, b) {
					return (a.dist >= b.dist) - (a.dist <= b.dist);
				});
			}
			//Calculate nodes positions.
			for (var k = 0, ls = subnodes.length; k < ls; k++) {
				var child = subnodes[k];
				if (!child._flag) {
					var angleProportion = child.extra.treeAngularWidth / totalAngularWidths * angleSpan;
					var theta = angleInit + angleProportion / 2;

					child.extra.pos.theta = theta;
					child.extra.pos.rho = len;
					child.extra.span = angleProportion;
					child.extra.dim_quotient = child.extra.dim / maxDim;

					child.extra.angleSpan = {
						begin : angleInit,
						end : angleInit + angleProportion
					};
					angleInit += angleProportion;
				}
			}
		});
	},

	toComplex : function (polar) {
		var x = Math.cos(polar.theta) * polar.rho;
		var y = Math.sin(polar.theta) * polar.rho;
		return {
			'x' : x,
			'y' : y
		};
	},

	computeRgraph : function (graph, rootId) {
		this.root = this.init(graph, rootId);
		this.computeLevels(graph, root, 0);
		this.computeAngularWidths(graph);
		var ld = 130;
		if(root.cat==="Network") ld = 250;		
		var lengthFunc = this.createLevelDistanceFunc(ld);
		this.computePositions(graph, lengthFunc);
		return root;
	},

	setPos : function (graph, root, maxNodeSize) {
		var that = this;
		graph.nodes().forEach(function (node) {
			var pos = that.toComplex(node.extra.pos);
			node.old_x = node.x;
			node.old_y = node.y;
			node.new_x = pos.x;
			node.new_y = pos.y;
			node.old_size = node.size;
			node.new_size = s.settings("maxNodeSize")/((node.extra.depth+1)*0.75);
			node.hidden = false;
			var depthFilter = 2;
			if(root.cat==="VM") depthFilter = 1;
			if(node.extra.depth>depthFilter)
				node.hidden = true;
		});
		graph.edges().forEach(function(e){
			e.color = "#eee";
			e.size = 0.6;
		})
		graph.adjacentEdges(root.id).forEach(function(e){
			if(e.source.match("NW")!=null || e.target.match("NW")!=null ){
				e.color = "#abe437"; 
			} else {
				e.color = "#000";
			}
			e.size = 1;
		});
	},
	
	getPathToRoot : function(graph, startNode, clear) {
		var that = this;
		if(clear) {
			this.clean(graph);
		}
		if(startNode.id==="ROOT") {
			return [startNode];
		} else {
			var adjs = graph.adjacentNodes(startNode.id);
			for(var i=0;i<adjs.length;i++){
				var adj = adjs[i];
				if(adj.extra.flag===false) {
					adj.extra.flag = true;
					var path = that.getPathToRoot(graph, adj, false);
					if(path!=null) {
						return [startNode].concat(path);
					}
				}
			}
		}
	}
};