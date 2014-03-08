//main app functionality
function onLoad(){
  $("#clearGraph").click(clearGraph);
  $("#drawNodes").click(drawNodes);
  $("#drawEdges").click(drawEdges);

}


var width = Math.max(960, window.innerWidth),
    height = Math.max(500, window.innerHeight);

var tiler = d3.geo.tile()
    .size([width, height]);

var projection = d3.geo.mercator()
    .center([-122.4521495,47.249365])
    .scale((1 << 21) / 2 / Math.PI)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path()
				.projection(projection)
				
var d3line2 = d3.svg.line()
	.x(function(d){return projection(d)[0];})
	.y(function(d){return projection(d)[1];})
	.interpolate("linear"); 


function drawNodes() {
	roads = ["data/WA_EdgeGeometry_trim_0.txt","data/WA_EdgeGeometry_trim_1.txt","data/WA_EdgeGeometry_trim_2.txt",
				  "data/WA_EdgeGeometry_trim_3.txt","data/WA_EdgeGeometry_trim_4.txt","data/WA_EdgeGeometry_trim_5.txt",
				  "data/WA_EdgeGeometry_trim_6.txt","data/WA_EdgeGeometry_trim_7.txt","data/WA_EdgeGeometry_trim_8.txt"]
				  
	var rnames = [];
	for(var id = 0, _len = roads.length; id < _len; id++){
		$.get(roads[id],  function (data) {
			console.log(data);
				var lines = data.split("\n");
				for (var i = 0, len = lines.length; i < len; i++) {
					var row = lines[i].split("^");
					var edgelabel = "a".concat(row[0]);
					row.splice(0,4);
					var links = [];
					for(var b=0, leng=row.length/2; b<leng; b++){
								links[b] = [row[b*2+1], row[b*2] ];
					}
				rnames.push(edgelabel);
				svg.append("path")
					.attr("d",d3line2(links))
					.attr("class", edgelabel)
					.attr("stroke", "black")
					.attr("stroke-width", "1px")
					.attr("shape-rendering", "auto")
					.attr("fill", "none");
				}
		});
	}

	var rlen = 0;
	function your_func() {
		if (rlen < rnames.length) {
			svg.select(".".concat(rnames[rlen])).style("stroke", "red");
			rlen++;
		}
	}
	setInterval(function() { your_func(); }, 1);

}

function drawEdges(){
	var projectedCoordinates = [];

	$.get("./data/WA_Nodes_trim.txt",  function (data) {
				var lines = data.split("\n");
				for (var i = 0, len = lines.length; i < len; i++) {
					var row = lines[i].split(" ");
					projectedCoordinates[i] = projection([row[2], row[1]]);
				}
				svg.selectAll("circle")
					.data(projectedCoordinates)
					.enter()
					.append("circle")
					.attr("r",2)
					.style("fill", "red")
					.attr("cx", function(d){ return d[0]; })
					.attr("cy", function(d){ return d[1]; });
	});
}
