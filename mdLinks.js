const {
    absoluteOrRelativePath,
    checkPath,
    getLinksMd,
    getStatus,
    arrayOfMd,
  } = require("./index.js");
  
  const mdLinks = (path, options = {}) => {
    return new Promise((resolve, reject) => {
      // Check if path exists
      if(checkPath(path)){
        // Turn path into absolute
        const absolutePath = absoluteOrRelativePath(path)
        // Check if path is a directory, read directory/or file, and get .md files
        const mdFilesArr = arrayOfMd(absolutePath);
        if(mdFilesArr.length >= 1){
        // Read files and extract links
        const linksArr = getLinksMd(absolutePath);
          if(linksArr.length >= 1 && options.validate) {
            resolve((getStatus(linksArr)))
          } else if (linksArr.length >= 1 && options.validate != true){
            resolve((getLinksMd(absolutePath)))
          } else {
            reject(new Error ('No links found.'))
          }
        } else {
          reject(new Error ('No Markdown files found.'))
        }
      } else {
        reject(new Error ('Invalid path.'));
      }
    })
  }

// mdLinks('C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\README.md')
// .then(response => console.log(response))
// .catch((error) => console.log(error));

  
  module.exports = {
    mdLinks,
  };