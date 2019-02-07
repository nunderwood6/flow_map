function wrapper(){


var mapFrame = false;

var svg;
var resizeCounter = 0;
var scaleFactor;
var w;
var h;

var equalEarth;
var land;
var countries;
var world_bb;
var renderCounter = 0;
var scaleFactor;

//maintain standard digital billboard aspect ratio
//update on resize
function sizeFrame(){
    //get window dimensions
bigW = window.innerWidth;
bigH = window.innerHeight;
aspectRatio = bigW/bigH;

var svgW;
var svgH;

   if(aspectRatio>2.1){
    //size based on height

    //set img dimensions
      d3.select("#svgHolder").style("height", function(d){
      return bigH*.95 + "px";
    });
    d3.select("#svgHolder").style("width", function(d){
      var h = parseFloat(d3.select("#svgHolder").style("height"));
      return h*2.1 + "px";
  });
    

   }else{
    console.log("this");
    //set img dimensions
    d3.select("#svgHolder").style("width", function(d){
      return bigW*.95 + "px";
    });
     d3.select("#svgHolder").style("height", function(d){
      var w = parseFloat(d3.select("#svgHolder").style("width"));
      return w*.4762 + "px";
  });

     d3.select("#imageSequence").style("padding-top", function(d){
       var h = parseFloat(d3.select("#svgHolder").style("height"));
       return (bigH-h)/4 + "px";
    });

   }

   //calculate mapscale
   w = parseFloat(d3.select("div#svgHolder").style("width"));
   h = parseFloat(d3.select("div#svgHolder").style("height"));

   //for projection
   scaleFactor = w/5.676;

if(resizeCounter!=0){
  //and reset svg to fill container
  svg.attr("width", "100%");
  svg.attr("height", "100%");
  //change mapscale
  equalEarth.scale(scaleFactor)
            .translate([w/2,h/2]);
if(mapFrame){
  renderMap();
}
}

resizeCounter++;

};

sizeFrame();

///resize functions
window.addEventListener("resize", resizeThrottler, false);

  var resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        actualResizeHandler();
     
       // The actualResizeHandler will execute at a rate of 15fps
       }, 50);
    }
  }

  function actualResizeHandler() {
    sizeFrame();
    //way to change pin location?
  }


///prep for flow map
//set svg to fill its container
   svg = d3.select("div#svgHolder")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");
//get svg width and height number of pixels
var w = parseFloat(d3.select("div#svgHolder").style("width"));
var h = parseFloat(d3.select("div#svgHolder").style("height"));

//set projection
//center on boulder
const centerLocation = {
    "longitude": -105.2705,
    "latitude": 40.0150
};

   equalEarth = d3.geoEqualEarth()
            .rotate([centerLocation.longitude*-1,0])
            .center([0,0])
            .translate([w/2,h/2])
            .scale(scaleFactor);

//path generator
const path = d3.geoPath()
               .projection(equalEarth);

//create scales
const googleColorScale = d3.scaleOrdinal()
                      .domain([1,2,3,4])
                      .range(["#4285F4","#DB4437","#F4B400","#0F9D58"]);

//d3v5 uses promises to load data
//use Promise.all([]).then for multiple files
Promise.all([
  d3.json("data/ne_110m_land.geojson"),
  d3.json("data/ne_110m_admin_0_countries.geojson"),
  d3.json("data/world_bounding_box.geojson")
  ])
  .then(function(jsons){
    
     land = jsons[0].features;
     countries = jsons[1].features;
     world_bb = jsons[2].features;

    //get centroids of countries, add as property, store color
for(country of countries){
    var centroid = d3.geoCentroid(country);
    country.properties.centroid = centroid;

    country.properties.color = googleColorScale(Math.round(Math.random()*4));

}

}).catch(function(error){
    if(error){
      console.log(error);
    }
  });




var frameIndex = 2;


function frameChanger(){

    setTimeout(function(){

    if(frameIndex == 3){
      mapFrame=false;
      thirdFrame();
      frameIndex = 1;

      setTimeout(function(){
        frameChanger();
      },3000)

    }else if(frameIndex == 2){
      mapFrame = true;
      secondFrame();
      frameIndex = 3;

      //longer second frame
      setTimeout(function(){
        frameChanger();
      },9000)

    }else if(frameIndex == 1){
      firstFrame();
      frameIndex = 2;

      frameChanger();
    }

    },6000);
    


}

firstFrame();
frameChanger();




function firstFrame() {

  console.log("first");

d3.selectAll("#thirdText").remove();
d3.select("#imageFrame").attr("src", "data/fancy_food.jpg");

var firstText=  d3.select("div#svgHolder")
    .append("div")
        .style("position", "absolute")
        .style("left", "-150%")
        .style("top", "2%")
        .style("width", "90%")
        .attr("id", "firstText")
        .style("font-size", function(d){
          console.log(h);
          return h/5.3 + "px";
        })
        .style("color", "#4285F4")
        .text("Students don't intern at Google just for the outrageously good snacks.");

//animate in from left
firstText.transition()
          .duration(2000)
          .style("left","10%");

}


