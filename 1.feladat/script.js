function futtat() {
            let bekeres = document.getElementById("szam_input").value;
            let szam = parseInt(bekeres);
            let eredmenyDiv = document.getElementById("eredmeny");
            
            eredmenyDiv.innerHTML = "";

            if (szam < 2 || szam > 100 || isNaN(szam)) {
                eredmenyDiv.innerHTML = "Nem jó számot adtál meg!";
                return;
            }

            let szamok = [];

            for (let i = 2; i <= 100; i++) {
                let a = szam;
                let b = i;
                
                while (b > 0) {
                    let maradek = a % b;
                    a = b;
                    b = maradek;
                }
                
                if (a === 1) {
                    szamok.push(i);
                }
            }

            eredmenyDiv.innerHTML = szamok.join(", ");
        }