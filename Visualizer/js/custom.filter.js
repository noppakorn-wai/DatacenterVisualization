function updatePane(graph) {
	var categories = {};
	// read nodes
	graph.nodes().forEach(function (n) {
		categories[n.cat] = true;
	});

	// node category
	var nodecategoryElt = $('#node-category')[0];
	Object.keys(categories).forEach(function (c) {
		var optionElt = document.createElement("option");
		optionElt.text = c;
		nodecategoryElt.add(optionElt);
	});
};
// Initialize the Filter API
filter = new sigma.plugins.filter(s);
updatePane(s.graph);
function applyCategoryFilter(e) {
	var c = e.target[e.target.selectedIndex].value;
	s.graph.nodes().forEach(function (node) {
		node.hidden = !1;
		if(c==="all") {
			if(node.extra.depth>3)
				node.hidden = true;
			node.old_size = node.size;
			node.size = node.new_size = s.settings("maxNodeSize")/(node.extra.depth+1);
		} else {
			if (node.cat === c) {
				node.old_size = node.size;
				node.new_size = s.settings("maxNodeSize");
			} else {
				node.old_size = node.size;
				node.new_size = s.settings("maxNodeSize")/10;
			}
		}
	});
	var step = 0;
	var prefix = ['old_', 'new_'][step = +!step];
	sigma.plugins.animate(
		s,
		{
			size: prefix + 'size'
		}
	);
}
$('#node-category').on("change", applyCategoryFilter);