function secondFrame(){

  console.log("second");
  d3.select("#firstText").remove();
  d3.select("#imageFrame").style("display", "none");

  renderMap();

 var secondText1 = d3.select("div#svgHolder")
    .append("div")
        .style("position", "absolute")
        .style("left", "-150%")
        .style("top", "2%")
        .style("width", "90%")
        .attr("id", "secondText")
        .style("font-size", function(d){
          console.log(h);
          return h/7 + "px";
        })
        .style("color", "#0F9D58")
        .text("We come from everywhere,");

//animate in from left
setTimeout(function(){
    secondText1.transition()
          .duration(2000)
          .style("left","6%");
},500)
  


 var secondText2 =  d3.select("div#svgHolder")
    .append("div")
        .style("position", "absolute")
        .style("left", "-150%")
        .style("top", "18%")
        .style("width", "90%")
        .attr("id", "secondText")
        .style("font-size", function(d){
          console.log(h);
          return h/9 + "px";
        })
        .style("color", "#4285F4")
        .text("for an incredible learning experience,");

//animate in from left
setTimeout(function(){
  secondText2.transition()
          .duration(2000)
          .style("left","6%");
},2500);


var secondText3 = d3.select("div#svgHolder")
    .append("div")
        .style("position", "absolute")
        .style("left", "-150%")
        .style("top", "32%")
        .style("width", "90%")
        .attr("id", "secondText")
        .style("font-size", function(d){
          console.log(h);
          return h/9 + "px";
        })
        .style("color", "#4285F4")
        .text("to work with brilliant people");

//animate in from left
setTimeout(function(){
  secondText3.transition()
          .duration(2000)
          .style("left","6%");
},4500);

 var secondText4 = d3.select("div#svgHolder")
    .append("div")
        .style("position", "absolute")
        .style("left", "-150%")
        .style("top", "46%")
        .style("width", "90%")
        .attr("id", "secondText")
        .style("font-size", function(d){
          console.log(h);
          return h/9 + "px";
        })
        .style("color", "#4285F4")
        .text("and make the world a better place.");

//animate in from left
setTimeout(function(){
  secondText4.transition()
          .duration(2000)
          .style("left","6%");
},6500);

  var secondText5 = d3.select("div#svgHolder")
    .append("div")
        .style("position", "absolute")
        .style("left", "-150%")
        .style("top", "57%")
        .style("width", "90%")
        .attr("id", "secondText")
        .style("font-size", function(d){
          console.log(h);
          return h/7 + "px";
        })
        .style("color", "#F4B400")
        .text("but also, the snacks are unreal.");

//animate in from left
setTimeout(function(){
  secondText5.transition()
          .duration(2000)
          .style("left","6%");
},9000);






}


function thirdFrame(){

  console.log("third");

  d3.selectAll("#secondText").remove();
  svg.selectAll(".countries,.land").remove();

  //make third frame visible
  d3.select("#imageFrame").style("display", "block");
 var image = d3.select("#imageFrame")
      .attr("src", "data/search.png")
      .style("filter", "blur(3px)")
      .style("-webkit-filter", "blur(3px)");


  var thirdText1 = d3.select("div#svgHolder")
    .append("div")
        .style("position", "absolute")
        .style("left", "-150%")
        .style("top", "2%")
        .style("width", "97%")
        .attr("id", "thirdText")
        .style("font-size", function(d){
          console.log(h);
          return h/9.2 + "px";
        })
        .style("color", "#0F9D58")
        .text("Don't worry too much about introductions.");

//animate in from left
    thirdText1.transition()
          .duration(2000)
          .style("left","2%");

//fade in photo
    setTimeout(function(){
      image.transition()
          .duration(2000)
          .style("filter", "blur(0px)")
          .style("-webkit-filter", "blur(0px)");

    },2000);
    
//second text
  var thirdText1 = d3.select("div#svgHolder")
    .append("div")
        .style("position", "absolute")
        .style("left", "-150%")
        .style("top", "80%")
        .style("width", "95%")
        .attr("id", "thirdText")
        .style("font-size", function(d){
          console.log(h);
          return h/9.2 + "px";
        })
        .style("color", "#0F9D58")
        .text("We've already seen your search history.");

//animate in from left
    setTimeout(function(){
      thirdText1.transition()
          .duration(2000)
          .style("left","2%");

    },4000)
    

}

/////render map!! ///////
///////////////////////////
function renderMap() {
//remove if already rendered
svg.selectAll(".land").remove();
svg.selectAll(".countries").remove();

//draw land
    svg.selectAll(".land")
                  .data(land)
                  .enter()
                  .append("path")
                      .attr("d", path)
                      .attr("fill", "#3f3f3f")
                      .attr("class", "land");
                     // .attr("stroke", "#ddd");  

  if(renderCounter == 0){
      //draw paths from country centroids to boulder
        var countryRef = svg.selectAll(".countries")
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
                           return d.properties.color;
                      })
                      .attr("stroke-width", .4)
                      .attr("fill", "none")
                      .attr("stroke-dasharray", "0%,100%")
                      .attr("class","countries");
    

      //animate drawing with stroke-dasharray
             countryRef.transition()
                      .duration(1500)
                      .ease(d3.easeLinear)
                      .attr("stroke-dasharray", function(d){
                        var length = d3.select(this).node().getTotalLength();
                        return length + ",0%";
                        "100%,0%"
                      });

  } else {

      //draw paths from country centroids to boulder
        var countryRef = svg.selectAll(".countries")
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
                           return d.properties.color;
                      })
                      .attr("stroke-width", .4)
                      .attr("fill", "none")
                      .attr("class","countries");

  }

}

    


}
window.onload = wrapper();
