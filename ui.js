"use strict";

var WarpPatternOutput = "";
var WeftPatternOutput = "";
var WarpColorOutput = "";
var WeftColorOutput = "";
var TieUpOutput = "";

var DraftName = "";

var SelectedOutputRadioButton = "WarpPatternRadio";

///////////////////////////////////////////////////////////////////////////
// Page Load setups
///////////////////////////////////////////////////////////////////////////

// on page load
$(function(){

	makePresets();
	setupRemoveBGPrompts();
	setupOutputRadioButtons();
	buildLoadDraftDropdown();
	buildColorKeyValueLists();

	var defaultName = Presets[0][0];
	loadDraft(defaultName);
	setupCanvasListener();
});


function setupRemoveBGPrompts() {
	// trick to remove background prompt when somone's typed, using jquery
	// thanks to https://css-tricks.com/textarea-tricks/
	$('#warpPatternAWL')
  	.focus(function() { $(this).css("background", "none"); $(this).css("background-color", "#ffeeee"); })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Warp-Pattern-Input.gif) bottom right no-repeat") } });
	$('#weftPatternAWL')
  	.focus(function() { $(this).css("background", "none"); $(this).css("background-color", "#ffeeee"); })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Weft-Pattern-Input.gif) bottom right no-repeat") } });
	$('#warpColorAWL')
  	.focus(function() { $(this).css("background", "none"); $(this).css("background-color", "#ffeeee"); })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Warp-Color-Input.gif) bottom right no-repeat") } });
	$('#weftColorAWL')
  	.focus(function() { $(this).css("background", "none"); $(this).css("background-color", "#ffeeee"); })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Weft-Color-Input.gif) bottom right no-repeat") } });
	$('#tieUpAWL')
  	.focus(function() { $(this).css("background", "none"); $(this).css("background-color", "#ffeeee"); })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Tieup-Input.gif) bottom right no-repeat") } });
}

function setupOutputRadioButtons() {
	$('.outputRadioButton').on('click', function(){
		var thisID = ($(this).find('input').attr('id'));
		SelectedOutputRadioButton = thisID;
		showChosenOutput('#'+thisID);
	}); 
}

function setupCanvasListener() {
   var canvas = document.getElementById("myCanvas");
   canvas.addEventListener("mousedown", respondToMouseInCanvas, false);
}

///////////////////////////////////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////////////////////////////////

function AWLtoString(inputID) {
	var input = $(inputID).val()
	var result = ProcessString(input);
	var output = "";
	for (var i=0; i<result.length; i++) {
		if (i > 0) output = output.concat(" ");
		output = output.concat(result[i]);
	}
	return output;
}
	
function selectRadioButton(choice) { 
	var target = $(choice);
	target.closest('.btn').button('toggle');
	showChosenOutput(choice);
}

function showChosenOutput(choice) {
	var outString = "";
	if (choice === "#WarpPatternRadio") outString = WarpPatternOutput;
	if (choice === "#WeftPatternRadio") outString = WeftPatternOutput;
	if (choice === "#WarpColorRadio") outString = WarpColorOutput
	if (choice === "#WeftColorRadio") outString = WeftColorOutput;
	if (choice === "#TieUpRadio") outString = TieUpOutput;
	$('#AWLOutput').val(outString);
}

///////////////////////////////////////////////////////////////////////////
// Button input element responders
///////////////////////////////////////////////////////////////////////////
	
function helpButtonFunction() {
	window.open("help/help.html", "_blank");
}

function fabricSizeInputFunction() {
	FabricSize = parseInt($('#fabricSizeInput').val());
	drawCanvas();
}

function tieUpWidthInputFunction() {
	TieUpWidth = parseInt($('#tieUpWidthInput').val());
	drawCanvas();
}

function tieUpHeightInputFunction() {
	TieUpHeight = parseInt($('#tieUpHeightInput').val());
	drawCanvas();
}

function warpPatternButtonFunction() {
	$('#warpPatternAWL').css("background-color", "#ffffff");
	WarpPatternOutput = AWLtoString('#warpPatternAWL');
	selectRadioButton("#WarpPatternRadio");
	drawCanvas();
}

