const http = require('http');

http.get('http://127.0.0.1:8080/explore/game/com-activision-callofduty-shooter.php', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('RESPONSE STATUS:', res.statusCode);
        console.log('RESPONSE HEADERS:', res.headers);
        console.log('FIRST 300 CHARS OF RESPONSE:');
        console.log(JSON.stringify(data.substring(0, 300)));
    });
}).on('error', (err) => {
    console.error('Request failed:', err);
});
