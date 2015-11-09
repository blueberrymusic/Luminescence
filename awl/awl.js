// AWL Parser
// Version 0.1, 18 Oct 2015, AG  (adapted from my C# version from 2003!)

"use strict";
var AATheStack = [];  // entries [element, type]
var DomainMin = 0;
var DomainMax = 7;
var DebugString = "";
var ParsedSoFar = "";
var Alerted = false;

var CListType= "clist";  // closed list: new elements don't append
var OListType= "olist";  // open list: new elements get appended


////////////////////////////////
///// The main entry
////////////////////////////////

function ProcessString(input) {
	initStack();
	input = cleanInputString(input);
	var words = input.split(" ");
	for (var i=0; i<words.length; i++) {
		var word = words[i];
		word = word.trim();
		processToken(word);
		ParsedSoFar += " " + word;
		if (Alerted) return [ "0" ];
	}
	DebugString += stackToHTML();
	var top = popList();
	return top;
}

////////////////////////////////
///// Basic stack utilities
////////////////////////////////

function initStack() {
	AATheStack = [];
	DomainMin = 0;
	DomainMax = 7;
	DebugString = "";
	ParsedSoFar = "";
	Alerted = false;
}

// Each list on the stack and each new list we push has an associated
// type. This interacts with the type currently on the head of the stack:
// new type   head of stack   action
// open       open            append new to existing top of stack
// open       closed          push new element
// closed     open            make top of stack closed, push new element
// closed     closed          push new element
function pushElement(element) {
	if (stackIsEmpty()) {
		AATheStack.push([[element], OListType]); 
	} else {
		var head = AATheStack.pop();
		if (head[1] === OListType) {
			head[0].push(element);
			AATheStack.push(head);
		} else {
			AATheStack.push(head);
			AATheStack.push([[element], OListType]);
		} 
	}
}

// pushing a list closes the old element if it's open, and pushes the new closed list
function pushList(list) {
	if (!stackIsEmpty()) {
		var head = AATheStack.pop();
		if (head[1] === OListType) {
			head[1] = CListType;
		}
		AATheStack.push(head);
	}
	AATheStack.push([list, CListType]); 
}

function popList() {
	if (stackIsEmpty()) {
		showAlert("popList: Cannot pop empty stack.");
		return;
	}
	var top = AATheStack.pop();
	return top[0];
}

function popInt() {
	var list = popList();
	if (list.length > 1) {
		showAlert("popInt: Expected one number, but found list ["+list+"] with "+list.length+" elements.");
		return;
	}
	return Number(list[0]);
}

function stackIsEmpty() {
	if (AATheStack.length < 1) return true;
	return false;
}

////////////////////////////////
///// Debugging stuff
////////////////////////////////

function showAlert(msg) {
	alert("ERROR: "+msg+" Read so far: "+ParsedSoFar);
	Alerted = true;
	//throw new Error(); // stop processing, let user try again
}

function stackToText() {
	var txt = "Top of Stack\n";
	for (var i=AATheStack.length-1; i>=0; i--) {
		var element = AATheStack[i];
		txt += "slot "+i+": value:["+element[0]+"] type:["+element[1]+"]\n";
	}
	return txt;
}

function stackToHTML() {
	var txt = "<ul><li>Top of Stack</li>";
	for (var i=AATheStack.length-1; i>=0; i--) {
		var element = AATheStack[i];
		txt += "<li>slot "+i+": value:["+element[0]+"] type:["+element[1]+"]</li>";
	}
	txt += "</ul>";
	return txt;
}

////////////////////////////////
///// Utilities
////////////////////////////////

// return n such that (na)%b = 0
// A really robust solution would return LCM(a,b)/b, but finding the LCM
// takes some work. Since n will usually be very small, this simple loop
// is usually sufficient.
function findReps(a, b) {
	var n = 1;
	do {
		if (((n*a)%b) === 0) return n;
		n++;
	} while(n<10000);  // sanity check for runaways
	return 1;
}

// each word is separated by one blank, no other white space
function cleanInputString(str) {
	str = str.trim();
	str = str.replace(/\t/g, ' '); // all tabs become space
	str = str.replace(/\s\s+/g, ' '); // all whitespace becomes one space
	return str;
}

