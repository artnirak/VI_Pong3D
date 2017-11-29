/*
Trabalho Realizado por :
Pedro Gusmão 77867
Francisco Lopes 76406

Referências:

1 - https://codepen.io/Xanmia/pen/otAgz
2 - https://appdevelopermagazine.com/538/2013/7/27/create-a-3d-pong-game-with-three.js-and-webgl/


*/

//GLOBAL VARIABLES

var renderer, scene, camera, pointLight, spotLight;

//rotation and collision angle
var angle = 0.2;

//field dimension variables
var fieldLength = 400, fieldWidth = 200, fieldHeight = 210;

//paddle dimension, direction and speed variables
var playerPaddle, cpuPaddle;
var paddleDepth, paddleWidth, paddleHeight, paddleQuality;
var playerPaddleDirY = 0, playerPaddleDirZ = 0, cpuPaddleDirY = 0, cpuPaddleDirZ = 0, paddleSpeed = 5;

// ball variables
var ball;
var ballDirX = Math.random()+1, ballDirY = Math.random(), ballDirZ = Math.random(), ballSpeed = 1.5, radius = 5;

//scores for player and cpu
var score1 = 0, score2 = 0;

// First to score 5 points wins the game
var maxScore = 5;

// set opponent reflexes (0 - easiest, 1 - hardest)
var difficulty = 0.15;

var myAudio = new Audio('resources/audio/core.mp3');

// ------- Explosion Animation Settings ------------

var movementSpeed = 10;
var totalObjects = 100;
var objectSize = 1;
var colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];

var dirs = [];
var parts = [];


function setup()
{
    document.getElementById('Start').style.display = "block";

	// now reset player and opponent scores
	score1 = 0;
	score2 = 0;

	// set up all the 3D objects in the scene
	createScene();

}

