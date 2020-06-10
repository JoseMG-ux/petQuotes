let DB;

//Selectores de la interfaz
const form = document.querySelector('form'),
     nombreMascota = document.querySelector('#mascota'),
     nombreCliente = document.querySelector('#cliente'),
     telefono = document.querySelector('#telefono'),
     fecha = document.querySelector('#fecha'),
     hora = document.querySelector('#hora'),
     sintomas = document.querySelector('#sintomas'),
     citas = document.querySelector('#citas'),
     headingAdministra = document.querySelector('#administra');


//Esperar por el DOM Ready
document.addEventListener('DOMContentLoaded', () => {
     //crear la base de datos
     let crearDB = window.indexedDB.open('citas', 1);//nombre y version, Para la version siempre debee usar numero entero

     //Si hay 1 error enviarlo a la consola
     crearDB.onerror = function(){
          console.log('hubo un error');
     }
     //Si todo esta bien entonces mostrar en consola y asignar la base de datos
     crearDB.onsuccess = function(){
          //console.log('todo listo');

          //Asignar a la base de datos
          DB = crearDB.result;//Muestra la DB en la pestaña aplicacion en la opcion IndexedDB
          mostrarCitas();
     };

     //Este metodo solo corre una vez y es ideal para crear el Schema de la DB
     crearDB.onupgradeneeded = function(e){
          //El evento es la misma DB
          let db = e.target.result;

          //Definir el object store, toma 2 parametros: nombre de DB y las opciones.
          //Keypath es el indice de la base de datos
          let objectStore = db.createObjectStore('citas', {keyPath:'key', autoIncrement: true});

          //Crear los indices y campos de la DB, createIndex: 3 parametros, nombre, keypath y opciones.
          objectStore.createIndex('mascota','mascota',{ unique : false });//Indice para mascota
          objectStore.createIndex('cliente','cliente',{ unique : false });//Indice para el cliente
          objectStore.createIndex('telefono','telefono',{ unique : false });//Indice para el telefono
          objectStore.createIndex('fecha','fecha',{ unique : false });//Indice para la fecha
          objectStore.createIndex('hora','hora',{ unique : false });//Indice para la hora
          objectStore.createIndex('sintomas','sintomas',{ unique : false });//Indice para sintomas
          
          
     }
     //Cuando el form se envia
     form.addEventListener('submit', agregarDatos);

     function agregarDatos(e){
          e.preventDefault();

          const nuevaCita = {
               mascota : nombreMascota.value,
               cliente : nombreCliente.value,
               telefono : telefono.value,
               fecha : fecha.value,
               hora : hora.value,
               sintomas : sintomas.value
          };
          //console.log(nuevaCita)

          //En IndexedDB se utilizan las transacciones

          let transaction = DB.transaction(['citas'], 'readwrite');
          let objectStore = transaction.objectStore('citas');
          console.log(objectStore)
          //Enviamos una peticion
          let peticion = objectStore.add(nuevaCita);
          console.log(peticion);
     
          peticion.onsuccess = () =>{
               form.reset();
          }
          transaction.oncomplete = () =>{
               console.log('Cita agregada');
               mostrarCitas();
          }
          transaction.onerror = () => {
               console.log('Hubo un error!');
          }
     }

     function mostrarCitas(){
          //Eliminar citas anteriores 
          while(citas.firstChild){
               citas.removeChild(citas.firstChild)
          }

          //Creamos un objectSTORE
          let objectStore = DB.transaction('citas').objectStore('citas');

          //Esto retorna una peticion
          objectStore.openCursor().onsuccess = function(e){
               //Cursos se va a ubicar en el registro indicado para acceder a los datos
               let cursor = e.target.result;

               //console.log(cursor);
               if(cursor){
                    let citaHTML = document.createElement('li');
                    citaHTML.setAttribute('data-cita-id', cursor.value.key);
                    citaHTML.classList.add('list-group-item');

                    citaHTML.innerHTML =`
                    <p class="font-weight-bold">Mascota: <span class="font-weight-normal">${cursor.value.mascota}</span></p>
                    <p class="font-weight-bold">Cliente: <span class="font-weight-normal">${cursor.value.cliente}</span></p>
                    <p class="font-weight-bold">Telefono: <span class="font-weight-normal">${cursor.value.telefono}</span></p>
                    <p class="font-weight-bold">Fecha: <span class="font-weight-normal">${cursor.value.Fecha}</span></p>
                    <p class="font-weight-bold">Hora: <span class="font-weight-normal">${cursor.value.Hora}</span></p>
                    <p class="font-weight-bold">Sintomas: <span class="font-weight-normal">${cursor.value.sintomas}</span></p>
                    `;

                    //Append en el padre
                    citas.appendChild(citaHTML);
                    //consultar los proximos registros     
                    cursor.continue();
               }else{
                    if(!citas.firstChild){
                         //Cuando no hay registros
                         headingAdministra.textContent = 'Agrega citas para comenzar';
                         let listado = document.createElement('p');
                         listado.classList.add('text-center');
                         listado.textContent = 'No hay registros';
                         citas.appendChild(listado);
                    }else{
                         headingAdministra.textContent = 'Adminsitra tus citas'
                    }
                    
                    

               }
          }
     }
     
});