// The top two elements should be lists. We pop them off, repeat the shorter 
// one until it's the same length as the longer, and then put both of them 
// back on the stack in their original order.
function normalizeStackTopLists() {
	var a = popList();
	var b = popList();
	var lists = normalizeLists(a, b);
	pushList(lists[1]);
	pushList(lists[0]);
}

// return the two lists, extended as needed so they have equal lengths
function normalizeLists(a, b) {
	var maxLen = Math.max(a.length, b.length);
	var newa = [];
	var newb = [];
	for (var i=0; i<maxLen; i++) {
		newa.push(a[i % a.length]);
		newb.push(b[i % b.length]);
	}
	return [newa, newb];
}

function toDomain(v) {
	var dr = 1+DomainMax - DomainMin;
	while (v < DomainMin) v += dr;
	while (v > DomainMax) v -= dr;
	return v;
}

////////////////////////////////
///// The Dispatch Table
////////////////////////////////

var Dispatch = [
	[ "binary0", DoBinary0 ],
	[ "binary1", DoBinary1 ],
	[ "block", DoBlock ], 
	[ "blockpal", DoBlockPal ], 
	[ "clear", DoClear ],
	[ "cipher", DoCipher ],
	[ "concat", DoConcat ], 
	[ "domain", DoDomain ],
	[ "down", DoDown ], 
	[ "downloop", DoDownLoop ], 
	[ "downup", DoDownUp ], 
	[ "downuploop", DoDownUpLoop ], 
	[ "dup", DoDup ],
	[ "extend", DoExtend ], 
	[ "growblock", DoGrowBlock ], 
	[ "iblock", DoIBlock ], 
	[ "iblockpal", DoIBlockPal ], 
	[ "interleave", DoInterleave ], 
	[ "palindrome", DoPalindrome ], 
	[ "permute", DoPermute ],
	[ "pbox", DoPbox ],
	[ "pop", DoPopOp ],
	[ "push", DoPush ], 
	[ "ramp", DoRamp ], 
	[ "ramploop", DoRampLoop ], 
	[ "repeat", DoRepeat ], 
	[ "reverse", DoReverse ], 
	[ "rotatel", DoRotateL ],
	[ "rotater", DoRotateR ],
   [ "skipkeep", DoSkipKeep ],
	[ "split", DoSplit ],
	[ "swap", DoSwap ],
	[ "tartan", DoTartan ],
	[ "tartanpal", DoTartanPal ],
	[ "template", DoTemplate ], 
	[ "twillr", DoTwillR ], 
	[ "twilll", DoTwillL ], 
	[ "up", DoUp ], 
	[ "uploop", DoUpLoop ], 
	[ "updown", DoUpDown ], 
	[ "updownloop", DoUpDownLoop ], 
	[ "vlen", DoVlen ],
	[ "vmax", DoVmax ],
	[ "vmin", DoVmin ],

	// shortcuts 
	[ "b0", DoBinary0 ],
	[ "b1", DoBinary1 ],
	[ "#", DoBlock ],
	[ "#p", DoBlockPal ],
	[ ",", DoConcat ],
	[ ">", DoDown ],
	[ ">l", DoDownLoop ],
	[ ">u", DoDownUp ],
	[ ">ul", DoDownUpLoop ],
	[ "+", DoExtend ],
	[ "=", DoGrowBlock ],
	[ "i#", DoIBlock ],
	[ "i#p", DoIBlockPal ],
	[ "%", DoInterleave ],
	[ "|", DoPalindrome ],
	[ "&", DoPermute ],
	[ "/", DoPush ],
	[ "-", DoRamp ],
	[ "-l", DoRampLoop ],
	[ "*", DoRepeat ],
	[ "@", DoReverse ],
	[ "<<", DoRotateL ],
	[ ">>", DoRotateR ],
	[ "-sk", DoSkipKeep ],
	[ ":", DoTemplate ],
	[ "t>>", DoTwillR ],
	[ "t<<", DoTwillL ],
	[ "<", DoUp ],
	[ "<l", DoUpLoop ],
	[ "<d", DoUpDown ],
	[ "<dl", DoUpDownLoop ]
];
	
// If it's an operator, call its function. Otherwise it should be an int. Check 
// to make sure, and then append it to the list of ints at the top of the stack.
function processToken(token) {
	var tokenLC = token.toLowerCase();
	for (var i=0; i<Dispatch.length; i++) {
		var entry = Dispatch[i];
		var procLC = entry[0].toLowerCase();
		if (tokenLC === procLC) {
			entry[1]();
			return;
		}
	}
	pushElement(token);
}

