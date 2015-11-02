"use strict";

// on page load
$(function(){

// Respond to a click in the load draft dropdown. I couldn't figure out how to get
// the chosen element back using Boostrap's Dropdown Events model. So instead we
// go around the back door and respond directly when the elements receive a click.
// Thank you (yet again) Stack Overflow! So easy once you know exactly what to do.
// http://stackoverflow.com/questions/17127572/bootstrap-dropdown-get-value-of-selected-item
$("#loadDraftMenuItems > li > a").click(function(){
	var selText = $(this).text();
	alert("got "+selText);
	// assign result to parent
	//$(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
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