function weftPatternButtonFunction() {
	$('#weftPatternAWL').css("background-color", "#ffffff");
	WeftPatternOutput = AWLtoString('#weftPatternAWL');
	selectRadioButton("#WeftPatternRadio");
	drawCanvas();
}

function warpColorButtonFunction() {
	$('#warpColorAWL').css("background-color", "#ffffff");
	WarpColorOutput = AWLtoString('#warpColorAWL');
	selectRadioButton("#WarpColorRadio");
	drawCanvas();
}

function weftColorButtonFunction() {
	$('#weftColorAWL').css("background-color", "#ffffff");
	WeftColorOutput = AWLtoString('#weftColorAWL');
	selectRadioButton("#WeftColorRadio");
	drawCanvas();
}

function tieUpButtonFunction() {
	$('#tieUpAWL').css("background-color", "#ffffff");
	TieUpOutput = AWLtoString('#tieUpAWL');
	selectRadioButton("#TieUpRadio");
	drawCanvas();
}

///////////////////////////////////////////////////////////////////////////
// i/o pnael responders
///////////////////////////////////////////////////////////////////////////

function draftNameInputFunction() {
	var target = $("input[name='draftNameInput']");
	var name = target.val();
	name = name.trim();
	name = name.replace(/\s\s+/g, ' '); // all whitespace becomes one space
	//name = name.replace(/\s/g, '-'); // all spaces become one dash
	DraftName = name;
	target.val(DraftName);
}

///////////////////////////////////////////////////////////////////////////
// mouse in Canvas callback for tieup editor
///////////////////////////////////////////////////////////////////////////

// if SqSize is too small for a reliable indication, then blink a
// reddish box to alert the user.
function respondToMouseInCanvas(event) {
	var canvas = document.getElementById("myCanvas");
	var rect = canvas.getBoundingClientRect();
	var x = Math.round(event.clientX - rect.left);
	var y = Math.round(event.clientY - rect.top);

	if ((x < TieUpL) || (x > TieUpR) || (y < TieUpT) || (y > TieUpB)) return;
	var minSqSize = 4;

	if (SqSize < minSqSize) {  
		var redBoxSize = 25;
		var boxULx = (x+15) - (redBoxSize/2); // compensate for 15px gutter between columns in Bootstrap
		var boxULy = y - (redBoxSize/2);
		$('#canvasSignalBoxDiv').css('width', redBoxSize);
		$('#canvasSignalBoxDiv').css('height', redBoxSize);
		$('#canvasSignalBoxDiv').css('left', boxULx);
		$('#canvasSignalBoxDiv').css('top', boxULy);
		$('#canvasSignalBoxDiv').css('border-width', (redBoxSize/6).toString()+"px");
		$('#canvasSignalBoxDiv').css('border-color', "white");
		$('#canvasSignalBoxDiv').css('border-style', "solid");
		$('#canvasSignalBoxDiv').animate({display: 'show'});
	} else {
		// from drawing.js, use TieUpL, TieUpR, TieUpT, TieUpB for sides of tie-up
		var col = Math.floor((x-TieUpL)/SqSize);
		var row = Math.floor((TieUpB-y)/SqSize);
		var tieUpWords = TieUpOutput.split(' ');
		var entry = (col * TieUpHeight) + row;
		if (tieUpWords[entry] === '0') {
			tieUpWords[entry] = '1';
		} else {
			tieUpWords[entry] = '0';
		}
		var newTieUp = tieUpStringToBinaryAWL(tieUpWords);
 		$('#tieUpAWL').val(newTieUp);
		TieUpOutput = AWLtoString('#tieUpAWL');
		drawCanvas();
	}
}

function tieUpStringToBinaryAWL(words) {
	var lens = [];
	var lastEntry = words[0];
	var thisLen = 1;
	var index = 0;
	while (index++ < words.length) {
		if ((words[index] !== '0') && (words[index] !== '1')) continue;
		if (words[index] !== lastEntry) {
			lens.push(thisLen);
			thisLen = 1;
			lastEntry = words[index];	
		} else {
			thisLen++;
		}
	}
	lens.push(thisLen);
	var newString = "";
	for (var i=0; i<lens.length; i++) {
		if (i > 0) newString += ' ';
		newString += (lens[i].toString());
	}
	if (words[0] === '0') {
		newString += ' b0';
	} else {
		newString += ' b1';
	}
	return newString;
}