////////////////////////////////
///// Operators
////////////////////////////////

function DoBinary0() { 
	var list = popList();
	handleBinary(list, "01");
}

function DoBinary1() { 
	var list = popList();
	handleBinary(list, "10");
}  

function DoBlock() { 
	handleBlock(false);
}  

function DoBlockPal() { 
	handleBlock(true);
}  

function DoClear() { 
	AATheStack = [];
}

function DoCipher() { 
	var bList = popList();
	var aList = popList();
	var newList = [];
	for (var i=0; i<aList.length; i++) {
		var elem = aList[i] % bList.length;
		newList.push(bList[elem]);
	}
	pushList(newList);
}

function DoConcat() { 
	var bList = popList();
	var aList = popList();
	var newList = aList;
	newList = newList.concat(bList);
	pushList(newList);
}  

function DoDomain() { 
	DomainMax = popInt();
	DomainMin = popInt();
	if (DomainMin < 0) DomainMin = 0;
	if (DomainMax <= DomainMin) DomainMax = DomainMin+1;
}

function DoDown() { 
	var bList = popList();
	var aList = popList();
	handleUpOrDown(aList, bList, 0, true);
}

function DoDownLoop() { 
	var numLoops = popInt();
	var bList = popList();
	var aList = popList();
	handleUpOrDown(aList, bList, numLoops, true);
}

function DoDownUp() { 
	var bList = popList();
	var aList = popList();
	handleDownUp(aList, bList, 0, true);
}
	
function DoDownUpLoop() { 
	var numLoops = popInt();
	var bList = popList();
	var aList = popList();
	handleDownUp(aList, bList, numLoops, true);
}

function DoDup() {
	if (stackIsEmpty()) return;
	var list = popList();
	pushList(list);
	pushList(list);
}

// truncate or repeat list so that it has the given length
function DoExtend() { 
	var newLen = popInt();
	var list = popList();
	while (list.length < newLen) {
		list = list.concat(list);
	}
	list = list.slice(0, newLen);
	pushList(list);
}

function DoGrowBlock() { 
	normalizeStackTopLists();
	var bList = popList();
	var aList = popList();
	var newList = [];
	for (var i=0; i<aList.length; i++) {
		newList.push(aList[i]);
		var start = Number(aList[i]);
		var end = Number(bList[0]);
		var goDown = true;
		if (start < end) goDown = false;
		var ramp = buildBridge(start, end, 0, goDown);
		newList = newList.concat(ramp);
		for (var j=0; j<i+1; j++) {
			newList.push(bList[j]);
		}
		for (var j=i-1; j>=0; j--) {
			newList.push(bList[j]);
		}
		if (i < aList.length-1) {
			start = Number(bList[0]);
			end = Number(aList[i+1]);
			goDown = true;
			if (start < end) goDown = false;
			ramp = buildBridge(start, end, 0, goDown);
			newList = newList.concat(ramp);
		}
	}
	pushList(newList);
}

function DoIBlock() { 
	handleIBlock(false, false);
}  

function DoIBlockPal() { 
	handleIBlock(true, false);
}

function DoInterleave() {   
	normalizeStackTopLists();
	var bList = popList();
	var aList = popList();
	var newList = [];
	for (var i=0; i<aList.length; i++) {
		newList.push(aList[i]);
		newList.push(bList[i]);
	}
	pushList(newList);
}

function DoPalindrome() {
	var list = popList();
	var newList = list;
	if (list.length > 2) {
		var subList = list.slice(1, list.length-1);
		subList = subList.reverse();
		newList = newList.concat(subList);
	}
	pushList(newList);
}

function DoPbox() {   
	var bList = popList();
	var aList = popList();
	var newb = bList;
	while (newb.length < aList.length) {
		newb = newb.concat(bList);
	}
	newb = newb.slice(0, aList.length);
	handlePermute(aList, newb);
}

function DoPermute() {   
	var bList = popList();
	var aList = popList();
	handlePermute(aList, bList);
}

function DoPopOp() {
	if (stackIsEmpty()) return;
	var list = popList();
}

