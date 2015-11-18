/*
// lots of great drafts at http://www.weavezine.com/content/flowing-curves-network-drafted-twill.html
*/

AWLPrivateFieldString =  "[PRIVATE Luminescence InputFields]";

var WIF_ID_WarpPatternAWL = "WarpPatternAWL";
var WIF_ID_WeftPatternAWL = "WeftPatternAWL";
var WIF_ID_WarpColorsAWL  = "WarpColorsAWL";
var WIF_ID_WeftColorsAWL  = "WeftColorsAWL";
var WIF_ID_TieUpAWL       = "TieUpAWL";
var WIF_ID_FabricSizeAWL  = "FabricSizeAWL";
var WIF_ID_TieUpWidthAWL  = "TieUpWidthAWL";
var WIF_ID_TieUpHeightAWL = "TieUpHeightAWL";

var WIF_ID_Delimiter = " ==== ";

///////////////////////////////////////////////////
// Reading WIF 
///////////////////////////////////////////////////

// wifData is a giant string with the WIF file contents
function convertWIFtoJSON(draftName, wifData) {
	// For a non-AWL file, we only care about the sections 
	//   WEFT/WARP COLORS, WEFT/WARP, TREADLING, THREADING, TIEUP, COLOR TABLE, WEAVING 
	// But we search first for AWL entries in a private field
	if (null !== wifData.match(/^\[WIF\]$/i)) {
		showModalAlert("There was a file problem", "This doesn't appear to be a WIF file. It's missing the [WIF] header.");
		return null;
	}

	var pvre = new RegExp(AWLPrivateFieldString);
	var awlFound = wifData.match(pvre);
	if (null !== awlFound) {
		var jsonData = getJSONfromWIFwithAWL(wifData);
		if (jsonData !== null) return jsonData;
	}
	return convertGeneralWIFtoJSON(draftName, wifData);
}

///////////////////////////////////////////////////
// Reading WIF (general, without AWL information)
///////////////////////////////////////////////////

