    //Rutas
    const routeSummary="/summary";
    const routeSentences="/sentences";
    const routeSynonymous="/synonymous";
    const routeDefinition="/definition";
    const routeIsSimple="/isSimple";
    const routeSentencesTree="/sentences/tree";
    const routeImgGlosario="/static/img/diccionario-grande%20(1).png"
    const routeImgEditar="/static/img/editar.png";

    var hayFrases = false;

    var text = document.getElementById('original').value;

    //Global variable to check if the text comes from the summary    var res = false;
    var summaryText;
    var idCambiados = [];
    var fraseOriginal = "";
    var buttonActivatedComplex = false;
    var fraseElegida = "";
    var definicionesFinal = [];
    var contDef = 0;


    function showPanel() {
        document.getElementById("sidebar").style.width = "40%";
        document.getElementById("abrir").style.display = "block";
        document.getElementById("cerrar").style.display = "block";
        document.getElementById("closeOriginal").style.display = "block";
        document.getElementById("main").style.marginLeft = "39%";
        document.getElementById("main").style.width = "60%";

    }

    function hidePanel() {
        document.getElementById("sidebar").style.width = "0";
        document.getElementById("abrir").style.display = "block";
        document.getElementById("cerrar").style.display = "none";
        document.getElementById("closeOriginal").style.display = "none";
        document.getElementById("main").style.marginLeft = "0%";
        document.getElementById("main").style.width = "100%";

    }

    function showPanelEnd() {

        document.getElementById("sidebarDerecho").style.width = "40%";
        document.getElementById("closeFinally").style.display = "block";
        document.getElementById("main").style.width = "60%";
    }

    function hidePanelEnd() {

        document.getElementById("sidebarDerecho").style.width = "0";
        document.getElementById("closeFinally").style.display = "none";
        document.getElementById("main").style.width = "100%";
    }

    function summary() {
        document.getElementById("dependencias").style.display = "none";

        text = document.getElementById("original").value;

        var str = text.replace(/['"]+/g, "'");
        var t = {"text": str};
        var jsonObj = JSON.stringify(t);
        fetch(routeSummary, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonObj
        }).then(response => response.json()
        ).then(data => {

            //Calls the hide function, so that the left menu is hidden.
            hidePanel();
            summaryText = data.summary;
            if(summaryText.length==0){
                res=false;
            }
            else{
                res=true;
            }
            constructionSentences();
        });


    }


    function valida_texto() {
        texto = document.getElementById("original").value;
        if (texto != "") {
            document.getElementById('bContinuar').disabled = false;
            document.getElementById('bresumen').disabled = false;

        } else {
            document.getElementById('bContinuar').disabled = true;
            document.getElementById('bresumen').disabled = true;

        }
    }

    function w3_close() {
        document.getElementById("mySidebar").style.display = "none";
    }

    function mostrarFrases() {
        document.getElementById("dependencias").style.display = "none";

        deactivateWords();
        if (idCambiados.length != 0) {
            reseteoListadoCambios();
            document.getElementById("listadoFrasesAdaptadas").style.display = "flex";
            document.getElementById("listadoFrasesAdaptadas").style.flexDirection = "column";
            document.getElementById("listadoFrasesAdaptadas").innerHTML = " <h6 style='color:#b7c9a6'>Frases modificadas:</h6>";

            for (var i = 0; i < idCambiados.length; i++) {
                document.getElementById("frases").className = "col-lg-6";

                var res = '"' + idCambiados[i].identificador + '"';
                var numFraseSplit = idCambiados[i].identificador.split("f");
                var numFrases = numFraseSplit[1];
                document.getElementById("listadoFrasesAdaptadas").innerHTML += " <div class='splitSentencesChanges fraseA" + numFrases + "' id='divFrases" + idCambiados[i].identificador + "'style='background:#fff;padding:10px;text-align:center;display:flex;margin:0px auto;'><a id=frase" + idCambiados[i].identificador + " href='javascript:drawDependenciesTree(" + res + ")'>" + idCambiados[i].cadena + "</a><div class='botonCerrar'><a class='boton-cerrar' title='Pulse para borrar esta frase' href='javascript:removeFraseCambiada(" + res + "," + numFrases + ")'>×</a></div></div><br>";
            }
        }


        //Displays the list of phrases again, hiding the dependencies panel.
        document.getElementById("listadoFrases").style.display = "block";
        document.getElementById("dependencias").style.display = "none";

    }

    //Reset text in case a new text is entered
    function reseteo() {
        //Check if there has already been text
        idCambiados.splice(0, idCambiados.length);
        definicionesFinal.splice(0, definicionesFinal.length);


        //Reset the previous sentences
        document.getElementById("frases").innerHTML = " ";
        document.getElementById("listadoFrasesAdaptadas").innerHTML = " ";
        document.getElementById("listadoFrasesAdaptadas").style.display = "none";
        contDef = 0;
        document.getElementById("frases").className = "col-lg-12";

    }

    function reseteoListadoCambios() {

        document.getElementById("listadoFrasesAdaptadas").innerHTML = " ";

    }

    //Hides the menu panel once a text is entered and separates the text by phrases.
    function constructionSentences() {
        document.getElementById("pestanaEditar").style.display = "inline-block";
        document.getElementById("transformaciones").style.display = "none";


        reseteo();

        document.getElementById("bienvenida").style.display = "none";
        document.getElementById("listadoFrases").style.display = "block";


        if (res) {
            var r = "";
            var t = "";
            for (var i = 0; i < summaryText.length; i++) {
                r += summaryText[i] + " ";
            }
            r = r.replace(/\n/g, "");
            t = {"text": r};
            res = false;
        } else {
            text = document.getElementById("original").value;
            text = texto.replace(/\n/g, "");
            t = {"text": texto};
        }
        document.getElementById("frases").innerHTML = " <h6>Frases del texto original:</h6>";


        var jsonObj = JSON.stringify(t);
        fetch(routeSentences, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonObj
        }).then(response => response.json()
        ).then(data => {

            hidePanel();
            var splitted = data.sentences;
            //Auxiliary counter to be used in the following loop of phrases to be included in the html.
            var sep = 0;

            splitted.forEach(element => {
                var res = '"' + element + '"';
                if (splitted != "") {
                    document.getElementById("frases").innerHTML += " <div class='splitSentences' id='divFrases" + sep + "'style='background:#fff;padding:10px;text-align:center;display:flex;margin:0px auto;'><a id='frase" + sep + "' class='sentencesSplitted' href='javascript:drawDependenciesTree(" + sep + ")'>" + element + "</a><div class='botonCerrar'><a title='Pulsa para borrar esta frase' class='boton-cerrar' href='javascript:removeFrase(" + sep + ")'>×</a></div></div><br>";
                    sep++;
                }
            });

            //Was written
            hayFrases = true;
        });

    }

    //Write in the final textarea the result of all the transformations that the original text has undergone.
    function draftFinalText() {
        document.getElementById("final").innerHTML = "";

        var cuantasFrases = document.getElementsByClassName("sentencesSplitted");
        console.log(cuantasFrases.length);
        for (var i = 0; i < cuantasFrases.length; i++) {
            if (document.getElementById("frase" + i) != null) {
                var ide = "f" + i;
                let indice = idCambiados.findIndex(element => element.identificador === ide);
                console.log(indice);
                if (indice === -1) {
                    document.getElementById("final").innerHTML += document.getElementById("frase" + i).innerText;

                } else {
                    console.log("Aqui entra");
                    console.log(document.getElementById("sentenceOrigin").classList.value);
                    console.log(idCambiados[indice]);
                    if (document.getElementById("sentenceOrigin").classList.value == idCambiados[indice].identificador) {

                        document.getElementById("final").innerHTML += "<strong>" + idCambiados[indice].cadena + "</strong>";
                    } else
                        document.getElementById("final").innerHTML += idCambiados[indice].cadena;


                }

            }
            document.getElementById("final").innerHTML += "\n";

        }


    }

        //includes the active class in the parent of the clicked id
        function choice(cont) {
        var item = document.getElementById("elem" + cont);
        var elemento = "elem" + cont;
        var e = document.getElementById(elemento);
        if (!item.classList.contains('active')) {
            e.classList.add('active');
        } else {
            e.classList.remove('active');
        }
        var c = document.getElementsByClassName('active');
        if (c.length == 1) {
            document.getElementById('bSinonimos').disabled = false;
            document.getElementById('bEliminar').disabled = false;
            document.getElementById('bIntercambiar').disabled = true;
            document.getElementById('bDefinicion').disabled = false;


        } else if (c.length == 2) {
            document.getElementById('bSinonimos').disabled = true;
            document.getElementById('bEliminar').disabled = true;
            document.getElementById('bIntercambiar').disabled = false;
            document.getElementById('bDefinicion').disabled = true;


        } else {
            document.getElementById('bSinonimos').disabled = true;
            document.getElementById('bEliminar').disabled = true;
            document.getElementById('bIntercambiar').disabled = true;
            document.getElementById('bDefinicion').disabled = true;

        }


    }


    //Changes two words of position
    function changeNode() {
        document.getElementById("internalPanel").style.display = "none";
        hideLabel();
        //Active classes are taken in order to be able to change the order words
        var classActive = document.getElementsByClassName('active');
        //Takes the id of the first class
        var id1 = classActive[0].getAttribute('id');
        //Split the id by elem to keep the number
        var split1 = id1.split("elem");
        //list of the first selected node
        var listNode1 = "lista" + split1[1];
        console.log(listNode1);
        var l1 = document.getElementById(listNode1);
         //get the id of the second class
        var id2 = classActive[1].getAttribute('id');
        var split2 = id2.split("elem");
        var listNode2 = "lista" + split2[1];
        console.log(listNode2);
        var l2 = document.getElementById(listNode2);


        if (l1.lastChild != l2.parentElement) {


            var t1 = l1.innerHTML;
            //the ul on which the activated list 1 is hooked is picked up
            var p1 = l1.parentNode.id;

            var t2 = l2.innerHTML;
            var p2 = l2.parentNode.id;
            var h2 = document.getElementById(p2);
            var indice1 = 0;
            var indice2 = 0;

            //Scroll the children of node 2 to see their position in the children.
            for (var i = 0; i < h2.childNodes.length; i++) {


                if (h2.childNodes[i].id == listNode2) {
                    indice2 = i;
                }
            }
            var h1 = document.getElementById(p1);

            for (var i = 0; i < h1.childNodes.length; i++) {

                if (h1.childNodes[i].id == listNode1) {
                    indice1 = i;
                }
            }
            h1.childNodes.item(indice1).id = listNode2;
            h2.childNodes.item(indice2).id = listNode1;

            h1.childNodes.item(indice1).innerHTML = t2;
            console.log(t2.length);
            h2.childNodes.item(indice2).innerHTML = t1;
            console.log(t1);


            var arrayTextNode1 = [];
            var aSplitted1 = t1.replace(/[~`!@#$%^&*(){}\[\];:"'<,.>?¿¡\/\\|_+-]/g, " ");
            var r1 = aSplitted1.split(" ");

            for (var j = 0; j < r1.length; j++) {
                if (r1[j].includes('elem')) {
                    arrayTextNode1.push(r1[j]);
                }
            }
            var arrayRemove1 = [];
            for (var z = 0; z < arrayTextNode1.length; z++) {
                var idsLista1 = arrayTextNode1[z].split("elem");

                arrayRemove1.push(idsLista1[1]);
            }
            arrayRemove1.sort((a, b) => a - b);
            var arrayTextNode2 = [];
            var aSplitted2 = t2.replace(/[~`!@#$%^&*(){}\[\];:"'<,.>?¿¡\/\\|_+-]/g, " ");
            var r2 = aSplitted2.split(" ");

            for (var j = 0; j < r2.length; j++) {
                if (r2[j].includes('elem')) {
                    arrayTextNode2.push(r2[j]);
                }
            }
            var arrayRemove2 = [];
            for (var z = 0; z < arrayTextNode2.length; z++) {
                var idsLista2 = arrayTextNode2[z].split("elem");

                arrayRemove2.push(idsLista2[1]);
            }
            arrayRemove2.sort((a, b) => a - b);
            var subList1 = [];
            var subList2 = [];
            var auxPos1 = null;
            var auxPos2 = null;
            var auxPos2AfterSlice = null;
            for (var i = 0; i < fraseOriginal.length; i++) {
                if (fraseOriginal[i].id == arrayRemove1[0]) {
                    auxPos1 = i;
                }
                if (fraseOriginal[i].id == arrayRemove2[0]) {
                    auxPos2 = i;
                }
                if (auxPos1 != null && auxPos2 != null) {
                    break;
                }
            }
            subList1 = fraseOriginal.slice(auxPos1, auxPos1 + arrayRemove1.length);
            fraseOriginal.splice(auxPos1, arrayRemove1.length);
            auxPos2AfterSlice = auxPos2 - arrayRemove1.length;

            subList2 = fraseOriginal.slice(auxPos2AfterSlice, auxPos2AfterSlice + arrayRemove2.length);
            fraseOriginal.splice(auxPos2AfterSlice, arrayRemove2.length);

            fraseOriginal.splice(auxPos1, 0, ...subList2);
            fraseOriginal.splice(auxPos2AfterSlice + subList2.length, 0, ...subList1);


        } else {
            //text that has both classes
            var e1 = classActive[0].innerText;
            var e2 = classActive[1].innerText;


            var ele1 = document.getElementById(id1);
            var ele2 = document.getElementById(id2);


            ele1.innerHTML = "<a href='javascript:choice(" + split2[1] + ")'><div  class='name'>" + e2;
            ele2.innerHTML = "<a href='javascript:choice(" + split1[1] + ")'><div  class='name'>" + e1;

            var idElemento1 = "elem" + split1[1];
            var elemento1 = document.getElementById(idElemento1);
            var idElemento2 = "elem" + split2[1];
            var elemento2 = document.getElementById(idElemento2);


            elemento1.attributes[0].nodeValue = "elem" + split2[1];
            elemento2.attributes[0].nodeValue = "elem" + split1[1];
            var idLista1 = "lista" + split1[1];
            var lista1 = document.getElementById(idLista1);
            var idLista2 = "lista" + split2[1];
            var lista2 = document.getElementById(idLista2);
            lista1.attributes[0].nodeValue = "lista" + split2[1];
            lista2.attributes[0].nodeValue = "lista" + split1[1];

            let indiceA = fraseOriginal.findIndex(element => element.id == split1[1]);

            let indiceB = fraseOriginal.findIndex(element => element.id == split2[1]);
            if (indiceA != -1) {
                fraseOriginal[indiceA].id = split2[1];
                fraseOriginal[indiceA].text = e2;
            }

            if (indiceB != -1) {
                fraseOriginal[indiceB].id = split1[1];
                fraseOriginal[indiceB].text = e1;
            }
        }
        var ele1 = document.getElementById(id1);
        ele1.classList.remove('active');
        var ele2 = document.getElementById(id2);
        ele2.classList.remove('active');
        document.getElementById('bIntercambiar').disabled = true;
        recoverResultantSentence();
        draftFinalText();


    }

    //Removes the selected word and its dependencies from the dependency tree.
    function deleteNode() {
        document.getElementById("internalPanel").style.display = "none";
        hideLabel();
        var c = document.getElementsByClassName('active');
        //id that the word has in order to delete it
        var id0 = c[0].getAttribute('id');
        var s = id0.split("elem");
        var listaSeleccionada = "lista" + s[1];
        var l = document.getElementById(listaSeleccionada);


        var ids = document.querySelector('#sentenceOrigin');
        var ide = ids.classList[0];
        var parent1 = l.querySelector('.person');
        var nodo = l.children.item(1);
        var arrayIdsNodo = [];
        var aSplitted = l.outerHTML.replace(/[~`!@#$%^&*(){}\[\];:"'<,.>?¿¡\/\\|_+-]/g, " ");
        var h = aSplitted.split(" ");

        for (var j = 0; j < h.length; j++) {
            if (h[j].includes('lista')) {
                arrayIdsNodo.push(h[j]);
            }
        }
        var arrayRemove = [];
        for (var z = 0; z < arrayIdsNodo.length; z++) {
            var idsLista = arrayIdsNodo[z].split("lista");

            arrayRemove.push(idsLista[1]);
        }
        arrayRemove.sort((a, b) => a - b);

        var subList = [];

        var auxPos = null;
        for (var i = 0; i < fraseOriginal.length; i++) {
            if (fraseOriginal[i].id == arrayRemove[0]) {
                auxPos = i;
                break;
            }

        }
        subList1 = fraseOriginal.slice(auxPos, auxPos + arrayRemove.length);
        fraseOriginal.splice(auxPos, arrayRemove.length);


        c.item(0).remove();
        //Delete list
        l.remove();
        document.getElementById('bSinonimos').disabled = true;
        document.getElementById('bEliminar').disabled = true;
        document.getElementById('bDefinicion').disabled = true;
        recoverResultantSentence();
        draftFinalText();


    }

    function hideLabel() {
        document.getElementById("labelExplicacion1").style.display = "none";
        document.getElementById("labelExplicacion2").style.display = "none";
        document.getElementById("labelExplicacion3").style.display = "none";
        document.getElementById("labelExplicacion4").style.display = "none";
        document.getElementById("labelExplicacion5").style.display = "none";

    }

   //Displays the synomials of a selected word from the dependency tree
    function synonyms() {
        hideLabel();

        document.getElementById("internalPanel").style.display = "block";

        document.getElementById("carga").style.display = "block";

        document.getElementById("mySidebar").style.display = "none";

        var sin = document.getElementById("internalPanel");
        sin.innerHTML = "";
        var c = document.getElementsByClassName('active');
        var p = c[0].innerText;
        var str = p.replace(/[~`!@#$%^&*(){}\[\];:"'<,.>?¿¡\/\\|_+=-]/g, "")
        var idP = '"' + c[0].id + '"';
        var j = {"synonymous": str}
        var jsonObj = JSON.stringify(j);
        fetch(routeSynonymous, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonObj
        }).then(response => response.json()
        ).then(data => {
            //Include the synonyms in the specific div to display them (a panel for synonyms)
            var sin = document.getElementById("internalPanel");
            sin.innerHTML = "<label style='width: 75%;font-size: smaller;margin-top: 10px;'><em>Selecciona una palabra y pulsa enter para continuar (o doble click) o pulsa el botón de editar para cambiar la palabra</em></label><h4 style='color: brown;padding-top: 10px;'>Sinónimos de <strong>'" + str + "'</strong>:</h4><ul>";
            var palabra = '"' + str + '"';
            var cont = 0;


            var elements = data.synonymous;
            var simpleElements = data.simpleSynonymous;
            if (elements.length != 0 || simpleElements.length != 0) {
                if (elements.length != 0) {
                    sin.innerHTML += "<h6 style='color: #e1b7b7;'>Sinónimos complejos</h6>"
                    elements.forEach(element => {
                        var contadorInput = "input" + cont;
                        var cI = '"' + contadorInput + '"';

                        cont++;
                        var res = '"' + element + '"';
                        sin.innerHTML += "<li><a style='color:#b594b9;' href='javascript:void(0)' ondblclick='myFunctionModal(" + res + "," + palabra + "," + idP + "," + res +","+cI+ ")'><input type='text' name='synonymous' onkeyup='onKeyUp(event, " + cI + "," + res + "," + idP + "," + palabra + ")' id='" + contadorInput + "' readonly='true' value='" + element + "'/></a><a href='javascript:editText(" + res + "," + cI + ")'><img src="+ routeImgEditar +" alt='editar'/></a></li>";


                    });
                }
                if (simpleElements.length != 0) {
                    sin.innerHTML += "<br><h6 style='color: #e1b7b7;'>Sinónimos sencillos</h6>"

                    simpleElements.forEach(element => {
                        var contadorInput = "input" + cont;
                        var cI = '"' + contadorInput + '"';

                        cont++;
                        var res = '"' + element + '"';
                        sin.innerHTML += "<li><a style='color:#89748c' href='javascript:void(0)' ondblclick='myFunctionModal(" + res + "," + palabra + "," + idP + "," + res + ","+cI+")'><input type='text' name='synonymous' onkeyup='onKeyUp(event, " + cI + "," + res + "," + idP + "," + palabra + ")' id='" + contadorInput + "' readonly='true' value='" + element + "'/></a><a href='javascript:editText(" + res + "," + cI + ")'><img src="+ routeImgEditar +" alt='editar'/></a></li>";


                    });
                }
            } else {
                sin.innerHTML += "<h5 style='color: brown;'>No hay sinónimos</h5>";
            }
            sin.innerHTML += "</ul>"
            document.getElementById("mySidebar").style.width = "100%";
            document.getElementById("mySidebar").style.display = "block";
            document.getElementById("carga").style.display = "none";

        });
        draftFinalText();


    }

    function editText(sinonimo, idInput) {
        var idIn = document.getElementById(idInput);
        //Input is changed to write.
        idIn.readOnly = false;
        idIn.focus(); //sets focus to element

        //I notice that if you click anywhere in the document and the entire synonym is deleted, it is restored to the value it had.
         document.onclick = function (e) {

            var target = e.target
            do {
                if (idIn == target) {
                    // The click has occurred inside the element, nothing is done.
                    return;
                }
                target = target.parentNode;
            } while (target)
            // Clicked outside the element, an action is performed.
            if (idIn.value == "") {
                idIn.value = sinonimo;
            }
            idIn.readOnly = true;

        }
    }

    //Checks if the key pressed is enter to change the synonym
    function onKeyUp(e, idInput, sinonimo, idPalabra, palabra) {
        var idIn = document.getElementById(idInput);
        tecla = (document.all) ? e.keyCode : e.which;
        if (tecla == 13) {
            idIn.value;

            console.log(idIn.value);
            myFunctionModal(idIn.value, palabra, idPalabra, sinonimo, idInput);
            idIn.readOnly = true;

        }
        //I notice that if you click anywhere in the document and the entire synonym is deleted, it is restored to the value it had.
        document.onclick = function (e) {

            var target = e.target
            do {
                if (idIn == target) {
                    return;
                }
                target = target.parentNode;
            } while (target)
            if (idIn.value == "") {
                idIn.value = sinonimo;


            }
               //Input is left to read-only
            idIn.readOnly = true;

        }
    }

    function myFunctionModal(sinonimo, palabra, idPalabra, sinonimoOriginal, idInput) {

        var modal = document.getElementById("myModal");
        modal.style.display = "block";

        var sino = '"' + sinonimo + '"';
        var id = '"' + idPalabra + '"';
        var sinoOriginal = '"' + sinonimoOriginal + '"';
        var idI = '"' + idInput + '"';


        document.getElementById("myModal").innerHTML = " <div class='modal-content'><p style='color:black;text-align:center;'>¿Deseas sustituir<span style='color:red;'> " + palabra + "</span> por <span style='color:green'>" + sinonimo + "</span>?</p>	<div style='display:inline-flex;'><button onclick='acceptWord(" + sino + "," + id + ");' style='width:100px; height: min-content; margin-bottom: 10px; margin:0px auto;'>Aceptar</button><button onclick='cancelWord(" + sino + "," + sinoOriginal + "," + id + "," + idI + ");' style='width:100px; height: min-content; margin-bottom: 10px; margin:0px auto;'>Cancelar</button></div>";

    }


    function acceptWord(sinonimo, idPalabra) {
        if (buttonActivatedComplex) {
            activateWordSynonymous(sinonimo, idPalabra);
        }
        console.log(idPalabra);
        if (idPalabra.includes("elem")) {
            var numId = idPalabra.split("elem");
            var num = '"' + numId[1] + '"';
        }
        var c = document.getElementById(idPalabra);
        var palabraAnt = c.innerText;
        var signos = "";
        var palCambiada = "";

        if (palabraAnt.match(/[~`!@#$%^&*(){}\[\];:"'<,.>?¿¡\/\\|_+=-]/g)) {
            signos = palabraAnt.split(/[~`!@#$%^&*(){}\[\];:"'<,.>?¿¡\/\\|_+=-]/g);
            for (var i = 0; i < signos.length; i++) {

                if (signos[i] != "")
                    palCambiada = palabraAnt.replace(signos[i], sinonimo);

            }

        } else {
            palCambiada = sinonimo;
        }


        c.innerHTML = "<a href='javascript:choice(" + num + ")'><div class='name'>" + palCambiada + "</div></a>";


        var modal = document.getElementById("myModal");

        c.classList.remove('active');

        modal.style.display = "none";
        document.getElementById("internalPanel").style.display = "none";

        console.log(fraseOriginal);
        let indice = fraseOriginal.findIndex(element => element.id == numId[1]);
        if (indice != -1) {
            fraseOriginal[indice].id = parseInt(numId[1]);
            fraseOriginal[indice].text = palCambiada;

        }

        document.getElementById('bSinonimos').disabled = true;
        document.getElementById('bEliminar').disabled = true;
        document.getElementById('bDefinicion').disabled = true;

        document.getElementById("internalPanel").style.display = "none";

        recoverResultantSentence();
        draftFinalText();

    }


    function cancelWord(sinonimo, sinonimoOriginal, idPalabra, idInput) {
        console.log(sinonimo);
        console.log(sinonimoOriginal);
        if (sinonimo != sinonimoOriginal) {
            console.log("Son diferentes");
            var i = document.getElementById(idInput);
            i.value = sinonimoOriginal;
            console.log(i);
        }
        var modal = document.getElementById("myModal");

        modal.style.display = "none";
    }

    //Displays the synomials of a selected word from the dependency tree
    function removeFrase(c) {
        var fr = "divFrases" + c;

        var f = document.getElementById(fr);
        f.remove();
        var contentDiv = document.getElementById("frases");

        if (!contentDiv.querySelector("div")) {
            contentDiv.innerHTML = "<p style='color:#b3a0b1;text-align: center'><em>No hay frases</em></p>";
        }

    }

    function removeFraseCambiada(res, c) {
        var fr = "fraseA" + c;
        var indiceArray = "f" + c;

        var f = document.getElementsByClassName(fr);
        f[0].remove();
        res = "";
        let indice = idCambiados.findIndex(element => element.identificador === indiceArray);
        idCambiados.splice(indice, 1);

        if (idCambiados.length == 0) {
            document.getElementById("frases").className = "col-lg-12";
            document.getElementById("listadoFrasesAdaptadas").style.display = "none";

        }

    }

    function clipboard() {
        var aux = document.createElement("div");
        aux.setAttribute("contentEditable", true);
        aux.innerHTML = document.getElementById("drawFinal").innerHTML;
        aux.setAttribute("onfocus", "document.execCommand('selectAll',false,null)");
        document.body.appendChild(aux);
        aux.focus();
        document.execCommand("copy");
        document.body.removeChild(aux);
        var css = document.createElement("style");
        var estilo = document.createTextNode("#aviso {position:fixed; z-index: 9999999; widht: 120px; top:30%;left:50%;margin-left: -60px;padding: 20px; background: #503961;border-radius: 8px;font-size: 14px;font-family: sans-serif;}");
        css.appendChild(estilo);
        document.head.appendChild(css);
        var aviso = document.createElement("div");
        aviso.setAttribute("id", "aviso");
        var contenido = document.createTextNode("Texto copiado");
        aviso.appendChild(contenido);
        document.body.appendChild(aviso);
        window.load = setTimeout("document.body.removeChild(aviso)", 2000);

    }

    function definition() {
        hideLabel();
        var sin = document.getElementById("internalPanel");

        sin.innerHTML = "";


        document.getElementById("internalPanel").style.display = "block";

        document.getElementById("carga").style.display = "block";

        document.getElementById("mySidebar").style.display = "none";
        var c = document.getElementsByClassName('active');
        var p = c[0].innerText;
        var str = p.replace(/[~`!@#$%^&*(){}\[\];:"'<,.>?¿¡\/\\|_+=-]/g, "")
        var cadena = removeAccents(str)

        var idP = '"' + c[0].id + '"';
        var j = {"word": cadena}
        var jsonObj = JSON.stringify(j);
        fetch(routeDefinition, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonObj
        }).then(response => response.json()
        ).then(data => {
                var elements = data.definiciones;

                var cont = 0;
                var def = '"' + str + '"';
                sin.innerHTML = "<label style='width: 75%;font-size: smaller;margin-top: 10px;'><em>Selecciona una o varias definiciones para adjuntarla al final del texto como glosario</em></label><h4 style='color: brown;padding-top: 10px;'>Definición de <strong>'" + str + "'</strong>:</h4><ul>";
                if (Object.keys(elements).length != 0) {
                    for (var clave in elements) {
                        // Checking that json really has that property
                        if (elements.hasOwnProperty(clave)) {
                            sin.innerHTML += "<li><a class='glosary' id='glosario" + cont + "' <a href='javascript:glosario(" + cont + "," + def + ")'>" + elements[clave].definicion + "</a></li><br>";


                        }
                        cont++;
                    }


                } else {
                    sin.innerHTML += "<li>No se encuentra ninguna definción</li><br>";
                }


            }
        );

        document.getElementById("mySidebar").style.width = "100%";
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("carga").style.display = "none";
        draftFinalText();


    }

      //Remove accents
    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function activateWords() {
        hideLabel();
        document.getElementById("legend").style = "block";
        buttonActivatedComplex = true;
        document.getElementById("internalPanel").style.display = "none";

        document.getElementById("carga").style.display = "block";

        var j = {"text": fraseOriginal}
        var jsonObj = JSON.stringify(j);
        fetch(routeIsSimple, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonObj
        }).then(response => response.json()
        ).then(data => {

            var elements = JSON.parse(data.simpleList);

            console.log(elements);

            for (var clave in fraseOriginal) {
                if (!elements[clave].simple && elements[clave].simple != null) {
                    console.log(elements[clave].id);
                    document.getElementById("elem" + elements[clave].id).classList.add("compleja");
                }

            }

            document.getElementById("carga").style.display = "none";
            document.getElementById("bSimple").style.display = "none";
            document.getElementById("bDesactivarSimple").style.display = "block";

        });


    }

    function activateWordSynonymous(sinonimo, idPalabra) {
        var splitId = idPalabra.split("elem");
        var synonymusWord = [];
        var objectSynonymusWord = {
            id: parseInt(splitId[1]),
            text: sinonimo
        };
        synonymusWord.push(objectSynonymusWord);
        var j = {"text": synonymusWord}
        var jsonObj = JSON.stringify(j);
        fetch(routeIsSimple, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonObj
        }).then(response => response.json()
        ).then(data => {

                var elements = JSON.parse(data.simpleList);

                console.log(elements);

                for (var clave in synonymusWord) {

                    if (!elements[clave].simple && elements[clave].simple != null) {
                        if (!document.getElementById("elem" + elements[clave].id).classList.contains("compleja").valueOf()) {

                            document.getElementById("elem" + elements[clave].id).classList.add("compleja");
                        }
                    } else {
                        if (document.getElementById("elem" + elements[clave].id).classList.contains("compleja").valueOf()) {

                            document.getElementById("elem" + elements[clave].id).classList.remove("compleja");
                        }
                    }

                }


            }
        );


    }

    function deactivateWords() {
        buttonActivatedComplex = false;
        //Recorrects the words to detect if they have the complex class
        for (var clave in fraseOriginal) {
            if (document.getElementById("elem" + fraseOriginal[clave].id).classList.contains("compleja").valueOf()) {
                document.getElementById("elem" + fraseOriginal[clave].id).classList.remove("compleja");
            }

        }
        document.getElementById("bSimple").style.display = "block";

        document.getElementById("bDesactivarSimple").style.display = "none";
        document.getElementById("legend").style.display = "none";

    }

    function openResultPanel() {
        document.getElementById("internalPanel").style.display = "none";
        showPanelEnd();
        pasteContent();
    }

    function pasteContent() {
        var contenido = document.getElementById("resultado");
        contenido.innerText = "";

        contenido.innerHTML += document.getElementById("final").innerText + "\n\n";
        if (definicionesFinal.length > 0) {
            contenido.innerHTML += "Glosario: " + "\n";

            for (var i = 0; i < definicionesFinal.length; i++) {
                contenido.innerHTML += definicionesFinal[i].pal + ": " + definicionesFinal[i].string + "\n";
            }
        }
    }

    function drawDependenciesTree(indice) {
        document.getElementById("transformaciones").style.display = "block";
        document.getElementById("listadoFrases").style.display = "none";
        document.getElementById("dependencias").style.display = "block";



        var seleccion = document.getElementById("frase" + indice).innerText;
        document.getElementById("sentenceOrigin").innerText = seleccion;
        var sentenceP = document.getElementById("sentenceOrigin")
        if(indice.length==2){
            sentenceP.attributes[1].value=indice;
        }else{
          sentenceP.attributes[1].value = "f" + indice;
        }
        fraseElegida =sentenceP.attributes[1].value;

        var j = {"sentence": seleccion}
        var jsonObj = JSON.stringify(j);
        fetch(routeSentencesTree, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonObj
        }).then(response => response.json()
        ).then(data => {

            elements = data;
            console.log(data.tree);
            var identificador = 2;
            var aux = 0;
            fraseOriginal = elements.sentenceIds;
            recoverResultantSentence();
            draftFinalText();
            buildTree(elements.tree, indice, elements.tree.id);


        });
    }

    function buildTree(tree, indice, identificador) {


        var T = tree.children.length;
        if (T > 0) {

            if (tree.height == 0) {
                document.getElementById('dependenciesTree').innerHTML = "<div id='legend' style='display:none; '>" +
                    "<ul><li>Complejas</li></ul></div>" +
                    "<div id='dependencyTree' class='tree'><ul><li  id='lista" + tree.id + "'><div class='family'>" +
                    "<div id='elem" + tree.id + "' class='f" + indice + " person child male'>" +
                    "<a href='javascript:choice(" + tree.id + ")'><div  class='name'>" + tree.text + "</div></a></div></div>" +
                    "<ul id='" + tree.id + "'>";
            } else {
                document.getElementById(identificador).innerHTML += "<li id='lista" + tree.id + "'>" +
                    "<div class='family'><div id='elem" + tree.id + "' class='f" + indice + " person child male'>" +
                    "<a href='javascript:choice(" + tree.id + ")'><div  class='name'>" + tree.text + "</div>" +
                    "</div></div><ul id='" + tree.id + "'>";
            }
            for (var i = 0; i < T; ++i) {
                buildTree(tree.children[i], indice, tree.id);

            }

        } else {
            document.getElementById(identificador).innerHTML += "<li id='lista" + tree.id + "'><div class='family'>" +
                "<div id='elem" + tree.id + "' class='f" + indice + " person child male'>" +
                "<a href='javascript:choice(" + tree.id + ")'><div  class='name'>" + tree.text + "</div></div></div>";

        }

    }


    function glosario(num, palabra) {
        document.getElementById("headerGlosary").style.display = "flex";

        var g = document.getElementById("glosario" + num);
        document.getElementById("listaGlosario").innerHTML += "<p><img src="+routeImgGlosario+" alt=''/>" + palabra + " : " + g.innerText + "</p>";
        var c = document.getElementsByClassName("activaDefinicion");
        g.classList = "glosary gDisabled";
        var ObDeficion = {
            pal: palabra,
            string: g.innerText
        }
        definicionesFinal[contDef] = ObDeficion;
        contDef++;


    }

    //Retrieves the phrase to save it in the change array
    function recoverResultantSentence() {
        var string = "";
        for (var i = 0; i < fraseOriginal.length; i++) {

            string += fraseOriginal[i].text + " ";

        }

        var ObjFrases = {
            identificador: fraseElegida,
            cadena: string
        };
        let indice = idCambiados.findIndex(element => element.identificador === fraseElegida);
        if (indice === -1) {
            idCambiados.push(ObjFrases);
            console.log(idCambiados);
            console.log("No esta");
        } else {
            console.log("Esta en el array")
            idCambiados[indice].cadena = string;
            console.log(idCambiados);
        }

    }