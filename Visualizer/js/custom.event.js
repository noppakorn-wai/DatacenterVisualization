//Event binding
s.bind(' clickNode', function (e) {
	$("#node-category").val("all");
	$("#node-category").change();
	var root = wai.jit.computeRgraph(s.graph, e.data.node.id);
	wai.jit.setPos(s.graph, root, s.settings("maxNodeSize"));
	var step = 0;
	var prefix = ['old_', 'new_'][step =  + !step];
	sigma.plugins.animate(
		s, {
		x : prefix + 'x',
		y : prefix + 'y',
		size : prefix + 'size',
		color : prefix + 'color'
	});
	while (s.camera.isAnimated)
		s.camera.goTo({
			x : root.x,
			y : root.y,
			ratio : 1
		});
		$('#breadcrumb').html("");
		wai.jit.getPathToRoot(s.graph, root, true).reverse().forEach( function(n) {
			$('#breadcrumb').html($('#breadcrumb').html() + n.toLink());
		});
	$("#node-data").html("Node ID:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + root.id + "<br/>Node type:&nbsp;&nbsp;&nbsp;" + root.cat + "<br/>Node name: " + root.label + "<br/>Status:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fine");
});
s.bind('overNode outNode doubleClickNode rightClickNode', function (e) {
	//console.log(e.type, e.data.node.label, e.data.captor);
});
s.bind('overEdge outEdge clickEdge doubleClickEdge rightClickEdge', function (e) {
	//console.log(e.type, e.data.edge, e.data.captor);
});
s.bind('clickStage', function (e) {
	//console.log(e.type, e.data.captor);
});

s.bind('doubleClickStage rightClickStage', function (e) {
	//console.log(e.type, e.data.captor);
});

$("#search").on("focus", function () {
	s.graph.nodes().forEach(function (node) {
		node.old_size = node.size;
		node.size = node.new_size = s.settings("maxNodeSize") / 10;
		node.hidden = !1;
	});
	s.camera.goTo({x: s.camera.x, y: s.camera.y, ratio: 2});
	s.refresh();
});

$("#search").on("blur", function () {
	$("#search").val("");
	s.graph.nodes().forEach(function (node) {
		node.old_size = node.size;
		node.size = node.new_size = s.settings("maxNodeSize") / (node.extra.depth + 1);
		if (node.extra.depth > 2)
			node.hidden = true;
	});
	$("#searchCounter").html("");
	s.camera.goTo({x: s.camera.x, y: s.camera.y, ratio: 1});
	s.refresh();
});

$("#search").on("keyup", function () {
	s.camera.goTo({x: s.camera.x, y: s.camera.y, ratio: 2});
	var count = 0;
	s.graph.nodes().forEach(function (node) {
		if ($("#search").val()!=="" && node.label.toLowerCase().match($("#search").val().toLowerCase()) != null) {
			count++;
			console.log(node.label);
			node.old_size = node.size;
			node.new_size = s.settings("maxNodeSize") / 1.5;
		} else {
			node.old_size = node.size;
			node.new_size = s.settings("maxNodeSize") / 15;
		}
	});
	$("#searchCounter").html("Found " + count + " nodes");
	var step = 0;
	var prefix = ['old_', 'new_'][step =  + !step];
	sigma.plugins.animate(
		s, {
		x : prefix + 'x',
		y : prefix + 'y',
		size : prefix + 'size',
		color : prefix + 'color'
	});
});

$(document).ready(function () {
	var sq = {};
	sq.e = document.getElementById("container");
	if (sq.e.addEventListener) {
		sq.e.addEventListener("mousewheel", MouseWheelHandler, 1);
		sq.e.addEventListener("DOMMouseScroll", MouseWheelHandler, 1);
	} else
		sq.e.attachEvent("onmousewheel", MouseWheelHandler);

	function MouseWheelHandler(e) {
		/*if (s.camera.ratio > 0.5) {
		var root = wai.jit.computeRgraph(s.graph, "ROOT");
		wai.jit.setPos(s.graph);
		s.refresh();
		s.camera.goTo({
		x : root.x,
		y : root.y,
		ratio : 1
		});
		}*/
	};
});


