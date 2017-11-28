
// ------------------------------------- //
// ------- GLOBAL VARIABLES ------------ //
// ------------------------------------- //

// scene object variables
var renderer, scene, camera, pointLight, spotLight;
var radius = 5;
//rotation and collision angle
var angle = 0.2;

// field variables
var fieldWidth = 400, fieldLength = 200, fieldHeight = 210;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle1DirZ = 0, paddle2DirY = 0, paddle2DirZ = 0, paddleSpeed = 5;

// ball variables
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballDirZ = 0, ballSpeed = 1.4;

// game-related variables
var score1 = 0, score2 = 0;
// you can change this to any positive whole number
var maxScore = 7;

// set opponent reflexes (0 - easiest, 1 - hardest)
var difficulty = 0.0932;
var StartText  = document.getElementById('Start');
StartText.style.display= 'block';

// ------------------------------------- //
// ------- GAME FUNCTIONS -------------- //
// ------------------------------------- //

function setup()
{
	// update the board to reflect the max score for match win
	document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";

	// now reset player and opponent scores
	score1 = 0;
	score2 = 0;

	// set up all the 3D objects in the scene
	createScene();

	// and let's get cracking!
	draw();
}

function createScene()
{
	// set the scene size
	var WIDTH = 1120,
	  HEIGHT = 832;

	// set some camera attributes
	var VIEW_ANGLE = 110,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.01,
	  FAR = 1000000000000;

	var c = document.getElementById("gameCanvas");

	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// set a default position for the camera
	// not doing this somehow messes up shadow rendering
	camera.position.z = 0;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the playing surface plane
	var planeWidth = fieldWidth,
		PlaneLength = fieldLength,
		planeQuality = 50;

	// create the paddle1's material
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: "green",
		  opacity: 0.5,
		  transparent: true
		});
	// create the paddle2's material
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  map: THREE.ImageUtils.loadTexture('resources/textures/evilface.jpg')
		});

	// create the table's material
	var barrierMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  map: THREE.ImageUtils.loadTexture('resources/textures/scifi2.jpg')
		});

	// create the ground's material
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: "darkred"
		});

    /*
	// create the playing surface plane
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
		PlaneLength,
		planeQuality,
		planeQuality),

	  planeMaterial);

	scene.add(plane);
	plane.receiveShadow = true;*/

	var bottomBarrier = new THREE.Mesh(

	  new THREE.CubeGeometry(
		planeWidth * 1.05,
		PlaneLength * 1.03,
		10,
		planeQuality,
		planeQuality,
		1),

	  barrierMaterial);
	bottomBarrier.position.z = -5;
	scene.add(bottomBarrier);
	bottomBarrier.receiveShadow = true;

    var upperBarrier = new THREE.Mesh(

        new THREE.CubeGeometry(
            planeWidth * 1.05,
            PlaneLength * 1.03,
            5,
            planeQuality,
            planeQuality,
            1),

        barrierMaterial);
    upperBarrier.position.z = 107.5;
    scene.add(upperBarrier);
    upperBarrier.receiveShadow = true;

    var leftBarrier = new THREE.Mesh(

        new THREE.CubeGeometry(
            planeWidth * 1.05,
            10,
            100 + 20,
            planeQuality,
            planeQuality,
            1),

        barrierMaterial);
    leftBarrier.position.y = 107;
    leftBarrier.position.z = 50;
    scene.add(leftBarrier);
    leftBarrier.receiveShadow = true;

    var rightBarrier = new THREE.Mesh(

        new THREE.CubeGeometry(
            planeWidth * 1.05,
            10,
            100 + 20,
            planeQuality,
            planeQuality,
            1),

        barrierMaterial);
    rightBarrier.position.y = -107;
    rightBarrier.position.z = 50;
    scene.add(rightBarrier);
    rightBarrier.receiveShadow = true;

	// // set up the sphere vars
	// lower 'segment' and 'ring' values will increase performance
	var radius = 5,
		segments = 30,
		rings = 30;

	// // create the sphere's material
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  map : THREE.ImageUtils.loadTexture('resources/textures/scifi4.jpg')
		});

	// Create a ball with sphere geometry
	ball = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

	// // add the sphere to the scene
	scene.add(ball);

	ball.position.x = 0;
	ball.position.y = 0;
	// set ball above the table surface
	ball.position.z = radius*10;
	ball.receiveShadow = true;
    ball.castShadow = true;

	// // set up the paddle vars
	paddleWidth = 5;
	paddleHeight = 30;
	paddleDepth = 20;
	paddleQuality = 1;

	paddle1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle1Material);

	// // add the padle to the scene
	scene.add(paddle1);
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;

	paddle2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  paddle2Material);

	// // add the padle to the scene
	scene.add(paddle2);
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;

	// set paddles on each side of the table
	paddle1.position.x = -fieldWidth/2 + paddleWidth;
	paddle2.position.x = fieldWidth/2 - paddleWidth;

	// lift paddles over playing surface
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;


	// finally we finish by adding a ground plane
	// to show off pretty shadows
	var ground = new THREE.Mesh(

	  new THREE.CubeGeometry(
	  1000,
	  1000,
	  3,
	  1,
	  1,
	  1 ),

	  groundMaterial);
    // set ground to arbitrary z position to best show off shadowing
	ground.position.z = -132;
	ground.receiveShadow = true;
	scene.add(ground);

	// // create a point light
	pointLight =
	  new THREE.PointLight(0xF8D898);

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 1.5;
	pointLight.distance = 10000;
	// add to the scene
	scene.add(pointLight);

	// add a spot light
	// this is important for casting shadows
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(-1000, 0, -100);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

	renderer.shadowMapEnabled = false;

	myAudio = new Audio('resources/audio/core.mp3');
    myAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    myAudio.play();
}

