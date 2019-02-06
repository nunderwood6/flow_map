function wrapper(){


var svg = d3.select("div.map")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

//set svg width
var w = parseFloat(d3.select("div.map").style("width"));
var h = parseFloat(d3.select("div.map").style("height"));

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
var googleColorScale = d3.scaleOrdinal()
                      .domain([1,2,3,4])
                      .range(["#4285F4","#DB4437","#F4B400","#0F9D58"]);

//d3v5 uses promises to load data
//use Promise.all([]).then for multiple files
Promise.all([
  d3.json("data/ne_110m_land.geojson"),
  d3.json("data/ne_110m_admin_0_countries.geojson")
  ])
  .then(function(jsons){
 
    var land = jsons[0].features;
    var countries = jsons[1].features;

    svg.selectAll(".land")
                  .data(land)
                  .enter()
                  .append("path")
                      .attr("d", path)
                      .attr("fill", "#111");
                     // .attr("stroke", "#ddd");


//get centroids of countries
for(country of countries){
    var centroid = d3.geoCentroid(country);
    country.properties.centroid = centroid;

}



    var countries = svg.selectAll(".countries")
                  .data(countries)
                  .enter()
                  .append("path")
                      .attr("d", function(d){
                        return path({
                          type:"LineString",
                          coordinates: [d.properties.centroid,
                                        [centerLocation.longitude,centerLocation.latitude]]
                        });
                      })
                      .attr("stroke", function(d){
                           return googleColorScale(Math.round(Math.random()*4));
                      })
                      .attr("stroke-width", .5)
                      .attr("fill", "none")
                      .attr("stroke-dasharray", "0%,100%")
                      .transition()
                      .duration(3000)
                      .ease(d3.easeLinear)
                      .attr("stroke-dasharray", "100%,0%");



/*
                      .transition()
                        .duration(2000)
                        .attr("d", function(d){
                        return path({
                          type:"LineString",
                          coordinates: [[centerLocation.longitude,centerLocation.latitude],
                                         d.properties.centroid]
                        });
                        });;
*/




  }).catch(function(error){
    if(error){
      console.log(error);
    }
  });

    




}
window.onload = wrapper();
