const fetch = require('node-fetch');
jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

const path = require("path");
const {
  absoluteOrRelativePath,
  checkPath,
  validateExtFile,
  arrayOfMd,
  pathIsDirectory,
  readFileMd,
  getStatus,
  getLinksMd,
} = require('../index.js');


let relativePathCorrect = "./OtroDirectorio/examples/example.md";
let relativePathCorrect2 = "./OtroDirectorio/examples/example2.md";
let relativePathIncorrect = "./OtroDirectorio/examples/noExisto.md";
let relativePathTxt = "./OtroDirectorio/examples/example.txt";
let relativePathDirectory = "./OtroDirectorio";
let absolutePathCorrect = path.resolve(relativePathCorrect);
let absolutePathCorrect2 = path.resolve(relativePathCorrect2);
let absolutePathIncorrect = path.resolve(relativePathIncorrect);
let emptyMdFile = path.resolve("./OtroDirectorio/examples/empty.md");
let absolutePathTxt = path.resolve(relativePathTxt);
let absolutePathDirectory = path.resolve(relativePathDirectory);
const directoryPath = 'C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio\\examples\\example.md';  
const linksArr = [
  {
    href: 'https://es.wikipedia.org/wiki/Markdown',
    text: 'Markdown',
    file: 'C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio\\examples\\example.md'
  },
  {
    href: 'https://nodejs.org/',
    text: 'Node.js',
    file: 'C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio\\examples\\example.md'
  },
  {
    href: 'https://noexisto/',
    text: 'NoExisto',
    file: 'C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio\\examples\\example.md'
  }
]; 

// test function absoluteOrRelativePath and checkPath;
describe("Verificación de rutas", () => {
  it("La ruta absoluta no sufre cambios", () => {
    expect(absoluteOrRelativePath(absolutePathCorrect)).toBe(absolutePathCorrect);
  });
  it("¿convertir la ruta a absoluta?", () => {
    expect(absoluteOrRelativePath(relativePathCorrect)).toBe(absolutePathCorrect);
  });
  it("verificar que la ruta si existe", () => {
    expect(checkPath(absolutePathCorrect)).toBe(true);
  });
  it("verificar que la ruta no existe", () => {
    expect(() => {
      checkPath(absolutePathIncorrect);
    }).toThrow("La ruta no existe");
  });
});

// test function validateExtFile;
describe("Verificación extensión de la ruta", () => {
  it("La extensión de la ruta debe ser: .txt", () => {
    expect(validateExtFile(absolutePathTxt)).toBe(".txt");
  });
  it("La extensión de la ruta debe ser: .md", () => {
    expect(validateExtFile(absolutePathCorrect)).toBe(".md");
  });
});

// test function arrayOfMd y pathIsDirectory;
describe("Validamos extension .md de la ruta", () => {
  it("Valida que la ruta es .md y devuelve un array", () => {
    expect(typeof arrayOfMd(absolutePathCorrect)).toEqual("object");
  });
  it("Valida que la ruta no es .md y devuelve array vacio", () => {
    expect(arrayOfMd(absolutePathTxt)).toStrictEqual([]);
  });
  it("Valida si la ruta si es un directorio", () => {
    expect(pathIsDirectory(absolutePathDirectory)).toBe(true);
  });
  it("Valida si la ruta no es un directorio", () => {
    expect(pathIsDirectory(absolutePathCorrect)).toBe(false);
  });
  it("Aplica recursividad y retorna la cantidad de elementos de un array", () => {
    expect(arrayOfMd(absolutePathDirectory).length).toBe(3);
  });
});

// test function readFileMd;
describe("Leemos el archivo y retorna una promesa resuelta o rechazada", () => {
  it("Lee el archivo y retorna un objeto", () => {
    readFileMd(absolutePathCorrect).then((result) => {
      expect(Object.keys(result).length).toEqual(2);
    });
  });
  it("Devolvemos un objeto vacio en caso el archivo .md no tenga contenido", () => {
    readFileMd(emptyMdFile).then((result) => {
      expect(Object.keys(result).length).toEqual(0);
    });
  });
});

describe('getLinksMd', () => {
  it('should be a function', () => {
    expect(typeof getLinksMd).toBe('function');
  }); 

  it('should return an array containing objects with links information', () => {
    expect(getLinksMd(directoryPath)).toEqual(linksArr);
  });
});

// Test for getStatus
describe('getStatus', () => {

  it('should be a function', () => {
    expect(typeof getStatus).toBe('function');
  }); 

  it('should return an array of objects including links AND status', () => {
    fetch.mockReturnValue(Promise.resolve(new Response({status: 200, message: 'OK'})));
    const response = getStatus(linksArr);
    expect(response).resolves.toEqual([
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: 'C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio\\examples\\example.md',
        status: 200,
        message: 'OK'
      },
      {
        href: 'https://nodejs.org/',
        text: 'Node.js',
        file: 'C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio\\examples\\example.md',
        status: 200,
        message: 'OK'
      },
    ])
  });
  it('k', () => {
    fetch.mockRejectedValue(new Error({status: 'FAIL', message: 'NOT FOUND'}));
    const response = getStatus(linksArr);
    response.catch(() => {
      expect(response).resolves.toEqual([
        {
          href: 'https://noexisto/',
          text: 'NoExisto',
          file: 'C:\\Users\\asus\\Documents\\Laboratoria!\\DEV001-md-links\\OtroDirectorio\\examples\\example.md',
          status: 'FAIL',
          message: 'NOT FOUND'
        }
      ])
    });
});
});