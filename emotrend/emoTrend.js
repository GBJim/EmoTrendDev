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
            




        wordCloud
        .append("circle").attr("stroke-width","2px")
        .on("mouseover",function(){
          d3.select(this).transition().attr("fill","orange");})
        .on("mouseout",function(){
          d3.select(this).transition().attr("fill","green");})
        .on("click", function(){showChart(words[0].href,showEmotion);})
        .transition().duration(1000) 
        .attr("fill", "green")   
        .attr("fill-opacity",0.1)
         .attr("stroke","black")
          .attr("stroke-opacity",0.1)

        .attr("r", function(d){return words[0].radius;} );
        
        

        
      wordCloud.append("g").attr("width",50).attr("height",50).
      selectAll("text")
              .data(words)
              .enter().append("text")
              .on("click", function(d){showChart(d.href,showEmotion);})
              .transition()
              .duration(2000)
              .style("font-size", function(d) { return Math.sqrt(d.radius)*d.size/10 + "px"; })
              .style("font-family", "Ubuntu")
              .style("fill", function(d, i) { return fill(i); })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
              .text(function(d) { return d.text; });
  
wordCloud.attr("transform", "translate(" + scale(xy[0])+","+(700-xy[1])+")");

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
        return {text: d[0], size: d[1]*3.5 , href: number,radius:radius[number]};
      }))
      .padding(-10)
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

var radius = [
200,
177,
161,
159,
141,
133,
105,
101,
100,
98,
91,
90,
89,
88,
86,
85,
83,
81,
78,
74,
73,
72,
70,
69,
68,
66,
66,
65,
64,
64,
63,
62,
61,
61,
61,
56,
56,
54,
53,
52,
52,
52,
51,
51,
];

var wordSet =[
[["thanks",5],["idol",5],["vote",5],["appreciate",5],["girlfriend",5],],
[["much",5],["i",5],["spend",5],["confessionnight",5],],
[["music",5],["group",5],["whatever",5],["rumor",5],],
[["morning",5],["early",5],["wednesday",5],["square",5],["8am",5],],
[["house",5],["road",5],["scorpio",5],["10th",5],["future",5],],
[["leave",5],["still",5],["good",5],["feel",5],["too",5],],
[["smile",5],["hotel",5],["behind",5],["everyday",5],["jb",5],],
[["dead",5],["dong",5],["ding",5],["witch",5],["speak",5],],
[["lil",5],["za",5],],
[["join",5],["stamford",5],["mourinho",5],["bridge",5],["falcao",5],],
[["forever",5],["scene",5],["alone",5],["realize",5],["couple",5],],
[["hair",5],["my",5],["cut",5],["6",5],],
[["use",5],["normally",5],["danielsahyounie",5],["code",5],["key",5],],
[["visit",5],["guarantee",5],["my",5],["taylor",5],["earn",5],],
[["bro",5],["boot",5],],
[["boston",5],["confirm",5],["tragic",5],["area",5],["pd",5],],
[["dog",5],["breed",5],["cat",5],["sunday",5],["pet",5],],
[["speak",5],["chinese",5],["truth",5],["bro",5],["alfredoflore",5],],
[["homework",5],["payne",5],["clean",5],["real",5],["outside",5],],
[["cover",5],["nfl",5],["sportsnation",5],["lion",5],["reveal",5],],
[["korea",5],["north",5],["cnbc",5],["bomb",5],["attack",5],],
[["mouth",5],["taste",5],["sloth",5],["cereal",5],["flake",5],],
[["bomb",5],["muslim",5],["suspicious",5],["spread",5],["threaten",5],],
[["dark",5],["ii",5],["soul",5],["star",5],],
[["obama",5],["target",5],["release",5],["republican",5],["tax",5],],
[["luck",5],["exam",5],["good",5],],
[["meeting",5],["nayarivera",5],["schedule",5],["brittana",5],["busy",5],],
[["apparently",5],["mg",5],["twin",5],["robin",5],],
[["ready",5],["fresh",5],["i",5],["st.",5],["n",5],],
[["across",5],["prob",5],["lounge",5],["contagion",5],],
[["de",5],["evra",5],["vidic",5],["smalling",5],["rio",5],],
[["war",5],["lanadelpuke",5],],
[["release",5],["tim",5],["my",5],["sportscenter",5],["adamschefter",5],],
[["training",5],["alan",5],["2013",5],["nufcofficial",5],["session",5],],
[["m",5],["skin",5],["g",5],["2013",5],["a",5],],
[["tom",5],["andy",5],["involve",5],["larry",5],["josh",5],],
[["wednesday",5],["selenagomez",5],["1230",5],["03",5],],
[["chinese",5],["tip",5],["medicine",5],["katyperry",5],],
[["pay",5],["i",5],["attention",5],],
[["crap",5],["minty",5],["lash",5],["mini",5],["toothpaste",5],],
[["fail",5],["audience",5],["per",5],],
[["paul",5],["civil",5],["republican",5],["university",5],["2013",5],],
[["common",5],["forest",5],["perch",5],["derby",5],],
[["total",5],["viewer",5],],
]



var position =[[new Date("2013-04-25"),68],
[new Date("2013-04-29"),61],
[new Date("2013-04-25"),136],
[new Date("2013-04-10"),36],
[new Date("2013-04-10"),72],
[new Date("2013-04-29"),122],
[new Date("2013-04-25"),204],
[new Date("2013-04-8"),91],
[new Date("2013-04-25"),272],
[new Date("2013-04-25"),340],
[new Date("2013-04-25"),408],
[new Date("2013-04-29"),183],
[new Date("2013-04-29"),244],
[new Date("2013-04-29"),305],
[new Date("2013-04-10"),108],
[new Date("2013-04-15"),183],
[new Date("2013-04-7"),275],
[new Date("2013-04-10"),144],
[new Date("2013-04-7"),550],
[new Date("2013-04-25"),476],
[new Date("2013-04-3"),550],
[new Date("2013-04-25"),544],
[new Date("2013-04-15"),366],
[new Date("2013-04-10"),180],
[new Date("2013-04-10"),216],
[new Date("2013-04-29"),366],
[new Date("2013-04-10"),252],
[new Date("2013-04-10"),288],
[new Date("2013-04-29"),427],
[new Date("2013-04-8"),182],
[new Date("2013-04-8"),273],
[new Date("2013-04-8"),364],
[new Date("2013-04-29"),488],
[new Date("2013-04-10"),324],
[new Date("2013-04-10"),360],
[new Date("2013-04-8"),455],
[new Date("2013-04-15"),549],
[new Date("2013-04-10"),396],
[new Date("2013-04-29"),549],
[new Date("2013-04-10"),432],
[new Date("2013-04-8"),546],
[new Date("2013-04-10"),468],
[new Date("2013-04-10"),504],
[new Date("2013-04-10"),540],
]




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
            .domain([new Date("2013-04-1"),new Date("2013-04-30")])
            .range([30,1000]);

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

