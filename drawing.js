"use strict";

var FabricSize = 120;    // The size of the fabric grid
var Ctx;                 // the graphics context
var SqSize;              // size of each square in the canvas
var CanvasSize;          // pixels on each side
var DrawGrids = false;   // see the underlying grid
var DrawThreads = false; // draw the fabric as threads
var TieUpWidth = 8;      // width of tie-up
var TieUpHeight = 8;     // height of tie-up
var FabricRight;         // right side of fabric grid
var FabricTop;           // bottom of fabric grid
var TieUpL, TieUpR, TieUpT, TieUpB; // tie-up sides for use by ui.js

/* 
We use the matrix form of the weaving equation on page 113 of
my November 2002 CG&A column. Remember that everything has to
be counted in the proper directions! 
*/

// the matrices and color lists
var R, T, S, WarpColors, WeftColors;

// domain min, max, and range (1+max-min)
var WarpDMin, WarpDMax, WarpDRange;
var WeftDMin, WeftDMax, WeftDRange;

function drawCanvas() {
	var c = document.getElementById("myCanvas");
	Ctx = c.getContext("2d");
	Ctx.clearRect(0, 0, c.width, c.height);
	Ctx.fillStyle = "rgb(255, 255, 255)";
	Ctx.fillRect(0, 0, c.width, c.height);

	CanvasSize  = Math.min(c.width, c.height);
	getDomainSizes();
	var rightSquares = Math.max(TieUpWidth+2, WeftDMax+1+3);
	var topSquares = Math.max(TieUpHeight+2, WarpDMax+1+3);
	var maxGap = Math.max(rightSquares, topSquares);
	var numSquares = FabricSize + maxGap + 1;

	// disable or enable the Show threads and Show grids checkboxes
	if (FabricSize < 100) { // turn them on
		if ($("#showThreadsCheckbox").prop('disabled')) {
			$("#showThreadsCheckbox").prop('disabled', false);
			$("#showThreadsLabel").css('color', '#000000');
		} 
		if ($("#showGridsCheckbox").prop('disabled')) {
			$("#showGridsCheckbox").prop('disabled', false);
			$("#showGridsLabel").css('color', '#000000');
		} 
	} else { // turn them off
		if (!$("#showThreadsCheckbox").prop('disabled')) {
			$("#showThreadsCheckbox").prop('disabled', true);
			$("#showThreadsLabel").css('color', '#cccccc');
		}
		if (!$("#showGridsCheckbox").prop('disabled')) {
			$("#showGridsCheckbox").prop('disabled', true);
			$("#showGridsLabel").css('color', '#cccccc');
		}
	}

	DrawGrids = false;
	if (!($("#showGridsCheckbox").prop('disabled'))) {
		DrawGrids = $('#showGridsCheckbox').prop('checked');
	}
	DrawThreads = false;
	if (!($("#showThreadsCheckbox").prop('disabled'))) {
		DrawThreads = $('#showThreadsCheckbox').prop('checked');
	}

	SqSize = CanvasSize / numSquares;

	FabricRight = CanvasSize - (rightSquares* SqSize);
	FabricTop = CanvasSize - ((FabricSize+1)* SqSize);

	makeMatrices();
	drawWarp();
	drawWeft();
	drawTieUp();
	drawFabric();
}

function getDomainSizes() {
	var weftList = getWeftAsList();
	var warpList = getWarpAsList();

	WeftDMin = Math.min.apply(Math, weftList);
	WeftDMax = Math.max.apply(Math, weftList);
	WeftDRange = 1+WeftDMax-WeftDMin;	

	WarpDMin = Math.min.apply(Math, warpList);
	WarpDMax = Math.max.apply(Math, warpList);
	WarpDRange = 1+WarpDMax-WarpDMin;	
}

function toWarpDomain(v) {
	while (v < WarpDMin) v += WarpDRange;
	while (v > WarpDMax) v -= WarpDRange;
	return v;
}

