let DB;

//Interface selectors
const form = document.querySelector('form'),
     nombreMascota = document.querySelector('#mascota'),
     nombreCliente = document.querySelector('#cliente'),
     telefono = document.querySelector('#telefono'),
     fecha = document.querySelector('#fecha'),
     hora = document.querySelector('#hora'),
     sintomas = document.querySelector('#sintomas'),
     citas = document.querySelector('#citas'),
     headingAdministra = document.querySelector('#administra');


//Wait for him DOM Ready
document.addEventListener('DOMContentLoaded', () => {
     //Create DB
     let crearDB = window.indexedDB.open('citas', 1);//name and version, for la version you should always use an integer

     //If there is 1 error send it to the console
     crearDB.onerror = function(){
          console.log('hubo un error');
     }
     //If everything is ok, it shows in the console and assigns the database
     crearDB.onsuccess = function(){
          //console.log('READY');

          //assign db
          DB = crearDB.result;//Show the DB in the application tab in the IndexedDB option
          mostrarCitas();
     };

     //This method only runs once and is ideal for creating the DB Schema
     crearDB.onupgradeneeded = function(e){
          //the event is the DB
          let db = e.target.result;

          //Define the object store, it takes 2 parameters: DB name and options.
          //Keypath is the index of the database
          let objectStore = db.createObjectStore('citas', {keyPath:'key', autoIncrement: true});

          //crearte indexs and fiels of the DB, createIndex: 3 parameters, name, keypath y opcions.
          objectStore.createIndex('mascota','mascota',{ unique : false });//Index for pet
          objectStore.createIndex('cliente','cliente',{ unique : false });//Index for client
          objectStore.createIndex('telefono','telefono',{ unique : false });//Index for phone
          objectStore.createIndex('fecha','fecha',{ unique : false });//Indice Index for date
          objectStore.createIndex('hora','hora',{ unique : false });//Indice Index for hour
          objectStore.createIndex('sintomas','sintomas',{ unique : false });//Index for symptims
          
          
     }
     //when the form is sent
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

          //In IndexedDB transactions are used

          let transaction = DB.transaction(['citas'], 'readwrite');
          let objectStore = transaction.objectStore('citas');
          //console.log(objectStore)
          //Enviamos una peticion
          let peticion = objectStore.add(nuevaCita);
          //console.log(peticion);
     
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
          //Delete previous appointments
          while(citas.firstChild){
               citas.removeChild(citas.firstChild)
          }

          //Create a objectSTORE
          let objectStore = DB.transaction('citas').objectStore('citas');

          //Return 1 petition
          objectStore.openCursor().onsuccess = function(e){
               //Courses will be located in the register indicated to access the data
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
                    <p class="font-weight-bold">Fecha: <span class="font-weight-normal">${cursor.value.fecha}</span></p>
                    <p class="font-weight-bold">Hora: <span class="font-weight-normal">${cursor.value.hora}</span></p>
                    <p class="font-weight-bold">Sintomas: <span class="font-weight-normal">${cursor.value.sintomas}</span></p>
                    `;
                    //Buttom delete
                    const botonBorrar = document.createElement('button');
                    botonBorrar.classList.add('borrar', 'btn', 'btn-danger');
                    botonBorrar.innerHTML = '<span aria-hidden="true">x</span> Borrar';
                    botonBorrar.onclick = borrarCitas;
                    citaHTML.appendChild(botonBorrar);

                    //Append in the father
                    citas.appendChild(citaHTML);
                    //consult the next records    
                    cursor.continue();
               }else{
                    if(!citas.firstChild){
                         //When there are no records
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
     function borrarCitas(e){
          let citaID = Number(e.target.parentElement.getAttribute('data-cita-id'));

          //In IndexedDB transactions are used
          let transaction = DB.transaction(['citas'], 'readwrite');
          let objectStore = transaction.objectStore('citas');
          console.log(objectStore)
          //Sent petitio
          let peticion = objectStore.delete(citaID);

          transaction.oncomplete = () => {
               e.target.parentElement.parentElement.removeChild( e.target.parentElement );
               //console.log('Se elimino la cita con el ID: ${citaID}');

               if(!citas.firstChild){
                    //When there are no records
                    headingAdministra.textContent = 'Agrega citas paracomenzar';
                    let listado = document.createElement('p');
                    listado.classList.add('text-center');
                    listado.textContent = 'No hay registros';
                    citas.appendChild(listado);
               }else{
                    headingAdministra.textContent = 'Administra tus citas'
               }
          }


     }
     
});
