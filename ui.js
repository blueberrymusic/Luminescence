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

	//$('#fabricSizeInput').val(FabricSize);
	//$('#tieUpWidthInput').val(TieUpWidth);
	//$('#tieUpHeightInput').val(TieUpHeight);

	var defaultName = Presets[0][0];
	loadDraft(defaultName);
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
// Draft saving and loading 
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

function buildLoadDraftDropdown() {
	var loadMenu = $('#loadDraftMenuItems');
	// clear the menu
	loadMenu.find('li').remove().end();
	//loadMenu.append("<li class='dropdown-header'>Dropdown header 1</li>");
	//loadMenu.append("<li><a href='#'>"+"item 1"+"</a></li>");
	//loadMenu.append("<li class='divider'></li>");

	if (LocalStorageAvailable) {
		loadMenu.append("<li class='dropdown-header'>Local Saves</li>");
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
	});
}

function loadDraft(draftName) {
	var jsonData = "";
	var foundIt = false;
	if (LocalStorageAvailable) {
 		for (var i = 0; (i < localStorage.length) && (!foundIt); i++){
			var key = localStorage.key(i);
			if (key === draftName) {
				jsonData = localStorage.getItem(key); // or localStorage[key];
				foundIt = true;
			}
		}
	}
	if (!foundIt) {
		for (var i=0; (i<Presets.length) && (!foundIt); i++) {
			var psi = Presets[i];
			var name = psi[0];
			if (name === draftName) {
				jsonData = psi[1];
				foundIt = true;
			}
		}
	}
	if (!foundIt) {
		alert("I couldn't find draft "+draftName+" to load either in local storage or as a built-in preset. Sorry!");
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
	// update the output area by forcing it to switch to WarpPattern
	selectRadioButton("#WarpPatternRadio");

	// update the name variable and display
	DraftName = draftName;
	$("input[name='draftNameInput']").val(DraftName);

	drawCanvas();
}

function saveButtonFunction() {
	if (DraftName === "") {
		alert("Please provide a name for the draft, then try saving again");
		return;
	}

	var warpPatternString = $('#warpPatternAWL').val();
	var weftPatternString = $('#weftPatternAWL').val();
	var warpColorString = $('#warpColorAWL').val();
	var weftColorString = $('#weftColorAWL').val();
	var tieUpString = $('#tieUpAWL').val();
	var fabricSizeString = $('#fabricSizeInput').val();
	var tieUpWidthString = $('#tieUpWidthInput').val();
	var tieUpHeightString = $('#tieUpHeightInput').val();

	var draft = [];
	draft.push({ "field": "WarpAWL",      "value": warpPatternString });
	draft.push({ "field": "WeftAWL",      "value": weftPatternString });
	draft.push({ "field": "WarpColorAWL", "value": warpColorString });
	draft.push({ "field": "WeftColorAWL", "value": weftColorString });
	draft.push({ "field": "TieUpAWL",     "value": tieUpString });
	draft.push({ "field": "FabricSize",   "value": fabricSizeString });
	draft.push({ "field": "TieUpWidth",   "value": tieUpWidthString });
	draft.push({ "field": "TieUpHeight",  "value": tieUpHeightString });
	var JSONDraft = JSON.stringify(draft);

	try {
		localStorage.setItem(DraftName, JSONDraft);
	}
	catch (e) {
		alert("Sorry! You're out of local storage space. Try deleting some drafts to make room for new ones.");
	}

	buildLoadDraftDropdown(); // rebuild the drop-down to include this new entry
}

function deleteButtonFunction() {
	if (DraftName === "") {
		alert("Please choose a draft from the list so I know what to delete.");
		return;
	}
	if (!LocalStorageAvailable) {
		alert("Sorry, I can only delete from local storage, and your browser doesn't support that.");
		return;
	}
	for (var i = 0; i < localStorage.length; i++){
		var key = localStorage.key(i);
		if (key === DraftName) {
			try {
				localStorage.removeItem(key);
				buildLoadDraftDropdown(); // rebuild the drop-down since this entry's gone
			}
			catch (e) {
				alert("Sorry! I found "+DraftName+" but got an error trying to delete it.");
			}
			return;
		}
	}
	alert("Sorry! I could not delete "+DraftName+" because I couldn't find it in your local storage.");
}

// handle the modal dialog popup to confirm delete
// http://www.codeproject.com/Tips/891309/Custom-Confirmation-Box-using-Bootstrap-Modal-Dial
function AsyncConfirmYesNo(title, msg, yesFn, noFn) {
    var $confirm = $("#modalConfirmYesNo");
    $confirm.modal('show');
    $("#lblTitleConfirmYesNo").html(title);
    $("#lblMsgConfirmYesNo").html(msg);
    $("#btnYesConfirmYesNo").off('click').click(function () {
        yesFn();
        $confirm.modal("hide");
    });
    $("#btnNoConfirmYesNo").off('click').click(function () {
        noFn();
        $confirm.modal("hide");
    });
}
function showDeleteConfirmationModal() {
	if (DraftName === "") {
		alert("Please choose a draft from the list so I know what to delete.");
		return;
	}
	AsyncConfirmYesNo(
		"Delete Confirmation",
		"Are you sure you want to delete draft "+DraftName+"?",
		DeleteModalYesFunction,
		DeleteModalNoFunction
	);
}
function DeleteModalYesFunction() {
	deleteButtonFunction();
}
function DeleteModalNoFunction() {
	// nothing to do
}