function toWeftDomain(v) {
	while (v < WeftDMin) v += WeftDRange;
	while (v > WeftDMax) v -= WeftDRange;
	return v;
}

function makeMatrices() {
	R = getWeftAsList();
	T = getTieupAsList();
	S = getWarpAsList();
	WarpColors = getWarpColorsAsList();
	WeftColors = getWeftColorsAsList();
}

function getWarpAsList() { 
	return getOutputAsList(WarpPatternOutput, true, [ 0 ]); 
}

function getWeftAsList() { 
	return getOutputAsList(WeftPatternOutput, true, [ 0 ]); 
}

function getWarpColorsAsList() {
	var names = getOutputAsList(WarpColorOutput, false, [ "white", "black" ]); 
	var rgb = [];
	for (var i=0; i<names.length; i++) {
		var rgbString = getColorAsRGBString(names[i]);
		rgb.push(rgbString);
	}
	return rgb;
}

function getWeftColorsAsList() {
	var names = getOutputAsList(WeftColorOutput, false, [ "black", "white" ]); 
	var rgb = [];
	for (var i=0; i<names.length; i++) {
		var rgbString = getColorAsRGBString(names[i]);
		rgb.push(rgbString);
	}
	return rgb;
}

function getTieupAsList() { 
	return getOutputAsList(TieUpOutput, true, [0]); 
}

function getOutputAsList(input, numbers, defaultReturn) {
	if (input === "") return defaultReturn;
	var result = [];
	var words = input.split(" ");
	for (var i=0; i<words.length; i++) {
		if (numbers) result.push(Number(words[i]));
	           else result.push(words[i]);
	}
	return result;
}

function drawWarp() {
	var right = FabricRight;
	var bottom = FabricTop - SqSize;
	var left = right - (FabricSize * SqSize);
	var top = bottom - (WarpDMax * SqSize);
	var colorTop = top - (2 * SqSize);
	Ctx.strokeStyle = "#000000";
	Ctx.lineWidth = 1;
	// draw the filled-in boxes in the grid
	Ctx.fillStyle = "rgb(0, 0, 0)";
	for (var col=0; col<FabricSize; col++) {  
		var cellNum = S[col % S.length];
		cellNum = toWarpDomain(cellNum);
		if (cellNum > 0) {
			Ctx.fillRect(right-((col+1)*SqSize), bottom-(cellNum*SqSize), SqSize, SqSize);
		}
	}
	// draw the colors
	for (var col=0; col<FabricSize; col++) {  
		var rgb = WarpColors[col % WarpColors.length];
		Ctx.fillStyle = rgb;
		Ctx.fillRect(right-((col+1)*SqSize), colorTop, SqSize, SqSize);
		Ctx.strokeStyle = rgb;
		Ctx.fillRect(right-((col+1)*SqSize), colorTop, SqSize, SqSize);
	}
	drawBoxAndGrid(left, top, right-left, bottom-top);
	drawBoxAndGrid(right-(FabricSize*SqSize), colorTop, FabricSize*SqSize, SqSize); 
}


function drawWeft() {
	var left = FabricRight + SqSize;
	var top = FabricTop;
	var right = left + (WeftDMax * SqSize);
	var bottom = top + (FabricSize * SqSize);

	var colorLeft = right + SqSize;
	Ctx.strokeStyle = "#000000";
	Ctx.lineWidth = 1;
	// draw the filled-in boxes in the grid
	Ctx.fillStyle = "rgb(0, 0, 0)";
	for (var row=0; row<FabricSize; row++) {  
		var cellNum = R[row % R.length];
		cellNum = toWeftDomain(cellNum);
		if (cellNum > 0) {
			Ctx.fillRect(left+((cellNum-1)*SqSize), top+(row*SqSize), SqSize, SqSize);
		}
	}
	// draw the colors
	for (var row=0; row<FabricSize; row++) {  
		var rgb = WeftColors[row % WeftColors.length];
		Ctx.fillStyle = rgb;
		Ctx.fillRect(colorLeft, top+(row*SqSize), SqSize, SqSize);
		Ctx.strokeStyle = rgb;
		Ctx.strokeRect(colorLeft, top+(row*SqSize), SqSize, SqSize);
	}
	// draw the color box over the colors
	drawBoxAndGrid(left, top, right-left, bottom-top);
	drawBoxAndGrid(colorLeft, top, SqSize, FabricSize*SqSize);
}

