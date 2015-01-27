;(function(undefined) {
	var imgCache = {};

	var drawImage = function (node,x,y,size,context) {
    if(s && node.image && node.image.url) {
      var url = node.image.url;
      var ih = node.image.h || 1; // 1 is arbitrary, anyway only the ratio counts
      var iw = node.image.w || 1;
      var scale = node.image.scale || 1;
      var clip = node.image.clip || 1;

      // create new IMG or get from imgCache
      var image = imgCache[url];
      if(!image) {
        image = document.createElement('IMG');
        image.src = url;
        image.onload = function(){
          s.refresh();
        };
        imgCache[url] = image;
      }

      // calculate position and draw
      var xratio = (iw<ih) ? (iw/ih) : 1;
      var yratio = (ih<iw) ? (ih/iw) : 1;
      var r = size*scale;

      // Draw the clipping disc:
      context.save(); // enter clipping mode
      context.beginPath();
      context.arc(x,y,size*clip,0,Math.PI*2,true);
      context.closePath();
      context.clip();

      // Draw the actual image
      context.drawImage(image,
          x+Math.sin(-3.142/4)*r*xratio,
          y-Math.cos(-3.142/4)*r*yratio,
          r*xratio*2*Math.sin(-3.142/4)*(-1),
          r*yratio*2*Math.cos(-3.142/4));
      context.restore(); // exit clipping mode
    }
  }

	sigma.canvas.nodes.vist = function(node, context, settings) {	
		var prefix = settings('prefix') || '';
		
		var x = node[prefix + 'x'];
		var y = node[prefix + 'y'];
		var size = node[prefix + 'size'];

		context.fillStyle = node.color || settings('defaultNodeColor');
		context.beginPath();
		context.arc(
			x,
			y,
			size,
			0,
			Math.PI * 2,
			true
		);

		context.closePath();
		context.fill();

		// Adding a border
		context.lineWidth = node.borderWidth || 1;
		context.strokeStyle = node.borderColor || '#fff';
		context.stroke();
		
		drawImage(node, node[prefix + 'x'], node[prefix + 'y'], node.size || 1, context)
	};
	
	sigma.canvas.labels.vist = function(node, context, settings) {
    var fontSize,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'];
				
    if (size < settings('labelThreshold'))
      return;
			
    if (!node.label || typeof node.label !== 'string')
      return;
			
    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

		var x = node[prefix + 'x'];
		var y = node[prefix + 'y'];
		var dif_x = x - wai.jit.root[prefix + 'x'];
		var dif_y = y - wai.jit.root[prefix + 'y'];
		var theta = Math.atan2(dif_y, dif_x);
		var label = node.label;
		
		if(Math.abs(theta)>Math.PI/2) {
			context.fillText(
				label,
				Math.round(x-label.length*8-size-3),
				Math.round(y+fontSize/3));
		} else {
			context.fillText(
				label,
				Math.round(x+size+3),
				Math.round(y+fontSize/3));
		}
	};
}).call(this);