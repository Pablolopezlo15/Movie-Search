window.onload = function() {
    var inputBuscar = document.getElementById("nombrePelicula");
    var tipo = document.getElementById("tipo");
    
    tipo.addEventListener("change", function() {
        if (inputBuscar.value.length >= 3) {
            limpiarRegistros();
            cargar();
        } else {
            limpiarRegistros();
        }
    });

    inputBuscar.addEventListener("input", function() {
        if (inputBuscar.value.length >= 3) {
            limpiarRegistros();
            cargar();
        } else {
            limpiarRegistros();
        }
    });

    var imdbRatingBtn = document.getElementById("imdbRatingBtn");
    var MayorRecaudacionBtn = document.getElementById("MayorRecaudacionBtn");
    var MasVotadasBtn = document.getElementById("MasVotadasBtn");
    
    imdbRatingBtn.addEventListener("click", checkedBoton);
    MayorRecaudacionBtn.addEventListener("click", checkedBoton);
    MasVotadasBtn.addEventListener("click", checkedBoton);

    addEventListener("scroll", scrollInfinito);

    var header = document.querySelector("header");
    if (header) {
        window.addEventListener("scroll", function () {
            window.scrollY >= 10 ? header.classList.add("active") : header.classList.remove("active");
        });
    }
}

var cargando = false;
let contador = 1;
var detallesAbiertos = null;


function cargar(page){
    var inputBuscar = document.getElementById("nombrePelicula");
    var tipo = document.getElementById("tipo").value;
    var MayorRecaudacionBtn = document.getElementById("MayorRecaudacionBtn"); 

    if (inputBuscar.value.length < 3) {
        return;
    }

    if (tipo == "movie") {
        tipo = "movie";
        MayorRecaudacionBtn.style.display = "block"; 

    } else if (tipo == "serie"){
        tipo = "series";
        inputBuscar.ariaPlaceholder = "Serie";
        MayorRecaudacionBtn.style.display = "none";

    }

    var URL = "http://www.omdbapi.com/?apikey=54589e65&s="+inputBuscar.value+"&type="+tipo+"&page="+page;
    var cargandoElement = document.getElementById("typing-indicator");
    cargandoElement.style.visibility = "visible";

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', URL, true);
    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            cargandoElement.style.visibility = "hidden";
            datos = this.responseText;
            var datosObjeto = JSON.parse(datos);
            console.log(datos);
            maquetar(datosObjeto);
            cargando = false;
        }
    }
    xhttp.send();

}


function cargarDetalles(e){
    var cargandoElement = document.getElementById("typing-indicator");
    cargandoElement.style.visibility = "visible";

    var URL2 = "http://www.omdbapi.com/?apikey=54589e65&i="+e.target.id+"&plot=full";
    var xhttp2 = new XMLHttpRequest();
    xhttp2.open('GET', URL2, true);
    xhttp2.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            cargandoElement.style.visibility = "hidden";
            datos = this.responseText;
            var datosObjeto = JSON.parse(datos);
            maquetarDetalles(datosObjeto);
        }
    }
    xhttp2.send();

}



