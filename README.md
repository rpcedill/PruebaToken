# PruebaToken

Requisitos:
- Conexión a Internet
- Base de datos MySQL
- Nodejs
- Un navegador


## Paso 1 instalar dependencias:
- Instalar dependencias con el comnado: "npm i" en la carpeta Backend
- Instalar dependencias con el comnado: "npm i" en la carpeta Frontend


## Paso 2 configurar Base de datos:
- Ingresar la ip del servidor, usuario, contraseña y tabla a utilizar en el archivo Backend/config/database.js.
- Deberá crear la tabla previamente a usar el sistema. 

## Paso 3 Ejecutar Backend:
- Ubicarse en la carpeta Backend y ejecutar el backend con el comando "npm start". NOTA: es importante que se ejecute como localhost:3000 para su llamado en el frontend.

## Paso 4: Ejecutar Frontend:
- Ubicarse en la carpeta Frontend y ejecutar el backend con el comando "npm start".


Endpoint para uso del token 
`http://localhost:3000/usarToken?cliente=xx&token=zz`
Donde xx es el nombre del cliente y zz es el valor del token