const {
    absoluteOrRelativePath,
    checkPath,
    getLinksMd,
    getStatus,
    arrayOfMd,
  } = require("./index.js");
  
  const mdLinks = (path, options = {}) => {
    return new Promise((resolve, reject) => {
      if(checkPath(path)){
        const absolutePath = absoluteOrRelativePath(path)
        const mdFilesArr = arrayOfMd(absolutePath);
        if(mdFilesArr.length >= 1){
        const linksArr = getLinksMd(absolutePath);
          if(linksArr.length >= 1 && options.validate) {
            resolve((getStatus(linksArr)))
          } if (linksArr.length >= 1 && options.validate != true){
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