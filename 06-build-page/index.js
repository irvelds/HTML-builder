const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');



async function createBundle() {

  /*Create Html*/
  await fs.promises.rm(projectDist, { recursive: true, force: true });
  await fs.promises.mkdir(path.join(projectDist, 'assets'), { recursive: true });
  let components = await fs.promises.readdir(path.join(__dirname, 'components'));
  let indexHtml = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  for (let file of components) {
    let template = await fs.promises.readFile(path.join(__dirname, 'components', file));
    if (file.split('.')[1] === 'html') {
      indexHtml = indexHtml.replace(`{{${file.split('.')[0]}}}`, template.toString());
    }
    else indexHtml = indexHtml.replace(`{{${file.split('.')[0]}}}`, '');
  }
  await fs.promises.writeFile(path.join(projectDist, 'index.html'), indexHtml);

  /*Create Styles*/
  const styles = path.join(__dirname, 'styles');
  const writeStream = fs.createWriteStream(path.join(projectDist, 'style.css'), 'utf-8');
  const files = await fs.promises.readdir(styles, { withFileTypes: true });
  files.forEach(file => {
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const readStream = fs.createReadStream(path.join(styles, file.name), 'utf-8');
      readStream.on('data', async chunk => {
        writeStream.write(chunk);
      });
    }
  });

  /*Create Assets*/

  const folderCurrent = path.join(__dirname, 'assets');
  const folderCopy = path.join(projectDist, 'assets');

  async function copyFolder(folderCurrent, folderCopy) {
    await fs.promises.rm(folderCopy, { recursive: true, force: true });
    await fs.promises.mkdir(folderCopy, { recursive: true });
    fs.promises.readdir(folderCurrent, { withFileTypes: true })
      .then(items => {
        items.forEach(item => {
          if (item.isFile()) {
            fs.promises.copyFile(path.join(folderCurrent, item.name), path.join(folderCopy, item.name));
          }
          else if (item.isDirectory()) {
            fs.promises.mkdir(path.join(folderCurrent, item.name), { recursive: true });
            copyFolder(path.join(folderCurrent, item.name), path.join(folderCopy, item.name));
          }
        });
      });
  }
  copyFolder(folderCurrent, folderCopy);


}
createBundle();