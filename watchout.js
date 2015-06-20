// start slingin' some d3 here.
var enemiesData = [];
var playerData = [{
  x: Math.floor(Math.random() * 900),
  y: Math.floor(Math.random() * 800)
}];
var player, enemies, gameBoard, animateIntervalID, collisionCheckID;
var startScoring = false;
var score = 0;
var numEnemies = 25;
var highScore = 0;
var scoreField = document.getElementById('currentScoreSpan');
var highScoreField = document.getElementById('highScoreSpan');
var drag = d3.behavior.drag().on('drag',function(){

  if(event.y > 150 && event.y < 900 && event.x > 100 && event.y < 1000){
    player.attr('cx',d3.event.x).attr('cy',d3.event.y);
    playerData.x = d3.event.x;
    playerData.y = d3.event.y;
    startScoring = true;
  }
});

document.getElementById('reset').addEventListener('click', function(event){
  //game();
  //try to fix bug for immediate explosion on game restart
  startScoring = false;
  score = 0;
  playerData = [{
    x: Math.floor(Math.random() * 900),
    y: Math.floor(Math.random() * 800)
  }];
  player.attr('r',20).attr('fill','#00ff00').attr('fill-opacity',1).attr('cx',playerData[0].x).attr('cy',playerData[0].y);

  animateIntervalID = setInterval(animateEnemies,4020);
  collisionCheckID = setInterval(collisionCheck,200);
  animateEnemies();


})

var positionGenerator = function(){
  var retX = Math.floor((Math.random() * 900) +100);
  var retY = Math.floor((Math.random() * 700) + 100);
  return {x:retX,y:retY};
}

var animateEnemies = function(){
  updateEnemyData();
  enemies.data(enemiesData).transition().attr('x',function(d){ return d.x }).attr('y',function(d){ return d.y }).duration(4000).ease("bouce");

  if (startScoring) score++;
  scoreField.innerHTML = score+'';
  if (score > highScore) highScore = score;
  highScoreField.innerHTML = highScore+'';
}

var updateEnemyData = function(){
  for (var i = 0; i < numEnemies; i++){
    enemiesData[i] = positionGenerator();
  }
}

var blowup = function(){
  //make player undraggable
  //animate blowup
  player.transition().duration(2000).attr('r',500).attr('fill','#ff0000').attr('fill-opacity',0.3);
  //freeze screen


  //updateEnemyData();

  clearInterval(collisionCheckID);
  clearInterval(animateIntervalID);
}

var collisionCheck = function(){
  var dist;
  for (var i = 0;i < enemiesData.length;i++){
    enemies.each(function(d,i){
      //d3.select(this).attr('cx')
      dist = Math.pow((Math.pow(((this.x.animVal.value + 20) - playerData.x),2)+Math.pow(((this.y.animVal.value + 20) - playerData.y),2)),0.5);
      if (dist < 40){
        blowup();
      }
    });
    //var dist = Math.pow((Math.pow((enemies.attr('cx') - playerData.x),2)+Math.pow((enemies.attr('cy') - playerData.y),2)),0.5);

  }
}

function CalculateStarPoints(centerX, centerY, arms, outerRadius, innerRadius)
{
   var results = "";
   var angle = Math.PI / arms;

   for (var i = 0; i < 2 * arms; i++)
   {
      // Use outer or inner radius depending on what iteration we are in.
      var r = (i & 1) == 0 ? outerRadius : innerRadius;

      var currX = centerX + Math.cos(i * angle) * r;
      var currY = centerY + Math.sin(i * angle) * r;

      // Our first time we simply append the coordinates, subsequet times
      // we append a ", " to distinguish each coordinate pair.
      if (i == 0)
      {
         results = currX + "," + currY;
      }
      else
      {
         results += ", " + currX + "," + currY;
      }
   }
   return results;
}

var game = function(){
  gameBoard = d3.select('#gameBoard').attr('height','100%').attr('width','100%');
  player = gameBoard.selectAll('circle')
      .data(playerData).enter().append('circle')
      .attr('cx',function(d){ return d.x })
      .attr('cy',function(d){ return d.y })
      .attr('r',20)
      .attr('fill','#00FF00')
      .attr('class','playerClass')
      .call(drag);

  updateEnemyData();

  enemies = gameBoard.selectAll(".nothing")
      .data(enemiesData).enter().append('svg')
      .attr('x',function(d){ return d.x })
      .attr('y',function(d){ return d.y })
      //.attr('r',20).attr('fill','#000000').attr('fill-opacity',0.3);

  enemies.append('polygon').attr('visibility','visible').attr('points',CalculateStarPoints(30,30,12,20,7)).attr('fill','#000000')
    .attr('class','star');

  animateEnemies();
  animateIntervalID = setInterval(animateEnemies,4020);
  collisionCheckID = setInterval(collisionCheck,200);
}


game();
