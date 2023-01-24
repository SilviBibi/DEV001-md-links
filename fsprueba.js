const fs = require('fs');

 // Leer archivos de manera sincrona
  let md= fs.readFileSync('./Pruebas/prueba.md', 'utf-8')
  console.log(md);

  // Leer archivos de manera sincrona
  let md2= fs.readFileSync('./OtroDirectorio/archivo.txt', 'utf-8')
  console.log(md2);

 // Leer archivos de manera asíncrona
fs.readFile('./Pruebas/Otromd.md', 'utf-8', (error, texto) => {    
         if(error) {
        console.log(error);
      } else {
        console.log(texto);
      }  
});
  
 // Leer directorios de manera síncrona
const dirSync = fs.readdirSync('./Pruebas');
console.log(dirSync);

// Leer directorios de manera asíncrona
const dirAsync = fs.readdir('./OtroDirectorio', (error, texto) =>{
  if(error) {
    console.log(error);
  }else {
    console.log(texto)
  }
});