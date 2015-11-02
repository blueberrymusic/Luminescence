"use strict";

var Presets;

function makePresets() {
	Presets = [];
	for (var i=0; i<RawPresets.length; i++) {
		var preset = RawPresets[i];
		var draft = [];
		draft.push({ "field": "Name",         "val": preset[0] });
		draft.push({ "field": "WarpAWL",      "val": preset[1] });
		draft.push({ "field": "WeftAWL",      "val": preset[2] });
		draft.push({ "field": "WarpColorAWL", "val": preset[3] });
		draft.push({ "field": "WeftColorAWL", "val": preset[4] });
		draft.push({ "field": "TieUpAWL",     "val": preset[5] });
		draft.push({ "field": "FabricSize",   "val": preset[6] });
		draft.push({ "field": "TieUpWidth",   "val": preset[7] });
		draft.push({ "field": "TieUpHeight",  "val": preset[8] });
		var JSONDraft = JSON.stringify(draft);
		Presets.push(JSONDraft);
	}
}

// name, warp-pattern, weft-pattern, warp-colors, weft-colors, tie-up
var RawPresets = [
[ "Simple Twill",
"0 1 / 7 updown",
"0 1 / 7 updown",
"DeepSkyBlue", "PowderBlue", 
"1 1 1 1 0 0 0 0 / 1 / 8 t<<",
120, 8, 8],

[ "Surveillance", 
"3 / 4 > 0 / 7 < 1 * ,", 
"3 / 4 > 0 / 7 < 2 * ,", 
"DarkSalmon", "DarkBlue", 
"0 0 1 1 0 0 1 1 / 1 / 8 t<<",
120, 8, 8],

[ "High Seas", 
"0 / 7 < 0 >", 
"0 0 0 1 1 2 4 6 1 3 5 6 6 7 7 7 ", 
"LightSeaGreen", "Navy", 
"1 1 1 1 0 0 0 0 / 1 / 8 t<<",
120, 8, 8],

[ "House Of Cards", 
"4 5 / 1 * 4 5 0 1 2 3 2 1 / 1 3 1 3 1 3 1 1 #p ,",
"4 5 / 1 * 4 5 0 1 2 3 2 1 / 1 3 1 3 1 3 1 1 #p ,",
"Green", "Yellow", 
"1 3 2 3 1 4 1 1 1 2 1 2 1 1 1 1 2 1 2 3 1 1 binary0",
120, 6, 6],

[ "Memories Of Sand",
"0 / 7 < 0 / 7 - 1 2 / 7 + : , |",
"0 / 7 < 0 / 7 - 1 2 / 7 + : , |",
"SandyBrown", "Firebrick",
"1 0 0 0 1 0 0 1 / 1 / 8 t>>",
300, 8, 8],

[ "Caffeine Buzz",
" 2 4 3 / 6 5 6 >u 7 / 0 > , |",
" 2 4 3 / 6 5 6 >u 7 / 0 > , |",
"DarkGreen", "DarkSeaGreen",
"1 0 0 0 0 1 0 1 / 1 / 8 t<<",
120, 8, 8],

[ "Kiss Me, You Fool",
"0 / 7 < 1 2 1 : |",
"0 / 7 < 0 1 0 : |",
"LightPink", "Firebrick",
"2 3 7 2 2 1 3 3 1 1 4 6 4 1 1 2 4 1 2 3 6 2 3 binary1",
200, 8, 8],

[ "Box Suite 1",
"0 / 5 < | 7 5 3 / 8 7 / 4 * : , 1 , 0 1 / 4 * 2 3 , , |",
"0 / 5 < | 7 5 3 / 8 7 / 4 * : , 1 , 0 1 / 4 * 2 3 , , |",
"LightSkyBlue", "SaddleBrown",
"1 1 1 0 0 1 1 0 / 1 / 8 t>>",
220, 8, 8],

[ "Box Suite 2",
"0 / 5 < | 7 5 3 / 8 7 / 4 * : , 1 , 0 1 / 4 * 2 3 , , |",
"0 / 5 < | 7 5 3 / 8 7 / 4 * : , 1 , 0 1 / 4 * 2 3 , , |",
"MidnightBlue", "GoldenRod",
"1 1 1 0 0 1 1 0 / 1 / 8 t<<",
220, 8, 8],

[ "Imperfect Edges",
"0 / 7 < 7 / 0 > = |",
"0 / 7 < 0 2 4 6 1 3 5 7 = |",
"black white", "white black",
"1 0 / 4 * 0 1 / 4 * 1 0  / 3 * 0 1 / 4 * 1 0 / 3 * 0 1 / 4 * 1 0 / 3 * 0 1 / 4 * 1 0 / 3 * , , , , , , , ,",
250, 8, 8],

[ "Breaking Out",
"0 / 6 - 1 / 7 - = |",
"0 / 6 - 0 / 6 - = |",
"black white", "black white",
"1 0 / 4 * 0 1 / 4 * 1 0  / 3 * 0 1 / 4 * 1 0 / 3 * 0 1 / 4 * 1 0 / 3 * 0 1 / 4 * 1 0 / 3 * , , , , , , , ,",
180, 8, 8],

[ "Nude Descending A Fabric",
"0 / 7 - 1 1 2 3 6 5 3 2 # 0 4 :",
"0 / 7 - 1 1 1 1 2 3 4 3 # 0 4 :",
"black white", "white black",
"0 0 0 1 1 1 1 0 / 1 / 8 t<<",
220, 8, 8],

[ "Fly's Eye",
"0 / 7 - 2 * | 1 2 3 4 5 6 7 8 / 1 2 2 2 4 5 6 8 # | 1 , # 1 1 ,",
"0 / 7 - 2 * | 1 2 3 4 5 6 7 8 / 1 2 3 4 5 7 8 # | 1 , # 1 1 ,",
"black white", "white black",
"2 2 2 2 2 1 3 1 1 binary0 2 2 2 2 1 3 1 3 binary1 , 2 *",
300, 8, 8],

[ "Sandstorm",
"0 / 7 - 2 * / 1 1 2 1 2 2 3 2 3 3 4 3 4 4 4 5 4 5 5 5 5 5 6 5 6 6 6 | #",
"0 / 7 - 2 * / 1 1 2 1 2 2 3 2 3 3 4 3 4 4 4 5 4 5 5 5 5 5 6 5 6 6 6 | #",
"rgb(248,219,173)", "rgb(135,22,51)",
"1 0 0 0 1 1 1 0 / 1 / 8 t<<",
500, 8, 8],

[ "Lucky's Last Chance",
"0 1 2 3 | 3 * 1 2 3 4 5 6 5 4 3 2 1 : 3 2 1 2 3 :",
"7 6 5 4 | 3 * 8 7 6 5 4 3 4 5 6 7 8 : 1 2 3 2 1 :",
"rgb(236,31,36)", "rgb(245,136,34)",
"1 0 0 0 1 1 1 0 / 1 / 8 t>>",
300, 8, 8],

[ "Long Green",
"0 1 2 3 | 3 * 1 2 3 4 5 | 1 , : 3 2 1 2 3 :",
"7 6 5 4 | 3 * 2 3 4 5 4 3 2 : 1 2 3 2 1 :",
"green", "yellow",
"1 1 1 0 0 1 1 0 / 1 / 8 t<<",
400, 8, 8],

[ "The Pen",
"4 5 0 1 2 3 2 1 / 1 3 2 3 1 3 1 1 #p",
"4 5 0 1 2 3 2 1 / 1 3 2 3 1 3 1 1 #p",
"cornflowerblue", "black",
"1 2 2 2 5 1 1 2 1 1 2 2 1 1 4 1 1 1  1 2 1 1 binary0",
120, 6, 6],

[ "Waffle Iron",
"7 / 0 > 1 2 3 , | 7 6 5 4 / | ,",
"7 / 0 > 1 2 3 , | 7 6 5 4 / | ,",
"rgb(145,29,36)", "rgb(236,172,31)",
"0 1 0 1 0 0 1 1 / 1 / 8 t>>",
120, 8, 8],

[ "Snail's Trail (KtW)",
"3 2 3 2 1 2 1 2 1 0 1 0 3 0 3 0 / 3 * 3 / 5 * 0 -1 : 1 / 4 * 0 1 :  3 2 3 , 2 / 4 * 1 0  : 2 / 4 * 0 1 : 0 3 / 4 *  0 / 4 * 0 1 :  0 3 / 2 * 0 / 4 * 0 1 : 0 3 / 3 * 0 , , , , , , , , , , ",
"2 / 0 / 3 < 3 * , 0 2 0 3 2 1 2 1 2 , 3 5 3 5 3 5 3 5 3 5 3 5 9 8 4 8 9 9 8 4 8 9 # ",
"rgb(165,215,229)", "rgb(73,96,150)",
"1 2 1 1 3 2 1 2 2 2 1 2 3 1 binary1",
410, 6, 4],


[ "Tabletop variation 1",
"0 / 15 domain 15 / 0 > 0 / 14 < ,",
"0 / 15 domain 7 / 15 < 14 / 0 > 1 / 6 < , , ",
"rgb(171,26,69)", "rgb(232,151,12)",
"2 6 4 3 2 1 4 2 3 3 1 2 1 1 4 2 1 "+
"3 1 1 1 1 2 1 4 4 1 4 3 7 1 5 3 6 " +
"1 7 2 5 1 9 1 4 1 6 2 6 1 6 1 1 2 " +
"4 1 6 1 2 3 2 1 8 1 1 2 2 1 3 3 4 " +
"2 2 1 3 5 3 1 2 1 2 8 2 1 1 1 1 5 " +
"1 5 1 2 1 5 4 4 1 binary1 ",
120, 16, 16],

[ "Tabletop variation 2",
"0 / 15 domain 15 / 0 > 0 / 14 < ,",
"0 / 15 domain 7 / 15 < 14 / 0 > 1 / 6 < , , ",
"rgb(171,26,69)", "rgb(232,151,12)",
"2 6 4 3 2 1 4 2 3 3 1 2 1 1 4 2 1 3 "+
"1 1 1 1 2 1 4 4 1 1 2 1 3 7 1 2 2 1 "+
"3 6 1 2 3 2 2 5 1 3 3 3 1 4 1 3 5 6 "+
"1 3 4 1 2 4 1 4 3 2 3 2 1 5 4 1 2 2 "+
"1 3 3 1 5 2 1 3 5 1 3 2 1 2 8 2 1 1 "+
"1 1 5 1 4 2 2 1 5 4 4 1 binary1",
120, 16, 16],


[ "Tabletop variation 3",
"0 / 15 domain 15 / 0 > 0 / 14 < ,",
"0 / 15 domain 7 / 15 < 14 / 0 > 1 / 6 < , , ",
"rgb(36,102,80)", "rgb(73,176,165)", 
"3 2 5 1 1 1 1 2 2 2 5 1 1 1 1 1 1 1 "+
"1 2 5 1 2 2 1 1 1 2 5 1 3 1 1 1 1 2 "+
"5 1 4 4 2 5 4 1 4 2 1 4 3 1 4 1 1 2 "+
"1 3 2 1 4 1 2 1 1 1 1 2 1 1 4 1 3 4 "+
"1 2 4 1 8 7 5 1 3 2 1 4 4 1 1 1 1 1 "+
"2 1 1 3 3 2 2 1 3 2 1 2 2 2 2 1 1 1 "+
"2 1 1 1 1 1 1 2 2 1 3 1 1 4 1 2 3 binary1",
120, 16, 16],


[ "Tabletop variation 4",
"0 / 15 domain 15 / 0 > 0 / 14 < ,",
"0 / 15 domain 7 / 15 < 14 / 0 > 1 / 6 < , , ",
"rgb(248,215,76)", "rgb(104,172,85)",
"0 1 1 1 1 2 5 3 1 1 1 1 1 2 4 4 1 1 "+
"1 1 1 1 4 5 1 1 1 1 1 1 1 1 4 3 1 1 "+
"1 4 2 1 4 1 1 1 1 4 4 4 1 1 1 3 6 3 "+
"1 1 1 4 3 1 2 2 1 1 1 1 1 2 4 2 1 1 "+
"1 1 1 2 2 1 3 4 1 1 1 3 6 3 1 1 1 4 "+
"4 4 1 1 1 1 4 1 2 4 1 1 1 3 4 1 1 1 "+
"1 1 1 1 1 5 4 1 1 1 1 1 1 4 4 2 1 1 "+
"1 1 1 3 5 2 1 1 1 1 binary1",
120, 16, 16],

[ "Lover's Knot",
"0 / 3 domain 0 1 2 3 / 0 1 0 : | 3 0 3 0 3 2 3 2 3 0 | "+
", 3 , 0 / 4 * 0 1 :  2 / 4 * 1 0 : 0 1 2 1 0 , , , " +
"1 / 4 * 0 1 : , 1 1 1 1 / 1 0 : , "+
"3 0 3 0 3 2 3 2 3 0 3 2 3 2 3 0 3 0 3 , ",
"0 / 3 domain 0 1 2 3 / 0 1 0 : | 3 0 3 0 3 2 3 2 3 0 | "+
", 3 , 0 / 4 * 0 1 :  2 / 4 * 1 0 : 0 1 2 1 0 , , , " +
"1 / 4 * 0 1 : , 1 1 1 1 / 1 0 : , "+
"3 0 3 0 3 2 3 2 3 0 3 2 3 2 3 0 3 0 3 ,",
"rgb(248,225,205)", "rgb(161,64,56)",
"0 1 1 0 0 0 1 1 1 0 0 1 1 1 0 0",
350, 4, 3],

["Hunting Stewart tartan",
"0 / 3 <",
"0 / 3 <",
"B 9 G 4 B 9 K 3 B 3 K 8 G 27 R 4 G 27 K 8 G 5 K 13 G 4 K 13 G 5 K 8 G 27 Y 4 G 27 K 8 B 3 K 3 tartan",
"B 9 G 4 B 9 K 3 B 3 K 8 G 27 R 4 G 27 K 8 G 5 K 13 G 4 K 13 G 5 K 8 G 27 Y 4 G 27 K 8 B 3 K 3 tartan",
"1 1 0 0 / 1 / 4 t<<",
300, 4, 4],

["Caledonia tartan",
"0 / 3 <",
"0 / 3 <",
"R 42 A 18 D 4 A 4 K 4 A 18 K 36 Y 6 G 42 R 26 K 6 R 26 W 4 R 26 tartan",
"R 42 A 18 D 4 A 4 K 4 A 18 K 36 Y 6 G 42 R 26 K 6 R 26 W 4 R 26 tartan",
"1 1 0 0 / 1 / 4 t<<",
300, 4, 4],

["Black Watch tartan",
"0 / 3 <",
"0 / 3 <",
"B 22 K 2 B 2 K 2 B 2 K 16 G 16 K 2 G 16 K 16 B 16 K 2 B 2 tartan",
"B 22 K 2 B 2 K 2 B 2 K 16 G 16 K 2 G 16 K 16 B 16 K 2 B 2 tartan",
"1 1 0 0 / 1 / 4 t<<",
300, 4, 4],
];


