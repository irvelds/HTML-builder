const path = require('path');
const fs = require('fs');
const { stdout, stdin, stderr } = require('process');
const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Please, enter text here:\n');
stdin.on('data', chunk => {
  if (chunk.toString().trim() === 'exit') {
    process.exit();
  }
  stream.write(chunk);
});

process.on('exit', code => {
  if (code === 0) {
    stdout.write('Bye, enjoy you studying!');
  } else {
    stderr.write(`Error: ${code}`);
  }
});

process.on('SIGINT', () => {
  process.exit();
});