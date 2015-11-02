"use strict";

var FabricSize = 120;  // The size of the fabric grid
var Ctx;               // the graphics context
var SqSize;            // size of each square in the canvas
var CanvasSize;        // pixels on each side
var DrawGrid = false;  // see the underlying grid, for debuggin
var TieUpWidth = 8;    // width of tie-up
var TieUpHeight = 8;   // height of tie-up

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

	CanvasSize  = Math.min(c.width, c.height);
	getDomainSizes();
	var maxRange = Math.max(WarpDRange, WeftDRange);
	var numSquares = FabricSize + maxRange + 5; // 4 pads and 1 color
	SqSize = CanvasSize / numSquares;

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
	var localS = S;
	var localClrs = WarpColors;
	var right = CanvasSize - ((TieUpWidth+4) * SqSize);
	var top = CanvasSize - ((TieUpHeight+3) * SqSize);
	var left = right - (FabricSize * SqSize);
	var bottom = top + (WarpDRange * SqSize);
	var colorTop = CanvasSize - (2 * SqSize);
	Ctx.strokeStyle = "#000000";
	Ctx.lineWidth = 1;
	// draw the box
	Ctx.beginPath();
		Ctx.moveTo(left, top);
		Ctx.lineTo(right, top);
		Ctx.lineTo(right, bottom);
		Ctx.lineTo(left, bottom);
		Ctx.lineTo(left, top);
		Ctx.stroke();
	if (DrawGrid) {
		for (var col=1; col<FabricSize; col++) {  
			Ctx.beginPath();
			Ctx.moveTo(left+(col*SqSize), top);
			Ctx.lineTo(left+(col*SqSize), bottom);
			Ctx.stroke();
		}
		for (var row=1; row<WarpDRange; row++) {  
			Ctx.beginPath();
			Ctx.moveTo(left,  top+(row*SqSize));
			Ctx.lineTo(right, top+(row*SqSize));
			Ctx.stroke();
		}
	}
	// draw the filled-in boxes in the grid
	Ctx.fillStyle = "rgb(0, 0, 0)";
	for (var col=0; col<FabricSize; col++) {  
		var cellNum = S[col % S.length];
		cellNum = toWarpDomain(cellNum)-WarpDMin;
		Ctx.fillRect(right-((col+1)*SqSize), top+(cellNum*SqSize), SqSize, SqSize);
	}
	// draw the colors
	for (var col=0; col<FabricSize; col++) {  
		var rgb = WarpColors[col % WarpColors.length];
		Ctx.fillStyle = rgb;
		Ctx.fillRect(right-((col+1)*SqSize), colorTop, SqSize, SqSize);
	}
}

function drawWeft() {
	var localR = R;
	var localClrs = WeftColors;
	var bottom = CanvasSize - ((TieUpHeight+4) * SqSize);
	var left = CanvasSize - ((TieUpWidth+3) * SqSize);
	var top = bottom - (FabricSize * SqSize);
	var right = left + (WeftDRange * SqSize);
	var colorLeft = CanvasSize - (2 * SqSize);
	Ctx.strokeStyle = "#000000";
	Ctx.lineWidth = 1;
	// draw the box
	Ctx.beginPath();
		Ctx.moveTo(left, top);
		Ctx.lineTo(right, top);
		Ctx.lineTo(right, bottom);
		Ctx.lineTo(left, bottom);
		Ctx.lineTo(left, top);
		Ctx.stroke();
	if (DrawGrid) {
		for (var col=1; col<WeftDRange; col++) {  
			Ctx.beginPath();
			Ctx.moveTo(left+(col*SqSize), top);
			Ctx.lineTo(left+(col*SqSize), bottom);
			Ctx.stroke();
		}
		for (var row=1; row<FabricSize; row++) {  
			Ctx.beginPath();
			Ctx.moveTo(left,  top+(row*SqSize));
			Ctx.lineTo(right, top+(row*SqSize));
			Ctx.stroke();
		}
	}
	// draw the filled-in boxes in the grid
	Ctx.fillStyle = "rgb(0, 0, 0)";
	for (var row=0; row<FabricSize; row++) {  
		var cellNum = R[row % R.length];
		cellNum = toWeftDomain(cellNum)-WeftDMin;
		Ctx.fillRect(left+(cellNum*SqSize), bottom-((row+1)*SqSize), SqSize, SqSize);
	}
	// draw the colors
	for (var row=0; row<FabricSize; row++) {  
		var rgb = WeftColors[row % WeftColors.length];
		Ctx.fillStyle = rgb;
		Ctx.fillRect(colorLeft, bottom-((row+1)*SqSize), SqSize, SqSize);
	}
}