//////////////settings/////////
var movementSpeed = 10;
var totalObjects = 100;
var objectSize = 1;
var sizeRandomness = 10;
var colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];
/////////////////////////////////
var dirs = [];
var parts = [];

function ExplodeAnimation(x,y,z)
{
  var geometry = new THREE.Geometry();

  for (i = 0; i < totalObjects; i ++)
  {
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = z;

    geometry.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }
  var material = new THREE.ParticleBasicMaterial( { size: objectSize,  color: colors[Math.round(Math.random() * colors.length)] });
  var particles = new THREE.ParticleSystem( geometry, material );

  this.object = particles;
  this.status = true;

  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);

  scene.add( this.object  );

  this.update = function(){
    if (this.status == true){
      var pCount = totalObjects;
      while(pCount--) {
        var particle =  this.object.geometry.vertices[pCount]
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  }

}

parts.push(new ExplodeAnimation(0, 0));

function draw()
{
	// draw THREE.JS scene
	renderer.render(scene, camera);
	// loop draw function call
	requestAnimationFrame(draw);

	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
    var pCount = parts.length;
    while(pCount--) {
        parts[pCount].update();
    }
}

function ballPhysics()
{
	// if ball goes off the 'left' side (Player's side)
	if (ball.position.x <= -fieldWidth/2)
	{
	    expls = new Audio('resources/audio/Explosion_00.mp3');
        expls.play();
		// CPU scores
		score2++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(2);
		matchScoreCheck();
	}

	// if ball goes off the 'right' side (CPU's side)
	if (ball.position.x >= fieldWidth/2)
	{
		point = new Audio('resources/audio/Collect_Point_01.mp3');
        point.play();
		// Player scores
		score1++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(1);
		matchScoreCheck();
	}

	// if ball goes to the side (side of table)
	if (ball.position.y-radius <= -fieldLength/2)
	{
		ballDirY = -ballDirY;
	}
	// if ball goes to the side (side of table)
	if (ball.position.y+radius >= fieldLength/2)
	{
		ballDirY = -ballDirY;
	}

	if (ball.position.z >= fieldHeight * 0.45 && ballDirZ > 0 )
	{
        ballDirZ = -ballDirZ;
	}

	if (ball.position.z <= 5 && ballDirZ < 0)
	{
	    ballDirZ = -ballDirZ;
	}

	// update ball position over time
	ball.position.z += ballDirZ * ballSpeed;
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;

	// limit ball's y-speed to 2x the x-speed
	// this is so the ball doesn't speed from left to right super fast
	// keeps game playable for humans
	if (ballDirZ > ballSpeed * 2)
    {
    	ballDirZ = ballSpeed * 2;
    }
    else if (ballDirZ < -ballSpeed * 2)
    {
    	ballDirZ = -ballSpeed * 2;
    }

	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

// Handles CPU paddle movement and logic
function opponentPaddleMovement()
{
	// Lerp towards the ball on the y plane
	paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;
	paddle2DirZ = (ball.position.z - paddle2.position.z) * difficulty;

	// in case the Lerp function produces a value above max paddle speed, we clamp it
	if (Math.abs(paddle2DirZ) <= paddleSpeed)
	{
 		paddle2.position.z += paddle2DirZ;
	}
	// if the lerp value is too high, we have to limit speed to paddleSpeed
	else
	{
		// if paddle is lerping in +ve direction
		if (paddle2DirZ > paddleSpeed)
		{
			paddle2.position.z += paddleSpeed;
		}
		// if paddle is lerping in -ve direction
		else if (paddle2DirZ < -paddleSpeed)
		{
			paddle2.position.z -= paddleSpeed;
		}
	}

	// in case the Lerp function produces a value above max paddle speed, we clamp it
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{
		paddle2.position.y += paddle2DirY;
	}
	// if the lerp value is too high, we have to limit speed to paddleSpeed
	else
	{
		// if paddle is lerping in +ve direction
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed;
		}
		// if paddle is lerping in -ve direction
		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed;
		}
	}
}


