/* Drag and Drop */
document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('dragstart', function (event) {
        card.classList.add('dragging');
        event.dataTransfer.setData('text/plain', card.dataset.id);
        event.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', function () {
        card.classList.remove('dragging');
    });
});

document.querySelectorAll('.drop-zone').forEach(function (zone) {
    zone.addEventListener('dragover', function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    });

    zone.addEventListener('dragenter', function (event) {
        event.preventDefault();
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', function () {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', function (event) {
        event.preventDefault();
        zone.classList.remove('drag-over');

        const id = event.dataTransfer.getData('text/plain');
        const card = document.querySelector('[data-id="' + id + '"]');

        if (card) {
            const logBox = document.getElementById('logBox');

            if (zone.classList.contains('cell')) {
                zone.appendChild(card);

                const effect = zone.getAttribute('data-effect');
                const cellNum = zone.querySelector('.cell-num').innerText;
                logBox.innerHTML = `Фишка встала на клетку № ${cellNum}<br><b>${effect}</b>`;
            } else {
                const slots = document.querySelectorAll('.player-slot');
                const chipIndex = parseInt(id.replace('chip', '')) - 1;

                if (slots[chipIndex]) {
                    slots[chipIndex].appendChild(card);
                } else {
                    zone.appendChild(card);
                }

                logBox.innerText = 'Фишка возвращена на стартовую панель.';
            }
        }
    });
});


/* Выпадающий блок правил  */
const wrapper = document.getElementById('menuWrapper');
const dropdown = document.getElementById('dropdown');

if (wrapper && dropdown) {
    wrapper.addEventListener('mouseenter', function () {
        dropdown.classList.add('open');
    });

    wrapper.addEventListener('mouseleave', function () {
        dropdown.classList.remove('open');
    });
}

/* Анимация кубика + горячие клавиши */
const rollButton = document.getElementById('rollButton');
const dice = document.getElementById('dice');
const diceValue = document.getElementById('diceValue');
const logBox = document.getElementById('logBox');

function getCellWord(num) {
    if (num === 1) return 'клетку';
    if (num >= 2 && num <= 4) return 'клетки';
    return 'клеток';
}

function rollDice() {
    if (dice.classList.contains('rolling')) return;

    dice.classList.add('rolling');

    let counter = 0;
    const interval = setInterval(() => {
        diceValue.innerText = Math.floor(Math.random() * 6) + 1;
        counter++;
        if (counter > 6) clearInterval(interval);
    }, 80);

    setTimeout(() => {
        const finalNum = Math.floor(Math.random() * 6) + 1;
        diceValue.textContent = finalNum;
        dice.classList.remove('rolling');
        const word = getCellWord(finalNum);
        logBox.innerHTML = `<p>На кубике выпало <b>${finalNum}!</b><br>Передвиньте фишку на ${finalNum} ${word} по стрелкам.</p>`;

        isRolling = false;
    }, 600);
}

if (rollButton) {
    rollButton.addEventListener('click', rollDice);
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        event.preventDefault();
        rollDice();
    }
});