function drawTieUp() {
	var localT = T;
	var left = CanvasSize - ((TieUpWidth+3) * SqSize);
	var top = CanvasSize - ((TieUpHeight+3) * SqSize);
	var right = left + (TieUpWidth * SqSize);
	var bottom = top + (TieUpHeight * SqSize);
	Ctx.strokeStyle = "#000000";
	Ctx.lineWidth = 1;
	// draw the box
	Ctx.beginPath();
		Ctx.moveTo(left, top);
		Ctx.lineTo(right, top);
		Ctx.lineTo(right, bottom);
		Ctx.lineTo(left, bottom);
		Ctx.lineTo(left, top);
		Ctx.stroke();
	if (DrawGrid) {
		for (var col=1; col<TieUpHeight; col++) {  
			Ctx.beginPath();
			Ctx.moveTo(left+(col*SqSize), top);
			Ctx.lineTo(left+(col*SqSize), bottom);
			Ctx.stroke();
		}
		for (var row=1; row<TieUpWidth; row++) {  
			Ctx.beginPath();
			Ctx.moveTo(left,  top+(row*SqSize));
			Ctx.lineTo(right, top+(row*SqSize));
			Ctx.stroke();
		}
	}
	// draw the filled-in boxes in the grid
	Ctx.fillStyle = "rgb(0, 0, 0)";
	var index = 0;
	for (var row=0; row<TieUpHeight; row++) { 
		for (var col=0; col<TieUpWidth; col++) {
			if (T[index % T.length] !== 0) {
				Ctx.fillRect(left+(col*SqSize), top+(row*SqSize), SqSize, SqSize);
			}
			index++;
		}
	}
}

function drawFabric() {
	var right = CanvasSize - ((TieUpWidth+4) * SqSize);
	var bottom = CanvasSize - ((TieUpHeight+4) * SqSize);
	var left = right - (FabricSize * SqSize);
	var top = bottom - (FabricSize * SqSize);
	Ctx.strokeStyle = "#000000";
	Ctx.lineWidth = 1;
	// draw the box
	Ctx.beginPath();
		Ctx.moveTo(left, top);
		Ctx.lineTo(right, top);
		Ctx.lineTo(right, bottom);
		Ctx.lineTo(left, bottom);
		Ctx.lineTo(left, top);
		Ctx.stroke();
	if (DrawGrid) {
		for (var col=1; col<WarpDRange; col++) {  
			Ctx.beginPath();
			Ctx.moveTo(left+(col*SqSize), top);
			Ctx.lineTo(left+(col*SqSize), bottom);
			Ctx.stroke();
		}
		for (var row=1; row<WeftDRange; row++) {  
			Ctx.beginPath();
			Ctx.moveTo(left,  top+(row*SqSize));
			Ctx.lineTo(right, top+(row*SqSize));
			Ctx.stroke();
		}
	}
	// use the weaving equation to fill in the fabric
	for (var row=0; row<FabricSize; row++) { 
		for (var col=0; col<FabricSize; col++) {
			var tieUpCol = R[row % R.length];
			var tieUpRow = S[col % S.length];
			var tieUpVal = T[(tieUpRow * TieUpWidth) + tieUpCol];
			var rgb = "rgb(0, 0, 0)";
			if (tieUpVal === 1) {  // use warp color
				rgb = WarpColors[col % WarpColors.length];
			} else { // use weft color
				rgb = WeftColors[row % WeftColors.length];
			}
			Ctx.fillStyle = rgb;
			Ctx.fillRect(right-((col+1)*SqSize), bottom-((row+1)*SqSize), SqSize, SqSize);
			Ctx.strokeStyle = rgb;
			Ctx.strokeRect(right-((col+1)*SqSize), bottom-((row+1)*SqSize), SqSize, SqSize);
		}
	}
}
