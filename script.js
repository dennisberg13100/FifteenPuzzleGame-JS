const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");

const COL = 4; 
const ROW = 4; 
const SQ = sqSize();

function sqSize(){
	if(screen.width >= 425) {
		return 100;
	} else {
		ctx.canvas.width  = 320;
  		ctx.canvas.height = 320;
		return 80;
	}
}

let randomNumbers = [];

console.log(screen.width);

// Draw the square
function drawSquare(x, y, n) {

	if ( n == 0 ) {
		// Draw the empty square

		ctx.fillStyle = '#CCC';
		ctx.fillRect(x*SQ, y*SQ, SQ, SQ);

		ctx.strokeStyle = "BLACK";
		ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
	} else {
		// Draw the squareswith numbers

		ctx.fillStyle = '#FFF';
		ctx.fillRect(x*SQ, y*SQ, SQ, SQ);

		
			ctx.font = "50px Helvetica";
			ctx.fillStyle = "red";
			ctx.textAlign = "center";
			ctx.fillText(n,(x*SQ)+(SQ/2), y*SQ+(SQ/2)+10);
		

		ctx.strokeStyle = "BLACK";
		ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
	}
}

// Render the game
function render(){
	for(let i = 0; i < ROW; i++) {
		for(let j = 0; j < COL; j++) {
			let text = randomNumbers[i][j];
			drawSquare(j, i, text);
		}
	}
	checkVictory();
}

// Function create the values (an array with values in order)
let numberList = [];
for(let i = 0; i < 16; i++) {
	numberList[i] = i;
}

// Remove the values that are already on the random list from the original list
function removeByIndex(n) {
	numberList.splice(n, 1);
}

// Put the numbers in a random oreder in a 4x4 matrix
function randomNumberList() {
	array = [];
	for(let i = 0; i < ROW; i++) {
		array[i] = [];
		for(let j = 0; j < COL; j++) {
			// take a random value of the length of the numberList
			let l = numberList.length;
			let randIndex = Math.floor(Math.random() * l);	
			// put it in the matrix	
			array[i][j] = numberList[randIndex];
			// remove this number from the list that we don't have repeated numbers ins the matrix 
			removeByIndex(randIndex);			
		}
	}
	return array;
}

randomNumbers = randomNumberList();

window.addEventListener('load', render());

// Add the click event
cvs.addEventListener('click', function(e) {
    let n = getFreeSquareIndex(randomNumbers);
    console.log(n);
    // This function will return true if one of the moveble square was clicked otherwise it will return false.
    let colision = checkColision(e.offsetX, e.offsetY, n);
    if (colision !== false){
    	// Change the random number array
    	randomNumbers[n[0]][n[1]] = randomNumbers[colision[0]][colision[1]];
    	randomNumbers[colision[0]][colision[1]] = 0;
    	console.log(randomNumbers);
    	render();
    }
}, false);

// finde the Free square index
function getFreeSquareIndex(array) {
	let result = [0, 0];
	let val = 1;
	let i = 0;
	let j = 0;
	while( val != 0 ){
		val = array[i][j];
		result = [i, j];
		if( j < ROW ) {
			j++;
		} else {
			j = 0;
			i++;
		}
	}
	return result;
}

// Check if the square where the user clicked is movable
function checkColision(x, y, array) {
	console.log( "x = "+x+" y = "+y+" - "+array);
	let list = [
		[array [0], array[1] +1],
		[array [0], array[1] -1],
		[array [0] +1, array[1]],
		[array [0] -1, array[1]]
		];
	for ( let i = 0; i < list.length; i++){
		if ( x > list[i][1] * SQ && x < ((list[i][1]*SQ)+SQ) && y > list[i][0] * SQ && y < ((list[i][0]* SQ) + SQ)){
			return list[i];
		}
	}
	return false;
}

// Check for victory 
function checkVictory() {
	finalGoal = [[ 1, 2, 3, 4],
	             [ 5, 6, 7, 8],
	             [ 9,10,11,12],
	             [13,14,15, 0]];
	for (let i = 0; i < COL; i++){
		for (let j = 0; j < ROW; j++){
			if(finalGoal[i][j] !== randomNumbers[i][j]){
				return false;
			}
		}
	}
	document.querySelector('#victory').style.display = 'block';
	var audio = new Audio('victory.mp3');
	audio.play();
}
