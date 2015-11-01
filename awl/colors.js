"use strict";

function getColorAsRGBString(name) {
	var nameLC = name.toLowerCase();
	for (var i=0; i<AllColorsRGB.length; i++) {
		var entry = AllColorsRGB[i];
		var procLC = entry[3].toLowerCase();
		if (nameLC === procLC) {
			return "rgb("+entry[0]+", "+entry[1]+", "+entry[2]+")";
		}
	}
	// is it hex?
	var hex6 = /#[0-9a-fA-F]{6}/;
	if (hex6.test(name)) {
		var red = parseInt(name.slice(1,3), 16);
		var green = parseInt(name.slice(3,5), 16);
		var blue = parseInt(name.slice(5,7), 16);
		return "rgb("+red+", "+green+", "+blue+")";
	}
	var hex8 = /#[0-9a-fA-F]{8}/;
	if (hex8.test(name)) {
		var red = parseInt(name.slice(3,5), 16);
		var green = parseInt(name.slice(5,7), 16);
		var blue = parseInt(name.slice(7,9), 16);
		return "rgb("+red+", "+green+", "+blue+")";
	}
	// is it rgb(#,#,#)?
	if (name.slice(0,3) === "rgb") {
		var vals = name.slice(4, name.length-1);
		var words = vals.split(",");
		var red = parseInt(words[0]);
		var green = parseInt(words[1]);
		var blue = parseInt(words[2]);
		return "rgb("+red+", "+green+", "+blue+")";
	}
	return "rgb(0, 0, 0)";  // default
}

function getColorRGB(name) {
	var nameLC = name.toLowerCase();
	for (var i=0; i<AllColorsRGB.length; i++) {
		var entry = AllColorsRGB[i];
		var procLC = entry[3].toLowerCase();
		if (nameLC === procLC) {
			return [entry[0], entry[1], entry[2]];
		}
	}
	return [0, 0, 0];
}

function getColorIndex(name) {
	var nameLC = name.toLowerCase();
	for (var i=0; i<AllColorsRGB.length; i++) {
		var entry = AllColorsRGB[i];
		var procLC = entry[3].toLowerCase();
		if (nameLC === procLC) {
			return i;
		}
	}
	return -1;
}