// This is the standard pushList() without the last line, since we
// don't actually push anything. We just make sure the top of the 
// stack, if there's anything there, is a closed list.
function DoPush() {
	if (!stackIsEmpty()) {
		var head = AATheStack.pop();
		if (head[1] === OListType) {
			head[1] = CListType;
		}
		AATheStack.push(head);
	}
}  

function DoRamp() { 
	var bList = popList();
	var aList = popList();
	handleRamp(aList, bList, 0);
}

function DoRampLoop() { 
	var numLoops = popInt();
	var bList = popList();
	var aList = popList();
	handleRamp(aList, bList, numLoops);
} 

function DoRepeat() {
	var count = popInt();
	var list = popList();
	var newList = [];
	for (var i=0; i<count; i++) {
		newList = newList.concat(list);
	}
	pushList(newList);
}

function DoReverse() { 
	var list = popList();
	list = list.reverse();
	pushList(list);
}

function DoRotateL() { 
	var count = popInt();
	var list = popList();
	handleRotation(list, count);
}

function DoRotateR() { 
	var count = popInt();
	var list = popList();
	handleRotation(list, -1*count);
}

function DoSkipKeep() {
	var keep = popInt();
	var skip = popInt();
	var list = popList();
	var newList = [];
	if ((skip < 1) || (keep < 1)) {
		pushList(list);
		return;
	}
	var index = 0;
	while (index < list.length) {
		index += skip;
		var k = 0;
		while ((k < keep) && (index < list.length)) {
			newList.push(list[index++]);
			k++;
		}
	}
	pushList(newList);
}

function DoSplit() {
	var cutPoint = popInt();
	var list = popList();
	var leftList = [];
	var rightList = [];
	for (var i=0; i<list.length; i++) {
		if (i < cutPoint) leftList.push(list[i]);
		else rightList.push(list[i]);
	}
	if (leftList.length > 0) pushList(leftList);
	if (rightList.length > 0) pushList(rightList);
}

function DoSwap() {
	if (AATheStack.length < 2) return;
	var a = popList();
	var b = popList();
	pushList(a);
	pushList(b);
}

function DoTartan() { 
	handleIBlock(false, true);
}

function DoTartanPal() { 
	handleIBlock(true, true);
}

// Note that the Jan 03 CG&A article has a spurious +1 in the text body
// at the end of the discussion of template on page 83. The code in the
// C# parser erroneously adds bList[0] to each new entry, so that they
// aren't 0-based. That is, 1 2 : 1 2 gives 2 3 3 4, not 1 2 2 3. I
// think that's actually better, so I'm going to keep it that way as a
// matter of policy. If you want 0-based, you can always start with 0.
function DoTemplate() {   
	var bList = popList();
	var aList = popList();
	var cList = [];
	for (var i=0; i<bList.length; i++) {
		var d = Number(bList[i]); 
		cList.push(d);
	}
	var newList = [];
	for (var i=0; i<aList.length; i++) {
		var aElement = Number(aList[i]);
		for (var j=0; j<cList.length; j++) {
			var v = aElement + cList[j];
			v = toDomain(v);
			newList.push(v.toString());
		}
	}
	pushList(newList);
}

// see comment for handleTwill
function DoTwillL() {   
	var repCount = popInt();
	var shiftCount = popInt();
	var aList = popList();
	handleTwill(repCount, shiftCount, aList);
}

// see comment for handleTwill
function DoTwillR() {   
	var repCount = popInt();
	var shiftCount= -1 * popInt();
	var aList = popList();
	handleTwill(repCount, shiftCount, aList);
}

function DoUp() { 
	var bList = popList();
	var aList = popList();
	handleUpOrDown(aList, bList, 0, false);
}

function DoUpLoop() { 
	var numLoops = popInt();
	var bList = popList();
	var aList = popList();
	handleUpOrDown(aList, bList, numLoops, false);
}

function DoUpDown() { 
	var bList = popList();
	var aList = popList();
	handleDownUp(aList, bList, 0, false);
}

function DoUpDownLoop() {
	var numLoops = popInt();
	var bList = popList();
	var aList = popList();
	handleDownUp(aList, bList, numLoops, false);
}

function DoVlen() {
	var list = popList();
	var v = list.length;
	pushList([v.toString()]);
}

