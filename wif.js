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

// wifData is a giant string with the WIF file contents
function convertWIFtoJSON(draftName, wifData) {
	// For a non-AWL file, we only care about the sections 
	//   WEFT/WARP COLORS, WEFT/WARP, TREADLING, THREADING, TIEUP, COLOR TABLE, WEAVING 
	// But we search first for AWL entries in a private field
	awlField = /\[PRIVATE AWLOnline Input\]/i;
	var awlFound = wifData.match(awlField);
	if (null != awlFound) {
		var jsonData = getJSONfromWIFwithAWL(wifData);
		return jsonData;
	}
	var sections = wifData.split('[');

	// Scan the CONTENTS and find which sections are present. They need to be
	// named and have the value true. Which seemes redundant - after all, it's
	// easy enough to find out if the section is there by looking in the file.
	// But maybe some programs include the section but want it ignored, so I'll
	// do what the spec says, though I think it's a bit of a waste of time.

	var gotWarp = false;
	var gotWarpColors = false;
	var gotWeft = false;
	var gotWeftColors = false;
	var gotTreadling = false;
	var gotThreading = false;
	var gotTieup = false;
	var gotColorTable = false;
	var gotColorPalette = false;
	var gotWeaving = false;
	var gotFlork = false;
	for (var i=0; i<sections.length; i++) {
		var thisSection = sections[i];
		if (null != thisSection.match(/CONTENTS/i)) {
			var lines = thisSection.split(/[\n\r]/);
			for (var k=0; k<lines.length; k++) {
				if (lineHastrueRE(lines[k], /WARP/i)) gotWarp = true;
				if (lineHastrueRE(lines[k], /WEFT/i)) gotWeft = true;
				if (lineHastrueRE(lines[k], /WARP COLORS/i)) gotWarpColors = true;
				if (lineHastrueRE(lines[k], /WEFT COLORS/i)) gotWeftColors = true;
				if (lineHastrueRE(lines[k], /TREADLING/i)) gotTreadling = true;
				if (lineHastrueRE(lines[k], /THREADING/i)) gotThreading = true;
				if (lineHastrueRE(lines[k], /TIEUP/i)) gotTieup = true;
				if (lineHastrueRE(lines[k], /COLOR TABLE/i)) gotColorTable = true;
				if (lineHastrueRE(lines[k], /COLOR PALETTE/i)) gotColorPalette = true;
				if (lineHastrueRE(lines[k], /WEAVING/i)) gotWeaving = true;
				if (lineHastrueRE(lines[k], /FLORK/i)) gotFlork = true;
			}
		}
	}

	var warpPatternString = "";   // this comes from the THREADING section
	var weftPatternString = "";   // this comes from the TREADLING section
	var warpColorsString = "";
	var weftColorsString = "";
	var tieUpString = "";
	var tieUpWidthString = "8";    // this comes from the WEAVING section
	var tieUpHeightString = "8";   // this comes from the WEAVING section
	var RGBList = [];              // this comes from the COLOR TABLE and COLOR PALETTE sections
	var fabricSizeString = "100";  // default - nothing in WIF overrides this

	var treadles = 8;
	var shafts = 8;
	var warpPatternLen = 8;
	var weftPatternLen = 8;
	var rgbMin = 0;
	var rgbMax = 255;
	var numColors = 10;
	var colorList = [];  // we'll use this to make the color strings
	var warpDefaultColorIndex = 0;
	var weftDefaultColorIndex = 0;
	var warpColorIndices = []; // we don't know in advance how long this will be
	var weftColorIndices = []; // we don't know in advance how long this will be
	var lines, thisSection;

	// Order of approach: 
	// From WEAVING, get the TieUp width and height
	// From WARP and WEFT get the pattern lengths and default color index
	// From THREADING, get the WarpPattern string
	// From TREADLING, get the WefPattern string
	// From COLOR PALETTE get rgb min and max
	// From COLOR TABLE get the list of RGB values scaled [0,255]
	// From WARP COLORS get WarpColors String
	// From WEFT COLORS get WeftColors String
	// From TIEUP, get TieUpString

	// From WEAVING, get the TieUp width and height
	thisSection  = getSection(sections, /WEAVING\]/i);
	lines = thisSection.split(/[\n\r]/);
	treadles =  getValueInLines(lines, /Treadles/i);
	shafts =  getValueInLines(lines, /Shafts/i);
	tieUpWidthString = treadles;
	tieUpHeightString = shafts;

	// From WARP, get the Warp pattern length and default color index
	thisSection  = getSection(sections, /WARP\]/i);
	lines = thisSection.split(/[\n\r]/);
	warpPatternLen = getValueInLines(lines, /Threads/i);
	var cindex = getValueInLines(lines, /color/i);
	if (cindex != null) warpDefaultColorIndex= parseInt(cindex[0])-1;
	

	// From WEFT, get the Weft pattern length and default color index
	thisSection  = getSection(sections, /WEFT\]/i);
	lines = thisSection.split(/[\n\r]/);
	weftPatternLen = getValueInLines(lines, /Threads/i);
	var cindex = getValueInLines(lines, /color/i);
	if (cindex != null) weftDefaultColorIndex= parseInt(cindex[0])-1;
 	
	// From THREADING, get the WarpPattern string
	thisSection  = getSection(sections, /THREADING\]/i);
	lines = thisSection.split(/[\n\r]/);
	var warpPattern = [];
	for (var i=0; i<warpPatternLen; i++) warpPattern[i] = -1;
	for (var i=0; i<lines.length; i++) {
		if (lines[i].match(/=/) != null) {
			var w = lines[i].split('=');
			var val = w[1];
			if (w[1].match(/,/) != null) {
				var splitw1 = w[1].split(',');
				val = splitw1[0];
			}
			warpPattern[parseInt(w[0])-1] = parseInt(val)-1; // we count starting at 0
		}
	}
	for (var i=0; i<warpPatternLen; i++) {
		warpPatternString += warpPattern[i].toString()+" ";
	}

	// From TREADLING, get the WefPattern string
	thisSection  = getSection(sections, /TREADLING\]/i);
	lines = thisSection.split(/[\n\r]/);
	var weftPattern = [];
	for (var i=0; i<weftPatternLen; i++) weftPattern[i] = -1;
	for (var i=0; i<lines.length; i++) {
		if (lines[i].match(/=/) != null) {
			var w = lines[i].split('=');
			var val = w[1];
			if (w[1].match(/,/) != null) {
				var splitw1 = w[1].split(',');
				val = splitw1[0];
			}
			weftPattern[parseInt(w[0])-1] = parseInt(val)-1; // we count starting at 0
		}
	}
	for (var i=0; i<weftPatternLen; i++) {
		weftPatternString += weftPattern[i].toString()+" ";
	}

	// From COLOR PALETTE get rgb min and max
	thisSection  = getSection(sections, /COLOR PALETTE\]/i);
	lines = thisSection.split(/[\n\r]/);
	var rangeLine = getValueInLines(lines, /range/i);
	var ranges = rangeLine.split(',');
	rgbMin = parseInt(ranges[0]);
	rgbMax = parseInt(ranges[1]);
	if (rgbMax === 0) rgbMax = 1;
	var entriesLine = getValueInLines(lines, /entries/i);
	numColors = parseInt(entriesLine);

	// From COLOR TABLE get the list of RGB values scaled [0,255]
	thisSection  = getSection(sections, /COLOR TABLE\]/i);
	lines = thisSection.split(/[\n\r]/);
	for (var i=0; i<numColors; i++) colorList[i] = [0, 0, 0];
	for (var i=0; i<lines.length; i++) {
		if (lines[i].match(/=/) != null) {
			var w = lines[i].split('=');
			var cindex = parseInt(w[0]);
			var rgbArray = w[1].split(',');
			var rval = Math.floor(255 * (parseInt(rgbArray[0])-rgbMin)/rgbMax);
			var gval = Math.floor(255 * (parseInt(rgbArray[1])-rgbMin)/rgbMax);
			var bval = Math.floor(255 * (parseInt(rgbArray[2])-rgbMin)/rgbMax);
			colorList[cindex-1] = [rval, gval, bval];
		}
	}

	// From WARP COLORS get WarpColors String
	thisSection  = getSection(sections, /WARP COLORS\]/i);
	lines = thisSection.split(/[\n\r]/);
	var maxIndex = 0;
	for (var i=0; i<lines.length; i++) {
		if (lines[i].match(/=/) != null) {
			var w = lines[i].split('=');
			var index = parseInt(w[0])-1;
			if (index > maxIndex) maxIndex = index;
			warpColorIndices[index] = parseInt(w[1])-1;
		}
	}
	// fill in what's missing
	for (var i=0; i<maxIndex; i++) {
		if (!(i in warpColorIndices)) {
			warpColorIndices[i] = warpDefaultColorIndex;
		}
	}
	// now make value/run pairs
	var clrs = [];
	var lens = [];
	var lastColorIndex = warpColorIndices[0];
	var thisLen = 1;
	var index = 0;
	while (index++ < maxIndex) {
		var thisColorIndex = warpColorIndices[index];
		if (thisColorIndex != lastColorIndex) {
			clrs.push(lastColorIndex);
			lens.push(thisLen);
			thisLen = 1;
			lastColorIndex = thisColorIndex;
		} else {
			thisLen++;
		}
	}
 	clrs.push(lastColorIndex);
	lens.push(thisLen);
	// make the string
	for (var i=0; i<clrs.length; i++) {
		var clrIndex = clrs[i];
		var clr = colorList[clrIndex];	
		warpColorsString += "rgb("+clr[0]+","+clr[1]+","+clr[2]+") "+lens[i]+" ";
	}
	warpColorsString += "iblock";
	
	// From WEFT COLORS get WeftColors String
	thisSection  = getSection(sections, /WEFT COLORS\]/i);
	lines = thisSection.split(/[\n\r]/);
	var maxIndex = 0;
	for (var i=0; i<lines.length; i++) {
		if (lines[i].match(/=/) != null) {
			var w = lines[i].split('=');
			var index = parseInt(w[0])-1;
			if (index > maxIndex) maxIndex = index;
			weftColorIndices[index] = parseInt(w[1])-1;
		}
	}
	// fill in what's missing
	for (var i=0; i<maxIndex; i++) {
		if (!(i in weftColorIndices)) {
			weftColorIndices[i] = weftDefaultColorIndex;
		}
	}
	// now make value/run pairs
	var clrs = [];
	var lens = [];
	var lastColorIndex = weftColorIndices[0];
	var thisLen = 1;
	var index = 0;
	while (index++ < maxIndex) {
		var thisColorIndex = weftColorIndices[index];
		if (thisColorIndex != lastColorIndex) {
			clrs.push(lastColorIndex);
			lens.push(thisLen);
			thisLen = 1;
			lastColorIndex = thisColorIndex;
		} else {
			thisLen++;
		}
	}
 	clrs.push(lastColorIndex);
	lens.push(thisLen);
	// make the string
	for (var i=0; i<clrs.length; i++) {
		var clrIndex = clrs[i];
		var clr = colorList[clrIndex];	
		weftColorsString += "rgb("+clr[0]+","+clr[1]+","+clr[2]+") "+lens[i]+" ";
	}
	weftColorsString += "iblock";
	
	// From TIEUP, get TieUpString
	var tu = [];
	var tuWid = parseInt(tieUpWidthString);
	var tuHgt = parseInt(tieUpHeightString);
	for (var col=0; col<tuWid; col++) {
		for (var row=0; row<tuHgt; row++) {
			tu[(col*tuHgt)+row] = 0;
		}
	}
	thisSection  = getSection(sections, /TIEUP\]/i);
	lines = thisSection.split(/[\n\r]/);
	for (var i=0; i<lines.length; i++) {
		if (lines[i].match(/=/) != null) {
			var w = lines[i].split('=');
			var col = parseInt(w[0])-1;
			var indices = w[1].split(',');
			for (var j=0; j<indices.length; j++) {
				var row = parseInt(indices[j])-1;
				var tuindex = (col*tuHgt)+row;
				tu[tuindex] = 1;
			}
		}
	}
	tieUpString = "";
	for (var i=0; i<tu.length; i++) {
		tieUpString += Math.floor(tu[i]).toString() + " ";
	}

	var draft = [];
	draft.push({ "field": "WarpAWL",      "value": warpPatternString });
	draft.push({ "field": "WeftAWL",      "value": weftPatternString });
	draft.push({ "field": "WarpColorAWL", "value": warpColorsString });
	draft.push({ "field": "WeftColorAWL", "value": weftColorsString });
	draft.push({ "field": "TieUpAWL",     "value": tieUpString });
	draft.push({ "field": "FabricSize",   "value": fabricSizeString });
	draft.push({ "field": "TieUpWidth",   "value": tieUpWidthString });
	draft.push({ "field": "TieUpHeight",  "value": tieUpHeightString });
	var JSONdraft = JSON.stringify(draft);

	var jj = JSONdraft;

	return JSONdraft;
}

function lineHastrueRE(line, re) {
	return ((null != line.match(re)) && (null != line.match(/true/i)));
}

function getSection(sections, re) {
	for (var i=0; i<sections.length; i++) {
		var thisSection = sections[i];
		if (null != thisSection.match(/CONTENTS/i)) continue;
		if (null != thisSection.match(re)) return thisSection;
	}
	return null;
}

function getValueInLines(lines, re) {
	for (var i=0; i<lines.length; i++) {
		if (null != lines[i].match(re)) {
			var sp = lines[i].split('=');
			return sp[1];
		}
	}
	return null;
}

function getJSONfromWIFwithAWL(wifData) {
	return null;
}
