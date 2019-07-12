// 508-PREPPY
// functions for speeding up 508 compliance stuff
// Author:
// Ri Le <r.le@columbia.edu>
// Started June 2019
// Helper script to speed up conversion to new layout
/// https://forums.adobe.com/thread/885625

var scriptWindow = createWindow();

// myMain();
// prevent scope creep and accidentally overwritting global scope
// function myMain() {
// Variable assignments for easy access
myDoc = app.activeDocument; // Get the current document
allParaStyles = myDoc.allParagraphStyles; // Get array of all paragraph styles
allCharStyles = myDoc.allCharacterStyles; // Get array of all character styles

// setting script preferences
app.scriptPreferences.enableRedraw = 0;
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;

$.writeln("TEST: Checking for character styles,");
$.writeln("Count of all character Styles is " + allCharStyles.length);
$.writeln("TEST: Checking for paragraph styles,");
$.writeln("Count of all P Styles is " + allParaStyles.length);

// FUNCTION DEFINITIONS
//----------------------------------------------------------------
function printAllParaStyles() {
  for (i = 0; i < allParaStyles.length; i++) {
    var current = allParaStyles[i];
    $.writeln(current.name);
  }
}

function printAllCharStyles() {
  for (i = 0; i < allCharStyles.length; i++) {
    var current = allCharStyles[i];
    $.writeln(current.name);
  }
}

function updateMetadata(pauth, ptitle) {
  // From Adobe guide, "Adobe InDesign CS6 JavaScript Scripting Guide"
  //var myDocument = app.documents.add();
  with(myDoc.metadataPreferences) {
    author = pauth;
    // copyrightStatus = CopyrightStatus.yes;
    description = "";
    documentTitle = ptitle;
    // jobName = "XMP_Example_2003";
    // keywords = ["animal", "mineral", "vegetable"];
    //The metadata preferences object also includes the read-only
    //creator, format, creationDate, modificationDate, and serverURL
    //properties that are automatically entered and maintained by InDesign.
    //Create a custom XMP container, "email"
    //var myNewContainer = createContainerItem("http://ns.adobe.com/xap/1.0/", "email");
    //setProperty("http://ns.adobe.com/xap/1.0/", "email/*[1]", "someone@adobe.com");
  }
}

function setAltText() {
  // Sets all alt text to XMP:Description
  // Loop thru all image objects
  for (i = 0; i < app.activeDocument.allGraphics.length; i++) {
    img = app.activeDocument.allGraphics[i]
    img.parent.objectExportOptions.altTextSourceType = SourceType.SOURCE_XMP_DESCRIPTION;
  }
}
// Perform text-based search and replaces
// function ripped from Adobe example;

// function myFindGrep(myObject, myFindPreferences, myChangePreferences, myFindChangeOptions) {
//     //Reset the find/change grep preferences before each search.
//     app.changeGrepPreferences = NothingEnum.nothing;
//     app.findGrepPreferences = NothingEnum.nothing;
//     var myString = "app.findGrepPreferences.properties = " + myFindPreferences + ";";
//     myString += "app.changeGrepPreferences.properties = " + myChangePreferences + ";";
//     myString += "app.findChangeGrepOptions.properties = " + myFindChangeOptions + ";";
//     app.doScript(myString, ScriptLanguage.javascript);
//     var myFoundItems = myObject.changeGrep();
//     //Reset the find/change grep preferences after each search.
//     app.changeGrepPreferences = NothingEnum.nothing;
//     app.findGrepPreferences = NothingEnum.nothing;
// }

// Replaces paragraph styles by deleting them
function replaceParaStyle(before, after) {
  try {
    //$.write(myDoc.allParagraphStyles.item(after));
    //var afterStyle = app.activeDocument.paragraphStyles.item(after);
    var styleObjectBefore = getStyleByFQN(before, app.activeDocument);
    var styleObjectID = styleObjectBefore.id; // use the ID to remap styles
    var styleObjectAfter = getStyleByFQN(after, app.activeDocument);
    // You can get the style FQN when you have a style object like this.
    // var styleFQN = getStyleFullyQualifiedName(styleObjectAfter);
    app.activeDocument.paragraphStyles.itemByID(styleObjectID).remove(styleObjectAfter);
  } catch (e) {
    alert(e);
  }
}

