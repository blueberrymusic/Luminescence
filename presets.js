"use strict";

var Presets;

function makePresets() {
	Presets = [];
	for (var i=0; i<RawPresets.length; i++) {
		var preset = RawPresets[i];
		var draft = [];
		draft.push({ "field": "WarpAWL",      "value": preset[1] });
		draft.push({ "field": "WeftAWL",      "value": preset[2] });
		draft.push({ "field": "WarpColorAWL", "value": preset[3] });
		draft.push({ "field": "WeftColorAWL", "value": preset[4] });
		draft.push({ "field": "TieUpAWL",     "value": preset[5] });
		draft.push({ "field": "FabricSize",   "value": preset[6] });
		draft.push({ "field": "TieUpWidth",   "value": preset[7] });
		draft.push({ "field": "TieUpHeight",  "value": preset[8] });
		var JSONDraft = JSON.stringify(draft);
		Presets.push([preset[0], JSONDraft]);
	}
}

// name, warp-pattern, weft-pattern, warp-colors, weft-colors, tie-up
var RawPresets = [
[ "Simple Twill",
"1 2 / 8 updown",
"1 2 / 8 updown",
"DeepSkyBlue", "PowderBlue", 
"1 1 1 1 0 0 0 0 / 1 / 8 t<<",
120, 8, 8],

[ "Surveillance", 
"4 / 5 > 1 / 8 < 1 * ,", 
"4 / 5 > 1 / 8 < 2 * ,", 
"DarkSalmon", "DarkBlue", 
"0 0 1 1 0 0 1 1 / 1 / 8 t<<",
120, 8, 8],

[ "High Seas", 
"1 / 8 < 1 >", 
"1 1 1 2 2 3 5 7 2 4 6 7 7 8 8 8 ", 
"LightSeaGreen", "Navy", 
"1 1 1 1 0 0 0 0 / 1 / 8 t<<",
120, 8, 8],

[ "House Of Cards", 
  "5 6 / 1 * 5 6 1 2 3 4 3 2 / 1 3 1 3 1 3 1 1 #p ,",
  "5 6 / 1 * 5 6 1 2 3 4 3 2 / 1 3 1 3 1 3 1 1 #p ,",
"IndiaGreen", "Gold", 
"1 3 2 3 1 4 1 1 1 2 1 2 1 1 1 1 2 1 2 3 1 1 binary0",
120, 6, 6],

[ "Memories Of Sand",
"1 / 8 < 1 / 8 - 1 2 / 7 + : , |",
"1 / 8 < 1 / 8 - 1 2 / 7 + : , |",
"SandyBrown", "Firebrick",
"1 0 0 0 1 0 0 1 / 1 / 8 t>>",
300, 8, 8],

[ "Caffeine Buzz",
"3 5 4 / 7 6 7 >u 8 / 1 > , |",
"3 5 4 / 7 6 7 >u 8 / 1 > , |",
"DarkGreen", "DarkSeaGreen",
"1 0 0 0 0 1 0 1 / 1 / 8 t<<",
120, 8, 8],

[ "Kiss Me, You Fool",
"1 / 8 < 1 2 1 : |",
"1 / 8 < 0 1 0 : |",
"LightPink", "Firebrick",
"2 3 7 2 2 1 3 3 1 1 4 6 4 1 1 2 4 1 2 3 6 2 3 binary1",
200, 8, 8],

[ "Box Suite 1",
"1 / 6 < | 8 6 4 / 8 7 / 4 * : , 2 , 1 2 / 4 * 3 4 , , |",
"1 / 6 < | 8 6 4 / 8 7 / 4 * : , 2 , 1 2 / 4 * 3 4 , , |",
"LightSkyBlue", "SaddleBrown",
"1 1 1 0 0 1 1 0 / 1 / 8 t>>",
220, 8, 8],

[ "Box Suite 2",
"1 / 6 < | 8 6 4 / 8 7 / 4 * : , 2 , 1 2 / 4 * 3 4 , , |",
"1 / 6 < | 8 6 4 / 8 7 / 4 * : , 2 , 1 2 / 4 * 3 4 , , |",
"MidnightBlue", "GoldenRod",
"1 1 1 0 0 1 1 0 / 1 / 8 t<<",
220, 8, 8],

[ "Imperfect Edges",
"1 / 7 < 8 / 1 > = |",
"1 / 8 < 1 3 5 7 2 4 6 8 = |",
"black white", "white black",
"1 0 / 4 * 0 1 / 4 * 1 0  / 3 * 0 1 / 4 * 1 0 / 3 * 0 1 / 4 * 1 0 / 3 * 0 1 / 4 * 1 0 / 3 * , , , , , , , ,",
250, 8, 8],

[ "Breaking Out",
"1 / 7 - 2 / 8 - = |",
"1 / 7 - 1 / 7 - = |",
"black white", "black white",
"1 0 / 4 * 0 1 / 4 * 1 0  / 3 * 0 1 / 4 * 1 0 / 3 * 0 1 / 4 * 1 0 / 3 * 0 1 / 4 * 1 0 / 3 * , , , , , , , ,",
180, 8, 8],

[ "Nude Descending A Fabric",
"1 / 8 - 1 1 2 3 6 5 3 2 # 0 4 :",
"1 / 8 - 1 1 1 1 2 3 4 3 # 0 4 :",
"white black", "black white", 
"0 0 0 1 1 1 1 0 / 1 / 8 t<<",
220, 8, 8],

[ "Fly's Eye",
"1 / 8 - 2 * | 1 2 3 4 5 6 7 8 / 1 2 2 2 4 5 6 8 # | 1 , # 2 2 ,",
"1 / 8 - 2 * | 1 2 3 4 5 6 7 8 / 1 2 3 4 5 7 8 # | 1 , # 2 2 ,",
"black white", "white black",
"2 2 2 2 2 1 3 1 1 binary0 2 2 2 2 1 3 1 3 binary1 , 2 *",
300, 8, 8],

[ "Sandstorm",
"1 / 8 - 2 * / 1 1 2 1 2 2 3 2 3 3 4 3 4 4 4 5 4 5 5 5 5 5 6 5 6 6 6 | #",
"1 / 8 - 2 * / 1 1 2 1 2 2 3 2 3 3 4 3 4 4 4 5 4 5 5 5 5 5 6 5 6 6 6 | #",
"rgb(248,219,173)", "rgb(135,22,51)",
"1 0 0 0 1 1 1 0 / 1 / 8 t<<",
500, 8, 8],

[ "Lucky's Last Chance",
"1 2 3 4 | 3 * 1 2 3 4 5 6 5 4 3 2 1 : 3 2 1 2 3 :",
"8 7 6 5 | 3 * 8 7 6 5 4 3 4 5 6 7 8 : 1 2 3 2 1 :",
"rgb(236,31,36)", "rgb(245,136,34)",
"1 0 0 0 1 1 1 0 / 1 / 8 t>>",
300, 8, 8],

[ "Long Green",
"1 2 3 4 | 3 * 1 2 3 4 5 | 1 , : 3 2 1 2 3 :",
"8 7 6 5 | 3 * 2 3 4 5 4 3 2 : 1 2 3 2 1 :",
"DeepGreen", "FrenchLime",
"1 1 1 0 0 1 1 0 / 1 / 8 t<<",
400, 8, 8],

[ "The Pen",
"5 6 1 2 3 4 3 2 / 1 3 2 3 1 3 1 1 #p",
"5 6 1 2 3 4 3 2 / 1 3 2 3 1 3 1 1 #p",
"cornflowerblue", "black",
"1 2 2 2 5 1 1 2 1 1 2 2 1 1 4 1 1 1  1 2 1 1 binary0",
120, 6, 6],

[ "Waffle Iron",
"8 / 1 > 2 3 4 , | 8 7 6 5 / | ,",
"8 / 1 > 2 3 4 , | 8 7 6 5 / | ,",
"rgb(145,29,36)", "rgb(236,172,31)",
"0 1 0 1 0 0 1 1 / 1 / 8 t>>",
120, 8, 8],

[ "Snail's Trail",
"4 3 4 3 2 3 2 3 2 1 2 1 4 1 4 1 / 3 * 4 / 5 * 0 -1 : 2 / 4 * 0 1 :  4 3 4 , 3 / 4 * 1 0  : 3 / 4 * 0 1 : 1 4 / 4 *  1 / 5 * 0 1 :  1 4 / 2 * 1 / 4 * 0 1 : 1 4 / 3 * 1 , , , , , , , , , ,",
"3 / 1 / 4 < 3 * , 1 3 1 4 3 2 3 2 3 , 3 5 3 5 3 5 3 5 3 5 3 5 9 8 4 8 9 9 8 4 8 9 #",
"rgb(165,215,229)", "rgb(73,96,150)",
"2 3 2 3 3 2 1 1 1 1 2 1 1 1 binary1",
410, 6, 4],


[ "Tabletop variation 1",
"1 / 16 domain 16 / 1 > 1 / 15 < ,",
"1 / 16 domain 8 / 16 < 15 / 1 > 2 / 7 < , , ",
"rgb(171,26,69)", "rgb(232,151,12)",
"2 6 4 3 2 1 4 2 3 3 1 2 1 1 4 2 1 "+
"3 1 1 1 1 2 1 4 4 1 4 3 7 1 5 3 6 " +
"1 7 2 5 1 9 1 4 1 6 2 6 1 6 1 1 2 " +
"4 1 6 1 2 3 2 1 8 1 1 2 2 1 3 3 4 " +
"2 2 1 3 5 3 1 2 1 2 8 2 1 1 1 1 5 " +
"1 5 1 2 1 5 4 4 1 binary1 ",
120, 16, 16],

[ "Tabletop variation 2",
"1 / 16 domain 16 / 1 > 1 / 15 < ,",
"1 / 16 domain 8 / 16 < 15 / 1 > 2 / 7 < , , ",
"rgb(171,26,69)", "rgb(232,151,12)",
"2 6 4 3 2 1 4 2 3 3 1 2 1 1 4 2 1 3 "+
"1 1 1 1 2 1 4 4 1 1 2 1 3 7 1 2 2 1 "+
"3 6 1 2 3 2 2 5 1 3 3 3 1 4 1 3 5 6 "+
"1 3 4 1 2 4 1 4 3 2 3 2 1 5 4 1 2 2 "+
"1 3 3 1 5 2 1 3 5 1 3 2 1 2 8 2 1 1 "+
"1 1 5 1 4 2 2 1 5 4 4 1 binary1",
120, 16, 16],


[ "Tabletop variation 3",
"1 / 16 domain 16 / 1 > 1 / 15 < ,",
"1 / 16 domain 8 / 16 < 15 / 1 > 2 / 7 < , , ",
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
"1 / 16 domain 16 / 1 > 1 / 15 < ,",
"1 / 16 domain 8 / 16 < 15 / 1 > 2 / 7 < , , ",
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
"1 / 4 domain 1 2 3 4 / 0 1 0 : | 4 1 4 1 4 3 4 3 4 1 | , 4 , 1 / 4 * 0 1 : 3 / 4 * 1 0 : 1 2 3 2 1 , , , 2 / 4 * 0 1 : , 2 2 2 2 / 1 0 : ,  4 1 4 1 4 3 4 3 4 1 4 3 4 3 4 1 4 1 4 ,",
"1 / 4 domain 1 2 3 4 / 0 1 0 : | 4 1 4 1 4 3 4 3 4 1 | , 4 , 1 / 4 * 0 1 : 3 / 4 * 1 0 : 1 2 3 2 1 , , , 2 / 4 * 0 1 : , 2 2 2 2 / 1 0 : ,  4 1 4 1 4 3 4 3 4 1 4 3 4 3 4 1 4 1 4 ,",
"rgb(248,225,205)", "rgb(161,64,56)",
"0 0 1 1 / 1 / 4 t>>",
350, 4, 4],

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


