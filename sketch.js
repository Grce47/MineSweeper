var bombPic;
var gameOver;
var hiderBoxImg = [];
var hide = [];
var pics = [];
var board = [];
var canvas;
var avail = [];
var rows;
var cols;
var noOfBombs = 15;
var sizeOfbox = 30;
function preload() {
	bombPic = loadImage('image/bomb.png');
	pics.push(loadImage('image/explosion.png'));
	for (var i = 1; i <= 8; i++) {
		pics.push(loadImage('image/' + i + '.png'));
	}
	hiderBoxImg.push(loadImage('image/hiderBox.jpg'));
	hiderBoxImg.push(loadImage('image/flag_box.png'));
}
function setup() {
	canvas = createCanvas(570, 570);
	canvas.parent('sketch-holder');
	for (let element of document.getElementsByClassName("p5Canvas")) {
		element.addEventListener("contextmenu", (e) => e.preventDefault());
	}
	
	gameOver = false;
	rows = height / sizeOfbox;
	cols = width / sizeOfbox;
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			avail.push(cndt(i, j));
		}
	}
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			board.push(0);
			hide.push(1);
		}
	}
	for (var i = 0; i < noOfBombs; i++) {
		var idx = floor(random(avail.length));
		var cn = avail[idx];
		avail.splice(idx, 1);
		var r = getRow(cn);
		var c = getCol(cn);
		board[cndt(r, c)] = -1;
	}
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (board[cndt(i, j)] != -1) {
				var no = getNumber(i, j);
				board[cndt(i, j)] = no;
			}
		}
	}
}

function draw() {
	background(255);
	showGrid();
	showHider();
	showBoard();
	noLoop();
}
function changeLevel() {
	var lvl = parseInt(document.getElementById("level").value);
	if (lvl > 0) {
		noOfBombs = lvl;
		resetGame(-1, -1, 500);
	}
	else {
		noOfBombs = 15;
		resetGame(-1, -1, 500);
	}
}
function mousePressed() {
	if (mouseX >= 0 && mouseX <= width && mouseY <= height && mouseY >= 0) {
		var f = 0;
		var cn = getCndt(mouseX, mouseY);
		if (board[cn] == -1 && mouseButton == LEFT) {
			resetGame(getRow(cn), getCol(cn));
			f = 1;
		}
		if (!f) {
			if (mouseButton == LEFT) {
				if (board[cn] == 0) {
					bfs(cn);
				}
				hide[cn] = 0;
			}
			else {
				if (hide[cn] != 0) {
					if (hide[cn] == 1) hide[cn] = 2;
					else hide[cn] = 1;
				}
			}
			if (!gameOver) loop();
		}
	}
}

function showHider() {
	var tmp_no = 0;
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (hide[cndt(i, j)] != 0) {
				tmp_no++;
				showBox(i, j, hide[cndt(i, j)] - 1);
			}
		}
	}
	if (tmp_no == noOfBombs) {
		resetGame(-1, -1);
	}
}
function resetGame(r, c, time = 2000) {
	hide = [];
	avail = [];
	background(255);
	showGrid();
	explosion(r, c);
	board = [];
	gameOver = false;
	rows = height / sizeOfbox;
	cols = width / sizeOfbox;
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			avail.push(cndt(i, j));
		}
	}
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			board.push(0);
			hide.push(1);
		}
	}
	for (var i = 0; i < noOfBombs; i++) {
		if (avail.length) {
			var idx = floor(random(avail.length));
			var cn = avail[idx];
			avail.splice(idx, 1);
			var r = getRow(cn);
			var c = getCol(cn);
			board[cndt(r, c)] = -1;
		}
		else {
			break;
		}
	}
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (board[cndt(i, j)] != -1) {
				var no = getNumber(i, j);
				board[cndt(i, j)] = no;
			}
		}
	}
	setTimeout(function () {
		background(255);
		showGrid();
		showHider();
		showBoard();
	}, time);
}
function explosion(r, c) {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (board[cndt(i, j)] == -1) {
				if (i == r && j == c) {
					showBomb(i, j);
				}
				else {
					showRealBomb(i, j);
				}
			}
			else if (board[cndt(i, j)] != 0) {
				showNumber(i, j, board[cndt(i, j)])
			}
		}
	}
	gameOver = true;
}

