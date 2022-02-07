//Constructores

function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

//Realiza la cotización con los datos

Seguro.prototype.cotizarSeguro = function () {
  /*
    1 = Americano 1.15
    2 = Asiático 1.05
    3 = Europeo 1.35 
*/
  let cantidad;
  const base = 2000;
  console.log(this.marca);
  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;

    case "2":
      cantidad = base * 1.05;

      break;

    case "3":
      cantidad = base * 1.35;

      break;

    default:
      break;
  }

  //Leer el año
  const diferencia = new Date().getFullYear() - this.year;

  //Por cada año que tenga el coche el precio va a reducirse un 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*Si el seguro es básico, cuesta un 30% más
  Si el seguro es completo cuesta 50% más */

  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }
  return cantidad;
};

function UI() {}

//Llena las opciones de los años
//Esta función solo pertenece a UI, es un proto de UI
UI.prototype.llenarOpciones = function () {
  const max = new Date().getFullYear();
  const min = max - 23;

  const selectYear = document.querySelector("#year");

  for (let i = max; i > min; i--) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectYear.appendChild(option);
  }
};

//Muestra alertas en pantalla
UI.prototype.mostrarMensaje = function (mensaje, tipo) {
  const div = document.createElement("div");
  if (tipo === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }

  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;
  //Insertar en html
  const formulario = document.querySelector("#cotizar-seguro");
  const resultado = document.querySelector("#resultado");
  formulario.insertBefore(div, resultado);

  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.mostrarResultado = function (total, seguro) {
  const { marca, year, tipo } = seguro;
  let textoMarca;

  switch (marca) {
    case "1":
      textoMarca = "Americano";
      break;
    case "2":
      textoMarca = "Asiático";
      break;
    case "3":
      textoMarca = "Europeo";
      break;
  }
  //Crear el resultado

  const div = document.createElement("div");
  div.classList.add("mt-10");
  div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
        <p class="font-bold">Tipo de seguro: <span class="font-normal"> ${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal"> ${total}€</span></p>
    
    `;
  const resultadoDiv = document.querySelector("#resultado");

  //Mostrar spinner

  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none";
    resultadoDiv.appendChild(div);
  }, 3000);
};

//Instanciar UI
//lo hago fuera del EventListener porque lo voy a utilizar en más sitios
const ui = new UI();
console.log(ui);

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones(); //Llena el select con los años
});

eventListeners();
function eventListeners() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  //Leer marca seleccionada

  const marca = document.querySelector("#marca").value;

  //Leer año seleccionado
  const year = document.querySelector("#year").value;

  //Leer tipo cobertura
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje(
      "Faltan datos. Por favor, revisa todos los campos",
      "error"
    );
    return;
  }
  ui.mostrarMensaje("Cotizando...", "correcto");

  //Ocultar las cotizaciones anteriores

  const resultados = document.querySelector("#resultado div");
  if (resultados != null) {
    resultados.remove();
  }
  //Instanciar el seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();

  //Utilizar el prototype que va a cotizar

  ui.mostrarResultado(total, seguro);
}
