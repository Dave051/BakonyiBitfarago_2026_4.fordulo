//fel 1.
var primszam = document.getElementById("primszam");
var primgomb = document.getElementById("primgomb");
var eredmeny = document.createElement("p");
primgomb.after(eredmeny);

function lnko(a, b) {
	while (b !== 0) {
		var maradek = a % b;
		a = b;
		b = maradek;
	}

	return a;
}

function relativPrimLista(alap) {
	var relativPrimek = [];

	for (var szam = 2; szam <= 100; szam++) {
		if (lnko(alap, szam) === 1) {
			relativPrimek.push(szam);
		}
	}

	return relativPrimek;
}

primgomb.addEventListener("click", function() {
	var alap = Number(primszam.value);

	if (!Number.isInteger(alap) || alap < 2 || alap > 100) {
		eredmeny.textContent = "Adj meg egy számot 2 és 100 között!";
		return;
	}

	eredmeny.textContent = relativPrimLista(alap).join(", ");
});