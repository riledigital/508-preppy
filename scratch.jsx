// RESOURCES
//--------------------------------
/*
API Documentation available at
http://jongware.mit.edu/idcsjs5.5/pc_ParagraphStyle.html

https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug

https://code.visualstudio.com/api/extension-guides/debugger-extension

https://stackoverflow.com/questions/8545497/console-log-with-photoshop-scripting-extendedscript-toolkit

https://graphicdesign.stackexchange.com/questions/56175/indesign-script-to-replace-paragraph-style

TODO: implement some of these grep replacements
https://indesignsecrets.com/favorite-grep-expressions-you-can-use.php

*/
//--------------------------------
// with(app.pdfExportPreferences) {
    //     //======Marks and Bleed
    //     cropMarks = false;
    //     bleedMarks = false;
    //     registrationMarks = false;
    //     colorBars = true;
    //     pageInformationMarks = true;

    //     //Default mark type.
    //     // pdfMarkType = 1147563124;
    //     // printerMarkWeight = PDFMarkWeight.P25PT
    //     //pageMarksOffset = 5;
    //     //useDocumentBleedWithPDF = true;
    //     //includeSlugWithPDF = true;
    // }

    // newPreset = {
    //     'colorBars': false,
    //     'acrobatCompatibility': AcrobatCompatibility.ACROBAT_8,
    //     //'standardsCompliance' : PDFXStandards.PDFX42010_STANDARD,
    //     'pdfColorSpace': PDFColorSpace.CMYK,
    //     'name': 'FEMA_Printers',
    //     'includeStructure': true,
    //     'includeHyperlinks': true,
    //     'includeBookmarks': true,
    //     'generateThumbnails': false
    // }

    //    app.pdfExportPresets.add(newPreset);
    
// BEFORE
/* ------------------------------
[No Paragraph Style]
[Basic Paragraph]
Slide Captions
Normal
Multi-level List 1
Multi-level List 2
Heading 1
slide caption
box
List Bullet
Heading 2.0
Block Text1
Body Text
Default
Heading 2
Heading 3
List Paragraph
Block Text3
------------------------------ */

// AFTER 
/* ------------------------------
[No Paragraph Style]
[Basic Paragraph]
Aside Box - Body
Aside Box - Heading
Body Text (Base)
Question
Checklist
Checklist - Checked
Fill-in Ruled
Fill-in Ruled with Checkboxes
Heading Lv 1
Heading Lv 2
Heading Lv 3
Definition List - Definition
Definition List - Description
List Bullet
List Bullet - Small Text
List Numbered
Running Header - Document Title
Footer - Page Num and Date
Tabular Body
Tabular - Numbers, Right-Aligned
Tabular Heading
Cover Title
TOC Listing Level 1
TOC Listing Level 2
Caption
Reference Item
Normal
H2-remap
------------------------------ */

// code scraps
// Toggle code
/*
if (myCond.visible) {
    $.writeln("Toggling " + myCondName + "to false");
    myCond.visible = 0;
} else if (!myCond.visible) {
    $.writeln("Toggling " + myCondName + "to true");
    myCond.visible = 1;
}
*/
//$.writeln("condition: " + myCondName);