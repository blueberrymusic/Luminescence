"use strict";

var WarpPatternOutput = "";
var WeftPatternOutput = "";
var WarpColorOutput = "";
var WeftColorOutput = "";
var TieUpOutput = "";

var SelectedOutputRadioButton = "WarpPatternRadio";

///////////////////////////////////////////////////////////////////////////
// Page Load setups
///////////////////////////////////////////////////////////////////////////

// on page load
$(function(){

	setupRemoveBGPrompts();
	setupOutputRadioButtons();
	buildLoadDraftDropdown();

});


function setupRemoveBGPrompts() {
	// trick to remove background prompt when somone's typed, using jquery
	// thanks to https://css-tricks.com/textarea-tricks/
	$('#warpPatternAWL')
  	.focus(function() { $(this).css("background", "none"); })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Warp-Pattern-Input.gif) bottom right no-repeat") } });
	$('#weftPatternAWL')
  	.focus(function() { $(this).css("background", "none") })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Weft-Pattern-Input.gif) bottom right no-repeat") } });
	$('#warpColorAWL')
  	.focus(function() { $(this).css("background", "none") })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Warp-Color-Input.gif) bottom right no-repeat") } });
	$('#weftColorAWL')
  	.focus(function() { $(this).css("background", "none") })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Weft-Color-Input.gif) bottom right no-repeat") } });
	$('#tieUpAWL')
  	.focus(function() { $(this).css("background", "none") })
  	.blur(function() { if ($(this)[0].value === '') { 
			$(this).css("background", "url(images/BG-Tieup-Input.gif) bottom right no-repeat") } });
}

function setupOutputRadioButtons() {
	$('.outputRadioButton').on('click', function(){
		var thisID = ($(this).find('input').attr('id'));
		SelectedOutputRadioButton = thisID;
		showChosenOutput('#'+thisID);
		//if (thisID === "WarpPatternRadio") alert("chose WarpPatternRadio");
		//if (thisID === "WeftPatternRadio") alert("chose WeftPatternRadio");
		//if (thisID === "WarpColorRadio") alert("chose WarpColorRadio");
		//if (thisID === "WeftColorRadio") alert("chose WeftColorRadio");
		//if (thisID === "TieUpRadio") alert("chose TieUpRadio");
	}); 
}

// Build responders to items in the load draft dropdown. I couldn't figure out how to get
// the chosen element back using Boostrap's Dropdown Events model. So instead we
// go around the back door and respond directly when the elements receive a click.
// Thank you (yet again) Stack Overflow! So easy once you know exactly what to do.
// http://stackoverflow.com/questions/17127572/bootstrap-dropdown-get-value-of-selected-item
function buildLoadDraftDropdown() {
	var loadMenu = $('#loadDraftMenuItems');
	loadMenu.find('li').remove().end();
	loadMenu.append("<li><a href='#'>"+"item 1"+"</a></li>");
	loadMenu.append("<li><a href='#'>"+"item 2"+"</a></li>");
	loadMenu.append("<li><a href='#'>"+"item 3"+"</a></li>");
	$("#loadDraftMenuItems > li > a").click(function(){
		var selText = $(this).text();
		alert("got "+selText);
		// assign result to parent
		//$(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
	});
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
	
function selectRadioButton(choice) { //"TieUpRadio");
	var target = $(choice);
	//$(choice).prop('checked', true);
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
// UI element responders
///////////////////////////////////////////////////////////////////////////
	
function helpButtonFunction() {
	alert("help button");
	//window.open("http://www.glassner.com");
}
function saveButtonFunction() {
	alert("save Button");
}

function loadButtonFunction() {
	alert("load Button");
}

function deleteButtonFunction() {
	alert("delete Button");
}

function draftNameInputFunction() {
	alert("name changed");
}

function loadDraftButtonFunction() {
	alert("load draft button used");
}

function fabricSizeInputFunction() {
	var fs = parseInt($('#fabricSizeInput').val());
	alert("fabric size input "+fs);
}

function tieUpWidthInputFunction() {
	var fs = parseInt($('#tieUpWidthInput').val());
	alert("tieup width input "+fs);
}

function tieUpHeightInputFunction() {
	var fs = parseInt($('#tieUpHeightInput').val());
	alert("tieup height input "+fs);
}

function warpPatternButtonFunction() {
	WarpPatternOutput = AWLtoString('#warpPatternAWL');
	selectRadioButton("#WarpPatternRadio");
	//alert("warp Pattern button used");
}

function weftPatternButtonFunction() {
	WeftPatternOutput = AWLtoString('#weftPatternAWL');
	selectRadioButton("#WeftPatternRadio");
	//alert("weft Pattern button used");
}

function warpColorButtonFunction() {
	WarpColorOutput = AWLtoString('#warpColorAWL');
	selectRadioButton("#WarpColorRadio");
	//alert("warp Color button used");
}

function weftColorButtonFunction() {
	WeftColorOutput = AWLtoString('#weftColorAWL');
	selectRadioButton("#WeftColorRadio");
	//alert("weft Color button used");
}

function tieUpButtonFunction() {
	TieUpOutput = AWLtoString('#tieUpAWL');
	selectRadioButton("#TieUpRadio");
	//alert("tieUp button used");
}