function showBoard() {
	var f = 0;
	var r, c;
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (hide[cndt(i, j)] == 0) {
				tint(255);
				if (board[cndt(i, j)] == -1) {
					f = 1;
					r = i;
					c = j;
					explosion(r, c);
				}
				else if (board[cndt(i, j)] == 0) continue;
				else {
					showNumber(i, j, board[cndt(i, j)]);
				}
			}
		}
	}
	if (f) {
		resetGame(r, c);
	}
}

function showGrid() {
	noFill();
	stroke(51);
	strokeWeight(8);
	rectMode(CORNER);
	rect(0, 0, width, height);
	for (var i = sizeOfbox; i < width; i += sizeOfbox) {
		strokeWeight(4);
		line(i, 0, i, height);
	}
	for (var i = sizeOfbox; i < height; i += sizeOfbox) {
		strokeWeight(4);
		line(0, i, width, i);
	}
}


///////////////////////////////////////////////




function getNumber(r, c) {
	var ans = 0;
	for (var i = -1; i < 2; i++) {
		for (var j = -1; j < 2; j++) {
			if (!(i == 0 && j == 0)) {
				if (isWell(r + i, c + j)) {
					if (board[cndt(r + i, c + j)] == -1) ans++;
				}
			}
		}
	}
	return ans;
}
function cndt(r, c) {
	return r * cols + c;
}
function isWell(r, c) {
	return (r >= 0 && r < rows && c >= 0 && c < cols);
}
class Queue {
	constructor() {
		this.arr = [];
		this.start = 0;
		this.len = 0;
	}
	push_back(val) {
		this.arr.push(val);
		// print("pushed" + val.row + " " + val.col);
		this.len++;
	}
	pop_front() {
		var ele = this.arr[this.start];
		this.start++;
		this.len--;
		return ele;
	}
}
function getCndt(x, y) {
	var c = floor(x / sizeOfbox);
	var r = floor(y / sizeOfbox);
	return cndt(r, c);
}
function getRow(cn) {
	return floor(cn / cols);
}
function getCol(cn) {
	return cn % cols;
}
function bfs(start) {
	var q = new Queue();
	q.push_back(start);
	var cur;
	hide[start] = 0;
	while (q.len > 0) {
		cur = q.pop_front();
		var row = getRow(cur);
		var col = getCol(cur);
		var childs = [];
		for (var i = -1; i < 2; i++) {
			for (var j = -1; j < 2; j++) {
				if ((!(i == 0 && j == 0)) && isWell(row + i, col + j)) {
					var child = cndt(row + i, col + j);
					if (hide[child] != 0) {
						if (board[child] == 0) {
							q.push_back(child);
							hide[child] = 0;
							childs.push(child);    //for animating BFS
						}
						else if (board[child] != -1) {
							hide[child] = 0;
							childs.push(child);   //for animating BFS
						}
					}
				}
			}
		}
	}
}
function showRealBomb(r, c) {
	image(bombPic, c * sizeOfbox + 2, r * sizeOfbox, sizeOfbox, sizeOfbox);
}
function showBomb(r, c) {
	image(pics[0], c * sizeOfbox + 2, r * sizeOfbox + 1, sizeOfbox - 3, sizeOfbox - 2);
}
function showNumber(r, c, n) {
	image(pics[n], c * sizeOfbox + 2.5, r * sizeOfbox + 2, sizeOfbox - 5, sizeOfbox - 5);
}
function showBox(r, c, no) {
	tint(200);
	image(hiderBoxImg[no], c * sizeOfbox, r * sizeOfbox, sizeOfbox - 2, sizeOfbox - 2);
}
