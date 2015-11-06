/*
To use:
1) The file nameRGB.txt needs to exist. Each entry is of the form
  colorname R G B
separated each by one space, and no trailing spaces at the end.
The list must be sorted alphabetically by name using sort -f
so that it's case-insensitive in the sort,
and there should be no duplicated colornames.
(though it's fine to have many colors with the same RGB).

2) Run this program using
  makeHBSRGBname()
This will make the file HBSRGBname.txt,
which contains the original data in that order. 

3) In a shell, rRun
  cat HBSRGBname.txt | sort -f > sortedHSBRGBname.txt
to make the sorted version (by hue, then saturation, then brightness).

4) Run this program again, using
  makeBrowseByColor()
This will make the output file OutputByColor.txt,
appropriate for pasting into the table portion of the HTML page.

5) Run this program again, using
  makeBrowseByName();
This will make the file OutputByName.txt,
again appropriate for apsting into the table portion of that HTML page.

*/

void setup() {
  //makeHBSRGBname();
  //makeBrowseByColor();
  makeBrowseByName();
  exit();
}


void makeHBSRGBname() {
  PrintWriter PW = createWriter("HBSRGBname.txt");
  String lines[] = loadStrings("nameRGB.txt");
  for (int i=0; i<lines.length; i++) {
    String line = lines[i];
     String words[] = split(lines[i], ' ');
     String name = words[0];
     int redval = int(words[1]);
     int grnval = int(words[2]);
     int bluval = int(words[3]);
     colorMode(RGB);
     color clr = color(redval, grnval, bluval);
     colorMode(HSB);
     int hueval = int(hue(clr));
     int satval = int(saturation(clr));
     int brtval = int(brightness(clr));
     PW.println(nf(hueval, 3)+" "+nf(satval, 3)+" "+nf(brtval, 3)+" "+nf(redval, 3)+" "+nf(grnval, 3)+" "+nf(bluval, 3)+" "+name);
  }
  PW.flush();
  PW.close();
}

class ColorSet {
  int redval, grnval, bluval;
  int hueval, satval, brtval;
  String hexColor;
  String name;

  ColorSet(int _redval, int _grnval, int _bluval, int _hueval, int _satval, int _brtval, String _name) {
    redval = _redval;
    grnval = _grnval;
    bluval = _bluval;
    hueval = _hueval;
    satval = _satval;
    brtval = _brtval;
    name = _name;
    colorMode(RGB);
    color clr = color(redval, grnval, bluval);
    hexColor = hex(clr, 6);  // Prints "FFCC00"
  }
}

void makeBrowseByColor() {
  PrintWriter PW = createWriter("OutputByColor.txt");
  String lines[] = loadStrings("sortedHBSRGBname.txt");
  ColorSet[] allColors = new ColorSet[lines.length];
  for (int i=0; i<lines.length; i++) {
    String line = lines[i];
     String words[] = split(lines[i], ' ');
     int hueval = int(words[0]);
     int satval = int(words[1]);
     int brtval = int(words[2]);
     int redval = int(words[3]);
     int grnval = int(words[4]);
     int bluval = int(words[5]);
     String name = words[6];
     allColors[i] = new ColorSet(redval, grnval, bluval, hueval, satval, brtval, name);
  }
  int targetIndex = 0;
  int rowLengthSoFar = 0;
  PW.println("<div class=\"row\">");
  while (targetIndex < allColors.length) {
    ColorSet thisColor = allColors[targetIndex];
    PW.println("<div class=\"col-md-2\"><p class=\"colorCell\" style=\"background-color:#"+thisColor.hexColor+";\"></p>");
    PW.print("<p class=\"colorName\" >"+thisColor.name);
    // peek ahead and keep adding names as long as the colors are the same
    boolean reachedAhead = false;
    do {
      reachedAhead = false;
      if (targetIndex < allColors.length-1) {
        ColorSet nextColor = allColors[targetIndex+1];
        if ((thisColor.redval == nextColor.redval) &&
            (thisColor.grnval == nextColor.grnval) &&
            (thisColor.bluval == nextColor.bluval)) {
              reachedAhead = true;
              targetIndex++;
              PW.println("<br/>"+nextColor.name);
        }
      }
    } while (reachedAhead && (targetIndex < allColors.length));
    PW.println("</p></div>");
    
    targetIndex++;
    if (++rowLengthSoFar == 6) {
      rowLengthSoFar = 0;
      PW.println("</div>");
      PW.println("<div class=\"row\">");
    }
  }
  PW.println("</div>");
  PW.flush();
  PW.close();
}



void makeBrowseByName() {
  PrintWriter PW = createWriter("OutputByName.txt");
  String lines[] = loadStrings("nameRGB.txt");
  
  int rowLengthSoFar = 0;
  PW.println("<div class=\"row\">");
  for (int i=0; i<lines.length; i++) {
    String line = lines[i];
     String words[] = split(lines[i], ' ');
     String name = words[0];
     int redval = int(words[1]);
     int grnval = int(words[2]);
     int bluval = int(words[3]);
     colorMode(RGB);
     color clr = color(redval, grnval, bluval);
     String hexColor = hex(clr, 6);  // Prints "FFCC00"
    PW.println("<div class=\"col-md-2\"><p class=\"colorCell\" style=\"background-color:#"+hexColor+";\"></p>");
    PW.print("<p class=\"colorName\" >"+name+"</p></div>");
    if (++rowLengthSoFar == 6) {
      rowLengthSoFar = 0;
      PW.println("</div>");
      PW.println("<div class=\"row\">");
    }
  }
  PW.println("</div>");
  PW.flush();
  PW.close();
}