function replaceCharStyle(before, after) {
  try {
    //$.write(myDoc.allParagraphStyles.item(after));
    //var afterStyle = app.activeDocument.paragraphStyles.item(after);
    var styleObjectBefore = getCharStyleWithFQN(before, app.activeDocument);
    var styleObjectID = styleObjectBefore.id; // use the ID to remap styles
    var styleObjectAfter = getCharStyleWithFQN(after, app.activeDocument);
    // You can get the style FQN when you have a style object like this.
    // var styleFQN = getStyleFullyQualifiedName(styleObjectAfter);
    app.activeDocument.paragraphStyles.itemByID(styleObjectID).remove(styleObjectAfter);
  } catch (e) {
    alert(e);
  }
}

// Function from 
// https://stackoverflow.com/posts/24831911/revisionsv
// getStyleFullyQualifiedName allow you to retrieve the style FQN,
// by providing a style object. Combine the name of the style and
// groups together separated by pipe (|).
function getStyleFullyQualifiedName(object) {
  var objectName = object.name;
  if (object.parent.constructor.name != "Document") {
    return getStyleFullyQualifiedName(object.parent) + "|" + objectName;
  }
  return objectName;
}

function getStyleByFQN(paragraphStyleFQN, document) {
  var tmp = paragraphStyleFQN.split("|");

  var object = document;

  for (i = 0; i < (tmp.length - 1); i++) {
    if (object.isValid) {
      object = object.paragraphStyleGroups.itemByName(tmp[i]);
    } else {
      throw "Error: can't find style" + paragraphStyleFQN;
      return false;
    }
  }
  if (!object.isValid) {
    throw "Error: can't find style" + paragraphStyleFQN;
    return false;
  }
  object = object.paragraphStyles.itemByName(tmp[(tmp.length - 1)]);
  if (!object.isValid) {
    throw "Error: can't find style" + paragraphStyleFQN;
    return false;
  }
  return object;
}

function getCharStyleFQN(object) {
  var objectName = object.name;

  if (object.parent.constructor.name != "Document") {
    return getStyleFullyQualifiedName(object.parent) + "|" + objectName;
  }

  return objectName;
}

function getCharStyleWithFQN(styleFQN, document) {
  var tmp = styleFQN.split("|");
  var object = document;
  for (i = 0; i < (tmp.length - 1); i++) {
    if (object.isValid) {
      object = object.characterStyleGroups.itemByName(tmp[i]);
    } else {
      throw "Invalid char style name.";
    }
  }
  if (!object.isValid) {
    throw "Invalid char style object";
  }
  object = object.characterStyles.itemByName(tmp[(tmp.length - 1)]);
  if (!object.isValid) {
    throw "Invalid char style";
  }
  return object;
}

function findChangeBasicPara() {
  app.findGrepPreferences = null;
  app.findGrepPreferences.appliedParagraphStyle = "[Basic Paragraph]";
  var myResults = app.activeDocument.findGrep();
  for (i = 0; i < myResults.length; i++) {
    myResults[i].parentStory.paragraphs.nextItem(myResults[i].paragraphs[0]).appliedParagraphStyle = "";
  }
}

function processParaStyles() {
  // https://stackoverflow.com/questions/19302941/how-to-reference-styles-properly-in-indesign-scripting  
  try {
    // $.writeln("All Character Styles: ");
    // printAllCharStyles();
    // printAllParaStyles();

    // Body Paragraphs
    replaceParaStyle("Module Heading", "Body|Body Text (Base)");
    replaceParaStyle("Body Text", "Body|Body Text (Base)");
    replaceParaStyle("box", "Body|Body Text (Base)");
    replaceParaStyle("Block Text1", "Body|Body Text (Base)");
    replaceParaStyle("Normal", "Body|Body Text (Base)");
    replaceParaStyle("Normal  (Web)", "Body|Body Text (Base)");
    replaceParaStyle("Default", "Body|Body Text (Base)");
    replaceParaStyle("List Bullet", "Lists|List Bullet");
    replaceParaStyle("Multi-level List 1", "Lists|List Bullet");
    replaceParaStyle("Multi-level List 2", "Lists|List Bullet");
    replaceParaStyle("Multi-level List 2", "Lists|List Bullet");
    replaceParaStyle("List Paragraph", "Body|Body Text (Base)");
    replaceParaStyle("Slide Captions", "Asides|Aside Box - Body");
    replaceParaStyle("slide caption", "Body|Body Text (Base)");

    // Headings
    // TODO Find and replace a bunch of [basic paragraphs] to the Body Text (Base) style... 
    // findChangeBasicPara();
    replaceParaStyle("remapped|H1-remap", "Headings|Heading Lv 1");
    replaceParaStyle("remapped|H2-remap", "Headings|Heading Lv 2");
    replaceParaStyle("H2-remap", "Headings|Heading Lv 2");
    replaceParaStyle("Heading 1", "Headings|Heading Lv 1");
    replaceParaStyle("Heading 2", "Headings|Heading Lv 2");
    replaceParaStyle("Heading 2.0", "Headings|Heading Lv 2");
    replaceParaStyle("Heading 3", "Headings|Heading Lv 3");

    // Character Styles to replace
    //-------------------------------------------------------------------

    // TODO: does it work to replace with empty style???... 
    replaceCharStyle('Body Bold', 'Box');
    replaceCharStyle('Caption', 'Box');
    replaceCharStyle('Heading 1 Char', 'Box');
    replaceCharStyle('Body', 'Box');
    replaceCharStyle('Styles for Word/RTF Imported Lists|Word Imported List Style1', 'Box');
    replaceCharStyle('Styles for Word/RTF Imported Lists|Word Imported List Style2', 'Box');
    replaceCharStyle('10 pt Body Bold White', 'Box');
    replaceCharStyle('10 pt Body Bold Black', 'Box');
    replaceCharStyle('Box', ''); //hopefully just delete box style after all are reassigned
    //replaceParaStyle("Heading 1", "Heading Lv 1");
    //replaceParaStyle("H2-remap", "Heading Lv 2");
    //replaceParaStyle("Normal (Web)", "Body Text (Base)");
    var boxStyleObject = getCharStyleWithFQN('Box', app.activeDocument);
    var boxStyleID = boxStyleObject.id;
    app.activeDocument.paragraphStyles.itemByID(boxStyleID).remove();
  } catch (e) {
    // Throw error if paragraph styles
    throw e;
  }
}

