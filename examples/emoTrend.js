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
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                 return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
            .text(function(d) { return d.text; });
  }





function draw(words) {
    xy=position[words[0].href];
    
   var wordCloud= d3.select("#wordCloud")
            .append("g")
            .attr("class","wordCircle")
            .attr("transform", "translate(" + scale(xy[0])+","+(700-xy[1])+")");

        wordCloud
        .append("circle").attr("stroke","black").attr("stroke-width","2px")
        .on("mouseover",function(){
          d3.select(this).transition().attr("fill","orange");})
        .on("mouseout",function(){
          d3.select(this).transition().attr("fill","white");})
        .on("click", function(){showChart(words[0].href,showEmotion);})
        .transition().duration(1000) 
        .attr("fill", "white")   
        .attr("r", function(d){return 1.1*Math.sqrt(radiusScale(1));} )
        .attr("stroke","black");
        

        
      wordCloud.selectAll("text")
              .data(words)
              .enter().append("text")
              .on("click", function(d){showChart(d.href,showEmotion);})
              .transition()
              .duration(2000)
              .style("font-size", function(d) { return d.size + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { return fill(i); })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
              .text(function(d) { return d.text; });
  


  }

  function showEmotion(data){

 var ndx = crossfilter(data);
 var dateDim  = ndx.dimension(function(d) {return d.date;});

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
var hopeCount=dateDim.group().reduceSum(function(d) {
  if (d.variable == "hope"){return d.value; } else{return 0;}    });

var minDate = dateDim.bottom(1)[0].date;
var maxDate = dateDim.top(1)[0].date;


var EmotionDim  = ndx.dimension(function(d) {return d.variable;});
var EmotionTotal = EmotionDim.group().reduceSum(function(d) {return d.value;});
var EmotionRingChart   = dc.pieChart("#EmotionDim");

hitslineChart
   .width(700).height(550)
   .dimension(dateDim)
   .ordinalColors(["#dc0047","#007b33","#f2993a","#edc500","#729dc9","#fadb4d"])
   .group(angerCount,"anger")
   .stack(fearCount,"fear")
   .stack(hopeCount,"hope")
   .stack(joyCount,"joy")
   .stack(sadenessCount,"sadness")
   .stack(surpriseCount,"surprise") 
   .renderArea(true)
   .x(d3.time.scale().domain([minDate,maxDate]))
   .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
   .yAxisLabel("Emotion Counts");

EmotionRingChart
    .width(300).height(300)
    .dimension(EmotionDim )
    .group(EmotionTotal)
    .ordinalColors(["#dc0047","#007b33","#f2993a","#edc500","#729dc9","#fadb4d"])
    .innerRadius(80)
    .legend(dc.legend().x(130).y(100).itemHeight(13).gap(5))
    .renderLabel(false)
    .renderTitle(false) ; 

dc.renderAll();
}

  function layout(wordList,number) {
   d3.layout.cloud().size([200, 200])
      .words(wordList.map(function(d) {
        return {text: d[0], size: d[1]*3.5 , href: number};
      }))
      .padding(1)
      .rotate(function(d) { return ~~(Math.random() * 5) * 30 - 60; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })

      .on("end", draw)
      .start();
  
  }


  function expandChart(){

d3.select("#wordCloud")
          .transition()
          .ease("bounce")
          .duration(1000)
          .attr("width","1000").
          attr("height","600");

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
      .font("Impact")
      .fontSize(function(d) { return d.size; })

      .on("end", drawMini)
      .start();

callback(emotionData[i]);

   $(".tag").show();
}



function zoomed() {
  svg.call(xAxis);
zoomer=Math.sqrt(radiusScale(1200))/100;
  d3.selectAll(".wordCircle")
    .data(position)
    .transition()
    .duration(500)
    .attr("transform",function(d){
      return "translate("+scale(d[0])+","+(700-d[1])+"),scale("+zoomer+","+zoomer+")";});}



var wordSet=[[["explosion",11],["marathon",11],["Boston",9],  ["line",4],["injured",8],],[["congress",5], ["news",6], ["immigration",4],["newtown",2],["bill",4]]];


var position = [[new Date("2013-04-15"),410],[new Date("2013-04-08"),300],[400,400]];

var emotionData = [[
    {"surprise":0,"sadness":1,"anger":1,"fear":2,"joy":1,"hope":1,"date":"04/08/2013"},
    {"surprise":0,"sadness":0,"anger":0,"fear":2,"joy":1,"hope":1,"date":"04/09/2013"},
    {"surprise":1,"sadness":3,"anger":1,"fear":3,"joy":1,"hope":1,"date":"04/10/2013"},
  {"surprise":1,"sadness":2,"anger":2,"fear":1,"joy":1,"hope":1,"date":"04/11/2013"},
  {"surprise":2,"sadness":2,"anger":0,"fear":3,"joy":3,"hope":2,"date":"04/12/2013"},
  {"surprise":2,"sadness":1,"anger":1,"fear":3,"joy":3,"hope":2,"date":"04/13/2013"},
  {"surprise":5,"sadness":8,"anger":0,"fear":4,"joy":11,"hope":4,"date":"04/14/2013"},
  {"surprise":11,"sadness":7,"anger":3,"fear":12,"joy":30,"hope":13,"date":"04/15/2013"},
  {"surprise":62,"sadness":114,"anger":32,"fear":136,"joy":42,"hope":112,"date":"04/16/2013"},
  {"surprise":135,"sadness":20,"anger":20,"fear":108,"joy":27,"hope":59,"date":"04/17/2013"}],
[
  {"surprise":108,"sadness":150,"anger":15,"fear":53,"joy":15,"hope":151,"date":"04/08/2013"},
   {"surprise":10,"sadness":22,"anger":3,"fear":12,"joy":1,"hope":4,"date":"04/09/2013"},
   {"surprise":4,"sadness":5,"anger":3,"fear":4,"joy":1,"hope":3,"date":"04/10/2013"},
   {"surprise":1,"sadness":4,"anger":2,"fear":2,"joy":1,"hope":1,"date":"04/11/2013"},
   {"surprise":2,"sadness":1,"anger":1,"fear":0,"joy":0,"hope":2,"date":"04/12/2013"},
   {"surprise":2,"sadness":3,"anger":0,"fear":2,"joy":0,"hope":0,"date":"04/13/2013"},
   {"surprise":0,"sadness":2,"anger":1,"fear":1,"joy":0,"hope":0,"date":"04/14/2013"},
   {"surprise":6,"sadness":6,"anger":1,"fear":0,"joy":1,"hope":0,"date":"04/15/2013"},
]]; 

var parseDate = d3.time.format("%m/%d/%Y").parse;

emotionData.forEach(function(data,i) {
    data.forEach(function(d) {
    d.date = parseDate(d.date);});
   emotionData[i]=melt(emotionData[i],["date"])
    
});

var fill = d3.scale.category20();
var scale = d3.time.scale()
            .domain([new Date("2013-04-01"),new Date("2013-04-30")])
            .range([0,1000]);

var radiusScale = d3.scale.linear()
                    .domain([10,10000])
                    .range([10000,100]);

var zoom = d3.behavior.zoom()
              .x(scale)
              .y(radiusScale)
              .on("zoom",zoomed);




var xAxis= d3.svg.axis()
    .scale(scale). tickSize(-450, 0, 0)
    .orient("bottom");