// Handles player's paddle movement
function playerPaddleMovement()
{
	// move left
	if (Key.isDown(Key.A))
	{

		paddle1.rotation.z = angle;
		// if paddle is not touching the side of table
		// we move
		if (Key.isDown(Key.SHIFT))
		{
		    paddle1DirY = 0;
		}
		else if (paddle1.position.y < fieldLength * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;

		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
			//paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
	}
	// move right
	if (Key.isDown(Key.D))
	{
		paddle1.rotation.z = -angle;
		// if paddle is not touching the side of table
		// we move
		if (Key.isDown(Key.SHIFT))
        {
            paddle1DirY = 0;
        }
		else if (paddle1.position.y > -fieldLength * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
		}
	}
	//move up
	if (Key.isDown(Key.W))
	{
		paddle1.rotation.y = -angle;
		if (Key.isDown(Key.SHIFT))
        {
            paddle1DirZ = 0;
        }

		else if (paddle1.position.z < fieldHeight * 0.45)
		{
			paddle1DirZ = paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirZ = 0;
		}


	}
	//move down
	if (Key.isDown(Key.S))
	{
		paddle1.rotation.y = angle;
		if (Key.isDown(Key.SHIFT))
        {
            paddle1DirZ = 0;
        }
		else if (paddle1.position.z > 11.45)
		{
			paddle1DirZ = -paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirZ = 0;
		}
	}


	if(!Key.isDown(Key.A) && !Key.isDown(Key.D))
	{
		paddle1DirY = 0;
		paddle1.rotation.z = 0;
	}
	if(!Key.isDown(Key.W) && !Key.isDown(Key.S))
	{
		paddle1DirZ = 0;
		paddle1.rotation.y = 0;
	}


	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
	paddle1.position.y += paddle1DirY;
	paddle1.position.z += paddle1DirZ;
	//console.log(paddle1DirY + " " + paddle1DirZ);
	//console.log("comp" + fieldLength * 0.45 + " " + paddle1.position.y + "c");
}

// Handles camera and lighting logic
function cameraPhysics()
{
	// move to behind the player's paddle
	camera.position.x = paddle1.position.x - 100;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
	camera.position.z = paddle1.position.z; // + 40 + 0.04;


	// rotate to face towards the opponent
	camera.rotation.x = -0.01 * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;

}




// Handles paddle collision logic
function paddlePhysics()
{
	// PLAYER PADDLE LOGIC

	// if ball is aligned with paddle1 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		// and if ball is aligned with paddle1 on y plane
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
		    if (ball.position.z <= paddle1.position.z + paddleDepth/2
		    && ball.position.z >= paddle1.position.z - paddleDepth/2)
		    {
		        // and if ball is travelling towards player (-ve direction)
                if (ballDirX < 0)
                {
                    ballDirX = -ballDirX;
                    beep = new Audio('resources/audio/Shoot_03.mp3');
                    beep.play();
                    parts.push(new ExplodeAnimation(ball.position.x, ball.position.y,ball.position.z));
                    //if paddle is turned up and ball higher than the table ground
                    if (paddle1.rotation.y < 0 && ball.position.z > radius)
                    {
                        if(ballDirZ<0)
                        {
                            if(paddle1DirZ > 0)
                            {
                                ballDirZ = -ballDirZ + angle;
                            }
                            else {
                                ballDirZ = -ballDirZ;
                            }

                        }
                        else
                        {
                            if(paddle1DirZ > 0)
                            {
                                ballDirZ = 1 + angle;
                            }
                            else {
                                ballDirZ = 1;
                            }
                        }
                    }
                    //if paddle is turned down and ball higher than the table ground
                    if (paddle1.rotation.y > 0 && ball.position.z > radius)
                    {
                        if (ballDirZ>0)
                        {
                            if(paddle1DirZ < 0)
                            {
                                ballDirZ = -ballDirZ - angle;
                            }
                            else
                            {
                                ballDirZ = -ballDirZ;
                            }

                        }
                        else
                        {
                            if(paddle1DirZ < 0)
                            {
                                ballDirZ = -1 - angle;
                            }
                            else {
                                ballDirZ = -1;
                            }

                        }
                    }
                    //if paddle is turned left
                    if (paddle1.rotation.z > 0)
                    {
                        if (ballDirY<0)
                        {
                            if(paddle1DirY > 0)
                            {
                                ballDirY = -ballDirY + angle;
                            }
                            else
                            {
                                ballDirY = -ballDirY;
                            }

                        }
                        else
                        {
                            if(paddle1DirY > 0)
                            {
                                ballDirY = 1 + angle;
                            }
                            else {
                                ballDirY = 1;
                            }

                        }

                    }
                    //if paddle is turned right
                    if (paddle1.rotation.z < 0)
                    {
                        if (ballDirY>0)
                        {
                            if(paddle1DirY<0)
                            {
                                ballDirY = -ballDirY - angle;
                            }
                            else {
                                ballDirY = -ballDirY;
                            }

                        }
                        else
                        {
                            if(paddle1DirY <0)
                            {
                                ballDirY = -1 - angle;
                            }
                            else {
                                ballDirY = -1;
                            }

                        }

                    }
                }
		    }

		}
	}

	// OPPONENT BALL LOGIC

	// if ball is aligned with paddle2 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x)
	{
		// and if ball is aligned with paddle2 on y plane
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards opponent (+ve direction)
			if (ballDirX > 0)
			{
			    parts.push(new ExplodeAnimation(ball.position.x, ball.position.y,ball.position.z));
                boop = new Audio('resources/audio/Shoot_03.mp3');
                boop.play();
				// stretch the paddle to indicate a hit
				//paddle2.scale.y = 15;
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				//ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function resetBall(loser)
{
    wait(1000);
	// position the ball in the center of the table
	ball.position.x = 0;
	ball.position.y = 0;
	ball.position.z = radius*10;
    ballDirZ = 0;


	// if player lost the last point, we send the ball to opponent
	if (loser === 1)
	{
		ballDirX = -1;
	}
	// else if opponent lost, we send ball to player
	else
	{
		ballDirX = 1;
	}

	// set the ball to move +ve in y plane (towards left from the camera)
	ballDirY = 1;
}

// checks if either player or opponent has reached 7 points
function matchScoreCheck()
{
	// if player has 7 points
	if (score1 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "Player wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
	}
	// else if opponent has 7 points
	else if (score2 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "CPU wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
	}
}