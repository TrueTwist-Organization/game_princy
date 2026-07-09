const fs = require('fs');
const content = fs.readFileSync('explore/game/com-activision-callofduty-shooter.php', 'utf8');

// Find "Challenge your friends"
const chalIdx = content.indexOf("Challenge your friends");
if (chalIdx !== -1) {
    console.log("SURROUNDING CHALLENGE YOUR FRIENDS:");
    console.log(content.substring(chalIdx - 100, chalIdx + 1200));
} else {
    // If not found, let's find the first "Google Play" button instead
    const playIdx = content.indexOf("Google Play");
    console.log("SURROUNDING GOOGLE PLAY:");
    console.log(content.substring(playIdx - 1000, playIdx + 100));
}
