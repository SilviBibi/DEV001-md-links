const fs = require('fs');
const path = require('path')
const md = require('markdown-it');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

// Check if the path is valid with the fs existsSync() method.
// The existsSync() method returns a Boolean value.

const checkPath = (absolutePath) => {
    const path = fs.existsSync(absolutePath);
    if(path){
      return true;
    }else{
      throw new Error("The path does not exist");
    }
  };

  // Check if the path is absolute or relative with the isAbsolute method.
  // Returns a Boolean value.

const absoluteOrRelativePath = (myPath) => {
  const validatePath = path.isAbsolute(myPath);
  if (!validatePath) {
    const absolutePath = path.resolve(myPath);
    return absolutePath;
  } else {
    return myPath;
  }
}

// Check if the path is a directory, read directory and files, check ext

const pathIsDirectory = (myPath) => fs.statSync(myPath).isDirectory();
const readDirectory = (myPath) => fs.readdirSync(myPath,{ encoding: "utf-8"});
const readFile = (myPath) => fs.readFileSync(myPath,{ encoding: "utf-8"});
const validateExtFile = (myPath) => path.extname(myPath);

// Add files .md in an array.
const arrayOfMd = (absolutePath) => {
  let arrayMd = [];
  if(pathIsDirectory(absolutePath)) {
    readDirectory(absolutePath).forEach((file) => {
      let filePath = path.join(absolutePath, file);
      arrayMd = [...arrayMd, ...arrayOfMd(filePath)]; 
      // When a function calls itself, it is called recursion
    });
  }else{
    const ext = validateExtFile(absolutePath);
    if(ext === ".md"){
        arrayMd.push(absolutePath);
    }
  }
  return arrayMd;
};

// convert file to string.
const readFileMd = (absolutePath) => {
    return new Promise((resolve) => {
      const noString = fs.readFileSync(absolutePath, "utf-8");
      if (noString) {
        const content = noString.toString();
        resolve({ path: absolutePath, file: content });
      }
      else{
        resolve({});
      }
    });
  };


// Regular expressions for reading links with fetch
const getLinksMd = (myPath) => {
    let linksArray = [];
    arrayOfMd(myPath).forEach((file) => {
    const urlLinks = /\[([^\[]+)\](\(.*\))/gm;

        let linksOfFiles = readFile(file).match(urlLinks);
        if (linksOfFiles != null ) {
            let render = md().render(readFile(file));
            let readHtml = new JSDOM(render);
            linksOfFiles = readHtml.window.document.querySelectorAll('a');
            
            linksOfFiles.forEach((eachLinks) => {      
                linksArray.push({
                    href: eachLinks.href,
                    text: eachLinks.textContent,
                    file: file,
                });
            });
        }
    });
    return linksArray;
}

const getStatus = (linksArray) => {
    let promises = linksArray.map((link) => fetch(link.href)
    .then((response) => {
        if (response.status >= 200 && response.status < 400){
            return {
                ...link,
                status: response.status,
                message: response.statusText,
            }
        }      
    })
    .catch(() => {
        return {
            ...link,
            status: 'FAIL',
            message: 'NOT FOUND'
        }
    })) 
    return Promise.all(promises);
}

module.exports = {
    checkPath,
    absoluteOrRelativePath,
    readFileMd,
    getLinksMd,
    getStatus,
    arrayOfMd,
    pathIsDirectory,
    readDirectory,
    validateExtFile,
  };
