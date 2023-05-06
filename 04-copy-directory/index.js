const path = require('path');
const fs = require('fs/promises');
const folderCurrent = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

async function copyFolder(folderCurrent, folderCopy) {
  await fs.rm(folderCopy, { recursive: true, force: true });
  await fs.mkdir(folderCopy, { recursive: true });
  fs.readdir(folderCurrent, { withFileTypes: true })
    .then(items => {
      items.forEach(item => {
        if (item.isFile()) {
          fs.copyFile(path.join(folderCurrent, item.name), path.join(folderCopy, item.name));
        }
        else if (item.isDirectory()) {
          fs.mkdir(path.join(folderCurrent, item.name), { recursive: true });
          copyFolder(path.join(folderCurrent, item.name), path.join(folderCopy, item.name));
        }
      });
    });
}
copyFolder(folderCurrent, folderCopy);