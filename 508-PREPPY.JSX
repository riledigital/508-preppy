// 508-PREPPY
// Author:
// Ri Le <r.le@columbia.edu>
// Started June 2019

/*
This software is provided under the MIT License.

Copyright (c) 2019 Ri Le

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Re-map old styles to new ones
/// https://forums.adobe.com/thread/885625

// Do it all
myMain();

// myMain is the main function that encapsulates this script
// prevent scope creep and accidentally overwritting global scope
function myMain() {
    // Variable assignments for easy access
    myDoc = app.activeDocument; // Get the current document
    myBook = app.activeBook;
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

    // Replaces character styles by deleting them
    // Replaces paragraph styles by deleting them
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
        //Assuming you have a style "Heading 1" under group "Title" and "Center.
        //You can retrieve the style object like this.
        //var styleObject = getStyleByFQN("remapped|H2-remap", app.activeDocument);
        //You can get the style FQN when you have a style object like this.
        //var styleFQN = getStyleFullyQualifiedName(styleObject);
        //alert("Valid: " + styleObject.isValid + " styleFQN: " + styleFQN);
        try {
            // $.writeln("All Character Styles: ");
            // printAllCharStyles();
            // $.writeln("END ---------------- ");
            //
            // printAllParaStyles();

            // https://stackoverflow.com/questions/19302941/how-to-reference-styles-properly-in-indesign-scripting  
            // Body Paragraphs

            replaceParaStyle("box", "Body|Body Text (Base)");
            replaceParaStyle("Block Text1", "Body|Body Text (Base)");
            replaceParaStyle("Normal", "Body|Body Text (Base)");
            replaceParaStyle("Normal  (Web)", "Body|Body Text (Base)");
            replaceParaStyle("Default", "Body|Body Text (Base)");
            replaceParaStyle("Multi-level List 1", "Lists|List Bullet");
            replaceParaStyle("Multi-level List 2", "Lists|List Bullet");
            replaceParaStyle("Multi-level List 2", "Lists|List Bullet");
            replaceParaStyle("List Paragraph", "Body|Body Text (Base)");
            replaceParaStyle("Slide Captions", "Asides|Aside Box - Body");
            replaceParaStyle("slide caption", "Body|Body Text (Base)");

            // Headings
            // TODO: Figure out a way to select before style in a group using FQN
            // Find and replace a bunch of [basic paragraphs] to the Body Text (Base) style... 
            // findChangeBasicPara();
            //replaceParaStyle("[Basic Paragraph]", "Body|Body Text (Base");
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
            //replaceCharStyle('Box', 'Box');
            replaceCharStyle('Styles for Word/RTF Imported Lists|Word Imported List Style1', 'Box');
            replaceCharStyle('Styles for Word/RTF Imported Lists|Word Imported List Style2', 'Box');
            replaceCharStyle('10 pt Body Bold White', 'Box');
            replaceCharStyle('10 pt Body Bold Black', 'Box');
            /*  
            Body Bold
            Caption
            Heading 1 Char
            Body
            Box
            Styles for Word/RTF Imported Lists|Word Imported List Style1
            Styles for Word/RTF Imported Lists|Word Imported List Style2
            */

            // Character Styles to replace
            //-------------------------------------------------------------------
            //replaceParaStyle("Heading 1", "Heading Lv 1");
            //replaceParaStyle("H2-remap", "Heading Lv 2");
            //replaceParaStyle("Normal (Web)", "Body Text (Base)");
        } catch (e) {
            // Print error if paragraph styles
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
            applyStyleTo(app.activeDocument.allGraphics[i].parent);
            //}  
        }
    }

    // Book Processing
    // https://www.indesignjs.de/extendscriptAPI/indesign-latest/#Book.html#d1e59880__d1e60493
    function orchestrateBook() {
        try {
            $.writeln("Running orchestrateBook...");
            //changeCondition();
            makeVersion('Instructor Guide');
            makeVersion('Participant Guide');
            //myBook.updateAllCrossReferences();
        } catch (e) {
            alert(e);
        }

    }

    function exportPDFBook(postfix) {
        // myBook.exportFile(ExportFormat.INTERACTIVE_PDF, 'file.pdf');
        myBook.exportFile(ExportFormat.PDF_TYPE,
            File(app.books[0].filePath + "/" + app.books[0].name.replace(".indb", "-" + postfix + ".pdf")), false);
        $.writeln("Initializing exportPDFBook...");
    }

    function syncBook() {
        myBook.synchronize();
        $.writeln("Initializing syncBook...");
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
    // Run the task functions
    // updateMetadata("FEMA", "Course Title");
    // removeEmptyFrames();
    //removeAllGraphicLines();
    // orchestrateBook();
     processParaStyles();
    // assignGraphicAsides();
    // reset script preferences and interaction...
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
    alert("Finished script");
}