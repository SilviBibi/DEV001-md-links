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


let relativePath = "./OtroDirectorio/examples/example.md";
let relativePathIncorrect = "./OtroDirectorio/examples/noExisto.md";
let relativePathTxt = "./OtroDirectorio/examples/example.txt";
let relativePathDirectory = "./OtroDirectorio";
let absolutePath = path.resolve(relativePath);
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
]; 

// test function absoluteOrRelativePath and checkPath;
describe("Path verification", () => {
  it("When the route is absolute it has no changes", () => {
    expect(absoluteOrRelativePath(absolutePath)).toBe(absolutePath);
  });
  it("When the path is relative it must be changed to absolute", () => {
    expect(absoluteOrRelativePath(relativePath)).toBe(absolutePath);
  });
  it("Check if the path exists", () => {
    expect(checkPath(absolutePath)).toBe(true);
  });
  it("It should return message when the route does not exist", () => {
    expect(() => {
      checkPath(absolutePathIncorrect);
    }).toThrow("The path does not exist");
  });
});

// test function validateExtFile;
describe("Should return the extension of the path", () => {
  it("When the path is .txt", () => {
    expect(validateExtFile(absolutePathTxt)).toBe(".txt");
  });
  it("When the path is .md", () => {
    expect(validateExtFile(absolutePath)).toBe(".md");
  });
});

// test function arrayOfMd y pathIsDirectory;
describe("Should add .md files to an array or return an empty array if not find .md files", () => {
  it("Add .md path to the array", () => {
    expect(typeof arrayOfMd(absolutePath)).toEqual("object");
  });
  it("Returns an empty array for not finding .md files", () => {
    expect(arrayOfMd(absolutePathTxt)).toStrictEqual([]);
  });
  it("Returns true if the path is a directory", () => {
    expect(pathIsDirectory(absolutePathDirectory)).toBe(true);
  });
  it("Returns false if the path not is a directory", () => {
    expect(pathIsDirectory(absolutePath)).toBe(false);
  });
  it("Returns the quantity of elements of an array", () => {
    expect(arrayOfMd(absolutePathDirectory).length).toBe(3);
  });
});

// test function readFileMd;
describe("Should return a resolved or rejected promise", () => {
  it("Should returns an object with the element", () => {
    readFileMd(absolutePath).then((result) => {
      expect(Object.keys(result).length).toEqual(2);
    });
  });
  it("Should returns an empty array", () => {
    readFileMd(emptyMdFile).then((result) => {
      expect(Object.keys(result).length).toEqual(0);
    });
  });
});

// Test for getLinksMd

describe('getLinksMd', () => {
  it('Should return an array of objects with links information', () => {
    expect(getLinksMd(directoryPath)).toEqual(linksArr);
  });
});

// Test for getStatus
describe('Should validate the status of the links', () => {
  it('Should be status: 200 and message: OK when valid links', () => {
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
  it('Should be status: FAIL and message: NOT FOUND when they are not valid links', () => {
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