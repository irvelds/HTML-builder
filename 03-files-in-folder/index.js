const path = require('path');
const fs = require('fs/promises');
const targetDir = path.join(__dirname, 'secret-folder');

async function readDir() {
  const files = await fs.readdir(targetDir, { withFileTypes: true });
  files.forEach(file => {
    if (file.isFile()) {
      try {
        fs.stat(path.join(targetDir, file.name))
          .then(stats => {
            console.log(`${path.parse(file.name).name} - ${(path.parse(file.name).ext).slice(1)} - ${Number(stats.size / 1024).toFixed(2)}kb`);
          });
      }
      catch (error) {
        console.log('Сan\'t read the file');
      }
    }
  });
}

readDir();