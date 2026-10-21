let cards = [document.getElementById('card-0'), document.getElementById('card-1'), document.getElementById('card-2')];
        let positions = [20, 160, 300];
        let cardPos = [0, 1, 2];
        let redIndex = 0;
        let canClick = false;
        let swapCount = 0;
        let maxSwaps = 12;
        let currentSpeed = 400;
        let swapInterval;
        let msg = document.getElementById('msg');
        document.getElementById('start-btn').addEventListener('click', startGame);
        for (let i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', function () {
                if (!canClick) return;
                canClick = false;
                let isRed = (i === redIndex);
                for (let j = 0; j < cards.length; j++) {
                    cards[j].style.backgroundImage = 'none';
                    if (j === redIndex) {
                        cards[j].style.backgroundColor = "red";
                    } else {
                        cards[j].style.backgroundColor = "black";
                    }
                }
                setTimeout(() => {
                    if (isRed) {
                        msg.innerHTML = "Eltaláltad! Ez a piros!";
                    } else {
                        msg.innerHTML = "Nem talált, ez fekete.";
                    }
                    document.getElementById('start-btn').disabled = false;
                }, 100);
            });
        }
        function startGame() {
            canClick = false;
            document.getElementById('start-btn').disabled = true;
            msg.innerHTML = "Jegyezd meg, hol van a piros!";
            redIndex = Math.floor(Math.random() * 3);
            for (let i = 0; i < cards.length; i++) {
                cards[i].style.backgroundImage = 'none';
                if (i === redIndex) {
                    cards[i].style.backgroundColor = "red";
                } else {
                    cards[i].style.backgroundColor = "black";
                }
            }
            setTimeout(function () {
                for (let i = 0; i < cards.length; i++) {
                    cards[i].style.backgroundColor = "#555";
                    cards[i].style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 10px, #444 10px, #444 20px)';
                }
                msg.innerHTML = "Keverés...";
                setTimeout(startSwapping, 500);
            }, 2000);
        }
        function startSwapping() {
            swapCount = 0;
            let speedSelect = document.getElementById('speed').value;
            currentSpeed = parseInt(speedSelect);
            for (let i = 0; i < cards.length; i++) {
                cards[i].style.transition = "left " + (currentSpeed / 1000) + "s ease";
            }
            swapInterval = setInterval(doSwap, currentSpeed + 50);
        }
        function doSwap() {
            if (swapCount >= maxSwaps) {
                clearInterval(swapInterval);
                canClick = true;
                msg.innerHTML = "Válassz egy kártyát!";
                return;
            }
            let p1 = Math.floor(Math.random() * 3);
            let p2 = Math.floor(Math.random() * 3);
            while (p1 === p2) {
                p2 = Math.floor(Math.random() * 3);
            }
            let card1Index = cardPos.indexOf(p1);
            let card2Index = cardPos.indexOf(p2);
            cardPos[card1Index] = p2;
            cardPos[card2Index] = p1;
            cards[card1Index].style.left = positions[p2] + "px";
            cards[card2Index].style.left = positions[p1] + "px";
            swapCount++;
        }