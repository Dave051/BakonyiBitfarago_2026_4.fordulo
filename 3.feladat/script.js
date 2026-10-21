let szekek = []
let jelenlegijatekos = 1
let jatek = false
let utolsofoglalasindex = null

const szekszambemenet = document.getElementById("szekszam") //chairCountInput
const startgomb = document.getElementById("startgomb")
//startBtn
const aktualisjatekos = document.getElementById("aktualisjatekos") //currentTurnP
const status = document.getElementById("status")
//statusMsgP
const szekekhelye = document.getElementById("szekekhelye") //chairsContainer
const P1pontok = document.getElementById("P1pontok") //scoreP1
const P2pontok = document.getElementById("P2pontok") //scoreP2
const jatekvege = document.getElementById("jatekvege") //gameOverMsg

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
            blocked
        })
        
    }
}