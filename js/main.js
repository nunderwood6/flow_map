function wrapper(){


var svg = d3.select("div.map")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

//set svg width
var w = $("div.map").width();
var h = $("div.map").height();

//set projection
//center on boulder
const centerLocation = {
    "longitude": -105.2705,
    "latitude": 40.0150
};

//albers centered on glacier
/*
const albersGlacier = d3.geoConicEqualArea()
                    .parallels([48.4,48.8]) 
                    .rotate([113.5,0,0]) //center longitude
                    .scale(35000)
                    .center([0,48.6]) //center latitude
                    .translate([w/2,h/2]);
*/

const equalEarth = d3.geoEqualEarth()
            .rotate([centerLocation.longitude*-1,0])
            .scale(150)
            .center([0,0])
            .translate([w/2,h/2]);

//path generator
const path = d3.geoPath()
               .projection(equalEarth);

//create scales
var colorScale = d3.scaleSequential(d3.interpolateMagma);

//d3v5 uses promises to load data
//use Promise.all([]).then for multiple files
d3.json("data/ne_110m_land.geojson")
  .then(function(landjson){

    var land = landjson.features;

    svg.selectAll(".land")
                  .data(land)
                  .enter()
                  .append("path")
                      .attr("d", path)
                      .attr("fill", "#111");
                     // .attr("stroke", "#ddd");



  }).catch(function(error){
    if(error){
      console.log("Error loading files");
    }
  });

    




}
window.onload = wrapper();
