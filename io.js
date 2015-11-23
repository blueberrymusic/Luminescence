///////////////////////////////////////////////////////////////////////////
// Draft saving and loading 
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
// Dropdown Responders
///////////////////////////////////////////////////////////////////////////

var LogIntoDropboxText = "Log into Dropbox";

function buildLoadDraftDropdown() {
	if (DropboxClient === null) {
		buildLoadDraftDropdownWithDropboxFiles(null);
	} else {
		getDropboxDirectory(buildLoadDraftDropdownWithDropboxFiles);
	}
}

function buildLoadDraftDropdownWithDropboxFiles(fileList) {
	var loadMenu = $('#loadDraftMenuItems');
	// clear the menu
	loadMenu.find('li').remove().end();
	//loadMenu.append("<li class='dropdown-header'>Dropdown header 1</li>");
	//loadMenu.append("<li><a href='#'>"+"item 1"+"</a></li>");
	//loadMenu.append("<li class='divider'></li>");

	loadMenu.append("<li class='dropdown-header'>Dropbox Files</li>");
	if (fileList === null) {
		loadMenu.append("<li><a href='#'>"+LogIntoDropboxText+"</a></li>");
	} else {
		for (var i=0; i<fileList.length; i++) {
			// we only want to offer files that end with .txt or .wif
			var suffixes = /\.txt$|\.wif$/;
			if (suffixes.test(fileList[i])) {
				loadMenu.append("<li><a href='#'>"+fileList[i]+"</a></li>");
			}
		}
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

///////////////////////////////////////////////////////////////////////////
// Load draft
///////////////////////////////////////////////////////////////////////////

function loadDraft(draftName) {
	if (draftName === LogIntoDropboxText) {
		authorizeDropBox();
		buildLoadDraftDropdown();
		return;
	}
	// search for preset names first, then try to go to dropbox
	var foundIt = false;
	for (var i=0; (i<Presets.length) && (!foundIt); i++) {
		var psi = Presets[i];
		var name = psi[0];
		if (name === draftName) {
			jsonData = psi[1]; 
			foundIt = true;
			loadDraftFromJSON(draftName, jsonData);
		}
	}
	if (!foundIt) {
		getDropboxFileContents(draftName, loadDraftFromWIF);
	}
}

function loadDraftFromWIF(draftName, wifData) {
	var jsonData = convertWIFtoJSON(draftName, wifData);
	loadDraftFromJSON(draftName, jsonData);
}

function loadDraftFromJSON(draftName, jsonData) {
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
			showModalAlert("There was a problem loading your draft", "Reading draft "+draftName+" I found an unknown field named ["+fieldName+"]");
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

///////////////////////////////////////////////////////////////////////////
// Save draft
///////////////////////////////////////////////////////////////////////////
	
function saveButtonFunction() {

	if (DraftName === "") {
		showModalAlert("I need a name for the file", "Please provide a name for the draft, then try saving again");
		return;
	}
	var suffixes = /.wif$/;
	if (!suffixes.test(DraftName)) {
		DraftName = DraftName+".wif";
		$("input[name='draftNameInput']").val(DraftName);
	}

	var wifFileContents = currentDraftAsWIF();
	saveDropboxFile(DraftName, wifFileContents, wroteDropboxFile);

}

function wroteDropboxFile(fileName) {
	//alert("wrote "+fileName+" to dropbox");
	buildLoadDraftDropdown(); // rebuild the drop-down to include this new entry
}

///////////////////////////////////////////////////////////////////////////
// Display the modal alert with just the OK button
///////////////////////////////////////////////////////////////////////////

function showModalAlert(title, contents) {
	$('#modalOK').modal('show'); 
	$('#modalOKBoxTitle').html(title);
	$('#modalOKBoxText').html(contents);
}

///////////////////////////////////////////////////////////////////////////
// Dropbox integration
// I use the dropbox.js API from https://github.com/dropbox/dropbox-js
///////////////////////////////////////////////////////////////////////////

var DropboxClient = null;

// Don't do anything but create and authorize the client. This is called
// when the user wants to save, or asks to load from Dropbox.
function authorizeDropBox() {
	// Browser-side applications do not use the API secret.

	//DropboxClient = new Dropbox.Client({ key: "0aa5l83w7a4bcb9" });  // for AndrewsOnlineLoom
	DropboxClient = new Dropbox.Client({ key: "h5moenkhykgznmt" });  // for Luminescent

	DropboxClient.authenticate(function(error, DropboxClient) {
		if (error) {
			// Replace with a call to your own error-handling code.
			//
			// Don't forget to return from the callback, so you don't execute the code
			// that assumes everything went well.
			return showDropboxError(error);
		}

		// Replace with a call to your own application code.
		//
		// The user authorized your app, and everything went well.
		// DropboxClient is a Dropbox.Client instance that you can use to make API calls.
		// doSomethingCool(DropboxClient);
	});
	DropboxClient.onError.addListener(function(error) {
		if (window.console) {  
				console.error(error);
				showDropboxError(error);
		}
	});
}

var showDropboxError = function(error) {
	switch (error.status) {
		case Dropbox.ApiError.INVALID_TOKEN:
		// If you're using dropbox.js, the only cause behind this error is that
		// the user token expired.
		// Get the user through the authentication flow again.
		DropboxClient = null;
		showModalAlert("There was a Dropbox problem", "I'm sorry, but you're not currently logged into Dropbox. Please choose this list again and log in again.");
		break;
		
		case Dropbox.ApiError.NOT_FOUND:
		// The file or folder you tried to access is not in the user's Dropbox.
		// Handling this error is specific to your application.
		showModalAlert("There was a Dropbox problem", "I'm sorry, but I couldn't find your file on your Dropbox. Please check that it's really there, or pick a different file.")
		break;
		
		case Dropbox.ApiError.OVER_QUOTA:
		// The user is over their Dropbox quota.
		// Tell them their Dropbox is full. Refreshing the page won't help.
		showModalAlert("There was a Dropbox problem", "I'm sorry, but you're out of space on your Dropbox. You can either buy more, or free up some space by deleting files you no longer need.");
		break;
		
		case Dropbox.ApiError.RATE_LIMITED:
		// Too many API requests. Tell the user to try again later.
		// Long-term, optimize your code to use fewer API calls.
		showModalAlert("There was a Dropbox problem", "I'm sorry, but Dropbox is busy. Please wait a moment and try again.");
		break;
		
		case Dropbox.ApiError.NETWORK_ERROR:
		// An error occurred at the XMLHttpRequest layer.
		// Most likely, the user's network connection is down.
		// API calls will not succeed until the user gets back online.
		showModalAlert("There was a Dropbox problem", "I'm sorry, but I can't reach Dropbox. Either Dropbox or the network is down.");
		break;
		
		case Dropbox.ApiError.INVALID_PARAM:
		case Dropbox.ApiError.OAUTH_ERROR:
		case Dropbox.ApiError.INVALID_METHOD:
		default:
		// Caused by a bug in dropbox.js, in your application, or in Dropbox.
		// Tell the user an error occurred, ask them to refresh the page.
		DropboxClient = null;
		showModalAlert("There was a Dropbox problem", "I'm sorry, but there was a Dropbox-related error I can't handle. Please refresh the page and try again. If you're saving a draft, you might want to take a screenshot before you refresh, so you can type your draft back in again after refreshing.");
	}
};

// These are modified from the example code. First, we check for authorization,
// and log in if necessary. Second, we use a callback to the main client so that
// the asynchrononous directory and file reads (and maybe write?) don't return
// before the job's done.

function getDropboxDirectory(callback) {
	if (DropboxClient === null) authorizeDropBox();
	DropboxClient.readdir("/", function(error, entries) {
		if (error) {
			//alert("something went wrong");
			return showDropboxError(error);  // Something went wrong.
		}
		//alert("got listing "+entries.join(", "));
		callback(entries);
	});
}

function getDropboxFileContents(filename, callback) {
	if (DropboxClient === null) authorizeDropBox();
	DropboxClient.readFile(filename, function(error, data) {
		if (error) {
			return showDropboxError(error);  // Something went wrong.
		}
		//alert(data);  // data has the file's contents
		callback(filename, data);
	});
}

function saveDropboxFile(filename, filetext, callback) {
	if (DropboxClient === null) authorizeDropBox();
	DropboxClient.writeFile(filename, filetext, function(error, stat) {
		if (error) {
			return showDropboxError(error);  // Something went wrong.
		}
		//alert("File saved as revision " + stat.versionTag);
		callback(filename);
	});
}

///////// originals from the dropbox doc

function doSomethingCool(DropboxClient) {
	alert("doing something cool for the DropboxClient");
}

// these are examples from the docs
function listDirectory() {
if (DropboxClient === null) authorizeDropBox();
	DropboxClient.readdir("/", function(error, entries) {
		if (error) {
			return showDropboxError(error);  // Something went wrong.
		}
		alert("Your Dropbox contains " + entries.join(", "));
	});
}

function userInfo() {
	if (DropboxClient === null) authorizeDropBox();
	DropboxClient.getAccountInfo(function(error, accountInfo) {
		if (error) {
			return showDropboxError(error);  // Something went wrong.
		}
		alert("Hello, " + accountInfo.name + "!");
	});
}

function readDBfile(filename) {
	if (DropboxClient === null) authorizeDropBox();
	DropboxClient.readFile(filename, function(error, data) {
		if (error) {
			return showDropboxError(error);  // Something went wrong.
		}
		alert(data);  // data has the file's contents
	});
}

function saveDBfile(filename, filetext) {
	if (DropboxClient === null) authorizeDropBox();
	DropboxClient.writeFile(filename, filetext, function(error, stat) {
		if (error) {
			return showDropboxError(error);  // Something went wrong.
		}
		alert("File saved as revision " + stat.versionTag);
	});
}
