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
     let crearDB = window.indexedDB.open('citas', 1);//nombre y version, Para la version siempre usar numero entero

     //Si hay 1 error enviarlo a la consola
     crearDB.onerror = function(){
          console.log('hubo un error')
     }
     //Si todo esta bien entonces mostrar en consola y asignar la base de datos
     crearDB.onsuccess = function(){
          //console.log('todo listo');

          //Asignar a la base de datos
          DB = crearDB.result;//Muestra la DB en la pestaña aplicacion en la opcion IndexedDB
         
     }

     //Este metodo solo corre una vez y es ideal para crear el Schema de la DB
     crearDB.onupgradeneeded = function(e){
          //El evento es la misma DB
          let db = e.target.result;

          //Definir el object store, toma 2 parametros: nombre de DB y las opciones.
          //Keypath es el indice de la base de datos
          let objectStore = db.createObjectStore('citas', {keyPath:'key', autoincrement: true});

          //Crear los indices y campos de la DB, createIndex: 3 parametros, nombre, keypath y opciones.
          objectStore.createIndex('mascota','mascota',{ unique : false });//Indice para mascota
          objectStore.createIndex('cliente','cliente',{ unique : false });//Indice para el cliente
          objectStore.createIndex('telefono','telefono',{ unique : false });//Indice para el telefono
          objectStore.createIndex('fecha','fecha',{ unique : false });//Indice para la fecha
          objectStore.createIndex('hora','hora',{ unique : false });//Indice para la hora
          objectStore.createIndex('sintomas','sintomas',{ unique : false });//Indice para sintomas
          
          
     }
     //Cuando el form se envia
     formulario.addEventListener('submit', agregarDatos);

     function agregarDatos(e){
          e.preventDefault();

          const nuevaCita = {
               mascota: mascota.value,
               cliente: nombreCliente.value,
               telefono: telefono.value,
               fecha: fecha.value,
               hora: hora.value,
               sintomas: sintomas.value
          }
          console.log(nuevaCita)
     }
     
});
