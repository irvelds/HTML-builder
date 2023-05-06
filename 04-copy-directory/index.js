const path = require('path');
const fs = require('fs/promises');
const folderCurrent = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

async function copyFolder() {
  await fs.rm(folderCopy, { recursive: true, force: true });
  await fs.mkdir(folderCopy, { recursive: true });
  fs.readdir(folderCurrent, { withFileTypes: true })
    .then(files => {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(folderCurrent, file.name), path.join(folderCopy, file.name));
        }
      });
    });
}
copyFolder();