const http = require('http');
var parser = require('ble-ad-parser');

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
    console.log(head)   // 元数据
    console.log(bles)   // 扫描到的蓝牙设备数据
    res.end('post')
  });
});

//server.listen(8000);

 
// Payload from your BLE device (make it into a buffer, if not already)
/*
var payload = new Buffer([27, 2, 1, 6, 17, 6, 186, 86, 137, 166, 250, 191, 162, 189, 1, 70, 125, 110, 56, 88, 171, 173, 5, 22, 10, 24, 7, 4]);
 
// Parse (little-endian by default)
var packets = parser.parse(payload);
 
// 
console.log(packets.length); // 3
console.log(packets[0].type); // Flags
console.log(packets[0].data); //  [ 'LE Limited Discoverable Mode' ]
 
console.log(packets[1].type); // 'Incomplete List of 128-bit Service Class UUIDs'
console.log(packets[1].data); // [ '0xba5689a6fabfa2bd01467d6e3858abad' ] 

console.log(packets[2].type); 
console.log(packets[2].data);
*/
