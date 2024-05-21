const express = require('express');
const path = require('path');
const readXlsxFile = require('read-excel-file/node');
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
const port = 3000;

// Configura EJS como el motor de visualización
app.set('view engine', 'ejs');

// Configura para acceder archivos estatico
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para la página principal
app.get('/', async (req, res) => {
  
    try {
        
        // pathName = path.join(__dirname, 'files', 'prueba.xlsx');

        // const data = await leerArchivoExcel(pathName)
        res.render('index', { title: 'Mi formulario' });

    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

});

app.get('/data', async (req, res) => {

    try {
        
        pathName = path.join(__dirname, 'files', 'prueba.xlsx');

        const data = await leerArchivoExcel(pathName)
        //console.log('La data:', data)
        res.json(data)

    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

})

app.post('/solicitar', async (req, res) => {

  const { nombre, area, informacion, resultado } = req.body;
  const archivo = await leerArchivoExcel(pathName);
  const fecha = new Date().toISOString();

  const registro = `Fecha: ${fecha}, Nombre: ${nombre}, Área: ${area}, Información: ${informacion}, Opción: ${resultado}\n`;

    fs.appendFile('historial.txt', registro, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        console.log('Registro añadido correctamente en el historial.');
    })

  const padre = archivo.padres.find( item => item[1] === informacion )

  if ( padre[2] === 'P/N' ) {
    return res.json({ message: 'Datos recibidos correctamente', data: padre });
  }
  
  const hijo = archivo.hijos.find( item => item[1] === resultado && item[0] === padre[0] )
  // Enviar una respuesta al cliente
  res.json({ message: 'Datos recibidos correctamente', data: hijo });

});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


async function leerArchivoExcel(filePath) {
    try {
      const rows = await readXlsxFile(filePath);
      const gerencias = rows.filter( gerencia => gerencia[2] === 'A' );
      const padres = rows.filter( padre => padre[2] === 'P' );
      const soloArchivos = rows.filter( item => item[2] === 'P/N' );
      const hijos = rows.filter( hijo => hijo[2] === 'H' )

      return {
        gerencias: gerencias,
        padres: [...padres, ...soloArchivos],
        hijos: hijos
      }
    } catch (error) {
      console.error('Error al leer el archivo:', error.message);
    }
  }