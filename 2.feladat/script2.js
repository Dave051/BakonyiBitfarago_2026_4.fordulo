let szekek = []
let jelenlegijatekos = 1
let jatek = false
let utolsofoglalasindex = null

const szekszambemenet = document.getElementById("szekszam")
const startgomb = document.getElementById("startgomb")
const aktualisjatekos = document.getElementById("aktualisjatekos")
const status = document.getElementById("status")
const szekekhelye = document.getElementById("szekekhelye")
const P1pontok = document.getElementById("P1pontok")
const P2pontok = document.getElementById("P2pontok")
const jatekvege = document.getElementById("jatekvege")

function jatekbemenet(){
    let szamlalo = parseInt(szekszambemenet.value)
    if (isNaN(szamlalo) || szamlalo<10) szamlalo = 10
    if (szamlalo>20) szamlalo=20
    szekszambemenet.value = szamlalo

    szekek = []
    for (let i = 0; i < szamlalo; i++) {
        const ertek = Math.floor(Math.random()*11)+5
        szekek.push({
            id: i,
            value: ertek,
            owner: null,
            blocked: null
        })
        
    }

    jelenlegijatekos = 1
    jatek = true
    utolsofoglalasindex = null

    jatekvege.innerText = ''
    status.innerText = ''

    updateUI()
}

function szekvalasztas(index) {
    if (!jatek) return

    const szek = szekek[index]

    //1. Szabály: csak szabad széket foglalhatunk el
    if (szek.owner !== null){
        status.innerText = "Ez a szék már le van foglalva"
        return
    }

    //2. Szabály: amikor az aktuális játékos lefoglal egy széket, a másik játékos a következő lépésben nem foglalhatja le annak szomszédait
    if (szek.blocked === jelenlegijatekos){
        status.innerText = "Ez a szék az előző lépés miatt tiltva van a számodra!"
        return
    }

    szek.owner = jelenlegijatekos
    utolsofoglalasindex = index

    szekek.forEach(c => c.blocked = null);

    const kovetkezojatekos = jelenlegijatekos === 1 ? 2 : 1
    if (index>0){
        szekek[index-1].blocked = kovetkezojatekos
    }
    if (index < szekek.length-1){
        szekek[index+1].blocked = kovetkezojatekos
    }

    status.innerText = `Játékos ${jelenlegijatekos} lefoglalt egy ${szek.value} értékű széket.`

    jelenlegijatekos = kovetkezojatekos

    jatekvegeellenorzes()

    if(jatek){
        updateUI()
    }
}

function jatekvegeellenorzes() {
    let elerhetolepesek = szekek.some(c => c.owner === null && c.blocked !== jelenlegijatekos)

    if(!elerhetolepesek){
        jatek = false
        aktualisjatekos.innerText = "A játék véget ért!"

        //pontok kiszámítása
        let ossz1 = 0
        let ossz2 = 0
        szekek.forEach(c => {
            if (c.owner === 1) ossz1 += c.value
            if (c.owner === 2) ossz1 += c.value
        })

        P1pontok.innerText = `Játékos 1 összértéke: ${ossz1}`
        P2pontok.innerText = `Játékos 2 összértéke: ${ossz2}`

        if (ossz1 > ossz2){
            jatekvege.innerText = "Győztes: Játékos 1!"
        } else if (ossz2 > ossz1){
            jatekvege.innerText = "Győztes: Játékos 2!"
        } else{
            jatekvege.innerText = "Döntetlen!"
        }

        updateUI()
    }
}

function updateUI() {
    if (jatek){
        aktualisjatekos.innerText = `Aktuális játékos: Játékos ${jelenlegijatekos}`
    }

    //Pontszámok frissítése menet közben
    let ossz1 = 0
    let ossz2 = 0
    szekek.forEach(c => {
        if (c.owner === 1) ossz1 += c.value
        if (c.owner === 2) ossz2 += c.value
    });
    P1pontok.innerText = `Játékos 1 összértéke: ${ossz1}`
    P2pontok.innerText = `Játékos 2 összértéke: ${ossz2}`

    szekekhelye.innerHTML = ''
    szekek.forEach((szek, index) => {
        const szekdiv = document.createElement("div")
        szekdiv.classList.add("szekdoboz")

        if (szek.owner === 1) {
            szekdiv.classList.add("foglaltp1")
        } else if (szek.owner === 2) {
            szekdiv.classList.add("foglaltp2")
        }else if (szek.blocked === jelenlegijatekos && jatek){
            szekdiv.classList.add("tiltott")
        }

        let szoveg = `Szék #${index+1} (Érték: ${szek.value})`
        if(szek.owner !== null){
            szoveg += ` - Foglalva: Játékos ${szek.owner}`
        } else if(szek.blocked === jelenlegijatekos && jatek){
            szoveg += ` [TILTOTT]`
        }

        const gomb = document.createElement("button")
        gomb.innerText = szoveg
        gomb.disabled = !jatek || szek.owner !== null || (szek.blocked === jelenlegijatekos)

        gomb.addEventListener("click", () => szekvalasztas(index))

        szekdiv.appendChild(gomb)
        szekekhelye.appendChild(szekdiv)
    });
}

startgomb.onclick = jatekbemenet

window.onload = function(){
    jatekbemenet()
}