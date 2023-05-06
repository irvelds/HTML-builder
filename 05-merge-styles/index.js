const fs = require('fs');
const path = require('path');
const styles = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist/bundle.css');
const writeStream = fs.createWriteStream(bundle);

async function createBundle() {
  const files = await fs.promises.readdir(styles, { withFileTypes: true });
  files.forEach(file => {
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const readStream = fs.createReadStream(path.join(styles, file.name), 'utf-8');
      readStream.on('data', async chunk => {
        writeStream.write(chunk);
      });
    }
  });
}
createBundle();