// Grabbed from
// https://indesignsecrets.com/finding-empty-text-frames-in-indesign.php
function removeEmptyFrames() {
  var myStories = app.activeDocument.stories.everyItem().getElements();
  for (i = myStories.length - 1; i >= 0; i--) {
    var myTextFrames = myStories[i].textContainers;
    for (j = myTextFrames.length - 1; j >= 0; j--) {
      if (myTextFrames[j].contents == "") {
        myTextFrames[j].remove();
      }
    }
  }
}

function removeAllGraphicLines() {
  myLines = myDoc.graphicLines;
  // loop thru all lines
  for (i = myLines.length - 1; i >= 0; i--) {
    // delete all the graphic lines...
    myLines[i].remove();
  }
}

function assignGraphicAsides() {
  var theObjectStyle = myDoc.objectStyles.itemByName("AsideGraphic");

  function applyStyleTo(img) {
    // https://forums.adobe.com/message/5718509#5718509
    img.applyObjectStyle(theObjectStyle);
    // alert(img.itemLink.name);
  }

  // https://forums.adobe.com/thread/885625

  for (i = 0; i < app.activeDocument.allGraphics.length; i++) {
    // Advisable to do some pre-selection here  
    // For example:  
    //if (app.activeDocument.allGraphics[i].imageTypeName != "TIFF")  
    //{
    activeGraphicFrame = app.activeDocument.allGraphics[i].parent;
    // alert(activeGraphicFrame.pref);
    // //if (activeGraphicFrame.values[0] )
    applyStyleTo(activeGraphicFrame);
    //}  
  }
}

// Book Processing
// https://www.indesignjs.de/extendscriptAPI/indesign-latest/#Book.html#d1e59880__d1e60493
function orchestrateBook() {
  try {
    $.writeln("Running orchestrateBook...");
    myBook = app.activeBook;
    //changeCondition();
    makeVersion('Instructor Guide');
    makeVersion('Participant Guide');
    //myBook.updateAllCrossReferences();
  } catch (e) {
    alert(e);
  }

}

function exportPDFBook(postfix) {
  $.writeln("Initializing exportPDFBook...");
  // myBook.exportFile(ExportFormat.INTERACTIVE_PDF, 'file.pdf');
  myBook.exportFile(ExportFormat.PDF_TYPE,
                    File(app.books[0].filePath + "/" + app.books[0].name.replace(".indb", "-" + postfix + ".pdf")), false);
}

function syncBook() {
  $.writeln("Initializing syncBook...");
  myBook.synchronize();
}

