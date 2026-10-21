        let lehetsegesSzinek = ["green", "yellow", "red", "blue", "black"];
        
        let szinErtekek = {
            "green": 1,
            "yellow": 2,
            "red": 3,
            "blue": 4,
            "black": 5
        };

        let letrehozottVezetekek = [];
        let megoldasSorrend = [];
        let aktualisLepes = 0;
        let jatekMegy = false;

        function generalas() {
            let darabszam = document.getElementById("darab").value;
            let doboz = document.getElementById("jatekTer");
            let uzenetDoboz = document.getElementById("uzenet");
            
            doboz.innerHTML = "";
            uzenetDoboz.innerHTML = "";
            letrehozottVezetekek = [];
            megoldasSorrend = [];
            aktualisLepes = 0;
            jatekMegy = true;

            for (let i = 0; i < darabszam; i++) {
                let veletlenIndex = Math.floor(Math.random() * 5);
                let adottSzin = lehetsegesSzinek[veletlenIndex];
                
                letrehozottVezetekek.push({
                    azonosito: i,
                    szin: adottSzin
                });

                let ujVezetek = document.createElement("div");
                ujVezetek.className = "vezetek";
                ujVezetek.style.backgroundColor = adottSzin;
                
                ujVezetek.onclick = function() {
                    elvagas(i, ujVezetek);
                };

                doboz.appendChild(ujVezetek);
            }

            for (let i = 0; i < letrehozottVezetekek.length; i++) {
                megoldasSorrend.push(letrehozottVezetekek[i]);
            }

            megoldasSorrend.sort(function(a, b) {
                let ertekA = szinErtekek[a.szin];
                let ertekB = szinErtekek[b.szin];
                
                if (ertekA !== ertekB) {
                    return ertekA - ertekB;
                } else {
                    return a.azonosito - b.azonosito;
                }
            });
        }

        function elvagas(kivalasztottId, htmlElem) {
            if (jatekMegy === false) {
                return;
            }

            let vartVezetek = megoldasSorrend[aktualisLepes];

            if (kivalasztottId === vartVezetek.azonosito) {
                htmlElem.style.visibility = "hidden";
                aktualisLepes = aktualisLepes + 1;

                if (aktualisLepes === megoldasSorrend.length) {
                    jatekMegy = false;
                    document.getElementById("uzenet").innerHTML = "Sikeres hatástalanítás!";
                    document.getElementById("uzenet").style.color = "green";
                }
            } else {
                jatekMegy = false;
                document.getElementById("uzenet").innerHTML = "Bumm! Rossz vezetéket vágtál el.";
                document.getElementById("uzenet").style.color = "red";
            }
        }