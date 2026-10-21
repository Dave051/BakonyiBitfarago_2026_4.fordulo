let palya = [
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 1, 0, 1],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
            [0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        let latogatasok = [];
        let bitX = 2;
        let bitY = 2;
        let setaloInterval;

        const terkepDiv = document.getElementById('terkep');

        function init() {
            for (let i = 0; i < 10; i++) {
                latogatasok[i] = [];
                for (let j = 0; j < 10; j++) {
                    latogatasok[i][j] = 0;
                }
            }
            latogatasok[bitY][bitX] = 1;
            rajzol();
        }

        function rajzol() {
            terkepDiv.innerHTML = "";
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    let cella = document.createElement('div');
                    cella.className = 'mezo';
                    
                    if (palya[y][x] === 1) {
                        cella.classList.add('fal');
                    } else {
                        cella.innerText = latogatasok[y][x] > 0 ? latogatasok[y][x] : "";
                    }

                    if (x === bitX && y === bitY) {
                        cella.classList.add('bit');
                    }
                    
                    terkepDiv.appendChild(cella);
                }
            }
        }

        function lepes() {
            let iranyok = [
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 }, 
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 }
            ];

            let lehetsegesLepesek = [];

            for (let i = 0; i < iranyok.length; i++) {
                let ujX = bitX + iranyok[i].dx;
                let ujY = bitY + iranyok[i].dy;

                if (ujX >= 0 && ujX < 10 && ujY >= 0 && ujY < 10) {
                    if (palya[ujY][ujX] === 0) {
                        lehetsegesLepesek.push({ x: ujX, y: ujY, ertek: latogatasok[ujY][ujX] });
                    }
                }
            }

            if (lehetsegesLepesek.length === 0) return;

            let minLatogatas = lehetsegesLepesek[0].ertek;
            for (let i = 1; i < lehetsegesLepesek.length; i++) {
                if (lehetsegesLepesek[i].ertek < minLatogatas) {
                    minLatogatas = lehetsegesLepesek[i].ertek;
                }
            }

            let legjobbLepesek = lehetsegesLepesek.filter(lepes => lepes.ertek === minLatogatas);

            let randomIdx = Math.floor(Math.random() * legjobbLepesek.length);
            let valasztott = legjobbLepesek[randomIdx];

            bitX = valasztott.x;
            bitY = valasztott.y;
            latogatasok[bitY][bitX]++;
            
            rajzol();
        }

        function startSeta() {
            stopSeta();
            let sebessegMs = document.getElementById('sebesseg').value;
            setaloInterval = setInterval(lepes, sebessegMs);
        }

        function stopSeta() {
            clearInterval(setaloInterval);
        }

        init();