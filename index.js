const express = require('express');
const app = express();
const jimp = require('jimp');
const { v4 } = require('uuid');
const fs = require('fs');

app.listen(3000, () => console.log("Servidor express activo http://localhost:3000"));

//Los estilos de este HTML deben ser definidos por un archivo CSS alojado en el servidor.
app.use('/css', express.static(`${__dirname}/assets/css/`));
app.use('/images', express.static(`${__dirname}/assets/img/`));

//El servidor debe disponibilizar una ruta raíz que devuelva un HTML con el formulario para el ingreso de la URL de la imagen a tratar.
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});

//El formulario debe redirigir a otra ruta del servidor que deberá procesar la imagen tomada por la URL enviada del formulario con el 
//paquete Jimp. 
app.get('/procesar', async (req, res) => {
    res.setHeader('Content-Type', 'image/jpg');
    let codigo = v4();
    let codigoImagen = codigo.slice(0,8)
    let ruta = req.query.ruta;
    let rutaDestino = `${__dirname}/assets/img/${codigoImagen}.jpg`; //La imagen alterada debe ser almacenada con un nombre incluya una porción de un UUID y con extensión "jpg".
    let imagen = await jimp.read(ruta);

    await imagen
        .grayscale() //La imagen debe ser procesada en escala de grises,
        .quality(60) //con calidad a un 60%
        .resize(350, jimp.AUTO) //y redimensionada a unos 350px de ancho.
        .writeAsync(rutaDestino);

    let imagenProcesada = fs.readFileSync(rutaDestino)
    res.send(imagenProcesada);
});