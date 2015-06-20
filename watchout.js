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
  player.attr('cx',d3.event.x).attr('cy',d3.event.y);
  playerData.x = d3.event.x;
  playerData.y = d3.event.y;
  startScoring = true;
});

document.getElementById('reset').addEventListener('click', function(event){
  game();
})

var positionGenerator = function(){
  var retX = Math.floor(Math.random() * 900+100);
  var retY = Math.floor(Math.random() * 700 + 100);
  return {x:retX,y:retY};
}

var animateEnemies = function(){
  updateEnemyData();
  enemies.data(enemiesData).transition().attr('cx',function(d){ return d.x }).attr('cy',function(d){ return d.y }).duration(4000).ease("linear");
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
  player.transition().attr('r',500).attr('fill','#ff0000').duration(2000);
  //freeze screen

  clearInterval(collisionCheckID);
  clearInterval(animateIntervalID);

}

var collisionCheck = function(){
  var dist;
  for (var i = 0;i < enemiesData.length;i++){
    enemies.each(function(d,i){
      //d3.select(this).attr('cx')
      dist = Math.pow((Math.pow((this.cx.animVal.value - playerData.x),2)+Math.pow((this.cy.animVal.value - playerData.y),2)),0.5);
      if (dist < 50){
        blowup();
      }
    });
    //var dist = Math.pow((Math.pow((enemies.attr('cx') - playerData.x),2)+Math.pow((enemies.attr('cy') - playerData.y),2)),0.5);

  }
}

var game = function(){
  d3.selectAll('svg > *').remove();
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

  enemies = gameBoard.selectAll('circle')
      .data(enemiesData).enter().append('circle')
      .attr('cx',function(d){ return d.x })
      .attr('cy',function(d){ return d.y })
      .attr('r',20).attr('fill','#000000');

  animateEnemies();
  animateIntervalID = setInterval(animateEnemies,4020);
  collisionCheckID = setInterval(collisionCheck,200);
}


game();