function DoVmax() {
	var list = popList();
	if (list.length <= 0) {
		pushList(["0"]);
		return;
	}
	var maxval = Number(list[0]);
	for (var i=0; i<list.length; i++) {
		if (Number(list[i]) > maxval) {
			maxval = Number(list[i]);
		}
	}
	pushList([maxval.toString()]);
}

function DoVmin() {
	var list = popList();
	if (list.length <= 0) {
		pushList(["0"]);
		return;
	}
	var minval = Number(list[0]);
	for (var i=0; i<list.length; i++) {
		if (Number(list[i]) < minval) {
			minval = Number(list[i]);
		}
	}
	pushList([minval.toString()]);
}

////////////////////////////////
///// Helper functions for operations
////////////////////////////////

//
// Each element leftList[i] is repeated rightList[i] times. If isPalindrome,
// follow this with a repeat but backwards.
//
function doGeneralBlock(leftList, rightList, isPalindrome) {
	var norms = normalizeLists(leftList, rightList);
	leftList = norms[0];
	rightList = norms[1];
	var newList = [];
	for (var i=0; i<rightList.length; i++) {
		var reps = Number(rightList[i]);
		for (var j=0; j<reps; j++) {
			newList.push(leftList[i]);
		}
	}
	if (isPalindrome) { // repeat as before but backwards
		var i = rightList.length-2;
		while (i > 0)
		{
			var reps = Number(rightList[i]);
			for (var j=0; j<reps; j++) {
				newList.push(leftList[i]);
			}
			i--;
		}
	}
	pushList(newList);
}

function handleBinary(list, chars01) {
	var newList = [];
	var charIndex = 0;
	for (var i=0; i<list.length; i++) {
		var count = Number(list[i]);
		for (var j=0; j<count; j++) {
			newList.push(chars01[charIndex]);
		}
		charIndex = (charIndex+1) % 2;
	}
	pushList(newList);
} 

// 
// Return the blend from start to end, in the given direction, including
// the desired number of complete cycles from 0 to Domain (or reverse).
// start and end are strings, so turn them into numbers first, but as usual
// save the resulting list elements as strings.
// This helper function simplifies the various versions of up, down, updown,
// etc. with and without loops. It makes things much easier than the C# code!
//
function buildBridge(start, end, numLoops, goDown) {
	start = toDomain(Number(start));
	end = toDomain(Number(end));
	var newList = [];
	var delta = 1;
	if (goDown) delta = -1;
	// build the loops
	for (var loop=0; loop<numLoops; loop++) {
		for (var j=0; j<1+DomainMax-DomainMin; j++) {
			var v = start + ((j+1) * delta);
			v = toDomain(v);
			newList.push(v.toString());
		}
	}
	// build the bridge if needed
	if (start !== end) {
		var b = start + delta;
		b = toDomain(b);
		while (b !== end) {
			newList.push(b.toString());
			b += delta;
			b = toDomain(b);
		}
	}
	return newList;
}

//
// Return leftList followed by rightList, but in between place an ascending or descending
// ramp to join the last element of the left with the first element of the right. Optionally
// also include several complete ascending or descending ramps between them as well.
//
function handleUpOrDown(leftList, rightList, numLoops, goDown) {
	var leftEnd = Number(leftList[leftList.length-1]);
	var rightStart = Number(rightList[0]);
	var bridge = buildBridge(leftEnd, rightStart, numLoops, goDown);
	var newList = leftList;
	newList = newList.concat(bridge);
	newList = newList.concat(rightList);
	pushList(newList);
}

// 
// Reshape the inputs (*). Go back and forth between the entries, alternatingly 
// going up and down. That is, start with leftList[0], bridge to rightList[0],
// bridge to leftList[1] in the other direction, and so on, to end of rightList.
// Tweaking what's in CG&A, the A list can have 1 more entry than B, so we can
// make repeating triangular structures.
//
function handleDownUp(leftList, rightList, numLoops, downFirstThenUp) {
	if (leftList.length !== rightList.length+1) {
		var norms = normalizeLists(leftList, rightList);
		leftList = norms[0];
		rightList = norms[1];
	}
	var goDown = downFirstThenUp;
	var newList = [leftList[0]];
	for (var i=0; i<rightList.length; i++) {
		var bridge = buildBridge(leftList[i], rightList[i], numLoops, goDown);
		newList = newList.concat(bridge);
		newList.push(rightList[i]);
		if (i < leftList.length-1) {
			bridge = buildBridge(rightList[i], leftList[i+1], numLoops, !goDown);
			newList = newList.concat(bridge);
			newList.push(leftList[i+1]);
		}
	}
	pushList(newList);
}

