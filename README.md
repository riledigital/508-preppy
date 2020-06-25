# 508-Preppy

This was a helper script that automates repetitive tasks in the production of course material.

It performs tasks related to [making a document accessible by US government standards](https://section508.gov).

- Sets alt text based on XMP metadata of linked images
- Find/replace styles
- Quickly updating cross-references
- Toggling between multiple versions of a document with [conditions]()

Accessibility is an essential feature, and I advise that content producers strongly consider accessibility-first Web platforms if they are interested in maximizing

- speed (in both user-side and production/dev-side)
- compatibility
- accesibility
- carbon footprint (printing)

Creating accessible PDF documents is particularly difficult due to compatibility issues and the complexity of PDF production suites.

### Caveats

The code likely does not work for your use case, but I posted it to show how some 508 tasks can be automated with ExtendScript, since it is rather difficult to find good resources on the Web for automating particular InDesign tasks.

This helper script was created as an exploratory project; thus, not all features are properly documented, and code quality is not guaranteed—nor is it a reflection of how any ExtendScript programs should be written in terms of code style/quality.

# Misc Resource Dump

"""THESE LINKS WILL GET YOU UP AND RUNNING TO START DEVELOPING SCRIPTS FOR INDESIGN"""

IDE:
VS CODE comes with two plugins required for development:

ExtendScript Debugger from Adobe
Read the set-up (very important)
https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug

ExtendScript Debugger

API DOCUMENTATION:
https://www.indesignjs.de/extendscriptAPI/indesign-latest/#about.html

HIGH-LEVEL OVERVIEW GUIDES FROM ADOBE:
https://www.adobe.com/content/dam/acom/en/devnet/indesign/sdk/cs6/scripting/InDesign_ScriptingTutorial.pdf
https://www.adobe.com/content/dam/acom/en/devnet/indesign/sdk/cs6/scripting/InDesign_ScriptingGuide_JS.pdf
https://helpx.adobe.com/indesign/using/scripting.html

SEE BUILT-IN EXAMPLES OF SCRIPTS FROM ADOBE
(COMES WITH CC)

Amazing API Documentation available at
http://jongware.mit.edu/idcsjs5.5/pc_ParagraphStyle.html

https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug

https://code.visualstudio.com/api/extension-guides/debugger-extension

https://stackoverflow.com/questions/8545497/console-log-with-photoshop-scripting-extendedscript-toolkit

https://graphicdesign.stackexchange.com/questions/56175/indesign-script-to-replace-paragraph-style

TODO: implement some of these grep replacements
https://indesignsecrets.com/favorite-grep-expressions-you-can-use.php