function maquetarDetalles(datosObjeto){
    if (detallesAbiertos) {
        document.body.removeChild(detallesAbiertos);
    }
    var detallesContenedor = document.createElement("div");
    detallesContenedor.setAttribute("class", "detallesContenedor");

    var divImagen = document.createElement("div");
    divImagen.setAttribute("class", "divImagen");
    var poster = document.createElement("img");
    poster.setAttribute("class", "poster");
    if(datosObjeto.Poster == "N/A"){
        poster.src = "img/notfound.jpg";
    }
    else {
        poster.src = datosObjeto.Poster;
    }
    divImagen.appendChild(poster);
    detallesContenedor.appendChild(divImagen);

    var divInfo = document.createElement("div");
    divInfo.setAttribute("class", "divInfo");

    var titulo = document.createElement("h2");
    titulo.textContent = datosObjeto.Title;
    divInfo.appendChild(titulo);

    var año = document.createElement("p");
    año.textContent = "Año: " + datosObjeto.Year;
    divInfo.appendChild(año);

    var imdbRating = document.createElement("p");
    imdbRating.textContent = "IMDB Rating: " + datosObjeto.imdbRating;
    divInfo.appendChild(imdbRating);

    var director = document.createElement("p");
    director.textContent = "Director: " + datosObjeto.Director;
    divInfo.appendChild(director);

    var actores = document.createElement("p");
    actores.textContent = "Actores: " + datosObjeto.Actors;
    divInfo.appendChild(actores);
    

    var sinopsis = document.createElement("p");
    sinopsis.setAttribute("class", "sinopsis");
    sinopsis.textContent = "Sinopsis: " + datosObjeto.Plot;
    divInfo.appendChild(sinopsis);

    detallesContenedor.appendChild(divInfo);

    document.body.appendChild(detallesContenedor);
    var botonCierre = document.createElement("ion-icon");
    botonCierre.setAttribute("name", "close-circle-outline");
    botonCierre.setAttribute("id", "botonCierre");
    
    botonCierre.addEventListener("click", function() {
        document.body.removeChild(detallesContenedor);
        detallesAbiertos = null;
    });
    
    detallesContenedor.appendChild(botonCierre);
    detallesAbiertos = detallesContenedor;
    
    detallesContenedor.setAttribute("class", "detallesContenedor");
}



function maquetar(datosObjeto) {
    var inputBuscar = document.getElementById("nombrePelicula");
    var peliculas = datosObjeto.Search;

    if  (inputBuscar.value != "") {
        var cargandoElement = document.getElementById("typing-indicator");
        cargandoElement.style.visibility = "hidden";
        var contenedorPeliculas = document.getElementById("contenedorPeliculas");

        var encontrados = document.getElementById("encontrados");
        var resultados = document.getElementById("resultados");

        if (datosObjeto.Response == "False") {
            encontrados.textContent = "No se han encontrado resultados";
            resultados.textContent = "No hay resultados para: " + inputBuscar.value;
        }
        else{
            encontrados.textContent = "Se han encontrado " + datosObjeto.totalResults + " resultados";
            resultados.textContent = "Resultados: " + inputBuscar.value;

            peliculas.forEach(function(pelicula) {
                var containerPrincipal = document.createElement("div");
                containerPrincipal.setAttribute("class", "containerPrincipal");
    
                var cartel = document.createElement("img");
                cartel.setAttribute("id", pelicula.imdbID);
                cartel.setAttribute("class", "cartel");
                if(pelicula.Poster == "N/A"){
                    cartel.src = "img/notfound.jpg";
                    cartel.addEventListener("click", cargarDetalles);
                    cartel.addEventListener("click", maquetarDetalles);
                } 
                else {
                    cartel.src = pelicula.Poster;
                    cartel.addEventListener("click", cargarDetalles);
                }
                var titulo = document.createElement("h2");
                titulo.setAttribute("class", "titulo");
                titulo.textContent = pelicula.Title;
    
                var fecha = document.createElement("p");
                fecha.setAttribute("class", "fecha");
                fecha.textContent = "Año: " + pelicula.Year;
    
                containerPrincipal.appendChild(cartel);
                containerPrincipal.appendChild(titulo);
                containerPrincipal.appendChild(fecha);
    
                contenedorPeliculas.appendChild(containerPrincipal);
    
            });
        }
    } 
}

function limpiarRegistros(){
    var contenedorPeliculas = document.getElementById("contenedorPeliculas");
    var encontrados = document.getElementById("encontrados");
    var resultados = document.getElementById("resultados");
    var chartContainer = document.getElementById("chartContainer");

    chartContainer.style.height = "0px";
    chartContainer.innerHTML = "";
    contenedorPeliculas.innerHTML = "";
    encontrados.textContent = "";
    resultados.textContent = "";

}


