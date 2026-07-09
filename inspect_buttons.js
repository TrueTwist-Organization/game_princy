const fs = require('fs');
const content = fs.readFileSync('explore/game/com-activision-callofduty-shooter.php', 'utf8');

const downIdx = content.indexOf("get-the-game-down");
if (downIdx !== -1) {
    console.log("SURROUNDING GET-THE-GAME-DOWN:");
    console.log(content.substring(downIdx - 1000, downIdx + 500));
} else {
    console.log("get-the-game-down not found!");
}
