const fs = require('fs');
const path = require('path')
const md = require('markdown-it');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

// Verificar si la ruta es válida con el método de fs existsSync()
// El método existsSync() devuelve un valor booleano.

const checkPath = (absolutePath) => {
    const path = fs.existsSync(absolutePath);
    if(path){
      return true;
    }else{
      throw new Error("La ruta no existe");
    }
  };

  // Verificar si la ruta es absoluta o relativa con el método isAbsolute.
  // El método isAbsolute devuelve un valor booleano.

const absoluteOrRelativePath = (myPath) => {
  const validatePath = path.isAbsolute(myPath);
  if (!validatePath) {
    const absolutePath = path.resolve(myPath);
    return absolutePath;
  } else {
    return myPath;
  }
}

// Verificar si la ruta es un directorio

const pathIsDirectory = (myPath) => fs.statSync(myPath).isDirectory();

// console.log(pathIsDirectory('C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio'));

// Si la ruta es un directorio entrar y leer archivos
const readDirectory = (myPath) => fs.readdirSync(myPath,{ encoding: "utf-8"});
// console.log(readDirectory('C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio'));

// Si la ruta es un archivo verificar la extension para saber si es txt, md, png
const readFile = (myPath) => fs.readFileSync(myPath,{ encoding: "utf-8"});
const validateExtFile = (myPath) => path.extname(myPath);

// Añadir archivos .md en un arreglo.
const arrayOfMd = (absolutePath) => {
  let arrayMd = [];
  if(pathIsDirectory(absolutePath)) {
    readDirectory(absolutePath).forEach((file) => {
      let filePath = path.join(absolutePath, file);
      arrayMd = [...arrayMd, ...arrayOfMd(filePath)]; 
      // Cuando una función se llama a si misma, se denomina paso de recursividad
    });
  }else{
    // Cuando no es un directorio, sino un archivo .md, solo leemos el archivo md y lo añadimo a un array
    const ext = validateExtFile(absolutePath);
    if(ext === ".md"){
        arrayMd.push(absolutePath);
    }
  }
  return arrayMd;
};
// console.log(arrayOfMd('C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio'));

// tenemos que convertir el archivo a String.
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

// console.log(readFileMd('C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio\\examples\\example.md'));
  
// Expresiones regulares para la lectura de links con fetch:

const getLinksMd = (myPath) => {
    let linksArray = [];
    arrayOfMd(myPath).forEach((file) => {
    const urlLinks = /\[([^\[]+)\](\(.*\))/gm;

        let linksOfFiles = readFile(file).match(urlLinks);  // El método match() devuelve todas las ocurrencias de una expresión regular dentro de una cadena.
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

// console.log(getLinksMd('C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio\\examples\\example.md'))

// Validating links
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
