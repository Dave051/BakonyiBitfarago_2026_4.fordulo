const arena = document.querySelector("#arena");
const statusz = document.querySelector("#jatek-allapot");
const inditasGomb = document.querySelector("#inditas-gomb");
const karikakSzama = document.querySelector("#karikak-szama");
const idoElem = document.querySelector("#ido");

let kovetkezoSzam = 1;
let idozito = null;
let kezdesIdeje = 0;
let futAJatek = false;
let szamokLathatok = true;

function idoFrissitese() {
    const elteltMasodperc = (performance.now() - kezdesIdeje) / 1000;
    idoElem.textContent = `${elteltMasodperc.toFixed(1).replace(".", ",")} mp`;
}

function veletlenPoziciok(darabszam, szelesseg, magassag, atmero) {
    const szegely = atmero / 2 + 8;
    const minimumTavolsag = atmero + 12;
    const poziciok = [];

    for (let index = 0; index < darabszam; index += 1) {
        let ujPozicio = null;

        for (let probalkozas = 0; probalkozas < 500; probalkozas += 1) {
            const x = szegely + Math.random() * (szelesseg - szegely * 2);
            const y = szegely + Math.random() * (magassag - szegely * 2);
            const elfer = poziciok.every((pozicio) => {
                return Math.hypot(pozicio.x - x, pozicio.y - y) >= minimumTavolsag;
            });

            if (elfer) {
                ujPozicio = { x, y };
                break;
            }
        }

        if (ujPozicio) {
            poziciok.push(ujPozicio);
        } else {
            const oszlopok = Math.ceil(Math.sqrt(darabszam * szelesseg / magassag));
            const sorok = Math.ceil(darabszam / oszlopok);
            return Array.from({ length: darabszam }, (_, gridIndex) => {
                const oszlop = gridIndex % oszlopok;
                const sor = Math.floor(gridIndex / oszlopok);
                const x = szegely + (oszlop + 0.5) * (szelesseg - szegely * 2) / oszlopok;
                const y = szegely + (sor + 0.5) * (magassag - szegely * 2) / sorok;

                return { x, y };
            });
        }
    }

    return poziciok;
}

function karikaKattintasakor(szam) {
    if (!futAJatek) {
        return;
    }

    if (szam !== kovetkezoSzam) {
        idoFrissitese();
        futAJatek = false;
        window.clearInterval(idozito);
        arena.querySelectorAll(".karika").forEach((gomb) => {
            gomb.classList.add("karika--hibas");
            gomb.textContent = gomb.dataset.szam;
            gomb.setAttribute("aria-label", `${gomb.dataset.szam}-es karika`);
            gomb.disabled = true;
        });
        inditasGomb.disabled = false;
        karikakSzama.disabled = false;
        inditasGomb.textContent = "Új játék";
        statusz.textContent = `Nem a megfelelő karikára kattintottál. A helyes sorrend újra látható. A játék véget ért. Idő: ${idoElem.textContent}.`;
        return;
    }

    if (szam === 1 && szamokLathatok) {
        szamokLathatok = false;
        arena.querySelectorAll(".karika").forEach((gomb) => {
            gomb.textContent = "";
            gomb.setAttribute("aria-label", "Számozatlan karika");
        });
        statusz.textContent = "Most már emlékezetből kattints a karikákra növekvő sorrendben!";
    }

    kovetkezoSzam += 1;

    if (kovetkezoSzam > Number(karikakSzama.value)) {
        futAJatek = false;
        window.clearInterval(idozito);
        idoFrissitese();
        arena.querySelectorAll(".karika").forEach((gomb) => {
            gomb.classList.add("karika--sikeres");
            gomb.textContent = gomb.dataset.szam;
            gomb.setAttribute("aria-label", `${gomb.dataset.szam}-es karika`);
            gomb.disabled = true;
        });
        inditasGomb.disabled = false;
        karikakSzama.disabled = false;
        inditasGomb.textContent = "Új játék";
        statusz.textContent = `Sikerült! Felhasznált idő: ${idoElem.textContent}.`;
    }
}

function jatekInditasa() {
    window.clearInterval(idozito);
    arena.replaceChildren();

    const darabszam = Number(karikakSzama.value);
    const arenaMeret = arena.getBoundingClientRect();
    const atmero = Math.min(72, Math.max(48, arenaMeret.width * 0.08));
    const poziciok = veletlenPoziciok(
        darabszam,
        arena.clientWidth,
        arena.clientHeight,
        atmero
    );

    kovetkezoSzam = 1;
    szamokLathatok = true;
    futAJatek = true;
    inditasGomb.disabled = true;
    karikakSzama.disabled = true;
    inditasGomb.textContent = "Játék folyamatban";

    poziciok.forEach((pozicio, index) => {
        const szam = index + 1;
        const karika = document.createElement("button");
        karika.type = "button";
        karika.className = "karika";
        karika.textContent = String(szam);
        karika.dataset.szam = String(szam);
        karika.setAttribute("aria-label", `${szam}-es karika`);
        karika.style.left = `${pozicio.x}px`;
        karika.style.top = `${pozicio.y}px`;
        karika.addEventListener("click", () => karikaKattintasakor(szam));
        arena.append(karika);
    });

    statusz.textContent = "Jegyezd meg a karikák helyét, majd kattints rájuk növekvő sorrendben!";
    idoElem.textContent = "0,0 mp";
    kezdesIdeje = performance.now();
    idozito = window.setInterval(idoFrissitese, 100);
}

inditasGomb.addEventListener("click", jatekInditasa);