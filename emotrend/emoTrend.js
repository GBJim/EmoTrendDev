var Height = 650;


function drawMini(words) {
  //remove previous text
    d3.select("#miniCloud")
      .selectAll("g").remove();

    var miniCloud= d3.select("#miniCloud")
            .append("g")
            .attr("transform", "translate(150,150)");

      miniCloud.append("circle")
                .attr("stroke","black")
                .attr("stroke-width","2px")
                .on("click", function(){showChart(words[0].href,showEmotion);})
                .transition()
                .duration(1000) 
                .attr("fill", "white")   
                .attr("r", function(d){return 140;} )
                .attr("stroke","black");
        

    miniCloud.selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .on("click", function(d){showChart(d.href,showEmotion);})
            .transition()
            .style("font-size", function(d) { return d.size + "px"; })
           
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                 return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
            .text(function(d) { return d.text; });
  }


function draw(words) {
  var tmpSize;
    xy=position[words[0].href];
    var wordCloud= d3.select("#wordCloud")
            .append("g")
            .attr("class","wordCircle")
                    .on("mouseover",function(){
                        tmpSize =  d3.select(this).select()
                        d3.select(this).selectAll("text").style("font-weight", "bold").style("font-style","oblique");
          d3.select(this).selectAll("circle").transition().attr("fill-opacity",1);})
                     .on("mouseout",function(){
                      d3.select(this).selectAll("text").style("font-weight", "normal").style("font-style","normal");
          d3.select(this).selectAll("circle").transition().attr("fill-opacity",0.1);})
                      .on("click", function(){showChart(words[0].href,showEmotion);});
  
            




        wordCloud
        .append("circle").attr("stroke-width","2px")
        .on("mouseover",function(){
          d3.select(this).transition().attr("fill-opacity",1);})
        .on("mouseout",function(){
          d3.select(this).transition().attr("fill-opacity",0.2);})
       
        .transition().duration(1000) 
        .attr("fill", getRandomColor())   
        .attr("fill-opacity",0.1)
         .attr("stroke","black")
          .attr("stroke-opacity",0.1)

        .attr("r", function(d){return words[0].radius+"px";} );
        
        

    var moveScale = words[0].radius /90;

      wordCloud.
      selectAll("text")
              .data(words)
              .enter().append("text")
              .on("click", function(d){showChart(d.href,showEmotion);})
              .transition()
              .duration(2000)
              .style("font-size", function(d) { return Math.sqrt(d.radius)*d.size/9 + "px"; })
             
              .style("fill", function(d, i) { return fill(i); })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                  return "translate(" + [d.x*moveScale, d.y*moveScale] + ")rotate(" + d.rotate + ")";})
              .text(function(d) { return d.text; });
  
wordCloud.attr("transform", "translate(" + scale(xy[0])+","+(Height-xy[1])+")");

  }
