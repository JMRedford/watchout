// start slingin' some d3 here.
var enemiesData = [];
var playerData = [{
  x: Math.floor(Math.random() * 900),
  y: Math.floor(Math.random() * 800),
  deltax: 0,
  deltay: 0,
  moveKeys: {
    37: [-1,0],
    38: [0,-1],
    39: [1,0],
    40: [0,1]
  }
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
    playerData[0].x = d3.event.x;
    playerData[0].y = d3.event.y;
    startScoring = true;
  }
});

window.addEventListener("keydown", function(event){
  if (event.defaultPrevented) {
    return; // Should do nothing if the key event was already consumed.
  }
  if (event.keyCode > 36 && event.keyCode < 41) {
    keyMove(event.keyCode);
  }
  console.log(event.keyCode)
  event.preventDefault();
}, true)

document.getElementById('reset').addEventListener('click', function(event){
  startScoring = false;
  score = 0;
  playerData[0].x = Math.floor(Math.random() * 900);
  playerData[0].y = Math.floor(Math.random() * 800);
  playerData[0].dx = 0;
  playerData[0].dy = 0;

  player.attr('r',20).attr('fill','#00ff00').attr('fill-opacity',1).attr('cx',playerData[0].x).attr('cy',playerData[0].y);
  console.log('here')
  animateEnemies();
  animateIntervalID = setInterval(animateEnemies,4020);
  collisionCheckID = setInterval(collisionCheck,200);
});

var keyMove = function(keyCode){
  console.log('here')
  var changeDelta = playerData[0].moveKeys[keyCode];
  playerData[0].deltax = playerData[0].deltax + changeDelta[0];
  playerData[0].deltay = playerData[0].deltay + changeDelta[1];
}

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
  //animate blowup
  player.transition().duration(2000).attr('r',500).attr('fill','#ff0000').attr('fill-opacity',0.3);
  //freeze screen
  clearInterval(collisionCheckID);
  clearInterval(animateIntervalID);
}

var collisionAndPlayerMove = function(){
  var dist;
  for (var i = 0;i < enemiesData.length;i++){
    enemies.each(function(d,i){
      //d3.select(this).attr('cx')
      dist = Math.pow((Math.pow(((this.x.animVal.value + 20) - playerData[0].x),2)+Math.pow(((this.y.animVal.value + 20) - playerData[0].y),2)),0.5);
      if (dist < 40 && startScoring){
        blowup();
      }
    });
  }
  var curPlayerPos = [player.attr('cx'),player.attr('cy')];
  var newPos = [Number(curPlayerPos[0])+Number(playerData[0].deltax), Number(curPlayerPos[1])+Number(playerData[0].deltay)]
  player.attr('cx', newPos[0] ).attr('cy', newPos[1]);
  playerData[0].x = newPos[0];
  playerData[0].y = newPos[1];
}

function CalculateStarPoints(centerX, centerY, arms, outerRadius, innerRadius)
{
   var results = "";
   var angle = Math.PI / arms;

   for (var i = 0; i < 2 * arms; i++) {
      // Use outer or inner radius depending on what iteration we are in.
      var r = (i & 1) == 0 ? outerRadius : innerRadius;
      var currX = centerX + Math.cos(i * angle) * r;
      var currY = centerY + Math.sin(i * angle) * r;

      // Our first time we simply append the coordinates, subsequet times
      // we append a ", " to distinguish each coordinate pair.
      if (i == 0) {
         results = currX + "," + currY;
      } else {
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

  enemies.append('polygon').attr('visibility','visible').attr('points',CalculateStarPoints(30,30,12,20,7)).attr('fill','#000000')
      .attr('class','star');

  animateEnemies();
  animateIntervalID = setInterval(animateEnemies,4020);
  collisionCheckID = setInterval(collisionAndPlayerMove,200);
}

game();
