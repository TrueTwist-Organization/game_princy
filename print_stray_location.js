const fs = require('fs');
const content = fs.readFileSync('explore/game/com-activision-callofduty-shooter.php', 'utf8');

const targetIndex = 29679;
console.log("EXACT SUBSTRING AROUND TARGET:");
console.log(JSON.stringify(content.substring(targetIndex - 50, targetIndex + 100)));