function convertGeneralWIFtoJSON(draftName, wifData) {
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
	
	var gotContents = false;
	for (var i=0; i<sections.length; i++) {
		var thisSection = sections[i];
		if (null !== thisSection.match(/CONTENTS/i)) {
			gotContents = true;
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
			}
		}
	}
	if (!gotContents) {
		showModalAlert("There was a file problem", "This file seems to be in WIF format, but it's missing the mandatory [CONTENTS] section, so I can't read it.");
		return null;
	}

	var warpPatternString = "";    // from the THREADING section
	var weftPatternString = "";    // from the TREADLING section
	var warpColorString = "";     // from WARP COLORS
	var weftColorString = "";     // from WEFT COLORS
	var tieUpString = "";          // from TIEUP
	var tieUpWidthString = "";     // from the WEAVING section
	var tieUpHeightString = "";    // from the WEAVING section
	var fabricSizeString = "100";  // default - nothing in WIF overrides this

	// assign defaults for missing sections
	if (!gotWarp) warpPatternString = "0 1 / 7 <d";
	if (!gotWeft) weftPatternString = "0 1 / 7 <d";
	if (!gotWarpColors) warpColorString = "black white";
	if (!gotWeftColors) weftColorString = "white black";
	if (!gotTieup) tieUpString = "1 0 0 0";
	if (!gotWeaving) tieUpWidthString = "8";
	if (!gotWeaving) tieUpHeightString = "8";

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

	if (gotWeaving) {
		// From WEAVING, get the TieUp width and height
		thisSection  = getSection(sections, /WEAVING\]/i);
		lines = thisSection.split(/[\n\r]/);
		treadles =  getValueInLines(lines, /Treadles/i);
		shafts =  getValueInLines(lines, /Shafts/i);
		tieUpWidthString = treadles;
		tieUpHeightString = shafts;
	}	

	if (gotWarp) {
		// From WARP, get the Warp pattern length and default color index
		thisSection  = getSection(sections, /WARP\]/i);
		lines = thisSection.split(/[\n\r]/);
		warpPatternLen = getValueInLines(lines, /Threads/i);
		var cindex = getValueInLines(lines, /color/i);
		if (cindex !== null) warpDefaultColorIndex= parseInt(cindex[0])-1;
	}

	if (gotWeft) {
		// From WEFT, get the Weft pattern length and default color index
		thisSection  = getSection(sections, /WEFT\]/i);
		lines = thisSection.split(/[\n\r]/);
		weftPatternLen = getValueInLines(lines, /Threads/i);
		var cindex = getValueInLines(lines, /color/i);
		if (cindex !== null) weftDefaultColorIndex= parseInt(cindex[0])-1;
	}
 	
	if (gotThreading) {
		// From THREADING, get the WarpPattern string
		thisSection  = getSection(sections, /THREADING\]/i);
		lines = thisSection.split(/[\n\r]/);
		var warpPattern = [];
		for (var i=0; i<warpPatternLen; i++) warpPattern[i] = -1;
		for (var i=0; i<lines.length; i++) {
			if (lines[i].match(/=/) !== null) {
				var w = lines[i].split('=');
				var val = w[1];
				if (w[1].match(/,/) !== null) {
					var splitw1 = w[1].split(',');
					val = splitw1[0];
				}
				warpPattern[parseInt(w[0])-1] = parseInt(val); 
			}
		}
		for (var i=0; i<warpPatternLen; i++) {
			warpPatternString += warpPattern[i].toString()+" ";
		}
	}

	if (gotTreadling) {
		// From TREADLING, get the WefPattern string
		thisSection  = getSection(sections, /TREADLING\]/i);
		lines = thisSection.split(/[\n\r]/);
		var weftPattern = [];
		for (var i=0; i<weftPatternLen; i++) weftPattern[i] = -1;
		for (var i=0; i<lines.length; i++) {
			if (lines[i].match(/=/) !== null) {
				var w = lines[i].split('=');
				var val = w[1];
				if (w[1].match(/,/) !== null) {
					var splitw1 = w[1].split(',');
					val = splitw1[0];
				}
				weftPattern[parseInt(w[0])-1] = parseInt(val);
			}
		}
		for (var i=0; i<weftPatternLen; i++) {
			weftPatternString += weftPattern[i].toString()+" ";
		}
	}

	if (gotColorPalette) {
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
	}

	if (gotColorTable) {
		// From COLOR TABLE get the list of RGB values scaled [0,255]
		thisSection  = getSection(sections, /COLOR TABLE\]/i);
		lines = thisSection.split(/[\n\r]/);
		for (var i=0; i<numColors; i++) colorList[i] = [0, 0, 0];
		for (var i=0; i<lines.length; i++) {
			if (lines[i].match(/=/) !== null) {
				var w = lines[i].split('=');
				var cindex = parseInt(w[0]);
				var rgbArray = w[1].split(',');
				var rval = Math.floor(255 * (parseInt(rgbArray[0])-rgbMin)/rgbMax);
				var gval = Math.floor(255 * (parseInt(rgbArray[1])-rgbMin)/rgbMax);
				var bval = Math.floor(255 * (parseInt(rgbArray[2])-rgbMin)/rgbMax);
				colorList[cindex-1] = [rval, gval, bval];
			}
		}
	}

	if (gotWarpColors && gotColorTable) {
		// From WARP COLORS get WarpColors String
		thisSection  = getSection(sections, /WARP COLORS\]/i);
		warpColorString = getColorString(thisSection, warpColorIndices, warpDefaultColorIndex, colorList);
	}
	
	if (gotWeftColors && gotColorTable) {
		// From WEFT COLORS get WeftColors String
		thisSection  = getSection(sections, /WEFT COLORS\]/i);
		weftColorString = getColorString(thisSection, weftColorIndices, weftDefaultColorIndex, colorList);
	}
	
	if (gotTieup) {
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
			if (lines[i].match(/=/) !== null) {
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
	}

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

function lineHastrueRE(line, re) {
	return ((null !== line.match(re)) && (null !== line.match(/true/i)));
}

function getSection(sections, re) {
	for (var i=0; i<sections.length; i++) {
		var thisSection = sections[i];
		if (null !== thisSection.match(/CONTENTS/i)) continue;
		if (null !== thisSection.match(re)) return thisSection;
	}
	return null;
}

function getValueInLines(lines, re) {
	for (var i=0; i<lines.length; i++) {
		if (null !== lines[i].match(re)) {
			var sp = lines[i].split('=');
			return sp[1];
		}
	}
	return null;
}

function getColorString(thisSection, indices, defaultColorIndex, colorList) {
	lines = thisSection.split(/[\n\r]/);
	var maxIndex = 0;
	for (var i=0; i<lines.length; i++) {
		if (lines[i].match(/=/) !== null) {
			var w = lines[i].split('=');
			var index = parseInt(w[0])-1;
			if (index > maxIndex) maxIndex = index;
			indices[index] = parseInt(w[1])-1;
		}
	}
	// fill in what's missing
	for (var i=0; i<maxIndex; i++) {
		if (!(i in indices)) {
			indices[i] = defaultColorIndex;
		}
	}
	// now make value/run pairs
	var clrs = [];
	var lens = [];
	var lastColorIndex = indices[0];
	var thisLen = 1;
	var index = 0;
	while (index++ < maxIndex) {
		var thisColorIndex = indices[index];
		if (thisColorIndex === ' ') continue;
		if (thisColorIndex !== lastColorIndex) {
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
	var colorString = "";
	for (var i=0; i<clrs.length; i++) {
		var clrIndex = clrs[i];
		var clr = colorList[clrIndex];	
		var rgbString = clr[0]+","+clr[1]+","+clr[2];
		if (rgbString in KeyRGBValueName) {
			var name = KeyRGBValueName[rgbString];
			colorString += name+" "+lens[i]+" ";
		} else {
			colorString += "rgb("+clr[0]+","+clr[1]+","+clr[2]+") "+lens[i]+" ";
		}
	}
	colorString += "iblock";
	return colorString;
}


///////////////////////////////////////////////////
// Reading WIF (from stored AWL data)
///////////////////////////////////////////////////

function getJSONfromWIFwithAWL(wifData) {
	var pvre = new RegExp(AWLPrivateFieldString.substr(1)); // remove opening [ since we split on that
	var sections = wifData.split('[');
	for (var i=0; i<sections.length; i++) {
		var thisSection = sections[i];
		if (null !== thisSection.match(pvre)) {
			gotContents = true;
			var lines = thisSection.split(/[\n\r]/);
			var warpPatternString = getPrivateFieldFromWIF(WIF_ID_WarpPatternAWL, lines);
			var weftPatternString = getPrivateFieldFromWIF(WIF_ID_WeftPatternAWL, lines);
			var warpColorString = getPrivateFieldFromWIF(WIF_ID_WarpColorsAWL, lines);
			var weftColorString = getPrivateFieldFromWIF(WIF_ID_WeftColorsAWL, lines);
			var tieUpString = getPrivateFieldFromWIF(WIF_ID_TieUpAWL, lines);
			var fabricSizeString = getPrivateFieldFromWIF(WIF_ID_FabricSizeAWL, lines);
			var tieUpWidthString = getPrivateFieldFromWIF(WIF_ID_TieUpWidthAWL, lines);
			var tieUpHeightString = getPrivateFieldFromWIF(WIF_ID_TieUpHeightAWL, lines);

			if ((warpPatternString === null) || (weftPatternString === null) ||
			    (warpColorString === null) || (weftColorString === null) ||
             (tieUpString === null) || (fabricSizeString === null) ||
             (tieUpWidthString === null) || (tieUpHeightString === null)) {
				return null;
			}

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
	}
	return null;
}

function getPrivateFieldFromWIF(awlString, lines) {
	var pvre = new RegExp(awlString);
	for (var k=0; k<lines.length; k++) {
		var line = lines[k];
	 	if (line.match(pvre)) {
			var words = line.split(WIF_ID_Delimiter);
			return words[1];
		}
	}
	return null;
}
			
///////////////////////////////////////////////////
// Write WIF
///////////////////////////////////////////////////

function currentDraftAsWIF() {
	var wifString = "";	
	wifString += "[WIF]\n";
	wifString += "Version=1.1\n";
	wifString += "Date=April 20, 1997\n";
	wifString += "Developers=andrew@imaginary-institute.com\n";
	wifString += "Source Program=Luminescence\n";
	wifString += "Source Version=1.0\n";
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
	wifString += "WARP COLORS=true\n";
	wifString += "WEFT COLORS=true\n";
	wifString += "\n";

	// get the draft inputs
	var warpPatternString = $('#warpPatternAWL').val();
	var weftPatternString = $('#weftPatternAWL').val();
	var warpColorString = $('#warpColorAWL').val();
	var weftColorString = $('#weftColorAWL').val();
	var tieUpString = $('#tieUpAWL').val();
	var fabricSizeString = $('#fabricSizeInput').val();
	var tieUpWidthString = $('#tieUpWidthInput').val();
	var tieUpHeightString = $('#tieUpHeightInput').val();

	// First, write the private AWL section
	wifString += "\n" + AWLPrivateFieldString +"\n";
	wifString += WIF_ID_WarpPatternAWL   + WIF_ID_Delimiter + warpPatternString + "\n";
	wifString += WIF_ID_WeftPatternAWL   + WIF_ID_Delimiter + weftPatternString + "\n";
	wifString += WIF_ID_WarpColorsAWL    + WIF_ID_Delimiter + warpColorString + "\n";
	wifString += WIF_ID_WeftColorsAWL    + WIF_ID_Delimiter + weftColorString + "\n";
	wifString += WIF_ID_TieUpAWL         + WIF_ID_Delimiter + tieUpString + "\n";
	wifString += WIF_ID_FabricSizeAWL    + WIF_ID_Delimiter + fabricSizeString + "\n";
	wifString += WIF_ID_TieUpWidthAWL    + WIF_ID_Delimiter + tieUpWidthString + "\n";
	wifString += WIF_ID_TieUpHeightAWL   + WIF_ID_Delimiter + tieUpHeightString + "\n";
	wifString += "\n";

	// now write the more generic version
	// start with the draft values from the output sections

	var warpPatternLength = (WarpPatternOutput.split(' ')).length;
	var weftPatternLength = (WeftPatternOutput.split(' ')).length;

	wifString += "[TEXT]\n";
	wifString += "Title="+DraftName+"\n";
	wifString += "Written by Luminescencev.10 at https://TK\n";
	wifString += "; Creation "+Date()+"\n";
	wifString += "\n";

	wifString += "[WEAVING]\n";
	wifString += "Rising Shed=true\n";  // I'm not sure what this is for
	wifString += "Treadles="+TieUpWidth.toString()+"\n";
	wifString += "Shafts="+TieUpHeight.toString()+"\n";
	wifString += "\n";

	wifString += "[WARP]\n";
	wifString += "Color=0\n";  // why not, give this default color 0
	wifString += "Threads="+warpPatternLength+"\n";
	wifString += "\n";

	wifString += "[WEFT]\n";
	wifString += "Color=1\n";  // why not, give this default color 1
	wifString += "Threads="+weftPatternLength+"\n";
	wifString += "\n";

	wifString += "[TIEUP]\n";
	var tieString = TieUpOutput.split(' ');
	for (var col=0; col<TieUpWidth; col++) {
		var firstInRow = true;
		rowString = "";
		for (var row=0; row<TieUpHeight; row++) {
			if (tieString[(col*TieUpHeight)+row] !== '0') {
				if (!firstInRow) rowString += ",";
				firstInRow = false;
				rowString += (row+1);
			}
		}
		if (rowString !== "") {
			wifString += (col+1)+"="+rowString+"\n";
		}
	}
	wifString += "\n";

	wifString += "[THREADING]\n";
	var warpWords = WarpPatternOutput.split(' ');
	for (var i=0; i<warpWords.length; i++) {
		wifString += i+"="+(parseInt(warpWords[i]))+"\n";
	}
	wifString += "\n";

	wifString += "[TREADLING]\n";
	var weftWords = WeftPatternOutput.split(' ');
	for (var i=0; i<weftWords.length; i++) {
		wifString += i+"="+(parseInt(weftWords[i]))+"\n";
	}
	wifString += "\n";

	//
	// The colors take some work, because we have to identify 
	// all the unique colors in such a way that we can match
	// them up to numbers starting at 0. So I use an associative
	// array with the color name as the key, and the number
	// for the value.
	//
	// First we'll build up the color palette. Run through the
	// two color outputs and make a key/value list from all the
	// rgb values that are used. Then use that list to write
	// out the color palette, then the table, then the colors
	//
	var keyRGBValueIndex = {};
	var pairLength = 0;
	var allColors = WarpColorOutput+" "+WeftColorOutput;
	var allColorsWords = allColors.split(' ');
	for (var i=0; i<allColorsWords.length; i++) {
		var rgbString = getColorAsRGBString(allColorsWords[i]); // comes back rgb(r,g,b)
		if (!(rgbString in keyRGBValueIndex)) {
			keyRGBValueIndex[rgbString] = pairLength++;
		}
	}

	wifString += "[COLOR PALETTE]\n";
	wifString += "Range=0,255\n";
	wifString += "Entries="+(pairLength.toString())+"\n";
	wifString += "\n";

	wifString += "[COLOR TABLE]\n";
	for (var i=0; i<pairLength; i++) {
		for (var k in keyRGBValueIndex) {
			if (keyRGBValueIndex[k] === i) {
				var thisKey = k;
				var rgbRE = /rgb.(\d+), *(\d+), *(\d+).*/
				var match = rgbRE.exec(thisKey);
				var rval = match[1];
				var gval = match[2];
				var bval = match[3];
				wifString += ((i+1).toString())+"="+rval+","+gval+","+bval+"\n";
			}
		}
	}
	wifString += "\n";

	wifString += "[WARP COLORS]\n";
	var warpWords = WarpColorOutput.split(' ');
	for (var i=0; i<warpWords.length; i++) {
		var rgbString = getColorAsRGBString(warpWords[i]); // comes back rgb(r,g,b)
		var rgbVal = keyRGBValueIndex[rgbString];
	 	wifString += ((i+1).toString())+"="+((parseInt(rgbVal)+1).toString())+"\n";
	 	var aaa =  ((i+1).toString())+"="+((parseInt(rgbVal)+1).toString())+"\n";
		var b = 3;
	}
	wifString += "\n";

	wifString += "[WARP COLORS]\n";
	var weftWords = WeftColorOutput.split(' ');
	for (var i=0; i<weftWords.length; i++) {
		var rgbString = getColorAsRGBString(weftWords[i]); // comes back rgb(r,g,b)
		var rgbVal = keyRGBValueIndex[rgbString];
	 	wifString += ((i+1).toString())+"="+((parseInt(rgbVal)+1).toString())+"\n";
	 	var aaa =  ((i+1).toString())+"="+((parseInt(rgbVal)+1).toString())+"\n";
		var b = 3;
	}
	wifString += "\n";

	return wifString;
}

