var miTimeout = null;
window.onload = function() {
    var inputBuscar = document.getElementById("nombrePelicula");
    var tipo = document.getElementById("tipo");
    var searchbtn = document.getElementById("search-btn");

    searchbtn.addEventListener("click", cargar);

    function inputTimeout(){
        if (inputBuscar.value.length >= 3) {
            limpiarRegistros();
            if (miTimeout !== null) {
                clearTimeout(miTimeout);
            }
            miTimeout = setTimeout(cargar, 1000);
        } else {
            limpiarRegistros();
        }
    }

    tipo.addEventListener("change", inputTimeout);
    inputBuscar.addEventListener("input", inputTimeout);

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
let contador = 0;
var detallesAbiertos = null;

function cargar(page){
    var inputBuscar = document.getElementById("nombrePelicula");
    var tipo = document.getElementById("tipo").value;
    var MayorRecaudacionBtn = document.getElementById("MayorRecaudacionBtn"); 

    if (tipo == "movie") {
        tipo = "movie";
        MayorRecaudacionBtn.style.display = "block"; 

    } else if (tipo == "serie"){
        tipo = "series";
        inputBuscar.ariaPlaceholder = "Serie";
        MayorRecaudacionBtn.style.display = "none";

    }

    var URL = "https://www.omdbapi.com/?apikey=54589e65&s="+inputBuscar.value+"&type="+tipo+"&page="+page;
    var cargandoElement = document.getElementById("preloader");
    cargandoElement.style.visibility = "visible";

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', URL, true);
    xhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            cargandoElement.style.visibility = "hidden";
            datos = this.responseText;
            var datosObjeto = JSON.parse(datos);
            // console.log(datos);
            maquetar(datosObjeto);
            cargando = false;
        }
    }
    xhttp.send();

}

