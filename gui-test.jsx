var windowOptions = new Window('dialog');
groupTasks.alignChildren = 'left';

// Create the checklist group
var groupTasks = windowOptions.add('panel');

// create task checklist
var task_processParaStyles = groupTasks.add('checkbox', undefined, 'Replace Paragraph Styles');

// create task buttons
var okButton = windowOptions.add('button', undefined, 'Execute tasks');
var generateBookPDF = windowOptions.add('button', undefined, 'Generate book PDFs');

// Event handlers
okButton.onClick = function() {
  // When clicked, check each box and run the functions corresponding
  if (task_processParaStyles.value) {
    processParaStyles();
    alert('enabled ' + task_processParaStyles.value);
  }
  windowOptions.close();
}

processParagraphStyles.value = true;

generateBookPDF.onClick = function() {
  $.writeln('Generating PDF files from book...');
  orchestrateBook();
}

windowOptions.show();
