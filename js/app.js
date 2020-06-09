let DB;

//Selectores de la interfaz
const formulario = document.querySelector('form'),
     mascota = document.querySelector('#mascota'),
     nombreCliente = document.querySelector('#cliente'),
     telefono = document.querySelector('#telefono'),
     fecha = document.querySelector('#fecha'),
     hora = document.querySelector('#hora'),
     sintomas = document.querySelector('#sintomas'),
     citas = document.querySelector('#citas'),
     heacdingAdministra = document.querySelector('#administra');


//Esperar por el DOM Ready
document.addEventListener('DOMContentLoaded', () => {
     //crear la base de datos
     let crearDB = window.indexedDB.open('citas', 1);//nombre y version, siempre usar numero enteros

     //Si hay 1 error enviarlo a la consola
     crearDB.onerror = function(){
          console.log('hubo un error')
     }
     //Si todo esta bien entonces mostrar en consola y asignar la base de datos
     crearDB.onsuccess = function(){
          console.log('todo listo');

          //Asignar a la base de datos
          DB = crearDB.result;
          console.log(DB)
     }
});
