const fs = require('fs');
const content = fs.readFileSync('explore/game/com-activision-callofduty-shooter.php', 'utf8');

// Find all occurrences of get-the-game-down
let idx = content.indexOf('get-the-game-down');
while (idx !== -1) {
    console.log(`Found get-the-game-down at: ${idx}`);
    // Check if it's in HTML (i.e. not inside <style>)
    const prefix = content.substring(idx - 50, idx);
    console.log(`Prefix: ${prefix.replace(/\n/g, ' ')}`);
    console.log(`Snippet: ${content.substring(idx, idx + 300).replace(/\n/g, ' ')}`);
    idx = content.indexOf('get-the-game-down', idx + 1);
}