function createScene()
{
	// set the scene size
	var width = 1120,
	  height = 600;

	// set some camera attributes
	var fov = 90,
	  aspect = width / height,
	  near = 1,
	  far = 10000;

	var c = document.getElementById("gameCanvas");

	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		fov,
		aspect,
		near,
		far);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// set a default position for the camera
	// not doing this somehow messes up shadow rendering
	camera.position.z = 0;

	// start the renderer
	renderer.setSize(width, height);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the playing field
	var barrierLength = fieldLength,
		barrierWidth = fieldWidth,
        barrierDepth = 10,
		barrierQuality = 50;

	// create the playerPaddle's material
	var playerPaddleMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: "darkgrey",
		  opacity: 0.5,
		  transparent: true
		});
	// create the cpuPaddle's material
	var cpuPaddleMaterial =
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

    var barrierMaterialBottom =
        new THREE.MeshLambertMaterial(
            {
                map: THREE.ImageUtils.loadTexture('resources/textures/scifi5.jpg')
            });

    var barrierMaterialUpper =
        new THREE.MeshLambertMaterial(
            {
                map: THREE.ImageUtils.loadTexture('resources/textures/scifi1.jpg')
            });

	var bottomBarrier = new THREE.Mesh(

	  new THREE.CubeGeometry(
		barrierLength * 1.05,
		barrierWidth * 1.03,
		barrierDepth,
		barrierQuality,
		barrierQuality,
		1),

	  barrierMaterialBottom);
	bottomBarrier.position.z = -5;
	scene.add(bottomBarrier);
	bottomBarrier.receiveShadow = true;

    var upperBarrier = new THREE.Mesh(

        new THREE.CubeGeometry(
            barrierLength * 1.05,
            barrierWidth * 1.03,
            barrierDepth/2,
            barrierQuality,
            barrierQuality,
            1),

        barrierMaterialUpper);
    upperBarrier.position.z = 107.5;
    scene.add(upperBarrier);
    upperBarrier.receiveShadow = true;

    var leftBarrier = new THREE.Mesh(

        new THREE.CubeGeometry(
            barrierLength * 1.05,
            barrierDepth,
            barrierWidth/2 + 20,
            barrierQuality,
            barrierQuality,
            1),

        barrierMaterial);
    leftBarrier.position.y = 107;
    leftBarrier.position.z = 50;
    scene.add(leftBarrier);
    leftBarrier.receiveShadow = true;

    var rightBarrier = new THREE.Mesh(

        new THREE.CubeGeometry(
            barrierLength * 1.05,
            barrierDepth,
            barrierWidth/2 + 20,
            barrierQuality,
            barrierQuality,
            1),

        barrierMaterial);
    rightBarrier.position.y = -107;
    rightBarrier.position.z = 50;
    scene.add(rightBarrier);
    rightBarrier.receiveShadow = true;

	// // set up the sphere vars
	// lower 'segment' and 'ring' values will increase performance
	var segments = 30,
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
	paddleDepth = 5;
	paddleWidth = 30;
	paddleHeight = 20;
	paddleQuality = 1;

	playerPaddle = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleDepth,
		paddleWidth,
		paddleHeight,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  playerPaddleMaterial);

	// // add the padle to the scene
	scene.add(playerPaddle);
	playerPaddle.receiveShadow = true;
    playerPaddle.castShadow = true;

	cpuPaddle = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleDepth,
		paddleWidth,
		paddleHeight,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  cpuPaddleMaterial);

	// // add the padle to the scene
	scene.add(cpuPaddle);
	cpuPaddle.receiveShadow = true;
    cpuPaddle.castShadow = true;

	// set paddles on each side of the table
	playerPaddle.position.x = -fieldLength/2 + paddleDepth;
	cpuPaddle.position.x = fieldLength/2 - paddleDepth;

	// lift paddles over playing surface
	playerPaddle.position.z = paddleHeight;
	cpuPaddle.position.z = paddleHeight;

	// create a point light
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
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(-1000, 0, -100);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

	renderer.shadowMapEnabled = false;

    myAudio.addEventListener('ended', function() {
        this.play();
    }, false);
    myAudio.play();

    // create a skybox

    var urlPrefix = "resources/skybox/";

    var urls = [urlPrefix + "back.png", urlPrefix + "front.png",
        urlPrefix + "left.png", urlPrefix + "right.png",
        urlPrefix + "top.png", urlPrefix + "bottom.png"];
    var textureCube = THREE.ImageUtils.loadTextureCube(urls, undefined, function () {


        var shader = THREE.ShaderLib["cube"];
        shader.uniforms['tCube'].value = textureCube;
        var material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });


        var geometry = new THREE.CubeGeometry(1000, 1000, 1000);
        var skybox = new THREE.Mesh(geometry, material);
        scene.add(skybox);

    });

}