var AllColorsRGB = [
// 140 HTML 5 color names from http://yorktown.cbe.wwu.edu/sandvig/shared/NetColors.aspx
[ 240, 248, 255, "AliceBlue"],
[ 250, 235, 215, "AntiqueWhite"],
[   0, 255, 255, "Aqua"],
[ 127, 255, 212, "Aquamarine"],
[ 240, 255, 255, "Azure"],
[ 245, 245, 220, "Beige"],
[ 255, 228, 196, "Bisque"],
[   0,   0,   0, "Black"],
[ 255, 235, 205, "BlanchedAlmond"],
[   0,   0, 255, "Blue"],
[ 138,  43, 226, "BlueViolet"],
[ 165,  42,  42, "Brown"],
[ 222, 184, 135, "BurlyWood"],
[  95, 158, 160, "CadetBlue"],
[ 127, 255,   0, "Chartreuse"],
[ 210, 105,  30, "Chocolate"],
[ 255, 127,  80, "Coral"],
[ 100, 149, 237, "CornflowerBlue"],
[ 255, 248, 220, "Cornsilk"],
[ 220,  20,  60, "Crimson"],
[   0, 255, 255, "Cyan"],
[   0,   0, 139, "DarkBlue"],
[   0, 139, 139, "DarkCyan"],
[ 184, 134, 187, "DarkGoldenrod"],
[ 169, 169, 169, "DarkGray"],
[   0, 100,   0, "DarkGreen"],
[ 189, 183, 107, "DarkKhaki"],
[ 139,   0, 139, "DarkMagenta"],
[  85, 107,  47, "DarkOliveGreen"],
[ 255, 140,   0, "DarkOrange"],
[ 153,  50, 204, "DarkOrchid"],
[ 139,   0,   0, "DarkRed"],
[ 233, 150, 122, "DarkSalmon"],
[ 143, 188, 139, "DarkSeaGreen"],
[  72,  61, 139, "DarkSlateBlue"],
[  47,  79,  79, "DarkSlateGray"],
[   0, 206, 209, "DarkTurquoise"],
[ 148,   0, 211, "DarkViolet "],
[ 255,  20, 147, "DeepPink"],
[   0, 191, 255, "DeepSkyBlue"],
[ 105, 105, 105, "DimGray"],
[  30, 144, 255, "DodgerBlue"],
[ 178,  34,  34, "Firebrick"],
[ 255, 250, 240, "FloralWhite"],
[  34, 139,  34, "ForestGreen"],
[ 255,   0, 255, "Fuchsia"],
[ 220, 220, 220, "Gainsboro"],
[ 248, 248, 255, "GhostWhite"],
[ 255, 215,   0, "Gold"],
[ 218, 165,  32, "Goldenrod"],
[ 128, 128, 128, "Gray"],
[   0, 128,   0, "Green"],
[ 173, 255,  47, "GreenYellow"],
[ 240, 255, 240, "Honeydew"],
[ 255, 105, 180, "HotPink"],
[ 205,  92,  92, "IndianRed"],
[  75,   0, 130, "Indigo"],
[ 255, 255, 240, "Ivory"],
[ 240, 230, 140, "Khaki"],
[ 230, 230, 250, "Lavender"],
[ 255, 240, 245, "LavenderBlush"],
[ 124, 252,   0, "LawnGreen"],
[ 255, 250, 205, "LemonChiffon"],
[ 173, 216, 230, "LightBlue"],
[ 240, 128, 128, "LightCoral"],
[ 224, 255, 255, "LightCyan"],
[ 250, 250, 210, "LightGoldenrodYellow"],
[ 211, 211, 211, "LightGray"],
[ 144, 238, 144, "LightGreen"],
[ 255, 182, 193, "LightPink"],
[ 255, 160, 122, "LightSalmon"],
[  32, 178, 170, "LightSeaGreen"],
[ 135, 206, 250, "LightSkyBlue"],
[ 119, 136, 153, "LightSlateGray"],
[ 176, 196, 222, "LightSteelBlue"],
[ 255, 255, 224, "LightYellow"],
[   0, 255,   0, "Lime"],
[  50, 205,  50, "LimeGreen"],
[ 250, 240, 230, "Linen"],
[ 255,   0, 255, "Magenta"],
[ 128,   0,   0, "Maroon"],
[ 102, 205, 170, "MediumAquamarine"],
[   0,   0, 205, "MediumBlue"],
[ 186,  85, 211, "MediumOrchid"],
[ 147, 112, 219, "MediumPurple"],
[  60, 179, 113, "MediumSeaGreen"],
[ 123, 104, 238, "MediumSlateBlue"],
[   0, 250, 154, "MediumSpringGreen"],
[  72, 209, 204, "MediumTurquoise"],
[ 199, 21, 133, "MediumVioletRed"],
[ 25, 25, 112, "MidnightBlue"],
[ 245, 255, 250, "MintCream"],
[ 255, 228, 225, "MistyRose"],
[ 255, 228, 181, "Moccasin"],
[ 255, 222, 173, "NavajoWhite"],
[   0,   0, 128, "Navy"],
[ 253, 245, 230, "OldLace"],
[ 128, 128,   0, "Olive"],
[ 107, 142,  35, "OliveDrab"],
[ 255, 165,   0, "Orange"],
[ 255,  69,   0, "OrangeRed"],
[ 218, 112, 214, "Orchid"],
[ 238, 232, 170, "PaleGoldenrod"],
[ 152, 251, 152, "PaleGreen"],
[ 175, 238, 238, "PaleTurquoise"],
[ 219, 112, 147, "PaleVioletRed"],
[ 255, 239, 213, "PapayaWhip"],
[ 255, 218, 185, "PeachPuff"],
[ 205, 133,  63, "Peru"],
[ 255, 192, 203, "Pink"],
[ 221, 160, 221, "Plum"],
[ 176, 224, 230, "PowderBlue"],
[ 128,   0, 128, "Purple"],
[ 255,   0,   0, "Red"],
[ 188, 143, 143, "RosyBrown"],
[  65, 105, 225, "RoyalBlue"],
[ 139,  69, 19, "SaddleBrown"],
[ 250, 128, 114, "Salmon"],
[ 244, 164,  96, "SandyBrown"],
[  46, 139,  87, "SeaGreen"],
[ 255, 245, 238, "SeaShell"],
[ 160,  82,  45, "Sienna"],
[ 192, 192, 192, "Silver"],
[ 135, 206, 235, "SkyBlue"],
[ 106,  90, 205, "SlateBlue"],
[ 112, 128, 144, "SlateGray"],
[ 255, 250, 250, "Snow"],
[   0, 255, 127, "SpringGreen"],
[  70, 130, 180, "SteelBlue"],
[ 210, 180, 140, "Tan"],
[   0, 128, 128, "Teal"],
[ 216, 191, 216, "Thistle"],
[ 255,  99,  71, "Tomato"],
[  64, 224, 208, "Turquoise"],
[ 238, 130, 238, "Violet"],
[ 245, 222, 179, "Wheat"],
[ 255, 255, 255, "White"],
[ 245, 245, 245, "WhiteSmoke"],
[ 255, 255,   0, "Yellow"],
[ 154, 205,  50, "YellowGreen"],
// 38 Tartan colors as used in my March 2003 CG&A column, in RGB format
// A  =  Aqua,            B =  Blue,        DB =  Dark Blue,    LB =  Light Blue,    MB =  Dark Blue 2, 
// NB =  Very Dark Blue, RB =  Royal Blue,   C =  Dark Orange, VLC =  Pink,          DG =  Dark Green, 
// FG =  Green-blue,      G =  Green,       LG =  Light Green,  MG =  Darker Green,   K =  Black, 
// M  =  Magenta,        DN =  Dark Gray,   LN =  Light Gray,    N =  Mid Gray,      DO =  Dark Orange, 
// LO =  Light Orange,    O =  Orange,       P =  Purple,       DR =  Dark Red,      LR =  Light Red, 
// R  =  Red,            WR =  Dark Magenta, S =  Yellowish,    DT =  Dark Tan,     LPT =  Lightish Tan, 
// LT =  Light Tan,      RT =  Orange-red,   T =  Tan,          MU =  Orange-ish,     W =  White, 
// DY =  Dark Yellow,    LY =  Light Yellow, Y =  Yellow, 
[  60, 132, 172,   "A"],
[  44,  58, 132,   "B"],
[  12,  10,  76,  "DB"],
[ 124, 130, 196,  "LB"],
[ 20,   26,  68,  "MB"],
[   4,   2,  36,  "NB"],
[   4,   2, 100,  "RB"],
[ 148,   2,  36,   "C"],
[ 220, 170, 172, "VLC"],
[   4,  50,  20,  "DG"],
[  68, 106,  84,  "FG"],
[   4,  82,  36,   "G"],
[  44, 154,  20,  "LG"],
[   4,  58,  20,  "MG"],
[  20,  18,  20,   "K"],
[ 116,  26,  52,   "M"],
[  76,  74,  76,  "DN"],
[ 188, 186, 188,  "LN"],
[ 124, 122, 124,   "N"],
[ 220,  90,   4,  "DO"],
[ 236, 114,  60,  "LO"],
[ 252,  74,   4,   "O"],
[ 116,   2, 116,   "P"],
[ 204,   2,   4,  "DR"],
[ 204,  42,  44,  "LR"],
[ 204,   2,   4,   "R"],
[ 100,   2,  44,  "WR"],
[ 228,  86,   4,   "S"],
[  68,  18,   4,  "DT"],
[ 204, 150, 100, "LPT"],
[ 148, 102,  52,  "LT"],
[ 244,  90,  44,  "RT"],
[  84,  62,  20,   "T"],
[ 204, 122,  20,  "MU"],
[ 228, 226, 228,   "W"],
[ 148, 122,   4,  "DY"],
[ 244, 218,   4,  "LY"],
[ 236, 194,   4,   "Y"]
];