function setupPDFExportPreferences() {
  var presetName = 'FEMA-508';
  // TODO: Figure out what features to enable for maximum PDF accessibility... // https://www.indesignjs.de/extendscriptAPI/indesign-latest/#PDFExportPreference.html
  newPref = {
    name: presetName,
    pdfDisplayTitle: PdfDisplayTitleOptions.DISPLAY_DOCUMENT_TITLE,
    includeHyperlinks: true,
    includeBookmarks: true,
    includeStructure: true,
    cropImagesToFrames: true,
    standardsCompliance: PDFXStandards.NONE,
    acrobatCompatibility: AcrobatCompatibility.ACROBAT_8,
    defaultDocumentLanguage: 'en',
    optimizePDF: true,
    generateThumbnails: false,
    // Compression Settings
    compressTextAndLineArt: true,
    colorBitmapCompression: BitmapCompression.AUTO_COMPRESSION,
    colorBitmapQuality: CompressionQuality.HIGH,
    colorBitmapSampling: Sampling.BICUBIC_DOWNSAMPLE,
    colorBitmapSamplingDPI: 96,
    grayscaleBitmapSamplingDPI: 96,
    grayscaleBitmapSampling: Sampling.BICUBIC_DOWNSAMPLE,
    grayscaleBitmapQuality: CompressionQuality.MEDIUM,
    grayscaleBitmapCompression: BitmapCompression.AUTOMATIC_JPEG_2000,
    // thresholdToCompressColor : 1.0,
    monochromeBitmapCompression: MonoBitmapCompression.CCIT4,
    monochromeBitmapSamplingDPI: 96,
    // thresholdToCompressMonochrome : 10,
    monochromeBitmapCompression: MonoBitmapCompression.CCIT4,
    monochromeBitmapSampling: Sampling.BICUBIC_DOWNSAMPLE
  };
  try {
    selectedPreset = app.pdfExportPresets.itemByName(presetName);
    if (app.pdfExportPresets.itemByName(presetName).isValid) {
      app.pdfExportPresets.itemByName(presetName).remove();
    }
    app.pdfExportPresets.add(newPref);
  } catch (e) {
    alert(e);
  }
}

function makeVersion(version) {
  $.writeln('Making ' + version + '...')
  if (version == 'Instructor Guide') {
    changeCondition(version, true);
    changeCondition('Participant Guide', false);

  } else if (version == 'Participant Guide') {
    changeCondition(version, true);
    changeCondition('Instructor Guide', false);

  } else {
    return false;
  }
  syncBook();
  exportPDFBook(version);
  return true;
}

// Change condition for the desired output...
function changeCondition(conditionName, bool) {
  myCond = app.activeDocument.conditions.itemByName(conditionName.toString());
  myCond.visible = bool;
}

function clearOverrides() {
  // Clear All Overrides
  // Written by TAW. (c) 2014 by Bookraft Solutions, Israel (Id-Extras.com)
  // Please do not delete this copyright notice.

  var myOverrideType = OverrideType.ALL;
  // var myOverrideType = OverrideType.CHARACTER_ONLY;
  // var myOverrideType = OverrideType.PARAGRAPH_ONLY;

  var allStories = app.activeDocument.stories.everyItem();

  // Remove overrides from all stories
  try {
    allStories.clearOverrides(myOverrideType);
  } catch (e) {
    alert("No stories!")


    // Remove overrides from all footnotes
    try {
      allStories.footnotes.everyItem().texts.everyItem().clearOverrides(myOverrideType);
    } catch (e) {
      alert("No footnotes!")
    }

    // // Remove overrides from all table
    // try {
    //     allStories.tables.everyItem().cells.everyItem().paragraphs.everyItem().clearOverrides(myOverrideType);
    // } catch (e) {
    //     alert("No tables!")
    // }

    alert("Overrides cleared!");
  }
}

  function findReplaceText() {

  }

  // clearOverrides();
  // // Run the task functions
  // updateMetadata// ("FEMA", "Course Title");
  // removeEmptyFrames();
  // removeAllGraphicLines();
  // // orchestrateBook();
  // // assignGraphicAsides();
  // processParaStyles();
  // setupPDFExportPreferences();

  // reset script preferences and interaction...
  app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
  scriptWindow.show();
  alert("Finished script");




function createWindow() {
  var windowOptions = new Window('dialog');

  // Create the checklist group
  var groupTasks = windowOptions.add('panel');
  groupTasks.alignChildren = 'left';

  // create task checklist
  var task_processParaStyles = groupTasks.add('checkbox', undefined, 'Replace Paragraph Styles');
  task_processParaStyles.value = true;
  // create task buttons
  var okButton = windowOptions.add('button', undefined, 'Execute tasks');
  var generateBookPDF = windowOptions.add('button', undefined, 'Generate book PDFs');

  generateBookPDF.onClick = function() {
    $.writeln('Generating PDF files from book...');
    orchestrateBook();
  }


  // Event handlers
  okButton.onClick = function() {
    // When clicked, check each box and run the functions corresponding
    if (task_processParaStyles.value) {
      processParaStyles();
      alert('enabled ' + task_processParaStyles.value);
    }
    windowOptions.close();
  }
  // return the window at the end...
  return windowOptions;
}