function ExplodeAnimation(x,y,z)
{
    var particles;
    var geometry = new THREE.Geometry();

    for (var i = 0; i < totalObjects; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = x;
        vertex.y = y;
        vertex.z = z;

        geometry.vertices.push(vertex);
        dirs.push({
            x: (Math.random() * movementSpeed) - (movementSpeed / 2),
            y: (Math.random() * movementSpeed) - (movementSpeed / 2),
            z: (Math.random() * movementSpeed) - (movementSpeed / 2)
        });
    }
    var material = new THREE.ParticleBasicMaterial({
        size: objectSize,
        color: colors[Math.round(Math.random() * colors.length)]
    });
    particles = new THREE.ParticleSystem(geometry, material);

  this.object = particles;
  this.status = true;

  scene.add( this.object  );

  this.update = function(){
    if (this.status === true){
      var pCount = totalObjects;
      while(pCount--) {
        var particle =  this.object.geometry.vertices[pCount];
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  }
}


// draw scene
function draw()
{
    renderer.render(scene, camera);
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
	if (ball.position.x <= -fieldLength/2)
	{
	    var expls = new Audio('resources/audio/Explosion_00.mp3');
        expls.play();
		// CPU scores
		score2++;
		// update scoreboard HTML

		document.getElementById('dir').innerHTML = "DETI " + score1 + "-" + score2 + " EVIL";
		// reset ball to center
		resetBall(2);
		matchScoreCheck();
	}

	// if ball goes off the 'right' side (CPU's side)
	if (ball.position.x >= fieldLength/2)
	{
		var point = new Audio('resources/audio/Collect_Point_01.mp3');
        point.play();
		// Player scores
		score1++;
		// update scoreboard HTML
		document.getElementById('dir').innerHTML = "DETI " + score1 + "-" + score2 + " EVIL";
		// reset ball to center
		resetBall(1);
		matchScoreCheck();
	}

	// if ball goes to the side (side of table)
	if (ball.position.y-radius <= -fieldWidth/2)
	{
		ballDirY = -ballDirY;
	}
	// if ball goes to the side (side of table)
	if (ball.position.y+radius >= fieldWidth/2)
	{
		ballDirY = -ballDirY;
	}

	if (ball.position.z >= fieldHeight * 0.45 + radius && ballDirZ > 0 )
	{
        ballDirZ = -ballDirZ;
	}

	if (ball.position.z <= radius && ballDirZ < 0)
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
	// Go towards the ball on the y plane
	cpuPaddleDirY = (ball.position.y - cpuPaddle.position.y) * difficulty;
	// Go towards the ball on z plane
	cpuPaddleDirZ = (ball.position.z - cpuPaddle.position.z) * difficulty;

	if (Math.abs(cpuPaddleDirZ) <= paddleSpeed)
	{
	    if(cpuPaddle.position.z < fieldHeight * 0.5 - (paddleHeight/2) && cpuPaddleDirZ > 0)
	    {
	        cpuPaddle.position.z += cpuPaddleDirZ;
	    }
	    if(cpuPaddle.position.z > (paddleHeight/2) && cpuPaddleDirZ < 0)
	    {
	        cpuPaddle.position.z += cpuPaddleDirZ;
	    }

	}
	else
	{
		if (cpuPaddleDirZ > paddleSpeed)
		{
		    cpuPaddle.position.z += paddleSpeed;
		}
		else if (cpuPaddleDirZ < -paddleSpeed)
		{
		    cpuPaddle.position.z -= paddleSpeed;
		}
	}

	// in case the Lerp function produces a value above max paddle speed, we clamp it
	if (Math.abs(cpuPaddleDirY) <= paddleSpeed)
	{
	    if(cpuPaddle.position.y < fieldWidth/2 - (paddleWidth/2) && cpuPaddleDirY > 0)
	    {
	        cpuPaddle.position.y += cpuPaddleDirY;
	    }
	    if(cpuPaddle.position.y > -fieldWidth/2 + paddleWidth/2 && cpuPaddleDirY < 0)
	    {
	        cpuPaddle.position.y += cpuPaddleDirY;
	    }
	}
	// if the lerp value is too high, we have to limit speed to paddleSpeed
	else
	{
		// if paddle is lerping in +ve direction
		if (cpuPaddleDirY > paddleSpeed)
		{
		    cpuPaddle.position.y += paddleSpeed;

		}
		// if paddle is lerping in -ve direction
		else if (cpuPaddleDirY < -paddleSpeed)
		{
		    cpuPaddle.position.y -= paddleSpeed;
		}
	}
}


// Handles player's paddle movement
function playerPaddleMovement()
{
	// move left
	if (Key.isDown(Key.A))
	{
		playerPaddle.rotation.z = angle;
		// if paddle is not touching the side of table
		if (Key.isDown(Key.SHIFT))
		{
		    playerPaddleDirY = 0;
		}
		else if (playerPaddle.position.y < fieldWidth * 0.45)
		{
			playerPaddleDirY = paddleSpeed * 0.5;

		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			playerPaddleDirY = 0;
		}
	}
	// move right
	if (Key.isDown(Key.D))
	{
		playerPaddle.rotation.z = -angle;
		// if paddle is not touching the side of table
		// we move
		if (Key.isDown(Key.SHIFT))
        {
            playerPaddleDirY = 0;
        }
		else if (playerPaddle.position.y > -fieldWidth * 0.45)
		{
			playerPaddleDirY = -paddleSpeed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			playerPaddleDirY = 0;
		}
	}
	//move up
	if (Key.isDown(Key.W))
	{
		playerPaddle.rotation.y = -angle;
		if (Key.isDown(Key.SHIFT))
        {
            playerPaddleDirZ = 0;
        }

		else if (playerPaddle.position.z < fieldHeight * 0.45)
		{
			playerPaddleDirZ = paddleSpeed * 0.5;
		}
		else
		{
			playerPaddleDirZ = 0;
		}


	}
	//move down
	if (Key.isDown(Key.S))
	{
		playerPaddle.rotation.y = angle;
		if (Key.isDown(Key.SHIFT))
        {
            playerPaddleDirZ = 0;
        }
		else if (playerPaddle.position.z > 11.45)
		{
			playerPaddleDirZ = -paddleSpeed * 0.5;
		}
		else
		{
			playerPaddleDirZ = 0;
		}
	}


	if(!Key.isDown(Key.A) && !Key.isDown(Key.D))
	{
		playerPaddleDirY = 0;
		playerPaddle.rotation.z = 0;
	}
	if(!Key.isDown(Key.W) && !Key.isDown(Key.S))
	{
		playerPaddleDirZ = 0;
		playerPaddle.rotation.y = 0;
	}

	playerPaddle.position.y += playerPaddleDirY;
	playerPaddle.position.z += playerPaddleDirZ;
}

// Handles camera and lighting logic
function cameraPhysics()
{
	// move to behind the player's paddle
	camera.position.x = -290;
	camera.position.y = (playerPaddle.position.y - camera.position.y) * 0.05;
	camera.position.z = 65;

	// rotate to face towards the opponent
	camera.rotation.x = -0.01 * Math.PI/180;
	camera.rotation.y = -85 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;

}

// Handles paddle collision logic
function paddlePhysics()
{
	// PLAYER PADDLE LOGIC

	if (ball.position.x <= playerPaddle.position.x + paddleDepth
	&&  ball.position.x >= playerPaddle.position.x)
	{
		if (ball.position.y <= playerPaddle.position.y + paddleWidth/2
		&&  ball.position.y >= playerPaddle.position.y - paddleWidth/2)
		{
		    if (ball.position.z <= playerPaddle.position.z + paddleHeight/2
		    && ball.position.z >= playerPaddle.position.z - paddleHeight/2)
		    {
                if (ballDirX < 0)
                {
                    ballDirX = -ballDirX;
                    var beep = new Audio('resources/audio/Shoot_03.mp3');
                    beep.play();
                    parts.push(new ExplodeAnimation(ball.position.x, ball.position.y,ball.position.z));
                    //if paddle is turned up and ball higher than the table ground
                    if (playerPaddle.rotation.y < 0 && ball.position.z > radius)
                    {
                        if(ballDirZ<0) //ball going down
                        {
                            if(playerPaddleDirZ > 0) //paddle is going up
                            {
                                ballDirZ = -ballDirZ + angle + 0.1; //strikes the ball with force and the ball goes up with more velocity
                            }
                            else { //the paddle isn't moving
                                if(ballDirZ<=-0.7)
                                {
                                    ballDirZ = -ballDirZ;
                                }
                                else {
                                    ballDirZ = -ballDirZ + angle*2;
                                }

                            }

                        }
                        else //ball going up or z = 0
                        {
                            if(playerPaddleDirZ > 0) //paddle is going up
                            {
                                ballDirZ = ballDirZ + angle + 0.1; //strikes the ball with force and the ball goes up with more velocity
                            }
                        }
                    }
                    //if paddle is turned down and ball higher than the table ground
                    if (playerPaddle.rotation.y > 0 && ball.position.z > radius)
                    {
                        if (ballDirZ>0) //ball going up
                        {
                            if(playerPaddleDirZ < 0) //paddle is going down
                            {
                                ballDirZ = -ballDirZ - angle - 0.1; //strikes the ball with force and the ball goes down with more velocity
                            }
                            else
                            {
                                if (ballDirZ>=0.7) //paddle isn't moving
                                {
                                    ballDirZ = -ballDirZ;
                                }
                                else
                                {
                                    ballDirZ = -ballDirZ - angle*2;
                                }

                            }

                        }
                        else //ball going down
                        {
                            if(playerPaddleDirZ < 0) //paddle is going down
                            {
                                ballDirZ = ballDirZ - angle - 0.1;
                            }

                        }
                    }
                    //if paddle is turned left
                    if (playerPaddle.rotation.z > 0)
                    {
                        if (ballDirY<0) //the ball is going right
                        {
                            if(playerPaddleDirY > 0) //paddle is going left
                            {
                                ballDirY = -ballDirY + angle + 0.1; //hard collision ball goes to the left with more velocity
                            }
                            else
                            {
                                if(ballDirY<=0.7) //paddle isn't moving
                                {
                                    ballDirY = -ballDirY;
                                }
                                else
                                {
                                    ballDirY = -ballDirY + angle*2;
                                }

                            }
                        }
                        else //the ball is going left or y = 0
                        {
                            if(playerPaddleDirY > 0) //paddle is going left
                            {
                                ballDirY = ballDirY + angle + 0.1;  //hard collision ball goes to the left with more velocity
                            }
                        }

                    }
                    //if paddle is turned right
                    if (playerPaddle.rotation.z < 0)
                    {
                        if (ballDirY>0) //ball is going left
                        {
                            if(playerPaddleDirY<0) //paddle is going right
                            {
                                ballDirY = -ballDirY - angle - 0.1;  //hard collision ball goes to the right with more velocity
                            }
                            if(ballDirY>=0.7) //paddle isn't moving
                            {
                                ballDirY = -ballDirY;
                            }
                            else
                            {
                                ballDirY = -ballDirY - angle*2;
                            }

                        }
                        else //ball goes right
                        {
                            if(playerPaddleDirY <0) //paddle goes right
                            {
                                ballDirY = ballDirY - angle - 0.1;  //hard collision ball goes to the right with more velocity
                            }
                        }

                    }
                }
		    }

		}
	}

	// OPPONENT BALL LOGIC

	if (ball.position.x <= cpuPaddle.position.x + paddleDepth
	&&  ball.position.x >= cpuPaddle.position.x)
	{
		if (ball.position.y <= cpuPaddle.position.y + paddleWidth/2
		&&  ball.position.y >= cpuPaddle.position.y - paddleWidth/2)
		{
		    if (ball.position.z <= cpuPaddle.position.z + paddleHeight/2
		    && ball.position.z >= cpuPaddle.position.z - paddleHeight/2)
		    {
                if (ballDirX > 0)
                {
                    parts.push(new ExplodeAnimation(ball.position.x, ball.position.y,ball.position.z));
                    var boop = new Audio('resources/audio/Shoot_03.mp3');
                    boop.play();

                    ballDirX = -ballDirX;
                }
            }
		}
	}
}

function resetBall(loser)
{
	ball.position.x = 0;
	ball.position.y = 0;
	ball.position.z = radius*10;

    ballDirX = 0;
    ballDirY = 0;
    ballDirZ = 0;

	setTimeout(function () {
        // if player lost the last point, we send the ball to opponent
        if (loser === 1)
        {
            ballDirX = -Math.random()-1;
        }
        // else if opponent lost, we send ball to player
        else
        {
            ballDirX = Math.random()+1;
        }

        // set the ball to move +ve in y plane (towards left from the camera)
        ballDirY = Math.random();
        ballDirZ = Math.random();

    }, 1000);

}

// checks if either player or opponent has reached 5 points
function matchScoreCheck()
{
	// if player reached max points
	if (score1 >= maxScore)
	{
		ballSpeed = 0;

		document.getElementById('dir').innerHTML = "DETI wins!";
		myAudio.pause();
	    var victory = new Audio('resources/audio/Jingle_Win_00.mp3');
        victory.play();
	}

	// else if opponent reached max points
	else if (score2 >= maxScore)
	{
		ballSpeed = 0;

		document.getElementById('dir').innerHTML = "Evil wins!";
		myAudio.pause();
        var lose = new Audio('resources/audio/Jingle_Lose_00.mp3');
        lose.play();

	}
}