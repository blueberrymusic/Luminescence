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

	makePresets();
	setupRemoveBGPrompts();
	setupOutputRadioButtons();
	buildLoadDraftDropdown();
	LocalStorageAvailable = localStorageTest();

	$('#fabricSizeInput').val(FabricSize);
	$('#tieUpWidthInput').val(TieUpWidth);
	$('#tieUpHeightInput').val(TieUpHeight);
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
	WarpPatternOutput = AWLtoString('#warpPatternAWL');
	selectRadioButton("#WarpPatternRadio");
	drawCanvas();
	//alert("warp Pattern button used");
}

function weftPatternButtonFunction() {
	WeftPatternOutput = AWLtoString('#weftPatternAWL');
	selectRadioButton("#WeftPatternRadio");
	drawCanvas();
	//alert("weft Pattern button used");
}

function warpColorButtonFunction() {
	WarpColorOutput = AWLtoString('#warpColorAWL');
	selectRadioButton("#WarpColorRadio");
	drawCanvas();
	//alert("warp Color button used");
}

function weftColorButtonFunction() {
	WeftColorOutput = AWLtoString('#weftColorAWL');
	selectRadioButton("#WeftColorRadio");
	drawCanvas();
	//alert("weft Color button used");
}

function tieUpButtonFunction() {
	TieUpOutput = AWLtoString('#tieUpAWL');
	selectRadioButton("#TieUpRadio");
	drawCanvas();
	//alert("tieUp button used");
}

///////////////////////////////////////////////////////////////////////////
// Draft saving and loading 
///////////////////////////////////////////////////////////////////////////

function saveButtonFunction() {
	alert("save Button");
}

function deleteButtonFunction() {
	alert("delete Button");
}

function draftNameInputFunction() {
	var target = $("input[name='draftNameInput']");
	var name = target.val();
	name = name.trim();
	name = name.replace(/\s\s+/g, ' '); // all whitespace becomes one space
	name = name.replace(/\s/g, '-'); // all spaces become one dash
	DraftName = name;
	target.val(DraftName);
}

function buildLoadDraftDropdown() {
	var loadMenu = $('#loadDraftMenuItems');
	// clear the menu
	loadMenu.find('li').remove().end();
	//loadMenu.append("<li class='dropdown-header'>Dropdown header 1</li>");
	//loadMenu.append("<li><a href='#'>"+"item 1"+"</a></li>");
	//loadMenu.append("<li class='divider'></li>");

	if (LocalStorageAvailable) {
		loadMenu.append("<li class='dropdown-header'>Local Saves 1</li>");
 		for (var i = 0; i < localStorage.length; i++){
			var key = localStorage.key(i);
			var value = localStorage.getItem(key); // or localStorage[key];
			loadMenu.append("<li><a href='#'>"+key+"</a></li>");
		}
		loadMenu.append("<li class='divider'></li>");
	}
	loadMenu.append("<li class='dropdown-header'>Presets</li>");
	for (var i=0; i<Presets.length; i++) {
		var psi = Presets[i];
		var name = psi[0];
		var json = psi[1];
 		loadMenu.append("<li><a href='#'>"+name+"</a></li>");
	}

	// I couldn't figure out how to respond to the drop-down selection event and get access
	// to the chosen item using Boostrap's Dropdown Events model. So instead we
	// attach a responder that sends the name of the selection to a handler.
	// Thank you (yet again) Stack Overflow! So easy once you know exactly what to do.
	// http://stackoverflow.com/questions/17127572/bootstrap-dropdown-get-value-of-selected-item
	$("#loadDraftMenuItems > li > a").click(function(){
		var selText = $(this).text();
		loadDraft(selText);
		//alert("got "+selText);
	});
}

function loadDraft(draftName) {
	var jsonData = "";
	var foundit = false;
	if (LocalStorageAvailable) {
 		for (var i = 0; i < localStorage.length; i++){
			var key = localStorage.key(i);
			if (key === draftName) {
				jsonData = localStorage.getItem(key); // or localStorage[key];
				foundit = true;
			}
		}
	}
	if (!foundit) {
		for (var i=0; i<Presets.length; i++) {
			var psi = Presets[i];
			var name = psi[0];
			if (name === draftName) {
				jsonData = psi[1];
				foundit = true;
			}
		}
	}
	if (!foundit) {
		alert("I couldn't find draft "+draftName+" to load. Sorry!");
		return;
	}
	var weaveData = JSON.parse(jsonData);
	for (var i=0; i<weaveData.length; i++) {
		var datum = weaveData[i];
		var fieldName = datum['field'];
		var value = datum['value'];
		if (fieldName === "WarpAWL") {
			$('#warpPatternAWL').val(value);
			WarpPatternOutput = AWLtoString('#warpPatternAWL');
		} else if (fieldName === "WeftAWL") {
			$('#weftPatternAWL').val(value);
			WeftPatternOutput = AWLtoString('#weftPatternAWL');
		} else if (fieldName === "WarpColorAWL") {
			$('#warpColorAWL').val(value);
			WarpColorOutput = AWLtoString('#warpColorAWL');
		} else if (fieldName === "WeftColorAWL") {
			$('#weftColorAWL').val(value);
			WeftColorOutput = AWLtoString('#weftColorAWL');
		} else if (fieldName === "TieUpAWL") {
			$('#tieUpAWL').val(value);
			TieUpOutput = AWLtoString('#tieUpAWL');
		} else if (fieldName === "FabricSize") {
			FabricSize = Number(value);
			$('#fabricSizeInput').val(FabricSize);
		} else if (fieldName === "TieUpWidth") {
			TieUpWidth = Number(value);
			$('#tieUpWidthInput').val(TieUpWidth);
		} else if (fieldName === "TieUpHeight") {
			TieUpHeight = Number(value);
			$('#tieUpHeightInput').val(TieUpHeight);
		} else {
			alert("Reading draft "+draftName+" I found an unknown field named ["+fieldName+"]");
			return;
		}
	}
	drawCanvas();
}

function saveDraftButtonFunction() {
	// hand-code everything for now. 
	// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

	if (DraftName === "") {
		alert("cannot save a draft with no name!");
		return;
	}
	var draft = [];
	draft.push({ "WarpAWL": $('#warpPatternAWL').val()});
	draft.push({ "WeftAWL": $('#weftPatternAWL').val()});
	draft.push({ "WarpColorAWL": $('#warpColorAWL').val()});
	draft.push({ "WeftColorAWL": $('#weftColorAWL').val()});
	draft.push({ "TieUpAWL": $('#tieUpAWL').val()});
	draft.push({ "TieUpWidth": TieUpWidth });
	draft.push({ "TieUpHeight": TieUpHeight });
	draft.push({ "FabricSize": FabricSize });

	var JSONDraft = JSON.stringify(draft);
	try {
		localStorage.setItem(DraftName, JSONDraft);
	}
	catch (e) {
		alert("Sorry! You're out of local storage space. Try deleting some drafts to make room for new ones.");
	}

	rebuildDraftSelector();

	// This will put a file in Downloads, but with some random name
	//var canvas = document.getElementById("myCanvas");
	//var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  
	//window.location.href=image; // it will save locally
}
