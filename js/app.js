const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
    moneda: "",
    criptomoneda: ""
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
})

document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomonedas();

    formulario.addEventListener("submit", submitFormulario);

    criptomonedasSelect.addEventListener("change", leerValor);
    monedaSelect.addEventListener("change", leerValor);
})

function consultarCriptomonedas() {
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement(`option`);
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;


}

function submitFormulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === "" || criptomoneda === "") {
        mostrarAlerta("Los campos no pueden ir vacios");
        return;
    }
    consultarApi();
}

function mostrarAlerta(msj) {
    const existeError = document.querySelector(".error");

    if(!existeError) {
        const divMensaje = document.createElement("div");

        divMensaje.classList.add("error");

        divMensaje.textContent = msj;

        formulario.appendChild(divMensaje)

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }
}

function consultarApi() {
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(cotizacion => {
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    })
}


function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML();  //Clear HTML

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    
    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `El precio actual es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement("p");
    precioAlto.innerHTML = `<p>El precio mas alto del dia fue de: <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement("p");
    precioBajo.innerHTML = `<p>El precio mas bajo del dia fue de: <span>${LOWDAY}</span></p>`;

    const precioHora = document.createElement("p");
    precioHora.innerHTML = `<p>La variacion en las ultimas horas fue de: <span>${CHANGEPCT24HOUR} %</span></p>`;

    const precioUltimo = document.createElement("p");
    precioUltimo.innerHTML = `<p>la ultima actualizacion del dia fue de: <span>${LASTUPDATE}</span></p>`;

    
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(precioHora);
    resultado.appendChild(precioUltimo);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