function scrollInfinito(){
    if (!cargando) {
        let altoScroll = document.documentElement.scrollHeight;
        let scrollTop = document.documentElement.scrollTop;
        let clientHeight = document.documentElement.clientHeight;
        if ((scrollTop + clientHeight) > (altoScroll - 200)) {
            contador++;
            console.log(contador);
            cargando = true;
            cargar(contador);
        }
    }
}

function checkedBoton(e) {
    var imdbRatingBtn = document.getElementById("imdbRatingBtn");
    var MayorRecaudacionBtn = document.getElementById("MayorRecaudacionBtn");
    var MasVotadasBtn = document.getElementById("MasVotadasBtn");

    imdbRatingBtn.checked = false;
    MayorRecaudacionBtn.checked = false;
    MasVotadasBtn.checked = false;

    e.target.checked = true;
    cargarPorOrdenacion(1);
}


function cargarPorOrdenacion(page) {
    var inputBuscar = document.getElementById("nombrePelicula");
    var tipo = document.getElementById("tipo").value;
    var MayorRecaudacionBtn = document.getElementById("MayorRecaudacionBtn"); 

    if (inputBuscar.value.length < 3) {
        return;
    }

    if (tipo == "movie") {
        tipo = "movie";
        MayorRecaudacionBtn.style.display = "block"; 
    } else if (tipo == "serie"){
        tipo = "series";
        inputBuscar.ariaPlaceholder = "Serie";
        MayorRecaudacionBtn.style.display = "none"; 

    }

    var URL = "http://www.omdbapi.com/?apikey=54589e65&s="+inputBuscar.value+"&type="+tipo+"&page="+page;
    var cargandoElement = document.getElementById("typing-indicator");
    cargandoElement.style.visibility = "visible";

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', URL, true);
    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            var datosObjeto = JSON.parse(this.responseText);
            var peliculas = datosObjeto.Search;
            var contador = 0;

            peliculas.forEach(function(pelicula) {
                var xhttp2 = new XMLHttpRequest();
                xhttp2.open('GET', "http://www.omdbapi.com/?apikey=54589e65&i="+pelicula.imdbID, true);
                xhttp2.onload = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var datosPelicula = JSON.parse(this.responseText);
                        pelicula.imdbRating = datosPelicula.imdbRating;
                        pelicula.BoxOffice = datosPelicula.BoxOffice;
                        pelicula.imdbVotes = datosPelicula.imdbVotes;
                        contador++;

                        if (contador === peliculas.length) {
                            var imdbRatingBtn = document.getElementById("imdbRatingBtn");
                            var MayorRecaudacionBtn = document.getElementById("MayorRecaudacionBtn");
                            var MasVotadasBtn = document.getElementById("MasVotadasBtn");

                            if (imdbRatingBtn.checked){
                                peliculas.sort(function(a, b) {
                                    var ratingA = parseFloat(a.imdbRating);
                                    var ratingB = parseFloat(b.imdbRating);
                                    return ratingB - ratingA;
                                });
                                var ordenacion = "IMDB Rating";
                                var modoordenacion = "imdbRating";
                                crearBotonInforme(peliculas, ordenacion, modoordenacion);
                            }
                            else if (MayorRecaudacionBtn.checked){
                                peliculas.sort(function(a, b) {
                                    var boxOfficeA = parseInt(a.BoxOffice.replace(/[\$,]/g, ''));
                                    var boxOfficeB = parseInt(b.BoxOffice.replace(/[\$,]/g, ''));
                                    return boxOfficeB - boxOfficeA;
                                });
                                var ordenacion = "Mayor recaudación";
                                var modoordenacion = "BoxOffice";
                                crearBotonInforme(peliculas, ordenacion, modoordenacion);

                            }
                            else if (MasVotadasBtn.checked){
                                peliculas.sort(function(a, b) {
                                    var votesA = parseInt(a.imdbVotes.replace(/,/g, ''));
                                    var votesB = parseInt(b.imdbVotes.replace(/,/g, ''));
                                    return votesB - votesA;
                                });
                                var ordenacion = "Más votadas";
                                var modoordenacion = "imdbVotes";
                                crearBotonInforme(peliculas, ordenacion, modoordenacion);
                            }

                            cargandoElement.style.visibility = "hidden";
                            limpiarRegistros();
                            maquetar(datosObjeto);
                            cargando = false;
                        }
                    }
                }
                xhttp2.send();
            });
        }
    }
    xhttp.send();
}

