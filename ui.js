"use strict";

var WarpPatternOutput = "";
var WeftPatternOutput = "";
var WarpColorOutput = "";
var WeftColorOutput = "";
var TieUpOutput = "";

var LocalStorageAvailable = false;
var DraftName = "";

var SelectedOutputRadioButton = "WarpPatternRadio";

///////////////////////////////////////////////////////////////////////////
// Page Load setups
///////////////////////////////////////////////////////////////////////////

// on page load
$(function(){

	LocalStorageAvailable = localStorageTest();

	makePresets();
	setupRemoveBGPrompts();
	setupOutputRadioButtons();
	buildLoadDraftDropdown();

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
// localStorage Utilities
///////////////////////////////////////////////////////////////////////////

function localStorageTest() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch(e){
    return false;
  }
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
	alert("help button");
	//window.open("http://www.glassner.com");
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
// canvas mouse callback setups
///////////////////////////////////////////////////////////////////////////


function respondToMouseInCanvas(event) {
	var canvas = document.getElementById("myCanvas");
	var rect = canvas.getBoundingClientRect();
	var x = Math.round(event.clientX - rect.left);
	var y = Math.round(event.clientY - rect.top);

	if (SqSize < 5) {
		alert("Processing x="+x+" y="+y+" SqSize="+SqSize);
	} else {
	}
	
}