var total;
  function showEmotion(data){

 var ndx = crossfilter(data);
 var dateDim  = ndx.dimension(function(d) {return d.date;});

var trustCount=dateDim.group().reduceSum(function(d) 
  {if (d.variable == "trust"){return d.value; } else{return 0;}    });
var disgustCount=dateDim.group().reduceSum(function(d) 
  {if (d.variable == "disgust"){return d.value; } else{return 0;}    });
var surpriseCount=dateDim.group().reduceSum(function(d) 
  {if (d.variable == "surprise"){return d.value; } else{return 0;}    });
var sadenessCount=dateDim.group().reduceSum(function(d) 
  {if (d.variable == "sadness"){return d.value; } else{return 0;}    });
var angerCount=dateDim.group().reduceSum(function(d) 
  {if (d.variable == "anger"){return d.value; } else{return 0;}    });
var fearCount=dateDim.group().reduceSum(function(d) 
  {if (d.variable == "fear"){return d.value; } else{return 0;}    });
var joyCount=dateDim.group().reduceSum(function(d) 
  {if (d.variable == "joy"){return d.value; } else{return 0;}    });
var anticipationCount=dateDim.group().reduceSum(function(d) {
  if (d.variable == "anticipation"){return d.value; } else{return 0;}    });
total=dateDim.group().reduceSum(function(d) {
 return d.value;     });

var minDate = dateDim.bottom(1)[0].date;
var maxDate = dateDim.top(1)[0].date;


var EmotionDim  = ndx.dimension(function(d) {return d.variable;});
var EmotionTotal = EmotionDim.group().reduceSum(function(d) {return d.value;});
var EmotionRingChart   = dc.pieChart("#EmotionDim");

hitslineChart
   .width(700).height(550)
   .dimension(dateDim)
   .ordinalColors(["#D40000","#FFA854","#FF54FF","#008000","#FFFF54","#5151FF",'#59BDFF','#54FF54'])
   .group(angerCount,"anger")
   .stack(anticipationCount,"anticipation")
   .stack(disgustCount,"disgust")
   .stack(fearCount,"fear")
   .stack(joyCount,"joy")
   .stack(sadenessCount,"sadeness")
   .stack(surpriseCount,'surprise')
   .stack(trustCount,'trust')
   .renderArea(true)
   .x(d3.time.scale().domain([minDate,maxDate]))
   .y(d3.scale.linear().domain([0, total.top(1)[0].value]))
   .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
   .yAxisLabel("Emotion Counts");

EmotionRingChart
    .width(335).height(335)
    .dimension(EmotionDim )
    .group(EmotionTotal)
    .ordinalColors(["#D40000","#FFA854","#FF54FF","#008000","#FFFF54","#5151FF",'#59BDFF','#54FF54'])
    .innerRadius(80)
    .legend(dc.legend().x(130).y(100).itemHeight(13).gap(5))
    .renderLabel(false)
    .renderTitle(false) ; 

dc.renderAll();
}



  function layout(wordList,number) {
   d3.layout.cloud().size([200, 200])
      .words(wordList.map(function(d) {
        return {text: d[0], size: d[1]*3.5 , href: number,radius:radius[number]};
      }))
     
      .rotate(function(d) { return ~~(Math.random() * 5) * 30 - 60; })
      
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
  
  }



function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}





  function expandChart(){

d3.select("#wordCloud")
          .transition()
          .ease("bounce")
          .duration(1000)
          .attr("width","1000").
          attr("height",Height);

d3.select("#chart-line")
          .selectAll("svg")
          .transition()
          .attr("width","0");

d3.select("#EmotionDim")
          .selectAll("svg")
          .transition()
          .attr("width","0");

d3.select("#miniCloud")
          .transition()
          .attr("width","0");

 $(".tag").hide();
  $(".myButton").hide();

}

function showChart(i, callback){
d3.select("#wordCloud").transition()
                      .attr("width","0");
d3.select("#miniCloud").transition()
                      .attr("width","400")
                      .attr("height","400");
                      
d3.layout.cloud().size([200, 200])
      .words(wordSet[i].map(function(d) {
        return {text: d[0], size: d[1]*3.5 , href: i};
      }))
      .padding(0)
      .rotate(function(d) { return ~~(Math.random() * 5) * 30 - 60; })

      .fontSize(function(d) { return d.size; })

      .on("end", drawMini)
      .start();

loadJSON("test/"+i+".json",
         function(data) { 
emoData = data;

    emoData.forEach(function(d) {
    d.date = parseDate(d.date);});

   emoData=melt(emoData,["date"]);
    callback(emoData);



          },
         function(xhr) { console.error(xhr); }
);




   $(".tag").show();
   $(".myButton").show();
}



function zoomed() {
  svg.call(xAxis);
zoomer=Math.sqrt(radiusScale(1200))/100;
  d3.selectAll(".wordCircle")
    .data(position)
    .transition()
    .duration(500)
    .attr("transform",function(d){
      return "translate("+scale(d[0])+","+(Height-d[1])+"),scale("+zoomer+","+zoomer+")";});}

function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

var emoData;

var parseDate = d3.time.format("%m/%d/%Y").parse;



var fill = d3.scale.category20();
var scale = d3.time.scale()
            .domain([new Date("2013-04-01"),new Date("2013-04-30")])
            .range([30,1000]);

var radiusScale = d3.scale.linear()
                    .domain([10,10000])
                    .range([10000,100]);

var zoom = d3.behavior.zoom()
              .x(scale)
              .y(radiusScale)
              .on("zoom",zoomed);




var xAxis= d3.svg.axis()
    .scale(scale). tickSize(-Height, 0, 0)
    .orient("bottom");