function crearBotonInforme(peliculas, ordenacion, modoordenacion) {
    if (document.getElementById("crearInformeBtn")) {
        return;
    }

    var btn = document.createElement("button");
    btn.id = "crearInformeBtn";
    btn.className = "filter-btn"; 
    btn.innerText = "Crear Informe";

    btn.addEventListener("click", function() {
        generarInforme(peliculas, ordenacion, modoordenacion);
        btn.parentNode.removeChild(btn);
    });

    var filterList = document.querySelector(".filter-list");
    var li = document.createElement("li");
    li.appendChild(btn);
    filterList.appendChild(li);
}

function generarInforme(peliculas,ordenacion, modoordenacion) {

    var ordenacion = ordenacion;
    var modoordenacion = modoordenacion;

    console.log(ordenacion);
    console.log(modoordenacion);
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        console.log(peliculas[0][modoordenacion]); 
        if (modoordenacion == "BoxOffice") {
            var data = google.visualization.arrayToDataTable([
                ["Element", "Recaudación en $", { role: "style" } ],
                [peliculas[0].Title, parseInt(peliculas[0][modoordenacion].replace(/[\$,]/g, '')), "gold"],
                [peliculas[1].Title, parseInt(peliculas[1][modoordenacion].replace(/[\$,]/g, '')), "silver"],
                [peliculas[2].Title, parseInt(peliculas[2][modoordenacion].replace(/[\$,]/g, '')), "#CD7F32"],
                [peliculas[3].Title, parseInt(peliculas[3][modoordenacion].replace(/[\$,]/g, '')), "iron"],
                [peliculas[4].Title, parseInt(peliculas[4][modoordenacion].replace(/[\$,]/g, '')), "iron"]
            ]);
            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                             { calc: "stringify",
                               sourceColumn: 1,
                               type: "string",
                               role: "annotation" },
                             2]);
      
            var options = {
              title: "Películas con "+ ordenacion+" en $",
              width: 600,
              height: 400,
              bar: {groupWidth: "95%"},
              legend: { position: "none" },
            };
        }
        else{
            var data = google.visualization.arrayToDataTable([
                ["Element", ordenacion, { role: "style" } ],
                [peliculas[0].Title, parseFloat(peliculas[0][modoordenacion]), "gold"],
                [peliculas[1].Title, parseFloat(peliculas[1][modoordenacion]), "silver"],
                [peliculas[2].Title, parseFloat(peliculas[2][modoordenacion]), "#CD7F32"],
                [peliculas[3].Title, parseFloat(peliculas[3][modoordenacion]), "iron"],
                [peliculas[4].Title, parseFloat(peliculas[4][modoordenacion]), "iron"]
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                             { calc: "stringify",
                               sourceColumn: 1,
                               type: "string",
                               role: "annotation" },
                             2]);
      
            var options = {
              title: "Películas más valoradas "+ ordenacion,
              width: 600,
              height: 400,
              bar: {groupWidth: "95%"},
              legend: { position: "none" },
            };
        
        }

        var peliculasContainer = document.querySelector("#contenedorPeliculas"); 
        var chartContainer = document.getElementById("chartContainer");
        chartContainer.style.height = "400px";


        peliculasContainer.parentNode.insertBefore(chartContainer, peliculasContainer);

        var chart = new google.visualization.BarChart(document.getElementById("chartContainer"));
        chart.draw(view, options);

    }
}

