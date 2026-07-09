const fs = require('fs');
const content = fs.readFileSync('explore/game/com-activision-callofduty-shooter.php', 'utf8');

// Find "Editor's Review"
const reviewIdx = content.indexOf("Editor's Review");
if (reviewIdx !== -1) {
    console.log("SURROUNDING EDITOR'S REVIEW:");
    console.log(content.substring(reviewIdx - 400, reviewIdx + 100));
}

// Find "App Store"
const appStoreIdx = content.indexOf("App Store");
if (appStoreIdx !== -1) {
    console.log("\nSURROUNDING APP STORE:");
    console.log(content.substring(appStoreIdx - 400, appStoreIdx + 200));
}
