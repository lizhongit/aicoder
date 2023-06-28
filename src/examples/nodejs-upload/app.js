const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const fileName = req.headers['x-file-name'];
      const filePath = path.join(__dirname, 'uploads', fileName);
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end('文件上传失败');
        } else {
          res.end('文件上传成功');
        }
      });
    });
  } else if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('读取文件失败');
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('服务器已启动，监听端口 3000');
});