//
// Normalize the top two lists, then treat them as inputs to block.
// If pal is true, the result will be palindromic by including the
// mirror image of the new sequence at its end.
//
function handleBlock(pal) {
	var rightList = popList();
	var leftList = popList();
	doGeneralBlock(leftList, rightList, pal);
}

// 
// Treat one list as an iBlock. If pal is true, result is palindromic.
// If halfLengths is true, reduce lengths by half (used by tartan, 
// because some published versions use doubled thread counts).
//
function handleIBlock(pal, halfLengths) {
	var Wlist = popList();
	var leftList = [];
	var rightList = [];
	var i = 0;
	while (i < Wlist.length) {
		leftList.push(Wlist[i]);
		if (halfLengths) {
			var v = Math.floor(Number(Wlist[i+1])/2);
			rightList.push(v.toString());
		} else {
			rightList.push(Wlist[i+1]);
		}
		i += 2;
	}
	doGeneralBlock(leftList, rightList, pal);
}

function handlePermute(aList, bList) {
	var aLen = aList.length;
	var bLen = bList.length;
	var newa = aList;
	var runaway = 0;
	while ((newa.length/bLen)%1 !== 0) {
		newa = newa.concat(aList);
		if (++runaway > 1000) {
			showAlert("DoPermute: Cannot reasonably extend list A to be multiple of list B");
			pushList([]);
			return;
		}
	}
	var newb = [];
	var repeatCount = 0;
	while (newb.length < newa.length) {
		for (var j=0; j<bList.length; j++) {
			var v = (repeatCount * bLen) + Number(bList[j]);
			newb.push(v.toString());
		}
		repeatCount++;
	}
	var newList = [];
	for (var i=0; i<newa.length; i++) {
		var index = Number(newb[i]) % newb.length;
		var v = newa[index];
		newList.push(v.toString());
	}
	pushList(newList);
}

function handleRamp(leftList, rightList, numLoops) {
	var leftEnd = toDomain(Number(leftList[leftList.length-1]));
	var rightStart = toDomain(Number(rightList[0]));
	var newList = leftList;
	var goDown = true;
	if (leftEnd < rightStart) goDown = false;
	var bridge = buildBridge(leftEnd, rightStart, numLoops, goDown);
	newList = newList.concat(bridge);
	newList = newList.concat(rightList);
	pushList(newList);
}

// Rotate the list left by the given count 
// (if count is negative, that's the same as rotating right)
function handleRotation(list, count) {
	var listLen = list.length;
	var newList = [];
	for (var i=0; i<list.length; i++) {
		var v = i + count;
		while (v >= listLen) v -= listLen;
		while (v < 0) v += listLen;
		newList.push(list[v]);
	}
	pushList(newList);
}

// Note that the Jan 03 CG&A article says that each repeat we rotate by "one"
// more time than before. It also has the arguments c and d labeled backwards.
// To maintain consistency with the examples, I switch c and d here in the
// argument list
function handleTwill(repCount, shiftAmount, aList) {
	var shiftSize = 0;
	var newList = [];
	for (var i=0; i<repCount; i++) {
		for (var j=0; j<aList.length; j++) {
			var index = j + shiftSize;
			while (index < 0) index += aList.length;
			while (index >= aList.length) index -= aList.length;
			newList.push(aList[index]);
		}
		shiftSize += shiftAmount;
	}
	pushList(newList);
}

////////////////////////////////
///// The button!
////////////////////////////////

function warpButtonFunction() {
	var warpAWLstring = document.getElementById("warpAWL").value;
	ProcessString(warpAWLstring);
   var topOfStack = "Stack as of exit: "+ stackToHTML();
   document.getElementById("messageArea").innerHTML = "warp: "+topOfStack;
}

function weftButtonFunction() {
	var weftAWLstring = document.getElementById("weftAWL").value;
	ProcessString(weftAWLstring);
   var topOfStack = "Stack as of exit: "+ stackToHTML();
   document.getElementById("messageArea").innerHTML = "weft: "+topOfStack;
}
