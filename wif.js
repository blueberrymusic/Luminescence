/*
// lots of great examples at http://www.weavezine.com/content/flowing-curves-network-drafted-twill.html
*/

function currentDraftAsWIF() {
	var wifString = "";	
	wifString += "[WIF]\n";
	wifString += "Version=1.1\n";
	wifString += "Date=April 20, 1997\n";
	wifString += "Developers=aquamusic@gmail.com\n";
	wifString += "Source Program=AndrewsOnlineLoom\n";
	wifString += "Source Version=1\n";
	wifString += "\n";
	wifString += "[CONTENTS]\n";

	// edit this to include only what's really in here
	wifString += "COLOR PALETTE=true\n";
	wifString += "TEXT=true\n";
	wifString += "WEAVING=true\n";
	wifString += "WARP=true\n";
	wifString += "WEFT=true\n";
	wifString += "COLOR TABLE=true\n";
	wifString += "THREADING=true\n";
	wifString += "TIEUP=true\n";
	wifString += "TREADLING=true\n";
	wifString += "\n";

	wifString += "[TEXT]\n";
	wifString += "Title="+DraftName+"\n";
	wifString += "; Creation "+Date()+"\n";

	// get the draft as it is now
	var warpPatternString = $('#warpPatternAWL').val();
	var weftPatternString = $('#weftPatternAWL').val();
	var warpColorString = $('#warpColorAWL').val();
	var weftColorString = $('#weftColorAWL').val();
	var tieUpString = $('#tieUpAWL').val();
	var fabricSizeString = $('#fabricSizeInput').val();
	var tieUpWidthString = $('#tieUpWidthInput').val();
	var tieUpHeightString = $('#tieUpHeightInput').val();

	return wifString;
}

function convertWIFtoJSON(draftName, wifData) {
	var warpPatternString = "0 1 2";
	var weftPatternString = "3 4 5";
	var warpColorString = "red yellow";
	var weftColorString = "rgb(100,150,200) green";
	var tieUpString = "1 1 1 0 0 0";
	var fabricSizeString = "120";
	var tieUpWidthString = "8";
	var tieUpHeightString = "8";
	
	var draft = [];
	draft.push({ "field": "WarpAWL",      "value": warpPatternString });
	draft.push({ "field": "WeftAWL",      "value": weftPatternString });
	draft.push({ "field": "WarpColorAWL", "value": warpColorString });
	draft.push({ "field": "WeftColorAWL", "value": weftColorString });
	draft.push({ "field": "TieUpAWL",     "value": tieUpString });
	draft.push({ "field": "FabricSize",   "value": fabricSizeString });
	draft.push({ "field": "TieUpWidth",   "value": tieUpWidthString });
	draft.push({ "field": "TieUpHeight",  "value": tieUpHeightString });
	var JSONdraft = JSON.stringify(draft);
	return JSONdraft;
}