function drawTieUp() {
	var left = FabricRight + SqSize;
	var bottom = FabricTop - SqSize;
	var right = left + (TieUpWidth * SqSize);
	var top = bottom - (TieUpHeight * SqSize);
	// save these so that ui.js can use them for clicks in the tie-up
	TieUpL = left;
	TieUpR = right;
	TieUpT = top;
	TieUpB = bottom;
	Ctx.strokeStyle = "#000000";
	Ctx.lineWidth = 1;
	// draw the filled-in boxes in the grid
	Ctx.fillStyle = "rgb(0, 0, 0)";
	var index = 0;
	for (var row=0; row<TieUpHeight; row++) { 
		for (var col=0; col<TieUpWidth; col++) {
			index = (col*TieUpHeight)+row;  // new way
			if (T[index % T.length] !== 0) {
				Ctx.fillRect(left+(col*SqSize), bottom-((row+1)*SqSize), SqSize, SqSize);
				Ctx.strokeRect(left+(col*SqSize), bottom-((row+1)*SqSize), SqSize, SqSize);
			}
			index++;
		}
	}
	drawBoxAndGrid(left, top, right-left, bottom-top);
}

var ThreadWidth = .75;

function drawFabric() {
	var right = FabricRight;
	var top = FabricTop;
	var left = right - (FabricSize * SqSize);
	var bottom = top + (FabricSize * SqSize);
	var threadBorderColor = "#666666";
	//var showThreads = false;
	//if (!($("#showThreadsCheckbox").prop('disabled'))) {
		//showThreads = $('#showThreadsCheckbox').prop('checked');
	//} else {
		//var kk = 3;
	//}
	Ctx.strokeStyle = "#000000";
	Ctx.lineWidth = 1;
	// draw the box
	//Ctx.strokeRect(left, top, right-left, bottom-top);
	// use the weaving equation to fill in the fabric
	for (var row=0; row<FabricSize; row++) { 
		for (var col=0; col<FabricSize; col++) {
			var tieUpCol = R[row % R.length];
			var tieUpRow = S[col % S.length];
			tieUpCol--;   // fix for user's 1-based indexing
			tieUpRow--;
			tieUpCol = tieUpCol % TieUpWidth;
			tieUpRow = tieUpRow % TieUpHeight;
			var rgb = "rgb(0, 0, 0)";
			var warpOnTop = true;
			var warpRGB = WarpColors[col % WarpColors.length];
			var weftRGB= WeftColors[row % WeftColors.length];
			if (tieUpCol < 0) {
				warpOnTop = true;
			} else if (tieUpRow < 0) {
				warpOnTop = false;
			} else {
				var tieUpIndex = (tieUpCol * TieUpHeight) + tieUpRow;
				var tieUpVal = T[tieUpIndex % T.length];
				if (tieUpVal === 1) {  // use warp color
					warpOnTop = true;
				} else { // use weft color
					warpOnTop = false;
				}
			}
			if (DrawThreads) {
				var boxL = right-((col+1)*SqSize);
				var boxT = top + (row*SqSize);
				var midX = boxL + (SqSize/2);
				var midY = boxT + (SqSize/2);
				var threadW2 = (ThreadWidth * SqSize)/2;
				Ctx.fillStyle = "rgb(255,255,255)";
				Ctx.fillRect(boxL, boxT, SqSize, SqSize);
				if (warpOnTop) {
					Ctx.fillStyle = weftRGB;
					Ctx.fillRect(boxL, midY-threadW2, SqSize, 2*threadW2);
					Ctx.strokeStyle = weftRGB;
					Ctx.strokeRect(boxL, midY-threadW2, SqSize, 2*threadW2);

					Ctx.strokeStyle = threadBorderColor;//"cccccc";
					Ctx.beginPath(); Ctx.moveTo(boxL, midY-threadW2); Ctx.lineTo(boxL+SqSize, midY-threadW2); Ctx.stroke();
					Ctx.beginPath(); Ctx.moveTo(boxL, midY+threadW2); Ctx.lineTo(boxL+SqSize, midY+threadW2); Ctx.stroke();

					Ctx.fillStyle = warpRGB;
					Ctx.fillRect(midX-threadW2, boxT, 2*threadW2, SqSize);
					Ctx.strokeStyle = warpRGB;
					Ctx.strokeRect(midX-threadW2, boxT, 2*threadW2, SqSize);

					Ctx.strokeStyle = threadBorderColor;//"cccccc";
					Ctx.beginPath(); Ctx.moveTo(midX-threadW2, boxT); Ctx.lineTo(midX-threadW2, boxT+SqSize); Ctx.stroke();
					Ctx.beginPath(); Ctx.moveTo(midX+threadW2, boxT); Ctx.lineTo(midX+threadW2, boxT+SqSize); Ctx.stroke();
				} else {
					Ctx.fillStyle = warpRGB;
					Ctx.fillRect(midX-threadW2, boxT, 2*threadW2, SqSize);
					Ctx.strokeStyle = warpRGB;
					Ctx.strokeRect(midX-threadW2, boxT, 2*threadW2, SqSize);

					Ctx.strokeStyle = threadBorderColor;//"cccccc";
					Ctx.beginPath(); Ctx.moveTo(midX-threadW2, boxT); Ctx.lineTo(midX-threadW2, boxT+SqSize); Ctx.stroke();
					Ctx.beginPath(); Ctx.moveTo(midX+threadW2, boxT); Ctx.lineTo(midX+threadW2, boxT+SqSize); Ctx.stroke();

					Ctx.fillStyle = weftRGB;
					Ctx.fillRect(boxL, midY-threadW2, SqSize, 2*threadW2);
					Ctx.strokeStyle = weftRGB;
					Ctx.strokeRect(boxL, midY-threadW2, SqSize, 2*threadW2);

					Ctx.strokeStyle = threadBorderColor;//"cccccc";
					Ctx.beginPath(); Ctx.moveTo(boxL, midY-threadW2); Ctx.lineTo(boxL+SqSize, midY-threadW2); Ctx.stroke();
					Ctx.beginPath(); Ctx.moveTo(boxL, midY+threadW2); Ctx.lineTo(boxL+SqSize, midY+threadW2); Ctx.stroke();
				}
			} else {

			if (warpOnTop) { Ctx.fillStyle = warpRGB; Ctx.strokeStyle = warpRGB; }
			          else { Ctx.fillStyle = weftRGB; Ctx.strokeStyle = weftRGB; }
			Ctx.fillRect(right-((col+1)*SqSize), top+(row*SqSize), SqSize, SqSize);
			Ctx.strokeRect(right-((col+1)*SqSize), top+(row*SqSize), SqSize, SqSize);

			}
		}
	}
	drawBoxAndGrid(left, top, right-left, bottom-top);
}

function drawBoxAndGrid(left, top, wid, hgt) {
	Ctx.strokeStyle = "#888888";
	Ctx.lineWidth = 1;
	Ctx.strokeRect(left, top, wid, hgt);
	if (DrawGrids) {
		var x = left+SqSize;
		while (x < left+wid) {
			Ctx.beginPath(); Ctx.moveTo(x, top); Ctx.lineTo(x, top+hgt), Ctx.stroke();
			x += SqSize;
		}
		var y = top+SqSize;
		while (y < top+hgt) {
			Ctx.beginPath(); Ctx.moveTo(left, y); Ctx.lineTo(left+wid, y), Ctx.stroke();
			y += SqSize;
		}
	}
}
