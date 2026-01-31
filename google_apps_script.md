# Google Apps Script for Portfolio Project Display

This script allows your website to fetch and display projects stored in your Google Sheet.

## 1. Google Sheet Setup

Create a Google Sheet and set the following headers in the first row (Row 1):

| Column | Header | Description |
| :--- | :--- | :--- |
| **A** | `Timestamp` | Date and time of entry |
| **B** | `ProjectTitle` | Name of the project |
| **C** | `Category` | Category (e.g., Figma Design, Fullstack, Mobile) |
| **D** | `Description` | Brief summary of the work done |
| **E** | `MainImageURL` | URL of the featured image (from LinkedIn/Cloud) |
| **F** | `MoreImages` | Comma-separated URLs for the gallery |
| **G** | `TechStack` | Comma-separated list of technologies used |
| **H** | `ProjectLink` | Optional URL to the live project or repo |

---

## 2. Apps Script Code (GET Only)

1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Erase any existing code and paste the following:

```javascript
/**
 * Handles GET requests to fetch project data
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    const headers = rows.shift(); // Remove headers
    
    const projects = rows.map((row, index) => {
      let project = { id: index };
      headers.forEach((header, i) => {
        // Clean up header names to be used as JSON keys
        let key = header.toString().toLowerCase().replace(/\s/g, '');
        project[key] = row[i];
      });
      return project;
    });

    return ContentService.createTextOutput(JSON.stringify(projects))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Deployment Instructions

1. Click the **Deploy** button (top right).
2. Choose **New Deployment**.
3. Select type: **Web App**.
4. Description: `Portfolio Data API`.
5. Execute as: **Me**.
6. Who has access: **Anyone**.
7. Click **Deploy**.
8. **CRITICAL**: Copy the **Web App URL**.
