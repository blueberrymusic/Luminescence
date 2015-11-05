
void setup() {
  makeBrowseByColor();
  exit();
}


void makeHBSRGBname() {
  PrintWriter PW = createWriter("HSBRGBname.txt");
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
     PW.println(nf(hueval, 3)+" "+nf(brtval, 3)+" "+nf(satval, 3)+" "+nf(redval, 3)+" "+nf(grnval, 3)+" "+nf(bluval, 3)+" "+name);
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
  PrintWriter PW = createWriter("BrowseByColorTable.txt");
  String lines[] = loadStrings("sortedHSBRGBname.txt");
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
    // peek ahead
    PW.println("</p></div>");
    
    //println("<div class=\"col-md-2\"><p class=\"colorCell\" style=\"background-color:#"+hexColor+";\"></p><p class=\"colorName\" >"+name+"</p></div>");
    //println("<div class=\"col-md-2\"><p class=\"colorCell\" style=\"background-color:#"+hexColor+";\"></p><p class=\"colorName\" >"+name+"</p></div>");
    //println("<div class=\"col-md-2\"><p class=\"colorCell\" style=\"background-color:#"+hexColor+";\"></p><p class=\"colorName\" >"+name+"</p></div>");

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


/*
void readsorthsb() {
  
  String lines[] = loadStrings("SortedByHSB.txt");
  int lastR = -1;
  int lastG = -1;
  int lastB = -1;
  int entryCount = 0;
  println("<div class=\"row\">");
  for (int i = 0 ; i < lines.length; i++) {
     String words[] = split(lines[i], ' ');
     int hu = int(words[0]);
     int satS = int(words[1]);
     int brtS = int(words[2]);
     int redS = int(words[3]);
     int grnS = int(words[4]);
     int bluS = int(words[5]);
     String name = words[6];
     if ((redS == lastR) && (grnS == lastG) && (bluS == lastB)) {
       println("REPEAT "+name);
     } else {
       color clr = color(redS, grnS, bluS);
       String hexColor = hex(clr, 6);  // Prints "FFCC00"
       println("<div class=\"col-md-2\"><p class=\"colorCell\" style=\"background-color:#"+hexColor+";\"></p><p class=\"colorName\" >"+name+"</p></div>");
       if (++entryCount == 6) {
         entryCount = 0;
         println("</div>");
         println("<div class=\"row\">");
       }
     }
     lastR = redS;
     lastG = grnS;
     lastB = bluS;
  }
  println("</div>");
}


void readraw() {
  String lines[] = loadStrings("v4.txt");
  for (int i = 0 ; i < lines.length; i++) {
    String words[] = split(lines[i], ' ');
    String name = words[0];
    int redval = int(words[1]);
    int grnval = int(words[2]);
    int bluval = int(words[3]);
    // convert to hsb
    colorMode(RGB);
    color clr = color(redval, grnval, bluval);
    colorMode(HSB);
    int hueval = int(hue(clr));
    int satval = int(saturation(clr));
    int brtval = int(brightness(clr));
    println(nf(hueval,3)+" "+nf(satval,3)+" "+nf(brtval,3)+" "+redval+" "+grnval+" "+bluval+" "+name);
    color c2 = color(hueval, satval, brtval);
    colorMode(RGB);
    int r2 = int(red(c2));
    int g2 = int(green(c2));
    int b2 = int(blue(c2));
    //if ((redval!=r2) || (grnval!=g2) || (bluval!=b2)) println(redval-r2, grnval-g2, bluval-b2);
    //println(r,r2+"   "+g,g2+"   "+b,b2);
  }
  */