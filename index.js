const http = require('http');
var parser = require('ble-ad-parser');

const OFFSET_LEN        = 2;
const OFFSET_ADV_TYPE   = 4;
const OFFSET_MAC        = 6;
const OFFSET_RSSI       = 18;
const OFFSET_ADV_DATA   = 20;

function isIbeacon(packet) {
    console.log(packet);
}

const server = http.createServer((req, res) => {
    const chunks = [];
    let size = 0;

    req.on('data', (chunk) => {
        chunks.push(chunk);
        size += chunk.length;
    });

    req.on('end', () => {
        let data = null;
        switch (chunks.length) {
            case 0: data = chunks[0];
                break;
            case 1: data = chunks[0];
                break;
            default:
                data = new Buffer(size);
                for (let i = 0, pos = 0, len = chunks.length; i < len; i++) {
                    const chunk = chunks[i];
                    chunk.copy(data, pos);
                    pos += chunk.length;
                }
                break;
        }
        data = data.toString('hex');
        const head = decodeURIComponent(data.match(/^7b\S+0d0a0d0a/)[0].replace(/(\w{2})/g, '%$1'));
        data = data.replace(head, '');
        data = data.replace(/(0d0a)/gm, '$1\n');
        const bles = data.match(/fe\w+0d0a/gm);
        console.log(head)   // meta data
        console.log(bles)   // advertisement data
        var frame;
        for (var i = 0; i < bles.length; i++) {
            frame = bles[i];
            var dataLen = parseInt(frame.substr(OFFSET_LEN, 2), 16);
            var rssi = parseInt(frame.substr(OFFSET_RSSI, 2), 16) - 256;
            var mac = frame.substr(OFFSET_MAC, 12);
            // parse advertisement data
            var advDataLen = (frame.length - OFFSET_ADV_DATA - 4) / 2;
            var advArray = [];
            advArray.push(advDataLen);
            for (var j = OFFSET_ADV_DATA; j < frame.length - 4; j+= 2) {
                advArray.push(parseInt(frame.substr(j, 2), 16));
            }
            var payload = new Buffer(advArray);
            var packets = parser.parse(payload);
            console.log(packets);
        }
        res.end('post')
    });
});

server.listen(8000);

