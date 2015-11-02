"use strict";

// on page load
$(function(){

// Build responders to items in the load draft dropdown. I couldn't figure out how to get
// the chosen element back using Boostrap's Dropdown Events model. So instead we
// go around the back door and respond directly when the elements receive a click.
// Thank you (yet again) Stack Overflow! So easy once you know exactly what to do.
// http://stackoverflow.com/questions/17127572/bootstrap-dropdown-get-value-of-selected-item
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

$('.outputRadioButton').on('click', function(){
    var thisID = ($(this).find('input').attr('id'));
	if (thisID === "WarpPatternRadio") alert("was WarpPatternRadio");
	if (thisID === "WeftPatternRadio") alert("was WeftPatternRadio");
	if (thisID === "WarpColorRadio") alert("was WarpColorRadio");
	if (thisID === "WeftColorRadio") alert("was WeftColorRadio");
	if (thisID === "TieUpRadio") alert("was TieUpRadio");
}); 


});

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