//CARGA LOS DATOS DE CADA PELICULA POR ID
function cargarDetalles(e){
    var cargandoElement = document.getElementById("preloader");
    cargandoElement.style.visibility = "visible";

    var URL2 = "https://www.omdbapi.com/?apikey=54589e65&i="+e.target.id+"&plot=full";
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


//MAQUETA LOS DATOS DE UNA PELICULA AL HACER CLICK EN UNA DE ELLAS
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
    poster.addEventListener("error", () => {
        poster.src = "img/notfound.jpg";                    
    });
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


//MAQUETA LOS DATOS OBTENIDOS DE CARGAR (BUSQUEDA POR NOMBRE)
function maquetar(datosObjeto) {
    var inputBuscar = document.getElementById("nombrePelicula");
    var peliculas = datosObjeto.Search;

    if  (inputBuscar.value != "") {
        var cargandoElement = document.getElementById("preloader");
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
                cartel.addEventListener("error", () => {
                    cartel.src = "img/notfound.jpg";                    
                });
                
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

//LIMPIA LA PÁGINA DE RESULTADOS DE LA BÚSQUEDA
function limpiarRegistros(){
    var contenedorPeliculas = document.getElementById("contenedorPeliculas");
    var encontrados = document.getElementById("encontrados");
    var resultados = document.getElementById("resultados");
    var chartContainer1 = document.getElementById("chartContainer1");
    var chartContainer2 = document.getElementById("chartContainer2");
    contador = 0;

    chartContainer1.style.height = "0px";
    chartContainer1.innerHTML = "";
    chartContainer2.style.height = "0px";
    chartContainer2.innerHTML = "";
    contenedorPeliculas.innerHTML = "";
    encontrados.textContent = "";
    resultados.textContent = "";

}

//SCROLL INFINITO CARGA PELICULAS AL HACER SCROLL
function scrollInfinito(){
    if (!cargando) {
        let altoScroll = document.documentElement.scrollHeight;
        let scrollTop = document.documentElement.scrollTop;
        let clientHeight = document.documentElement.clientHeight;
        if ((scrollTop + clientHeight) > (altoScroll - 200)) {
            contador++;
            // console.log(contador);
            cargando = true;
            cargar(contador);
        }
    }
}

//COMPRUEBA EL BOTON QUE HE PULSADO PARA LA ORDENACIÓN
function checkedBoton(e) {
    var imdbRatingBtn = document.getElementById("imdbRatingBtn");
    var MayorRecaudacionBtn = document.getElementById("MayorRecaudacionBtn");
    var MasVotadasBtn = document.getElementById("MasVotadasBtn");

    imdbRatingBtn.checked = false;
    MayorRecaudacionBtn.checked = false;
    MasVotadasBtn.checked = false;

    e.target.checked = true;
    cargarPorOrdenacion();
}

//
function cargarPorOrdenacion() {
    var inputBuscar = document.getElementById("nombrePelicula");
    var tipo = document.getElementById("tipo").value;
    var MayorRecaudacionBtn = document.getElementById("MayorRecaudacionBtn");

    if (tipo == "movie") {
        tipo = "movie";
        MayorRecaudacionBtn.style.display = "block";
    } else if (tipo == "serie") {
        tipo = "series";
        inputBuscar.ariaPlaceholder = "Serie";
        MayorRecaudacionBtn.style.display = "none";
    }

    var contenedorPeliculas = document.getElementById("contenedorPeliculas");
    var peliculas = contenedorPeliculas.querySelectorAll(".containerPrincipal");
    var peliculasArray = [];

    peliculas.forEach(function (pelicula) {
        var peliculaObj = {
            imdbID: pelicula.querySelector(".cartel").id,
            Title: pelicula.querySelector(".titulo").textContent,
            Year: pelicula.querySelector(".fecha").textContent.replace("Año: ", ""),
            Poster: pelicula.querySelector(".cartel").src,
            imdbRating: null,
            BoxOffice: null,
            imdbVotes: null,
        };
        peliculasArray.push(peliculaObj);
    });

    var contador = 0;

    peliculasArray.forEach(function (pelicula) {
        var xhttp2 = new XMLHttpRequest();
        xhttp2.open('GET', "https://www.omdbapi.com/?apikey=54589e65&i=" + pelicula.imdbID, true);
        xhttp2.onload = function () {
            if (this.readyState == 4 && this.status == 200) {
                var datosPelicula = JSON.parse(this.responseText);
                pelicula.imdbRating = datosPelicula.imdbRating;
                pelicula.BoxOffice = datosPelicula.BoxOffice;
                pelicula.imdbVotes = datosPelicula.imdbVotes;
                contador++;

                if (contador === peliculasArray.length) {
                    var imdbRatingBtn = document.getElementById("imdbRatingBtn");
                    var MayorRecaudacionBtn = document.getElementById("MayorRecaudacionBtn");
                    var MasVotadasBtn = document.getElementById("MasVotadasBtn");

                    if (imdbRatingBtn.checked) {
                        peliculasArray.sort(function (a, b) {
                            var ratingA = parseFloat(a.imdbRating);
                            var ratingB = parseFloat(b.imdbRating);
                            return ratingB - ratingA;
                        });
                        var ordenacion = "IMDB Rating";
                        var modoordenacion = "imdbRating";
                        crearBotonInforme(peliculasArray, ordenacion, modoordenacion);
                    } else if (MayorRecaudacionBtn.checked) {
                        peliculasArray.sort(function (a, b) {
                            var boxOfficeA = parseInt(a.BoxOffice.replace(/[\$,]/g, ''));
                            var boxOfficeB = parseInt(b.BoxOffice.replace(/[\$,]/g, ''));
                            return boxOfficeB - boxOfficeA;
                        });
                        var ordenacion = "Mayor recaudación";
                        var modoordenacion = "BoxOffice";
                        crearBotonInforme(peliculasArray, ordenacion, modoordenacion);
                    } else if (MasVotadasBtn.checked) {
                        peliculasArray.sort(function (a, b) {
                            var votesA = parseInt(a.imdbVotes.replace(/,/g, ''));
                            var votesB = parseInt(b.imdbVotes.replace(/,/g, ''));
                            return votesB - votesA;
                        });
                        var ordenacion = "Más votadas";
                        var modoordenacion = "imdbVotes";
                        crearBotonInforme(peliculasArray, ordenacion, modoordenacion);
                    }

                    limpiarRegistros();
                    maquetar({ Search: peliculasArray });
                    cargando = false;
                }
            }
        }
        xhttp2.send();
    });
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

    // console.log(ordenacion);
    // console.log(modoordenacion);
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        // console.log(peliculas[0][modoordenacion]); 
        if (modoordenacion == "BoxOffice") {

            var data = google.visualization.arrayToDataTable([
                ["Element", "Recaudación en $", { role: "style" } ],
                [peliculas[0].Title, parseInt(peliculas[0][modoordenacion].replace(/[\$,]/g, '')), "gold"],
                [peliculas[1].Title, parseInt(peliculas[1][modoordenacion].replace(/[\$,]/g, '')), "silver"],
                [peliculas[2].Title, parseInt(peliculas[2][modoordenacion].replace(/[\$,]/g, '')), "#CD7F32"],
                [peliculas[3].Title, parseInt(peliculas[3][modoordenacion].replace(/[\$,]/g, '')), "iron"],
                [peliculas[4].Title, parseInt(peliculas[4][modoordenacion].replace(/[\$,]/g, '')), "iron"]
            ]);

            
            var viewTop5 = new google.visualization.DataView(data);

            var data = [["Element", "Recaudación en $", { role: "style" }]];
            for (var i = 0; i < peliculas.length; i++) {
                var row = [peliculas[i].Title, parseInt(peliculas[i][modoordenacion].replace(/[\$,]/g, '')), "gold"];
                data.push(row);
            }
        
            var dataTable = google.visualization.arrayToDataTable(data);
            var viewAll = new google.visualization.DataView(dataTable);

            viewTop5.setColumns([0, 1,
                             { calc: "stringify",
                               sourceColumn: 1,
                               type: "string",
                               role: "annotation" },
                             2]);

            viewAll.setColumns([0, 1,
               { calc: "stringify",
                 sourceColumn: 1,
                 type: "string",
                 role: "annotation" },
               2]);
            var options = {
              title: "Top 5 Películas con "+ ordenacion+" en $",
              width: 1300,
              height: 400,
              bar: {groupWidth: "95%"},
              legend: { position: "none" },
            };
            var options2 = {
                title: "Películas con "+ ordenacion+" en $",
                width: 1300,
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
                [peliculas[3].Title, parseFloat(peliculas[3][modoordenacion]), "green"],
                [peliculas[4].Title, parseFloat(peliculas[4][modoordenacion]), "blue"]
            ]);

            
            var viewTop5 = new google.visualization.DataView(data);

            var data = [["Element", ordenacion, { role: "style" }]];
            for (var i = 0; i < peliculas.length; i++) {
                var row = [peliculas[i].Title, parseFloat(peliculas[i][modoordenacion]), "gold"];
                data.push(row);
            }
        
            var dataTable = google.visualization.arrayToDataTable(data);
            var viewAll = new google.visualization.DataView(dataTable);

            viewTop5.setColumns([0, 1,
                             { calc: "stringify",
                               sourceColumn: 1,
                               type: "string",
                               role: "annotation" },
                             2]);

            viewAll.setColumns([0, 1,
               { calc: "stringify",
                 sourceColumn: 1,
                 type: "string",
                 role: "annotation" },
               2]);
            var options = {
              title: "Top 5 Peliculas "+ ordenacion,
              width: 1300,
              height: 400,
              bar: {groupWidth: "95%"},
              legend: { position: "none" },
            };
            var options2 = {
                title: "Películas según "+ ordenacion,
                width: 1300,
                height: 400,
                bar: {groupWidth: "95%"},
                legend: { position: "none" },
              };
        
        }

        var peliculasContainer = document.querySelector("#contenedorPeliculas"); 

        var chartContainer1 = document.getElementById("chartContainer1");
        chartContainer1.style.height = "400px";

        var chartContainer2 = document.getElementById("chartContainer2");
        chartContainer2.style.height = "400px";

        var chartContainer = document.createElement("div");


        peliculasContainer.parentNode.insertBefore(chartContainer, peliculasContainer);

        var chart1 = new google.visualization.ColumnChart(document.getElementById("chartContainer1"));
        chart1.draw(viewTop5, options);

        var chart2 = new google.visualization.ColumnChart(document.getElementById("chartContainer2"));
        chart2.draw(viewAll, options2);



    }
}
