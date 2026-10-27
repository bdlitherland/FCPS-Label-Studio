/**
 * Glen Forest Label Studio - Google Apps Script (Code.gs)
 * 
 * This script allows Glen Forest Label Studio to run directly inside Google Sheets
 * as a Sidebar, Dialog, or standalone Web App.
 */

// 1. Create Custom Menu in Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Glen Forest Label Studio')
    .addItem('Open Label Studio (Modal Dialog)', 'showDialog')
    .addItem('Open Label Studio (Sidebar)', 'showSidebar')
    .addSeparator()
    .addItem('Export Active Sheet to Label Studio', 'showDialog')
    .addToUi();
}

// 2. Open as Modal Dialog (Recommended for printing labels)
function showDialog() {
  var html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(1050)
    .setHeight(750)
    .setTitle('Glen Forest Label Studio');
  SpreadsheetApp.getUi().showModalDialog(html, 'Glen Forest Label Studio');
}

// 3. Open as Sidebar (Great for fast data editing)
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Glen Forest Label Studio');
  SpreadsheetApp.getUi().showSidebar(html);
}

// 4. Web App Entry Point (for standalone Web App deployments)
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Glen Forest Label Studio')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 5. Server-Side Data Helpers (called via google.script.run in frontend)

/**
 * Fetch student roster data directly from the active Google Sheet tab
 */
function getRosterFromSheet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];

    var headers = data[0].map(function(h) { return String(h).trim(); });
    var rows = data.slice(1);

    return rows.map(function(row, index) {
      var obj = {};
      headers.forEach(function(header, colIdx) {
        obj[header] = row[colIdx];
      });
      return {
        id: obj.id || String(index + 1),
        studentName: obj.studentName || obj.Name || obj['Student Name'] || '',
        studentId: String(obj.studentId || obj.ID || obj['Student ID'] || ''),
        grade: String(obj.grade || obj.Grade || ''),
        staffName: obj.staffName || obj.Teacher || obj['Staff Name'] || '',
        password: String(obj.password || obj.Password || ''),
        barcode: String(obj.barcode || obj.studentId || obj.ID || ''),
        roomNumber: String(obj.roomNumber || obj.Room || obj['Room Number'] || ''),
        hasSleeve: String(obj.hasSleeve || 'Yes'),
        hasCharger: String(obj.hasCharger || 'Yes'),
        hasLaptop: String(obj.hasLaptop || 'Yes'),
        attendingSummerPrograms: String(obj.attendingSummerPrograms || 'No'),
        deviceCheckedOutForSummer: String(obj.deviceCheckedOutForSummer || 'No'),
        updatedAt: obj.updatedAt || new Date().toISOString().split('T')[0],
        updatedBy: obj.updatedBy || Session.getActiveUser().getEmail() || 'Sheet User'
      };
    });
  } catch (err) {
    Logger.log('Error reading sheet: ' + err.toString());
    return [];
  }
}

/**
 * Get current logged in user email
 */
function getUserEmail() {
  return Session.getActiveUser().getEmail();
}
