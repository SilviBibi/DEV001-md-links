#  Markdown Links 🔗

## Índice

* [1. Sobre la librería e instalación:](#1- Sobre la libreria e Instalación)
* [2. Proceso de desarrollo:](#2-Proceso-de-desarrollo)
* [3. Guía de uso:](#3-Guía-de-uso)
* [4. Opciones:](#4-Opciones)

 
***


## 1. Sobre la libreria e Instalación 💻
Es una libreria ejecutable con node.js, capaz de leer y analizar archivos en formato Markdown, para verificar los links que contengan y reportar algunas estadísticas. 

#### Instalación
Puedes hacer la instalación por `npm`:

```sh
npm install SilviBibi/DEV001-md-links
```

  ## 2. Proceso de desarrollo:

Como punto de partida para la ejecución de este proyecto, yo planifiqué mis tareas y objetivos, es por ello que hice un diagrama de flujo para plasmar lo que queria lograr y de que manera podía hacerlo.

[Diagrama de flujo]](./images/diagrama)


## 3. Guía de uso 📖
En tu terminal, puedes ejecutar "md-links" y agregar una ruta, verás en tu **consola o terminal**, la ruta del archivo, link y el texto que tiene el enlace. 
<code> md-links < path > </code>
  
* `href`: URL encontrada.
* `text`: Texto que aparecía dentro del link (`<a>`).
* `file`: Ruta del archivo donde se encontró el link.
  

## 4. Opciones
  <code> --validate </code> <code> --stats </code> <code> --validate --stats </code> <code> --stats --validate </code> 

### Validar
#### --validate
Si ingresas la opción <code> --validate </code> podrás ver el status de tus links
 
* `href`: URL encontrada.
* `text`: Texto que aparecía dentro del link (`<a>`).
* `file`: Ruta del archivo donde se encontró el link.
* `status`: Código de respuesta HTTP.
* `ok`: Mensaje `fail` en caso de fallo u `ok` en caso de éxito.

### Estadísticas
#### --stats
Si ingresas la opción <code> --stats </code> podrás ver estadísticas básicas sobre los links.

### Estadísticas y validación
#### --validate --stats o --stats --validate
También se puedes ingresar <code> --validate --stats </code>  o <code> --stats --validate </code> para obtener estadísticas que necesiten de los resultados de la validación.

### Ayuda
#### --help
Tambien puedes ingresar <code> md-links --help </code> para obtener ayuda con respecto a la forma de uso de ésta libreria.
  

   **Autor**
  [Silvia Falcón](https://github.com/SilviBibi/DEV001-md-links)
  
