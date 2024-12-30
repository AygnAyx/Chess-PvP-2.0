let initialPosition = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const checkTerritory = [
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true]
];

let validMoves = [];        //Öngörücü için seçili bölgeler
let oldSelect = []          //Önceki Hamlenin seçili bölgeleri
let allOldSelect = [];
let allForwardSelect = [];
let selectedPiece = null;   //Seçili Taşın Karesi
let row
let col

let copyCheckTerritory = JSON.parse(JSON.stringify(checkTerritory)) // Şah Tehtidindeki Bölgeler
let copyPosition        //Gecici Pozisyon
let patCheck = false    //Pat Kontrolü
let checkControl = false    //Pat Kontrolü
let matControl = false    //Pat Kontrolü
let checkStatus         //Şah Kontrolü
let totalPieces         //Toplam taş sayısı
let oldTotalPieces
let movePoint = 0
let allOldPoint = [];
let allForwardPoint = [];

const pieces = {
    'r': 'BRook.png', 'n': 'BKnight.png', 'b': 'BBishop.png',
    'q': 'BQueen.png', 'k': 'BKing.png', 'p': 'BPawn.png',
    'R': 'WRook.png', 'N': 'WKnight.png', 'B': 'WBishop.png',
    'Q': 'WQueen.png', 'K': 'WKing.png', 'P': 'WPawn.png'
};

let positionHistory = [];   //Önceki Hamleler
let fenForward = [];    //Geri alınan hamle
let backMove = false    //Hamle Geri ve İleri alma
let turn = 'White';     //Sıra
let rotation = true     //Tahta Döndürme
let predictive = false  //Öngörücü Hamle
let soundEffect = true  //Öngörücü Hamle
let finishGame = false  //Oyunun Bitmesi
let newGame = true      //Oyuna yeni başlanmış
let turnBoard = false   //Renkleri Döndürme
let indexStyle = 0      //Tema Rengi
let promotionScreen = false
let promotionPiece = null

//let timeBox = true      //Zaman Göstergesi
let timeLimit = {       //Zaman Sayacı
    'White': [false,'00'],
    'Black': [false,'00']
};
      
let enPassantTarget = null; // Geçerken alma hedefi
let oldPawnID = null;       // Geçerken alma hedefi
const kingPositions = {
    'White': [],
    'Black': []
};

let RookOptions = {
    'White': [['A1-White-Rook', true], ['H1-White-Rook', true]],
    'Black': [['A8-Black-Rook', true], ['H8-Black-Rook', true]]
};

// Oyun açılış ekranı fonksiyonu
function displayOpeningScreen() {
    var openingScreen = document.createElement("div");
    openingScreen.id = "opening-screen";
    document.body.appendChild(openingScreen);

    var dialogBox = document.createElement("div");
    dialogBox.id = "dialog-box";
    openingScreen.appendChild(dialogBox);

    var title = document.createElement("h2");
    title.textContent = "Chess 3.0";
    dialogBox.appendChild(title);

    var separator = document.createElement("hr");
    dialogBox.appendChild(separator);

    // Tema Rengi Seçimi
    let colors = [
        "repeating-conic-gradient(#eee0bb 0% 25%, #c8a340 0% 50%)",
        "repeating-conic-gradient(white 0% 25%, black 0% 50%)",
        "repeating-conic-gradient(#8a8a8a 0% 25%, #3f3f3f 0% 50%)",
        "repeating-conic-gradient(#7000ff 0% 25%, #ff00ee 0% 50%)",
        "repeating-conic-gradient(#454545 0% 25%, #00ddff 0% 50%)",
        "repeating-conic-gradient(pink 0% 25%, red 0% 50%)"
    ];
    var themeColorContainer = document.createElement("div");
    themeColorContainer.className = "round-container";

    var themeColorLabel = document.createElement("div");
    themeColorLabel.textContent = "Tema Rengi:";
    themeColorContainer.appendChild(themeColorLabel);

    var roundBox = document.createElement("div");
    roundBox.id = "roundBox";
    roundBox.className = "round-box";
    roundBox.textContent = " ";
    roundBox.addEventListener('click', function() {
    indexStyle = indexStyle === 5 ? 0 : indexStyle+1;
    console.log(indexStyle,colors[indexStyle])
    rotation += 360; // Her tıklamada dönüş derecesini 360 artır
    this.style.transform = `rotate(${rotation}deg)`;
    this.style.backgroundImage = colors[indexStyle];
    changeStyles(indexStyle)
    });
    themeColorContainer.appendChild(roundBox);

    dialogBox.appendChild(themeColorContainer);

    // Hamle Geri Alma Toggle Düğmesi
    var optionContainer1 = document.createElement("label");
    optionContainer1.className = "option-container";
    var backMoveLabel = document.createElement("div");
    backMoveLabel.textContent = "Hamle Geri Alma:";
    var switchContainer1 = document.createElement("div");
    switchContainer1.className = "switch";
    var backMoveCheckbox = document.createElement("input");
    backMoveCheckbox.type = "checkbox";
    backMoveCheckbox.id = "back-move-toggle";
    backMoveCheckbox.checked = false; // Varsayılan olarak aktif
    var slider1 = document.createElement("span");
    slider1.className = "slider";
    switchContainer1.appendChild(backMoveCheckbox);
    switchContainer1.appendChild(slider1);
    optionContainer1.appendChild(backMoveLabel);
    optionContainer1.appendChild(switchContainer1);
    dialogBox.appendChild(optionContainer1);

    // Öngörücü Hamle Toggle Düğmesi
    var optionContainer2 = document.createElement("label");
    optionContainer2.className = "option-container";
    var fitureMoveLabel = document.createElement("div");
    fitureMoveLabel.textContent = "Öngörücü Hamle:";
    var switchContainer2 = document.createElement("div");
    switchContainer2.className = "switch";
    var fitureMoveCheckbox = document.createElement("input");
    fitureMoveCheckbox.type = "checkbox";
    fitureMoveCheckbox.id = "fiture-move-toggle";
    fitureMoveCheckbox.checked = false; // Varsayılan olarak aktif
    var slider2 = document.createElement("span");
    slider2.className = "slider";
    switchContainer2.appendChild(fitureMoveCheckbox);
    switchContainer2.appendChild(slider2);
    optionContainer2.appendChild(fitureMoveLabel);
    optionContainer2.appendChild(switchContainer2);
    dialogBox.appendChild(optionContainer2);

    // Tahtayı Döndürme Alma Toggle Düğmesi
    var optionContainer3 = document.createElement("label");
    optionContainer3.className = "option-container";
    var backMoveLabel = document.createElement("div");
    backMoveLabel.textContent = "İlk Hamle Aşağıda:";
    var switchContainer3 = document.createElement("div");
    switchContainer3.className = "switch";
    var backMoveCheckbox = document.createElement("input");
    backMoveCheckbox.type = "checkbox";
    backMoveCheckbox.id = "turn-board-toggle";
    backMoveCheckbox.checked = true; // Varsayılan olarak aktif
    var slider3 = document.createElement("span");
    slider3.className = "slider";
    switchContainer3.appendChild(backMoveCheckbox);
    switchContainer3.appendChild(slider3);
    optionContainer3.appendChild(backMoveLabel);
    optionContainer3.appendChild(switchContainer3);
    dialogBox.appendChild(optionContainer3);

    // Dönen Tahta (Rotate Board) Toggle Düğmesi
    var optionContainer4 = document.createElement("label");
    optionContainer4.className = "option-container";
    var rotateBoardLabel = document.createElement("div");
    rotateBoardLabel.textContent = "Dönen Tahta:";
    var switchContainer4 = document.createElement("div");
    switchContainer4.className = "switch";
    var rotateBoardCheckbox = document.createElement("input");
    rotateBoardCheckbox.type = "checkbox";
    rotateBoardCheckbox.id = "rotate-board-toggle";
    rotateBoardCheckbox.checked = true; // Varsayılan olarak aktif
    var slider4 = document.createElement("span");
    slider4.className = "slider";
    switchContainer4.appendChild(rotateBoardCheckbox);
    switchContainer4.appendChild(slider4);
    optionContainer4.appendChild(rotateBoardLabel);
    optionContainer4.appendChild(switchContainer4);
    dialogBox.appendChild(optionContainer4);

    // Ses Efecti Toggle Düğmesi
    var optionContainer5 = document.createElement("label");
    optionContainer5.className = "option-container";
    var soundEffectLabel = document.createElement("div");
    soundEffectLabel.textContent = "Ses Efectleri:";
    var switchContainer5 = document.createElement("div");
    switchContainer5.className = "switch";
    var soundEffectCheckbox = document.createElement("input");
    soundEffectCheckbox.type = "checkbox";
    soundEffectCheckbox.id = "sound-effect-toggle";
    soundEffectCheckbox.checked = true; // Varsayılan olarak aktif
    var slider5 = document.createElement("span");
    slider5.className = "slider";
    switchContainer5.appendChild(soundEffectCheckbox);
    switchContainer5.appendChild(slider5);
    optionContainer5.appendChild(soundEffectLabel);
    optionContainer5.appendChild(switchContainer5);
    dialogBox.appendChild(optionContainer5);

    // Süre Odağı (Time Control) Ayarı
    var timeControlContainer = document.createElement("div");
    timeControlContainer.className = "time-option-container";

    var timeControlLabel = document.createElement("label");
    timeControlLabel.textContent = "Oyun Süresi: ";
    var timeControlSelection = document.createElement("span");
    timeControlSelection.className = "time-selection";
    timeControlSelection.textContent = "Süresiz";
    timeControlSelection.id = "selectionTime"
    timeControlLabel.appendChild(timeControlSelection);

    var timeControlSlider = document.createElement("input");
    timeControlSlider.type = "range";
    timeControlSlider.min = 0;
    timeControlSlider.max = 5;
    timeControlSlider.value = 5; // Varsayılan olarak süresiz seçili

    var timeOptions = [1, 3, 5, 10, 30, "Süresiz"];

    timeControlSlider.addEventListener("input", function () {
        var selectedTime = timeOptions[timeControlSlider.value];
        timeControlSelection.textContent = selectedTime + (selectedTime === "Süresiz" ? "" : " Dakika");

        // Seçili olmayan kısmı gri yap
        var ratio = (timeControlSlider.value - timeControlSlider.min) / (timeControlSlider.max - timeControlSlider.min) * 100;
        timeControlSlider.style.background = `linear-gradient(90deg, #a5e600 ${ratio}%, #dbdbdb ${ratio}%)`;
    });

    // İlk durumda da doğru rengi ayarla
    var initialRatio = (timeControlSlider.value - timeControlSlider.min) / (timeControlSlider.max - timeControlSlider.min) * 100;
    timeControlSlider.style.background = `linear-gradient(90deg, #a5e600 ${initialRatio}%, #dbdbdb ${initialRatio}%)`;

    timeControlContainer.appendChild(timeControlLabel);
    timeControlContainer.appendChild(timeControlSlider);
    dialogBox.appendChild(timeControlContainer);



    // Yeni Oyun ve Önceki Oyun butonları
    var buttonGroup = document.createElement("div");
    var loadGameButton = document.createElement("button");
    if(localStorage.getItem('chessGameState') === null){
        loadGameButton.style.opacity = 0.5
        loadGameButton.disabled = true
        loadGameButton.style.cursor = "not-allowed"
    }
    loadGameButton.textContent = "Önceki Oyun";
    loadGameButton.addEventListener("click", function () {
        openingScreen.remove();
        loadPreviousGame();
    });
    buttonGroup.className = "button-group";
    var newGameButton = document.createElement("button");
    newGameButton.textContent = "Yeni Oyun";
    newGameButton.addEventListener("click", function () {
        let backMoveToggle = document.getElementById("back-move-toggle");
        backMove = backMoveToggle.checked
        let rotateBoard = document.getElementById("rotate-board-toggle");
        rotation = rotateBoard.checked
        let turnToBoard = document.getElementById("turn-board-toggle");
        turnBoard = !turnToBoard.checked
        let fitureMoveToggle = document.getElementById("fiture-move-toggle");
        predictive = fitureMoveToggle.checked
        let soundOptions = document.getElementById("sound-effect-toggle");
        soundEffect = soundOptions.checked
        //rotation = rotateBoard.checked
        console.log("turnBoard",turnBoard)
        console.log("rotation",rotation)
        let selectionTime = document.getElementById("selectionTime");
        if(!(selectionTime.textContent === 'Süresiz')){
            timeLimit['White'][0] = selectionTime.textContent.split(' ')[0]
            timeLimit['Black'][0] = selectionTime.textContent.split(' ')[0]
        }
        else{
            timeLimit['White'][0] = false
            timeLimit['Black'][0] = false
        }
        openingScreen.remove();
        startNewGame();
    });
    buttonGroup.appendChild(loadGameButton);
    buttonGroup.appendChild(newGameButton);


    dialogBox.appendChild(buttonGroup);
}

// Yeni oyun başlatma fonksiyonu
function startNewGame() {
    if(soundEffect) playMoveSound("Start") // Ses efecti
    console.log("Yeni Oyun Başlatıldı");
    console.log(RookOptions['White']);
    localStorage.removeItem('chessGameState'); // Yeni oyun için önceki durumu temizle
    StartGame(initialPosition)
    disabledElement()
}

// Önceki oyunu yükleme fonksiyonu
function loadPreviousGame() {
    console.log("Önceki Oyun Yüklendi");
    var savedGameState = localStorage.getItem('chessGameState');
    if (savedGameState) {
        initialPosition = JSON.parse(savedGameState).board
        RookOptions = JSON.parse(savedGameState).rook
        turn = JSON.parse(savedGameState).turn
        movePoint = JSON.parse(savedGameState).point
        allOldPoint = JSON.parse(savedGameState).oldPoint
        allForwardPoint = JSON.parse(savedGameState).forwardPoint
        finishGame = JSON.parse(savedGameState).finished
        rotation = JSON.parse(savedGameState).rotation
        turnBoard = JSON.parse(savedGameState).turnBoard
        timeLimit = JSON.parse(savedGameState).time
        predictive = JSON.parse(savedGameState).predictive
        backMove = JSON.parse(savedGameState).backMove
        positionHistory = JSON.parse(savedGameState).history
        fenForward = JSON.parse(savedGameState).forward
        indexStyle = JSON.parse(savedGameState).style
        oldSelect = JSON.parse(savedGameState).select
        allOldSelect = JSON.parse(savedGameState).allOldSelect
        allForwardSelect = JSON.parse(savedGameState).allForwardSelect
        promotionScreen = JSON.parse(savedGameState).pScreen
        promotionPiece = JSON.parse(savedGameState).pPiece
        checkStatus = JSON.parse(savedGameState).check
        soundEffect = JSON.parse(savedGameState).sound
        StartGame(initialPosition)
        changeStyles(indexStyle)
        if(promotionScreen && promotionPiece){
            console.log("OPOP",promotionPiece)
            pawnPromotionDialog(promotionPiece, oldSelect[1][0], oldSelect[1][1])
        }
        if(soundEffect) playMoveSound("Start") // Ses efecti
        if(predictive)
            selectOption(true)
        else
            selectOption(false)
        disabledElement()
        // Tahta ve taşları güncelleme işlemleri burada yapılmalı
    } else {
        alert("Önceki oyun bulunamadı.");
        location.reload();
    }
}

// Sayfa yüklendiğinde açılış ekranını göster
window.onload = function() {
    displayOpeningScreen();
}

//Zaman Göstergesi
//createBox fonksiyonu, belirli parametreler kullanarak bir kutu oluşturur ve sayacı başlatır
function createBox(containerId, timerId, inverted = 'Black') {
    const container = document.getElementById(containerId);
    const box = document.createElement('div');
    box.className = 'time-box' + (inverted === 'Black' ? ' inverted' : '');

    const leftButton = document.createElement('button');
    leftButton.className = 'round-button left' + (inverted === 'Black' ? ' inverted' : '');
    leftButton.id = 'roundLeft' + (inverted === 'Black' ? 'Black' : '');
    leftButton.innerHTML = '&#x276E;';
    box.appendChild(leftButton);

    const timer = document.createElement('div');
    timer.id = timerId;
    timer.className = 'timer' + (inverted === 'Black' ? ' inverted' : '');
    if(timer.className === 'timer inverted' && rotation)
        timer.style.transform = 'rotate(180deg)';
    if(!rotation && turnBoard)
        timer.style.transform = 'rotate(180deg)';
    timer.innerText = !(timeLimit[inverted][0] === false)
        ? timeLimit[inverted][0] + ":" + timeLimit[inverted][1]
        : '';
    box.appendChild(timer);

    const rightButton = document.createElement('button');
    rightButton.className = 'round-button right' + (inverted === 'Black' ? ' inverted' : '');
    rightButton.id = 'roundRight' + (inverted === 'Black' ? 'Black' : '');
    rightButton.innerHTML = '&#x276F;';
    box.appendChild(rightButton);

    container.appendChild(box);

    if (!(timeLimit[inverted][0] === false)) {
        startTimer(timerId, inverted);
    }

    if (turnBoard) {    // Renklein konumuna göre Butonların idlerini değiştir
        leftButton.id = "roundRight" + (inverted === 'Black' ? 'Black' : '');
        rightButton.id = "roundLeft" + (inverted === 'Black' ? 'Black' : '');
    }

    //Butonların işlevleri
    leftButton.addEventListener('click', function () {
        if(soundEffect) playMoveSound("Move1") // Ses efecti
        if(turnBoard)   //Renklerin konumuna göre butonların işlevini tersine çevir
            fenToForward(positionHistory);
        else
            fenToBack(positionHistory);
        disabledElement();
    });

    rightButton.addEventListener('click', function () {
        if(soundEffect) playMoveSound("Move1") // Ses efecti
        if(turnBoard)   //Renklerin konumuna göre butonların işlevini tersine çevir
            fenToBack(positionHistory);
        else
            fenToForward(positionHistory);
        disabledElement();
    });
}


// startTimer fonksiyonu, belirtilen elementte geri sayım başlatır
function startTimer(elementId, inverted) {
    console.log("X289")
    // elementId ile belirtilen elementi bul
    const timerElement = document.getElementById(elementId);

    // Metni dakika ve saniye olarak böl ve numaraya dönüştür
    let [minutes, seconds] = timerElement.innerText.split(':').map(Number);
    
    // Her 1 saniyede bir çalışacak bir interval ayarla
    const interval = setInterval(() => {
        // Aktif olmayan sayaç durur
        if (((timeLimit[turn][0] === false)) || !(finishGame === false) || (promotionScreen === true) || ((turn === 'White' && inverted === 'Black') || (turn === 'Black' && inverted === 'White'))) {
            return;
        }
        timeLimit[inverted] = [minutes, seconds]
        //console.log(timeLimit[inverted][0],":",timeLimit[inverted][1])
        // Saniye sıfır ise
        if (seconds === 0) {
            // Dakika da sıfır ise
            if (minutes === 0) {
                // Interval'ı durdur
                clearInterval(interval);
                // Uyarı mesajı göster
                displayCheckmateDialog("Süre",turn,"Süre Doldu")
                return;
            }
            // Dakikayı bir azalt
            minutes--;
            // Saniyeyi 59 yap
            seconds = 59;
        } else {
            // Saniyeyi bir azalt
            seconds--;
        }

        // Timer elementinin metnini güncelle
        timerElement.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
} 

//Butonları aktifliği ve opaklığı
function disabledElement(){
    console.log("Ds0",backMove,!(timeLimit[turn][0] === false),Boolean(backMove || !(timeLimit[turn][0] === false)))
    if(backMove || !(timeLimit[turn][0] === false)){
        console.log("Ds1",backMove,!(timeLimit[turn][0] === false))
        if(turn === 'White'){
            document.getElementById('container1').style.opacity = 0.5
            document.getElementById('container2').style.opacity = 1
            document.getElementById("roundRightBlack").classList.add('no-hover'); 
            document.getElementById("roundLeftBlack").classList.add('no-hover');
            document.getElementById("roundRight").classList.add('no-hover'); 
            document.getElementById("roundLeft").classList.add('no-hover');
            document.getElementById("roundRightBlack").style.opacity = 0.1
            document.getElementById("roundLeftBlack").style.opacity = 0.1 
            document.getElementById("roundRight").style.opacity = 0.1
            document.getElementById("roundLeft").style.opacity = 0.1 
            if(backMove){
                    if(!(positionHistory.length === 0)){
                        document.getElementById("roundLeft").classList.remove('no-hover'); 
                        document.getElementById("roundLeft").style.opacity = 1
                    }
                    if(!(fenForward.length === 0)){
                        document.getElementById("roundRight").classList.remove('no-hover')
                        document.getElementById("roundRight").style.opacity = 1
                    }
                }
        }else{
            document.getElementById('container1').style.opacity = 1
            document.getElementById('container2').style.opacity = 0.5
            document.getElementById("roundRightBlack").classList.add('no-hover'); 
            document.getElementById("roundLeftBlack").classList.add('no-hover');
            document.getElementById("roundRight").classList.add('no-hover'); 
            document.getElementById("roundLeft").classList.add('no-hover');
            document.getElementById("roundRightBlack").style.opacity = 0.1
            document.getElementById("roundLeftBlack").style.opacity = 0.1 
            document.getElementById("roundRight").style.opacity = 0.1
            document.getElementById("roundLeft").style.opacity = 0.1 
            if(backMove){
                    if(!(positionHistory.length === 0)){
                        document.getElementById("roundLeftBlack").classList.remove('no-hover'); 
                        document.getElementById("roundLeftBlack").style.opacity = 1
                    }
                    if(!(fenForward.length === 0)){
                        document.getElementById("roundRightBlack").classList.remove('no-hover')
                        document.getElementById("roundRightBlack").style.opacity = 1
                    }
                }
        }
    }
}

//Taşları Dizen ve Oyunu Başlatan fonksiyon
function StartGame(stonePosition){
    if(!(oldSelect === undefined) && !(oldSelect[0] === undefined)){ 
        selectSquare = document.querySelector(`[data-row="${oldSelect[0][0]}"][data-col="${oldSelect[0][1]}"]`)
        selectSquare.classList.add('select')
        selectSquare = document.querySelector(`[data-row="${oldSelect[1][0]}"][data-col="${oldSelect[1][1]}"]`)
        selectSquare.classList.add('select')
    }
    if(turnBoard){
        console.log("turnBoard",turnBoard)
        let mainCont = document.getElementById("mainCont")
        mainCont.style.transform = 'rotate(180deg)'
    }
    if((!(timeLimit[turn][0] === false) || backMove) && newGame){
        console.log("Ds3")
        //Göstergeyi Ekle
            createBox('container1', 'timer1'); // İlk kutuyu oluştur ve timer'ı başlat
            createBox('container2', 'timer2', 'White'); // İkinci kutuyu oluştur ve timer'ı başlat (inverted)
        if(turn === 'White'){
            document.getElementById('container1').style.opacity = 0.5
            document.getElementById('container2').style.opacity = 1
        }else{
            document.getElementById('container2').style.opacity = 0.5
            document.getElementById('container1').style.opacity = 1
    }}
    if(positionHistory[0] == null && backMove){
            document.getElementById("roundRightBlack").classList.add('no-hover'); 
            document.getElementById("roundLeftBlack").classList.add('no-hover'); 
            document.getElementById("roundRight").classList.add('no-hover'); 
            document.getElementById("roundLeft").classList.add('no-hover');
            document.getElementById("roundRightBlack").style.opacity = 0.1; 
            document.getElementById("roundLeftBlack").style.opacity = 0.1; 
            document.getElementById("roundRight").style.opacity = 0.1; 
            document.getElementById("roundLeft").style.opacity = 0.1;
        }
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
            if (stonePosition[row][col] !== ' ') {
                const piece = document.createElement('div');
                const pieceColor = pieces[stonePosition[row][col]][0] === 'W' ? 'White' : 'Black';
                const pieceName = `${pieceColor}-${pieces[stonePosition[row][col]].slice(1, -4)}`;
                const pieceId = `${String.fromCharCode(65 + col)}${8 - row}-${pieceName}`;
                piece.id = pieceId;
                piece.className = 'piece';
                piece.style.backgroundImage = `url('png/${pieces[stonePosition[row][col]]}')`;
                square.appendChild(piece);
                piece.setAttribute('data-name', pieceName);
    
                // İlk hamle bayrağını ata
                if (pieces[stonePosition[row][col]].endsWith('King.png') || pieces[stonePosition[row][col]].endsWith('Rook.png')){
                    let color = stonePosition[row][col].charCodeAt() < 97 ? "White" : "Black"
                    let pointer = true
                    if(!(pieces[stonePosition[row][col]].endsWith('King.png'))){
                        if(pieceId.includes("A8") || pieceId.includes("A1")){
                            pointer = RookOptions[color][0][1];
                        }else if(pieceId.includes("H8") || pieceId.includes("H1")){
                            pointer = RookOptions[color][1][1];
                        }else{
                            pointer = false
                        }
                    }
                    console.log(pieceId,color,pointer)
                    piece.setAttribute('data-first-move', pointer);

                }
    
                // Şah pozisyonunu belirle
                if (pieces[stonePosition[row][col]].endsWith('King.png') && newGame) {
                    kingPositions[pieceColor].push([row, col]);
                }
            }
        }
    }
    
    if(turnBoard && !rotation){
            rotatePieces('Black')
    }else
        rotatePieces(turn)
    if(!(finishGame === false))
        displayCheckmateDialog(finishGame[0],finishGame[1],finishGame[2])
    
}

// Tahtayı Çizen fonksiyon
function setupBoard() {
    const chessboard = document.getElementById('chessboard');

    // Chessboard container
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('chessboard');
    boardContainer.id = "boardContainer"

    // Harf çizelgesi satırını oluştur
    function createLabelRow(reverse = false) {
        const labelRow = document.createElement('div');
        labelRow.classList.add('row');
        labelRow.classList.add('label-row');

        // Harf çizelgesi hücrelerini ekleyelim
        for (let col = 0; col < 8; col++) {
            const labelCell = document.createElement('div');
            labelCell.className = 'label-cell';
            labelCell.textContent = String.fromCharCode(65 + col); // A'dan H'ye kadar
            labelCell.style.transform = reverse ? 'rotate(180deg)' : 'none'; // Ters döndürme
            labelRow.appendChild(labelCell);
        }

        return labelRow;
    }

    // Harf çizelgesi satırlarını tahtaya ekle
    boardContainer.appendChild(createLabelRow(true)); // Üstteki harfler ters

    // Satranç tahtasını oluştur
    for (let row = 0; row < 8; row++) {
        // Satır container
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row');

        // Sayı çizelgesi hücresi (sol)
        const leftNumberCell = document.createElement('div');
        leftNumberCell.className = 'number-label';
        leftNumberCell.textContent = 8 - row; // 8'den 1'e kadar
        rowContainer.appendChild(leftNumberCell);

        // Tahta karelerini oluştur
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', onSquareClick);
            rowContainer.appendChild(square);
        }

        // Sayı çizelgesi hücresi (sağ, ters)
        const rightNumberCell = document.createElement('div');
        rightNumberCell.className = 'number-label';
        rightNumberCell.textContent = 8 - row; // 8'den 1'e kadar ters
        rightNumberCell.style.transform = 'rotate(180deg)'; // Ters döndürme
        rowContainer.appendChild(rightNumberCell);

        // Satır containerını tahtaya ekle
        boardContainer.appendChild(rowContainer);
    }

    // Harf çizelgesi satırını tahtanın altına ekle
    boardContainer.appendChild(createLabelRow(false)); // Alttaki harfler düz

    // Tahtayı sayfaya ekle
    chessboard.appendChild(boardContainer);
}

document.addEventListener('DOMContentLoaded', setupBoard);

/* Örnek bir tıklama olay dinleyicisi
function onSquareClick(event) {
    console.log(`Clicked on square: Row ${event.target.dataset.row}, Col ${event.target.dataset.col}`);
}
*/

//Hamleleri denetleyen fonksiyon
function onSquareClick(event) {
    const square = event.currentTarget;
    row = parseInt(square.dataset.row);
    col = parseInt(square.dataset.col);
    console.log("onSquareClick", selectedPiece);

    if (selectedPiece) {
        //aynı renkte taşlar arasında daha hızlı geçiş
        if(((initialPosition[selectedPiece[0]][selectedPiece[1]].charCodeAt(0) < 97 && initialPosition[row][col].charCodeAt(0) < 97) && !(initialPosition[row][col] === ' ') || 
            (initialPosition[selectedPiece[0]][selectedPiece[1]].charCodeAt(0) >= 97 && initialPosition[row][col].charCodeAt(0) >= 97)) && !((initialPosition[selectedPiece[0]][selectedPiece[1]].toLowerCase() === 'r' && initialPosition[row][col].toLowerCase() === 'k') || (initialPosition[selectedPiece[0]][selectedPiece[1]].toLowerCase() === 'k' && initialPosition[row][col].toLowerCase() === 'r'))){
            console.log("333AAA0",selectedPiece,[row, col])
            validFon(false,predictive)
            selectedPiece = null;
            selectSquare.classList.remove('select')
            selectedPiece = [row, col]
            selectToSquare(selectedPiece)
            return;
        }
        //rook için kral ve rook değerlerini değiştirme
        if(((initialPosition[selectedPiece[0]][selectedPiece[1]].charCodeAt(0) < 97 && initialPosition[row][col].charCodeAt(0) < 97) && !(initialPosition[row][col] === ' ') || 
            (initialPosition[selectedPiece[0]][selectedPiece[1]].charCodeAt(0) >= 97 && initialPosition[row][col].charCodeAt(0) >= 97)) && (initialPosition[selectedPiece[0]][selectedPiece[1]].toLowerCase() === 'k' && initialPosition[row][col].toLowerCase() === 'r')){
            console.log("333AAA",selectedPiece,[row, col])
            let gecici = [...selectedPiece]; // selectedPiece'in kopyasını al
            selectedPiece = [row, col];
            [row, col] = gecici;
            console.log("333AAAZ",selectedPiece,[row, col],gecici)
        }
        console.log("PPP000")
        if (isValidMove(selectedPiece, [row, col])) {
            console.log("PPP010")
            // Geçici olarak hamleyi yap
            const tempPiece = initialPosition[row][col];
            const [selectedRow, selectedCol] = selectedPiece;
            initialPosition[row][col] = initialPosition[selectedRow][selectedCol];
            initialPosition[selectedRow][selectedCol] = ' ';

            // Eğer şah hareket ettirildiyse, kingPositions güncelle
            if (initialPosition[row][col].toLowerCase() === 'k') {
                kingPositions[turn][0] = [row, col];
            }
            
            // Şah durumunu kontrol et
            checkStatus = isCheck(turn,true,false,initialPosition);
            console.log("Şah durumu:", checkStatus);
            
            // Hamleyi geri al
            initialPosition[selectedRow][selectedCol] = initialPosition[row][col];
            initialPosition[row][col] = tempPiece;
            
            // Eğer şah hareket ettirildiyse, geri al (Bunu Kontrol et!!!!!!!!!!!!!!!!!!!!!!!!!!)
            if (initialPosition[selectedRow][selectedCol].toLowerCase() === 'k') {
                kingPositions[turn][0] = [selectedRow, selectedCol];
            }
            console.log("ŞŞŞ Şah nerede",initialPosition[selectedRow][selectedCol].toLowerCase(),selectedRow,selectedCol,row,col,kingPositions[turn][0])

            console.log("PPP020")
            if (checkStatus) {
                console.log("Hamle şah durumu yaratıyor, geçersiz hamle.");
                if(promotionScreen){
                    document.getElementById("promotion-dialog").remove();
                }
            } else {
                console.log("PPP100",selectedPiece, [row, col])
                // Hamleyi kalıcı yap
                movePiece(selectedPiece, [row, col]);
                //if(soundEffect) playMoveSound("Move2") // Ses efecti
                //Önceki selectleri geri al
                if((!(oldSelect === undefined) && !(oldSelect[0] === undefined)) && predictive){
                    console.log("ÖÖ",oldSelect)
                    selectOption(false)
                }
                movePoint++ // 50 Hamle sayacı
                oldTotalPieces = totalPieces
                countPieces(initialPosition)
                if((oldTotalPieces > totalPieces) || initialPosition[row][col].toLowerCase() === 'p') // 50 Hamle kuralı sıfırla (Taş yenilmişse veya piyon sürülmüşse)
                    movePoint = 0
                allOldPoint.push(movePoint)
                //fenForward = [] //Önceden kaydedilen geri alınan hamlesi sil
                //Önceki hamleler
                oldSelect = [selectedPiece,[row,col]]
                if(predictive){
                    selectOption(true)
                }
                else
                    selectSquare.classList.remove('select','back')
                console.log("SSTX",selectSquare)
                console.log("MovePoint",movePoint,allOldPoint)
                //console.log("6666 GeçerkenTaş:",initialPosition[enPassantTarget[0]][enPassantTarget[1]],initialPosition[enPassantTarget[0]][enPassantTarget[1]].charCodeAt(0),' '.charCodeAt(0))
                validFon(false,predictive)
                selectedPiece = null;
                //Geçerken alma Taşını unutma
                if(!patCheck && enPassantTarget !== null && !((turn ==='Black' && initialPosition[enPassantTarget[0]][enPassantTarget[1]].charCodeAt(0)  === 112) || (turn ==='White' && initialPosition[enPassantTarget[0]][enPassantTarget[1]].charCodeAt(0) === 80)))
                    enPassantTarget = null; // Geçerken alma hedefini sıfırla
                //Sıra değiştirme
                turn = turn === 'White' ? 'Black' : 'White';
                //Sayacın Opaklığını değiştir.
                if(!(timeLimit[turn][0] === false) || backMove){
                    disabledElement();
                }
                //Şah Durumu kontrolü
                checkStatus= isCheck(turn,false,false,initialPosition)
                console.log("checkStatus1111",checkStatus)
                if(checkStatus && soundEffect) playMoveSound("Check") // Ses efecti
                console.log("checkStatus1112",checkStatus)
                //Hamle Tekrarı Kaydet
                addPositionToHistory(initialPosition, turn);
                //Mat Kontrolü
                if(checkStatus && !(isCheckmate(turn))){
                    console.log("EEEE Check-mate")
                    displayCheckmateDialog(turn,[row, col])
                }
                //50 Hamle Kuralı
                else if(movePoint === 50){
                    console.log("EEEE 50 Hamle kuralı")
                    displayCheckmateDialog('Berabere','',"50 Hamle Kuralı")
                }
                // Üç kez tekrarlanan pozisyon olup olmadığını kontrol et
                else if (checkThreefoldRepetition()){
                    console.log("EEEE 3 Tekrar")
                    displayCheckmateDialog('Berabere','',"Üç Kez Tekrarlanan Pozisyon")
                }
                //Pat Konrol
                else if(isStalemate(turn)){
                    if(checkStatus) // Şah durumu varsa
                        displayCheckmateDialog(turn,[row, col])
                    else
                        displayCheckmateDialog("Pat",'',"Karşı Tarafın Hamlesi Kalmadı")
                }
                else if(isInsufficientMaterial(initialPosition)){
                    displayCheckmateDialog('Berabere','',"Yetersiz Taş")
                    console.log("EEEE YETERSİZ TAŞ:")
                }else if(soundEffect) playMoveSound("Move3") // Ses efecti
                if(rotation && !finishGame)
                    rotatePieces(turn) //Taşların dönmesi
                //Hamle sonrası işlemler
                //selectedPiece = null -> zaten yapılıyor
                fenForward = []          //Yeni hamleden sonra Forward işlemlerini sıfırla
                allForwardPoint = []     //Yeni hamleden sonra Forward işlemlerini sıfırla
                allForwardSelect = []    //Yeni hamleden sonra Forward işlemlerini sıfırla
                selectSquare = null
                disabledElement()
                whereIsTheKing()
                console.log("checkStatus666",checkStatus)
                saveGameState(initialPosition, turn) // Oyunun son durumunu kaydet
            }
        } else {
            console.log("111");
            selectedPiece = null;
            selectSquare.classList.remove('select','back')
            validFon(false,predictive);
        }
    } else {
        const piece = square.querySelector('.piece');
        let pieceId = piece ? piece.id : null;
        if (piece) {
            console.log(pieceId, `Piece color: ${pieceId.includes(turn)}, turn: ${turn}`);
            if (piece.classList.contains(turn)) {
                selectedPiece = [row, col];
                selectToSquare(selectedPiece)
            }
        }
        if (piece && pieceId.includes(turn)) {
            console.log("333-111");
            selectedPiece = [row, col];
            selectToSquare(selectedPiece)
            console.log(selectedPiece);
        }
    }
}

//Select Efecti olan fonksiyon
function selectToSquare([row, col]){
    console.log("ĞĞĞ Select Fonksiyona girildi",selectedPiece)
    patCheck = true
    selectSquare = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
    selectSquare.classList.add('select')
    initialPosition.forEach((rowArr, row) => {
        rowArr.forEach((colVal, col) => {
            console.log("ĞĞĞ forEach Hamle kontrol öncesi",selectedPiece, [row, col])
            if (isValidMove(selectedPiece, [row, col])) {
                console.log("ĞĞĞ forEach",row, col)

                // Geçici olarak hamleyi yap
                const tempPiece = initialPosition[row][col];
                const [selectedRow, selectedCol] = selectedPiece;
                initialPosition[row][col] = initialPosition[selectedRow][selectedCol];
                initialPosition[selectedRow][selectedCol] = ' ';
                // Eğer şah hareket ettirildiyse, kingPositions güncelle
                if (initialPosition[row][col].toLowerCase() === 'k')
                    kingPositions[turn][0] = [row, col];
                // Şah durumunu kontrol et
                checkStatus = isCheck(turn,true,true,initialPosition);
                console.log("ĞĞĞ Şah kontrol sonrası")
                // Hamleyi geri al
                initialPosition[selectedRow][selectedCol] = initialPosition[row][col];
                initialPosition[row][col] = tempPiece;
                // Eğer şah hareket ettirildiyse, geri al (Bunu Kontrol et!!!!!!!!!!!!!!!!!!!!!!!!!!)
                if (initialPosition[selectedRow][selectedCol].toLowerCase() === 'k')
                    kingPositions[turn][0] = [selectedRow, selectedCol];
                if (!checkStatus)
                    validMoves.push([row, col]);
                console.log("ĞĞĞ For Each tur içi sonu")
            }
        });
    });
    patCheck = false
    console.log("ĞĞĞX Geçerli taş?",validMoves)
    if(validMoves[0] === undefined){
        selectedPiece = null;
        selectSquare.classList.remove('select','back')
    }
    // Geçerli hamleleri vurgula
    console.log("ĞĞĞ Vurgulama fonksiyonu öncesi")
    validFon(true,predictive);
    console.log("ĞĞĞ Vurgulama fonksiyonu sonrası")
}
//Öngörücü hamleleri sçen ve kaldıran fonksiyon
function validFon(apply,predictive) {
    console.log("ĞĞĞ validFon",validMoves,apply)
    if(predictive){
    validMoves.forEach(move => {
        let point = false
        if(initialPosition[move[0]][move[1]] === ' ')
            point = true
        const square = document.querySelector(`[data-row="${move[0]}"][data-col="${move[1]}"]`);
        if (square) {
            if (apply) {
                if(point)
                    square.classList.add('point');
                else
                    square.classList.add('circle');
            } else {
                square.classList.remove('circle');
                square.classList.remove('point');
            }
        }
    });

    if (!apply) {
        validMoves = [];
    }}
}

//Hareketleri denetleyen fonksiyon
function isValidMove(start, end) {
    //console.log("222-000");
    // Geçerli hamle kontrolü
    const piece = initialPosition[start[0]][start[1]];
    const targetPiece = initialPosition[end[0]][end[1]];
    //console.log(end[0], end[1], "piece:", piece, "targetPiece:", targetPiece);
    //Rook Atma Hareketi
    if(((piece === 'r' && targetPiece === 'k') || (piece === 'R' && targetPiece === 'K')) || ((piece === 'k' && targetPiece === 'r') || (piece === 'K' && targetPiece === 'R'))){
        console.log("Rook Mümkün",start,end)
        if(isValidRookCastleMove(start, end) === true){
            return true;
        }
        else
         return false;
    }
    // Hedef karede taş yoksa veya taşın rengi, sırayı belirleyen oyuncu ile uyumlu değilse, hamle geçersizdir
    if (targetPiece !== ' ' && pieces[targetPiece] && pieces[targetPiece].startsWith(turn === 'White' ? 'W' : 'B')) {
        return false;
    }
    //console.log("222-010");
    switch (piece.toLowerCase()) {
        case 'p': return isValidPawnMove(start, end, piece, patCheck);
        case 'r': return isValidRookMove(start, end);
        case 'n': return isValidKnightMove(start, end);
        case 'b': return isValidBishopMove(start, end);
        case 'q': return isValidQueenMove(start, end);
        case 'k': return isValidKingMove(start, end);
        default: return false;
    }
}

//Hareketi Kalıcı yapan fonksiyon
function movePiece(start, end) {
    // Taşı hareket ettir
    //console.log("movePiece", start, end);
    const startSquare = document.querySelector(`[data-row="${start[0]}"][data-col="${start[1]}"]`);
    const endSquare = document.querySelector(`[data-row="${end[0]}"][data-col="${end[1]}"]`);
    const piece = startSquare.querySelector('.piece'); //rook
    const targetPiece = endSquare.querySelector('.piece'); //king
    console.log(initialPosition[start[0]][start[1]],initialPosition[end[0]][end[1]],piece,targetPiece)
    //Rook Atma
    if(((initialPosition[start[0]][start[1]] === 'r' && initialPosition[end[0]][end[1]] === 'k') || 
        (initialPosition[start[0]][start[1]] === 'R' && initialPosition[end[0]][end[1]] === 'K')) && targetPiece !== null && 
        ((piece.getAttribute('data-first-move') === 'true' && targetPiece.getAttribute('data-first-move') === 'true'))){
        piece.setAttribute('data-first-move', 'false')
        targetPiece.setAttribute('data-first-move', 'false')
        var newStartSquare
        var newEndSquare
        console.log(start[1],end[1])
        if(start[1] > end[1]){
            console.log("kısa rook")
            newStartSquare = document.querySelector(`[data-row="${start[0]}"][data-col="${start[1]-2}"]`);
            newEndSquare = document.querySelector(`[data-row="${end[0]}"][data-col="${end[1]+2}"]`);
            }else{
            console.log("uzun rook")
            newStartSquare = document.querySelector(`[data-row="${start[0]}"][data-col="${start[1]+3}"]`);
            newEndSquare = document.querySelector(`[data-row="${end[0]}"][data-col="${end[1]-2}"]`);
        }
        console.log("RRR",initialPosition[newStartSquare.getAttribute('data-row')][newStartSquare.getAttribute('data-col')],initialPosition[start[0]][start[1]],initialPosition[end[0]][end[1]])
        newStartSquare.innerHTML = ''
        newEndSquare.innerHTML = ''
        kingPositions[turn][0] = [Number(newEndSquare.getAttribute('data-row')), Number(newEndSquare.getAttribute('data-col'))]
        initialPosition[newStartSquare.getAttribute('data-row')][newStartSquare.getAttribute('data-col')] = initialPosition[start[0]][start[1]]
        initialPosition[newEndSquare.getAttribute('data-row')][newEndSquare.getAttribute('data-col')] = initialPosition[end[0]][end[1]]
        newStartSquare.appendChild(piece)
        newEndSquare.appendChild(targetPiece)
        initialPosition[start[0]][start[1]] = ' '
        initialPosition[end[0]][end[1]] = ' '
        return;
    }
    endSquare.innerHTML = '';
    if(piece)
        endSquare.appendChild(piece);
    startSquare.innerHTML = '';
    
    // Tahtanın durumunu güncelle
    initialPosition[end[0]][end[1]] = initialPosition[start[0]][start[1]];
    initialPosition[start[0]][start[1]] = ' ';
    
    // Taşın ilk hareket bayrağını kontrol et ve false yap
    if (piece && piece.getAttribute('data-first-move') === 'true') {
        if(piece.id.includes("King")){
            RookOptions[turn][0][1] = false
            RookOptions[turn][1][1] = false
        }else{
            if(RookOptions[turn][0][0].includes("A8")|| RookOptions[turn][0][0].includes("A1")){
                RookOptions[turn][0][1] = false
            }else
                RookOptions[turn][1][1] = false
        }
        piece.setAttribute('data-first-move', 'false');
    }

    // Geçerken alma hamlesi kontrolü (HATALI)
    //console.log("PG-000",piece.id)
    if (piece && (piece.id.includes('White-Pawn') || piece.id.includes('Black-Pawn'))) { // .textContent property kullanıldı
        console.log("PG-010",start,end,initialPosition[end[0]][end[1]])
        const direction = piece.id.includes('White-Pawn') === 'P' ? -1 : 1;
        if (start[1] !== end[1] && initialPosition[end[0]][end[1]] === ' ') {
            console.log("PG-020")
            const captureRow = end[0] - direction;
            const captureSquare = document.querySelector(`[data-row="${captureRow}"][data-col="${end[1]}"]`);
            captureSquare.innerHTML = '';
            initialPosition[captureRow][end[1]] = ' ';
        }
    }
}

//Pat durumunu kontrol eden fonksiyon
function isStalemate(color) {
    console.log("Pat Kontrol Fonksiyonu Başlatıldı 000")
    patCheck = true
    //console.log("PAT-XXX-isStalemate:", color);
    // Tüm taşların mümkün olan hamlelerini kontrol et
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // Taş mevcut ve rengi doğru mu kontrol et
            if (initialPosition[i][j] && isSameColor(initialPosition[i][j], color)) {
                // Mevcut taşın mümkün olduğu tüm hamleleri kontrol et
                for (let x = 0; x < 8; x++) {
                    for (let y = 0; y < 8; y++) {
                        const start = [i, j];
                        const end = [x, y];
                        // Eğer geçerli bir hamle ise, hamleyi geçici olarak yap
                        if (isValidMove(start, end)) {
                            // Geçici bir kopya oluştur
                            const tempPosition = JSON.parse(JSON.stringify(initialPosition));
                            //console.log("PAT-X11",tempPosition,initialPosition);
                            tempPosition[end[0]][end[1]] = tempPosition[i][j];
                            tempPosition[i][j] = ' ';
                            //console.log("PAT-X12",tempPosition,initialPosition);
                            
                            // Şah durumunu kontrol et
                            const isCheckStatus = isCheck(color, true, true, tempPosition);
                            // Eğer şah durumu yoksa, bu hamle pat durumunu sağlamaz
                            if (!isCheckStatus) {
                                console.log(tempPosition);
                                console.log("Pat Kontrol Fonksiyonu Bitti 999.1")
                                patCheck = false
                                return false;
                            } else {
                                console.log("Pat Kontrol Fonksiyonu Bitti 999.2")
                                //patCheck = false
                                //console.log(`Bu hamle pat durumunu sağlar: ${start} => ${end}`);
                            }
                        }
                    }
                }
            }
        }
    }
    // Hiçbir hamle yapılamazsa, bu durum pat durumunu belirtir
    console.log("Pat Kontrol Fonksiyonu Bitti 999.3")
    patCheck = false
    return true;
}

//Check statusunu kontrol eden fonksiyon
function isCheck(color,fake,pat,fakePosition) {
    checkControl = true
    //console.log("MMMM mat kontrol isCheck:",color,fake,pat)
    console.log("isCheck fonksiyonu 111, color:", color);
    
    const opponentColor = color === 'White' ? 'Black' : 'White';
    let kingPosition = kingPositions[color][0] //Kralın orjinal konumu
    //console.log("MMMM mat kontrol kingPosition:",kingPosition)
    if(fake == false) //Mat kontrolü için
        copyCheckTerritory = JSON.parse(JSON.stringify(checkTerritory))
    if(pat == true){
            copyPosition = JSON.parse(JSON.stringify(fakePosition)) //Sahte konumlar
            copyPosition.forEach((row, rowIndex) => {               //Kralın pozisyonu sahte konumdan bul
                row.forEach((col, colIndex) => {
                    if (color == "Black" && col === 'k'){
                        kingPosition = [rowIndex, colIndex];
                        return;
                    }
                    if (color == "White" && col === 'K'){
                        kingPosition = [rowIndex, colIndex];
                        return;
                    }
            });});
        }else{
            copyPosition = JSON.parse(JSON.stringify(initialPosition)) //Orjinal Konumlar
        }
        //console.log("MMMM mat kontrol kingPosition:",kingPosition)
    console.log("Şahın pozisyonu:", kingPosition);

    const directions = [
        [-1, -1], // Sol üst
        [1, -1],  // Sağ üst
        [-1, 1],  // Sol alt
        [1, 1],   // Sağ alt
        [1, 0],   // Yatay
        [0, 1],    // Dikey
        [-1, 0],   // Yatay
        [0, -1]    // Dikey
    ];
    // Her yönde tahtayı tarayarak şahı tehdit eden taşları kontrol et
    for (let d = 0; d < directions.length; d++) {
        const direction = directions[d];
        let [x, y] = kingPosition;
        if(fake == false)
            copyCheckTerritory = JSON.parse(JSON.stringify(checkTerritory))
        // Her yönde sonsuza kadar gitme
        while (true) {
            x += direction[0];
            y += direction[1];
            //console.log("MMMM-000 mat kontrol kingPosition:",kingPosition,x,y,directions[d])
            // Tahta dışına çıktıysak dur
            if (x < 0 || y < 0 || x > 7 || y > 7) break;
            
            const piece = copyPosition[x][y];
            //console.log("MMMM piece",piece,x,y)

            // Boş kare ise devam et
            if (piece === ' '){
                if(fake == false){
                    copyCheckTerritory[x][y] = false
                    //console.log("YYY000",copyCheckTerritory)
                }
                continue;
            }
            console.log("WWWW şah kontrol kingPosition:",color,kingPosition,x,y,piece,direction[0],d,x - 1,kingPosition[0])
            // Rakip taşı bulunduğunda şah tehdit altındadır
            if ((color === 'White' && piece.charCodeAt(0) >= 97) || (color === 'Black' && piece.charCodeAt(0) < 97)) {
                if ((color === 'White' && piece.charCodeAt(0) >= 97) || (color === 'Black' && piece.charCodeAt(0) < 97)) {
                    if (d < 4 && (piece.toLowerCase() === 'b' || piece.toLowerCase() === 'q')) { // Çapraz yönde tehdit eden Bishop ve Queen taşlar
                        //console.log("MMMM Şah tehdit altında. Tehdit eden taş:", piece, "Pozisyon:", [x, y]);
                        console.log("isCheck fonksiyonu Bitti 999");
                        checkControl = false
                        return true;
                    }
                    if (((color === 'White' && piece === 'p') && (direction[0] === -1 && (d === 0 || d === 2)) && (x + 1 === kingPosition[0] && Math.abs(y - kingPosition[1]) === 1)) ||
                        ((color === 'Black' && piece === 'P') && (direction[0] ===  1 && (d === 1 || d === 3)) && (x - 1 === kingPosition[0] && Math.abs(y - kingPosition[1]) === 1))) {
                        //console.log("MMMM Şah tehdit altında. Tehdit eden taş:", piece, "Pozisyon:", [x, y]);
                        console.log("isCheck fonksiyonu Bitti 999");
                        checkControl = false
                        return true;
                    }                        
                    if (d > 3 && (piece.toLowerCase() === 'r' || piece.toLowerCase() === 'q')) { // Düz yönde tehdit eden Rook ve Queen taşlar
                        //console.log("MMMM Şah tehdit altında. Tehdit eden taş:", piece, "Pozisyon:", [x, y]);
                        console.log("isCheck fonksiyonu Bitti 999");
                        checkControl = false
                        return true;
                    }
                }
                //console.log("MMMM02 mat kontrol kingPosition:",kingPosition)
            }
            // Kendi taşımızı bulduğumuzda devam etme
            break;
        }
    }
    // Atın tehdit ettiği karelerin listesi
    const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (let i = 0; i < knightMoves.length; i++) {
        const move = knightMoves[i];
        const [dx, dy] = move;
        const nx = kingPosition[0] + dx;
        const ny = kingPosition[1] + dy;

        // Tahtayı taşmadığından ve rakip atın varlığını kontrol ettiğimizden emin olalım
        if (nx >= 0 && ny >= 0 && nx < 8 && ny < 8) {
            const piece = copyPosition[nx][ny];
            if ((color === 'White' && piece === 'n') || (color === 'Black' && piece === 'N')) {
                console.log("Şah tehdit altında. Tehdit eden taş:", piece, "Pozisyon:", [nx, ny]);
                console.log("isCheck fonksiyonu Bitti 999");
                checkControl = false
                return true;
            }
        }
    }                       

    // Eğer hiçbir taş şahı tehdit etmiyorsa, şah güvende demektir
    if(fake == false)
        copyCheckTerritory = JSON.parse(JSON.stringify(checkTerritory))
    console.log("Şah güvende.");
    console.log("isCheck fonksiyonu Bitti 999");
    checkControl = false
    return false;
}

//Mat durumunu kontrol eden fonksiyon
function isCheckmate(color) {
    console.log("KK Mat fonksiyonu Başlatıldı 111")
    // Mat durumundan kurtaracak bir hamle bul
    const rescueMove = findRescueMove(color);
    if (rescueMove) {
        console.log("Mat durumundan kurtaracak hamle:", rescueMove.start, "-", rescueMove.end);
        console.log("KK Mat fonksiyonu Bitti 999")
        return true;
    } else {
        console.log("Şah mat!",color);
        console.log("KK Mat fonksiyonu Bitti 999")
        return false;
    }
}

//Mat taraması yapan fonksiyon
function findRescueMove(color) {
    matControl = true
    console.log("KK Mat Kontrol fonksiyonu(rescue) Başlatıldı 111")
    const opponentColor = color === 'White' ? 'Black' : 'White';
    const kingPosition = kingPositions[color][0];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    // Kralın etrafındaki tüm kareleri kontrol et
    for (const [dx, dy] of directions) {
        const newX = kingPosition[0] + dx;
        const newY = kingPosition[1] + dy;
        if (newX >= 0 && newY >= 0 && newX < 8 && newY < 8) {
            console.log("opop33",copyPosition)
            if (copyCheckTerritory[newX][newY] === false || copyPosition[newX][newY] !== ' ') continue;
            // Kralı geçici olarak yeni pozisyona taşı
            const tempPosition = JSON.parse(JSON.stringify(initialPosition));
            tempPosition[newX][newY] = tempPosition[kingPositions[color][0][0]][kingPositions[color][0][1]];
            tempPosition[kingPositions[color][0][0]][kingPositions[color][0][1]] = ' ';

            //console.log("MMMM mat kontrol KingNewPosition:",kingPositions[color][0])
            // Yeni pozisyonda şahın tehdit altında olup olmadığını kontrol et
            const isKingInCheck = isCheck(color, true, true, tempPosition);

            if (!isKingInCheck) {
                console.log("KK Mat Kontrol fonksiyonu(rescue) Bitti 999")
                matControl = false
                return { start: kingPosition, end: [newX, newY] }; // Mat durumundan kurtaracak hamle bulundu
            }
        }
    }

    // Diğer taşların hareketlerini kontrol et
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (initialPosition[i][j] && isSameColor(initialPosition[i][j], color) && initialPosition[i][j].toLowerCase() !== 'k') {
                for (let x = 0; x < 8; x++) {
                    for (let y = 0; y < 8; y++) {
                        const start = [i, j];
                        const end = [x, y];

                        if (isValidMove(start, end)) {
                            const tempPiece = initialPosition[end[0]][end[1]];
                            initialPosition[end[0]][end[1]] = initialPosition[i][j];
                            initialPosition[i][j] = ' ';

                            const check = isCheck(color, true, false, initialPosition);

                            initialPosition[i][j] = initialPosition[end[0]][end[1]];
                            initialPosition[end[0]][end[1]] = tempPiece;

                            if (!check) {
                                console.log("KK Mat Kontrol fonksiyonu(rescue) Bitti 999")
                                matControl = false
                                return { start, end }; // Mat durumundan kurtaracak hamle bulundu
                            }
                        }
                    }
                }
            }
        }
    }

    console.log("KK Mat Kontrol fonksiyonu(rescue) Bitti 999")
    matControl = false
    return null; // Mat durumundan kurtaracak hamle bulunamadı
}

//İki taşın rengini kontrol eden fonksiyon
function isSameColor(piece, color) {
    // Eğer taş boş ise false döndür
    if (piece === ' ') {
        return false;
    }

    // Taşın rengini belirle
    const pieceColor = piece.charCodeAt(0) < 97 ? 'White' : 'Black';

    // Eğer taşın rengi istenen renkle aynı ise true döndür
    return pieceColor === color;
}

//Taş Sayısı
function countPieces(board) {
    let newTotalPieces = 0
    const pieceCount = {
        w: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
        b: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 }
    };

    const pieceTypes = {
        'K': 'king', 'Q': 'queen', 'R': 'rook', 'B': 'bishop', 'N': 'knight', 'P': 'pawn',
        'k': 'king', 'q': 'queen', 'r': 'rook', 'b': 'bishop', 'n': 'knight', 'p': 'pawn'
    };
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece !== ' ') {
                const color = piece === piece.toUpperCase() ? 'w' : 'b';
                pieceCount[color][pieceTypes[piece]]++;
                newTotalPieces++;
            }
        }
    }
    
    totalPieces = newTotalPieces
    return pieceCount;
}

// Yetersiz Taş sayısı durumu
function isInsufficientMaterial(board) {
    console.log("SSSS-0001 isInsufficientMaterial: Yetersiz Taş Kontrol")
    // Tahtadaki taşları sayar
    const pieceCount = countPieces(board);

    console.log("White pieces count:", pieceCount.w);
    console.log("Black pieces count:", pieceCount.b);
    
    // Bir rengin taşlarını kontrol eden fonksiyon
    function ColorControl (pieceCount, Color){
        console.log("SSSS-0010 ColorControl- pieceCount:",pieceCount,"Color:",Color)
        // Taş rengini belirle
        let colorPiece = Color === 'Black' ? 'b' : 'B';
        const positions = [];
        const colorTotalPieces = Object.values(pieceCount).reduce((sum, count) => sum + count, 0) // Rengin taşlarının toplam sayısını hesaplar
        if(pieceCount.pawn == 0 && pieceCount.queen == 0 && pieceCount.rook == 0){        // Eğer piyon, vezir ve kale yoksa
            // Eğer toplamda 2 taş varsa ve bu taşlardan biri at veya fil ise ya da 3 taş varsa ve bu taşlar 2 fil ise
            if((colorTotalPieces == 2 && (pieceCount.knight == 1 || pieceCount.bishop == 1)) || (colorTotalPieces == 3 && pieceCount.bishop == 2)){
                console.log("SSSS-0100 colorTotalPieces:",colorTotalPieces,"pieceCount.knight:",pieceCount.knight,"pieceCount.bishop:",pieceCount.bishop)
                // Eğer 3 taş varsa ve bunlar 2 fil ise, aynı renkte olup olmadıklarını kontrol et
                if(colorTotalPieces == 3 && pieceCount.bishop == 2){
                    console.log("SSSS-0110 2 Bishop - pieceCount.bishop",pieceCount.bishop)
                    initialPosition.forEach((row, rowIndex) => {
                        row.forEach((cell, colIndex) => {
                            if (cell === colorPiece) {
                                positions.push([rowIndex, colIndex]);
                            }});});
                    console.log("SSSS-0111 2 Bishop - positions",positions,positions[0][0],positions[0][1])
                    // Eğer filler aynı renkte değillerse false döner
                    if(!(Math.abs(positions[0][0] - positions[1][0]) % 2 == 0 && Math.abs(positions[0][1] - positions[1][1]) % 2 == 0)){
                        console.log("SSSS-0112 2 Bishop - positions",Color,false)
                        return false
                    }
                }
                console.log("SSSS-0120",Color,true)
                return true;
            }
        }
        console.log("SSSS-0020",Color,false)
        return false
    }
    // Beyaz ve siyah taşların yeterli olmadığını kontrol eder
    if(ColorControl (pieceCount.w, 'White') && ColorControl (pieceCount.b, 'Black')){
        console.log("SSSS-1111",true)
        return true
    }
    console.log("SSSS-0002",false)
    return false
}

//Piyonun geçerli bir hamle yapmasını ve geçerken alma yapmasını kontrol eden fonksiyon
function isValidPawnMove(start, end, piece, patCheck) {
    console.log("P-222",start, end, piece, patCheck, validMoves)
    const startSquare = document.querySelector(`[data-row="${start[0]}"][data-col="${start[1]}"]`);
    const pieces = startSquare.querySelector('.piece')
    //console.log("PPP001",selectedPiece)
    if(pieces === null) // Piyon Seçilemediyse
        return false;
    const pieceID = pieces.id
    const direction = pieceID.includes("White") === true ? -1 : 1; // Beyaz piyon yukarı, siyah piyon aşağı hareket eder
    //console.log("P-333",pieceID,pieceID.includes("White"),direction)
    const startRow = start[0];
    const startCol = start[1];
    const endRow = end[0];
    const endCol = end[1];
    // Düz hareket
    if (startCol === endCol && initialPosition[endRow][endCol] === ' ') {
        if (endRow === startRow + direction) {
            if(((pieceID.includes("White") && endRow === 0 )|| pieceID.includes("Black") && endRow === 7) && !patCheck){
                console.log("PPP002-1",selectedPiece)
                promotionScreen = true // Zamanı Durdur
                pawnPromotionDialog(pieceID, endRow, endCol)
            }
            return true; // Bir kare ileri
        }
        if ((piece === 'P' && startRow === 6 || piece === 'p' && startRow === 1) && endRow === startRow + 2 * direction && initialPosition[startRow + direction][startCol] === ' ') {
            enPassantTarget = [endRow, endCol]; // Geçerken alma hedefini ayarla
            oldPawnID = pieceID
            //console.log(initialPosition[start[0]][start[1]])
            return true; // Başlangıç noktasından iki kare ileri
        }
    } 
    else if (Math.abs(startCol - endCol) === 1 && endRow === startRow + direction && (initialPosition[endRow][endCol] !== ' ' || (enPassantTarget && endRow === enPassantTarget[0]+direction && endCol === enPassantTarget[1]))) {//Taş yeme hareketi
        if(!patCheck){
            if(enPassantTarget && endRow === enPassantTarget[0] + direction && endCol === enPassantTarget[1]){
                initialPosition[enPassantTarget[0]][enPassantTarget[1]] = ' '
                enPassantTarget = null
                document.getElementById(oldPawnID).remove() // Hata
                oldPawnID = null
            }
            if((pieceID.includes("White") && endRow === 0 )|| pieceID.includes("Black") && endRow === 7){
                console.log("PPP002-2",selectedPiece)
                promotionScreen = true // Zamanı Durdur
                pawnPromotionDialog(pieceID, endRow, endCol)
            }
        }
        return true;
    }
    return false;
}

// Piyon promosyon işlevselliğini uygulayan fonksiyon
function pawnPromotionDialog(pieceID, endRow, endCol) {
    console.log("WLK",pieceID, endRow, endCol,patCheck, checkControl, matControl)
    if(patCheck || checkControl || matControl){
        console.log("WLK",patCheck)
        return
    }
    promotionPiece = pieceID
    console.log("ĞĞĞ PROMOSYON", pieceID, endRow, endCol)
    let turnColor = pieceID.includes("White") === true ? "White" : "Black";
    let pieceCod = ""

    const promotionDialog = document.createElement('div');
    promotionDialog.id = 'promotion-dialog';

    const promotionBox = document.createElement('div');
    promotionBox.id = 'promotion-box';
    console.log("CVC",rotation, turnColor, turnBoard,(rotation && ((turnColor === 'Black' && !turnBoard) || (turnColor === 'White' && turnBoard))))
    if(rotation && ((turnColor === 'Black' && !turnBoard) || (turnColor === 'White' && turnBoard))){
        promotionBox.style.transform = 'rotate(180deg)'; //Döndürme
    }

    const title = document.createElement('h2');
    title.textContent = 'Piyon Seçimi';
    promotionBox.appendChild(title);

    const promotionOptions = document.createElement('div');
    promotionOptions.classList.add('promotion-options');

    const pieces = [
        { alt: "Q"+turnColor+"-Queen", name: "Vezir", imageSrc: "png/"+turnColor[0]+"Queen.png" },
        { alt: "N"+turnColor+"-Knight", name: "At", imageSrc: "png/"+turnColor[0]+"Knight.png" },
        { alt: "R"+turnColor+"-Rook", name: "Kale", imageSrc: "png/"+turnColor[0]+"Rook.png" },
        { alt: "B"+turnColor+"-Bishop", name: "Fil", imageSrc: "png/"+turnColor[0]+"Bishop.png" }
    ];

    pieces.forEach(piece => {
        const pieceContainer = document.createElement('div');
        pieceContainer.classList.add('piece-container');
        pieceContainer.classList.add(turnColor === "White" ? 'white-piece-container' : 'black-piece-container');

        const pieceImage = document.createElement('img');
        pieceImage.src = piece.imageSrc;
        pieceImage.classList.add('piece-image');
        pieceImage.addEventListener('click', () => {
            console.log("PXG Listener")
            const oldPiece = document.getElementById(`${String.fromCharCode(65 + endCol)}${8 - endRow}-pawn`);
            if (oldPiece) {
                oldPiece.parentNode.removeChild(oldPiece);
            }
            const newPiece = document.createElement('div');
            newPiece.id = `${String.fromCharCode(65 + endCol)}${8 - endRow}-${piece.alt}`;
            newPiece.className = 'piece';
            newPiece.style.backgroundImage = `url(${piece.imageSrc})`;
            newPiece.setAttribute('data-name', `${piece.alt}`);
            console.log(piece.alt[0], turnColor, piece.alt[0].toLowerCase())
            pieceCod = turnColor === "White" ? piece.alt[0] : piece.alt[0].toLowerCase();
            const square = document.querySelector(`[data-row="${endRow}"][data-col="${endCol}"]`);
            square.removeChild(square.firstChild);
            square.appendChild(newPiece);
            promotionDialog.parentNode.removeChild(promotionDialog);
            console.log("endRow", endRow, "endCol", endCol, "initialPosition", initialPosition[endRow][endCol], "pieceCod", pieceCod)
            initialPosition[endRow][endCol] = pieceCod
            //Hamle Sonrası işlemler
            if ((rotation && turnColor === 'White') || (turnBoard && !rotation)){
                console.log("UYUT")
                newPiece.style.transform = 'rotate(180deg)'
            }
            positionHistory.pop()
            addPositionToHistory(initialPosition, turn)
            console.log("OPOP2",pieceID)
            copyPosition = JSON.parse(JSON.stringify(initialPosition))
            if (!(isCheckmate(turn))) {
                console.log("EEEE Check-mate")
                displayCheckmateDialog(turn, [endRow, endCol])
            }    
            promotionScreen = false //Zaman devam etsin
            saveGameState(initialPosition, turn)
        });

        pieceContainer.appendChild(pieceImage);

        const pieceText = document.createElement('span');
        pieceText.textContent = piece.name;
        pieceContainer.appendChild(pieceText);

        promotionOptions.appendChild(pieceContainer);
    });

    promotionBox.appendChild(promotionOptions);
    promotionDialog.appendChild(promotionBox);
    document.body.appendChild(promotionDialog);
}

// Atın geçerli bir hamle yapmasını kontrol eden fonksiyon
function isValidKnightMove(start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);

    // At, L şeklinde hareket eder
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

// Vezirin geçerli bir hamle yapmasını kontrol eden fonksiyon
function isValidQueenMove(start, end) {
    return isValidRookMove(start, end) || isValidBishopMove(start, end);
}

// Filin geçerli bir hamle yapmasını kontrol eden fonksiyon
function isValidBishopMove(start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    // Fil sadece çapraz hareket eder
    if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) {
        return false; // Çapraz hareket etmiyor
    }

    // Hareket yönüne bağlı olarak ilerleyişte engel kontrolü yapılır
    const rowStep = startRow < endRow ? 1 : -1;
    const colStep = startCol < endCol ? 1 : -1;
    let row = startRow + rowStep;
    let col = startCol + colStep;
    while (row !== endRow && col !== endCol) {
        if (initialPosition[row][col] !== ' ') {
            return false; // Yol üzerinde bir taş varsa geçersiz hamle
        }
        row += rowStep;
        col += colStep;
    }

    return true;
}

// Şah taşının geçerli bir hamle yapmasını kontrol eden fonksiyon
function isValidKingMove(start, end) {
    console.log("KK Kral Kontrol fonksiyonu çalıştı",patCheck)
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    for(let x=-1; x < 2; x++){
        for(let y=-1; y < 2; y++){
            console.log("KKKK:","end:",end,"x,y",x,y,"end[0]+x=",end[0]+x,"end[0]+y=",end[0]+y)
            if((end[0]+x > -1 && end[1]+y > -1 && end[0]+x < 8 && end[1]+y < 8) && 
               ((initialPosition[start[0]][start[1]].charCodeAt(0) == 75 && initialPosition[end[0]+x][end[1]+y].charCodeAt(0) == 107) ||
               (initialPosition[start[0]][start[1]].charCodeAt(0) == 107 && initialPosition[end[0]+x][end[1]+y].charCodeAt(0) == 75)))
               return false
        }
    }
    // Şah bir kare her yöne hareket edebilir.
    return rowDiff <= 1 && colDiff <= 1;
}

// Kale taşının geçerli bir hamle yapmasını kontrol eden fonksiyon
function isValidRookMove(start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    // Hedef kare, başlangıç karesiyle aynı sütun veya satırda olmalı
    if (startRow !== endRow && startCol !== endCol) {
        return false; // Dikey veya yatay olarak hareket etmiyor
    }

    // Yatay hareket
    if (startRow === endRow) {
        const step = startCol < endCol ? 1 : -1;
        for (let col = startCol + step; col !== endCol; col += step) {
            if (initialPosition[startRow][col] !== ' ') {
                return false; // Yol üzerinde bir taş varsa geçersiz hamle
            }
        }
    }
    // Dikey hareket
    else {
        const step = startRow < endRow ? 1 : -1;
        for (let row = startRow + step; row !== endRow; row += step) {
            if (initialPosition[row][startCol] !== ' ') {
                return false; // Yol üzerinde bir taş varsa geçersiz hamle
            }
        }
    }

    return true;
}

// Rook atmayı kontrol eden fonksiyon
function isValidRookCastleMove(start, end) {
    console.log("Rook Kontrol Fonksiyonu Başlatıldı...")
    const startSquare = document.querySelector(`[data-row="${start[0]}"][data-col="${start[1]}"]`);
    const endSquare = document.querySelector(`[data-row="${end[0]}"][data-col="${end[1]}"]`);
    const piece = startSquare.querySelector('.piece'); //rook
    const targetPiece = endSquare.querySelector('.piece'); //king
    console.log("RKRKRK","startSquare:",startSquare,"endSquare:",endSquare,"piece:",piece,"targetPiece:",targetPiece)
    if(!(piece.getAttribute('data-first-move') === 'true' && targetPiece.getAttribute('data-first-move') === 'true')){
        console.log("RKRKRK ilk kontol false")
        return false;
    }
    console.log("Rook Kontrol")
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    console.log(start,end)
    let step
    copyPosition = JSON.parse(JSON.stringify(initialPosition))
    if(start[1] > end[1]){
        console.log("Kısa Rook",start[1],end[1])
        step = -1
    }else{
        console.log("Uzun Rook",start[1],end[1])
        step = 1
    }
    for(let col = startCol + step; ((start[1] < end[1]) && col < endCol) || ((start[1] > end[1]) && col > endCol); col=col+step){
        console.log("for kontol:",col)
        if(initialPosition[startRow][col] === ' '){
            console.log("for if kontrol: boş kare")
            copyPosition[startRow][col] = initialPosition[endRow][endCol]
            copyPosition[endRow][endCol] = ' '
            console.log("for if fake konum:",copyPosition,initialPosition)
            if(!isCheck(turn,true,true,copyPosition)){ // Şah durumu yoksa
                copyPosition = JSON.parse(JSON.stringify(initialPosition))
                continue;
            }else{
                console.log("Rook Kontrol: Şah durumu")
                return false
            }
        }else{ //Boş kare değilse
            return false
        }
    }
return true;
}

//Hamle Pozisyonları oluşturma
function generateFEN(position, turn) {
    let fen = '';
    for (let row = 0; row < 8; row++) {
        let emptyCount = 0;
        for (let col = 0; col < 8; col++) {
            const piece = position[row][col];
            if (piece === ' ') {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                fen += piece;
            }
        }
        if (emptyCount > 0) {
            fen += emptyCount;
        }
        if (row < 7) {
            fen += '/';
        }
    }
    fen += ` ${turn === 'White' ? 'w' : 'b'}`;
    console.log("checkStatus333",checkStatus)
    if(checkStatus){
        fen += `c`
    }
    console.log("fen333",fen)
    return fen;
}

//Hamle Pozisyonlarını kaydetme
function addPositionToHistory(position, turn) {
    const fen = generateFEN(position, turn);
    positionHistory.push(fen);
}

//3 Kez hamle tekrarı var mı diye Kontrol etme
function checkThreefoldRepetition() {
    const positionCount = {};
    allOldSelect.push(oldSelect)
    console.log("OSOS:",allOldSelect,oldSelect)
    for (const fen of positionHistory) {
        if (positionCount[fen]) {
            positionCount[fen]++;
        } else {
            positionCount[fen] = 1;
        }
        if (positionCount[fen] === 3) {
            return true;
        }
    }
    return false;
}

//Oyun sonu diyaloğu
function displayCheckmateDialog(winner,matPiece,Text) {
    finishGame = [winner,matPiece,Text]
    var promotionDialog = document.createElement("div");
    promotionDialog.id = "custom-promotion-dialog";
    document.body.appendChild(promotionDialog);

    var kingImage = document.createElement("img");
    kingImage.id = "king-image";
    if (winner === "Black" || winner === "White") {
        console.log("PGTX",matPiece)
        kingImage.src = "png/" + pieces[initialPosition[matPiece[0]][matPiece[1]]]
        promotionDialog.appendChild(kingImage);
    }

    var closeIcon = document.createElement("span");
    closeIcon.className = "close-icon";
    closeIcon.addEventListener("click", function () {
        promotionDialog.remove();
    });
    promotionDialog.appendChild(closeIcon);

    var title = document.createElement("h2");
    if (winner === "Berabere") {
        if(soundEffect) playMoveSound("Draw") // Ses efecti
        title.textContent = "Berabere!";
    } else if (winner === "Pat") {
        if(soundEffect) playMoveSound("Draw") // Ses efecti
        title.textContent = "Pat!";
    }else if(winner === "Süre"){
        if(soundEffect) playMoveSound("Clock") // Ses efecti
        title.textContent = "Süre Doldu!"
    }else {
        if(soundEffect) playMoveSound("Win") // Ses efecti
        title.textContent = "Check-Mate!";
    }
    promotionDialog.appendChild(title);

    var subtitle = document.createElement("p");
    if (winner === "Berabere") {
        subtitle.textContent = Text;
    }else if (winner === "Pat") {
        subtitle.textContent = (turn === 'White' ? "Beyazın" : "Siyahın") + " yapabilecak hamlesi kalmadı!"
    }else if(winner === "Süre"){
        subtitle.textContent = "Kazanan " + (matPiece === "Black" ? "Beyazlar" : "Siyahlar");
    }else {
        subtitle.textContent = "Kazanan " + (winner === "Black" ? "Beyazlar" : "Siyahlar");
    }
    promotionDialog.appendChild(subtitle);

    var restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", function () {
        promotionDialog.remove();
        // Oyun yenilenmeden önceki işlemler
        location.reload();
    });
    promotionDialog.appendChild(restartButton);
    if(winner === "Süre"){
        var continueButton = document.createElement("button");
        continueButton.textContent = "Continue";
        continueButton.style.margin = '0 15px'
        continueButton.addEventListener("click", function () {
            promotionDialog.remove();
            // Oyun yenilenmeden önceki işlemler
            document.getElementById("timer1").remove();
            document.getElementById("timer2").remove();
            timeLimit['White'][0] = false
            timeLimit['White'][1] = 0
            timeLimit['Black'][0] = false
            timeLimit['Black'][1] = 0
            finishGame = false
            saveGameState(initialPosition, turn)
            console.log("Ds2",timeLimit)
        });
        promotionDialog.appendChild(continueButton);
    }
    if(!(winner === "Süre")){ // Basılmaları iptal etme
        document.getElementById('chessboard').style.pointerEvents = 'none'
        document.getElementById("container1").classList.add('no-hover'); 
        document.getElementById("container2").classList.add('no-hover')
    }
}

//Taşların Dönmesi
function rotatePieces(turn) {
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach(piece => {
        if (turn === 'Black') {
            piece.style.transform = 'rotate(180deg)';
        } else {
            piece.style.transform = 'rotate(0deg)';
        }
    });
}

//Geri alma ve geri alınan hamleyi kaydetme fonksiyonu
function fenToBack(fenArray) {
    allForwardPoint.push(allOldPoint.pop())
    movePoint = allOldPoint[allOldPoint.length-1]
    console.log("movePoint",movePoint,allOldPoint,allForwardPoint)
    let Forward = fenArray.pop()
    fenForward.push(Forward)
    let oldSelect2 = allOldSelect.pop()
    allForwardSelect.push(oldSelect2)
    console.log("OSOS Back",allOldSelect,"Forward",allForwardSelect,"old:",oldSelect)
    let fen = fenArray[fenArray.length-1]
    if(fenArray[0] === undefined){
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w"
        oldSelect = []
        movePoint = 0
    }else{
        selectOption(false)
        oldSelect = allOldSelect[allOldSelect.length-1]
    }
    console.log(fen)
    const backPosition = [];
    console.log("HHHHXXX",fen)
    const parts = fen.split(' ');
    const rows = parts[0].split('/');
    //Şah çekjme durumu güncelle
    if(parts[1][1] == "c"){
        checkStatus = true
        if(checkStatus && soundEffect) playMoveSound("Check") // Ses efecti
    }

    for (const row of rows) {
        const boardRow = [];
        for (const char of row) {
            if (isNaN(char)) {
                boardRow.push(char);
            } else {
                for (let i = 0; i < parseInt(char, 10); i++) {
                    boardRow.push(' ');
                }
            }
        }
        backPosition.push(boardRow);
    }
    console.log(backPosition);
    initialPosition = JSON.parse(JSON.stringify(backPosition))
    document.getElementById("boardContainer").remove()  // Tahtayı Sil
    newGame = false
    setupBoard()                                        // Tahtayı yemiden oluştur
    console.log("WXBack0",initialPosition)
    StartGame(initialPosition)                          // Taşları Diz
    whereIsTheKing()                                    // Kralın Konumunu Güncelle
    console.log("SSW1",oldSelect)
    if(!(oldSelect === undefined) && !(oldSelect[0] === undefined))
        selectOption(true)
    console.log("SSW2")
    if(!(timeLimit[turn][0] === false) || backMove){
        if(backMove)
            disabledElement();
        if(turn === 'Black'){
            document.getElementById('container1').style.opacity = 0.5
            document.getElementById('container2').style.opacity = 1
        }else{
            document.getElementById('container2').style.opacity = 0.5
            document.getElementById('container1').style.opacity = 1
    }}
    turn = turn === 'White' ? 'Black' : 'White';
    if(rotation)
        rotatePieces(turn)
    saveGameState(initialPosition, turn)
    changeStyles(indexStyle)
    selectedPiece = null
    selectSquare = null
    return fenForward
}

//İleri Alma - Geri alınan hamleyi ileri saran fonksiyon
function fenToForward(fenArray){
    if(!(oldSelect === undefined) && !(oldSelect[0] === undefined))
        selectOption(false)
    if (fenForward.length === 0) {
        return;
    }
    movePoint = allForwardPoint.pop()
    allOldPoint.push(movePoint)
    console.log("movePoint",movePoint,allOldPoint,allForwardPoint)
    let fen = fenForward.pop();
    fenArray.push(fen);
    oldSelect = allForwardSelect.pop()
    allOldSelect.push(oldSelect)
    console.log("OSOS Forward",allForwardSelect,"Back",allOldSelect,"old:",oldSelect)
    if (!(fenForward.length === 0)){
    }
    if(fen === undefined)
        return;
    const ForwardPosition = [];
    const parts = fen.split(' ');
    const rows = parts[0].split('/');
    //Şah çekjme durumu güncelle
    if(parts[1][1] == "c"){
        checkStatus = true
        if(checkStatus && soundEffect) playMoveSound("Check") // Ses efecti
    }

    for (const row of rows) {
        const boardRow = [];
        for (const char of row) {
            if (isNaN(char)) {
                boardRow.push(char);
            } else {
                for (let i = 0; i < parseInt(char, 10); i++) {
                    boardRow.push(' ');
                }
            }
        }
        ForwardPosition.push(boardRow);
    }
    console.log(ForwardPosition);
    initialPosition = JSON.parse(JSON.stringify(ForwardPosition))
    document.getElementById("boardContainer").remove()
    newGame = false
    setupBoard()
    StartGame(initialPosition)
    whereIsTheKing()                                    // Kralın Konumunu Güncelle
    if(!(oldSelect === undefined) && !(oldSelect[0] === undefined))
        selectOption(true)
    if(!(timeLimit[turn][0] === false) || backMove){
        if(backMove)
            disabledElement();
        if(turn === 'Black'){
            document.getElementById('container1').style.opacity = 0.5
            document.getElementById('container2').style.opacity = 1
        }else{
            document.getElementById('container2').style.opacity = 0.5
            document.getElementById('container1').style.opacity = 1
    }}
    turn = turn === 'White' ? 'Black' : 'White';
    if(rotation)
        rotatePieces(turn)
    saveGameState(initialPosition, turn)
    changeStyles(indexStyle)
    selectedPiece = null
    selectSquare = null
}

//Oyunu her hamlede kaydeden fonksiyon
function saveGameState(board, turn) {
    const gameState = {
        board: board,
        kings: kingPositions,
        rook: RookOptions,
        turn: turn,
        point: movePoint,
        oldPoint: allOldPoint,
        forwardPoint: allForwardPoint,
        time: timeLimit,
        rotation: rotation,
        turnBoard: turnBoard,
        finished: finishGame,
        predictive: predictive,
        backMove: backMove,
        history: positionHistory,
        forward: fenForward,
        style: indexStyle,
        select: oldSelect,
        allOldSelect: allOldSelect,
        allForwardSelect: allForwardSelect,
        pScreen: promotionScreen,
        pPiece: promotionPiece,
        check: checkStatus,
        sound: soundEffect
    };
    localStorage.setItem('chessGameState', JSON.stringify(gameState));
    console.log(gameState.board)
}

//Oyunun Temasını belirleyen fonksiyon
// CSS stillerini güncelleyen fonksiyon
function changeStyles(index) {
    if (index < 0 || index >= 6) {
        console.error('Geçersiz index değeri.');
        return;
    }
    // Tanımlı renk dizileri
    let squareColors = [
        ['#eee0bb', '#c8a340'], 
        ['rgb(207, 207, 207)', 'rgb(113, 113, 113)'], 
        ['rgb(207, 207, 207)', 'rgb(113, 113, 113)'], 
        ['#f4aeff', '#753fb8'], 
        ['#b6fffa', '#25d0c5'], 
        ['#ffb9ea', '#ff0099']
    ];

    let selectColors = [
        ['rgba(0, 255, 242, 0.7)', 'rgba(124, 124, 124, 0.5)'], 
        ['rgba(0, 255, 242, 0.7)', 'rgba(252, 99, 188, 0.5)'], 
        ['rgba(0, 255, 242, 0.7)', 'rgba(252, 99, 188, 0.5)'], 
        ['rgba(0, 255, 242, 0.7)', 'rgba(124, 124, 124, 0.5)'], 
        ['rgba(255, 119, 232, 0.678)', 'rgba(141, 141, 141, 0.5)'], 
        ['rgba(0, 255, 242, 0.7)', 'rgba(141, 141, 141, 0.5)']
    ];

    let labelColors = [
        ['#d8a443', '#fff', 'white'], 
        ['#dadada', '#000000', 'black'], 
        ['#dadada', '#000000', 'black'], 
        ['#dc00ff', '#fff', 'white'], 
        ['#89aeb5', '#fff', 'white'], 
        ['#ff70b7', '#fff', 'white']
    ];
    // Arka plan stilini güncelle
    let backgrounds = [
        `
        background:
        radial-gradient(35.36% 35.36% at 100% 25%,#0000 66%,#ffe15c 68% 70%,#0000 72%) 10px 10px/calc(2*10px) calc(2*10px),
        radial-gradient(35.36% 35.36% at 0    75%,#0000 66%,#ffe15c 68% 70%,#0000 72%) 10px 10px/calc(2*10px) calc(2*10px),
        radial-gradient(35.36% 35.36% at 100% 25%,#0000 66%,#ffe15c 68% 70%,#0000 72%) 0 0/calc(2*10px) calc(2*10px),
        radial-gradient(35.36% 35.36% at 0    75%,#0000 66%,#ffe15c 68% 70%,#0000 72%) 0 0/calc(2*10px) calc(2*10px),
        repeating-conic-gradient(#c7a660 0 25%,#0000 0 50%) 0 0/calc(2*10px) calc(2*10px),
        radial-gradient(#0000 66%,#ffe15c 68% 70%,#0000 72%) 0 calc(10px/2)/10px 10px
        #c7a660;
        `,
        `
        background:
            conic-gradient(from 0deg at calc(500%/6) calc(100%/3),#999 0 120deg,#0000 0),
            conic-gradient(from -120deg at calc(100%/6) calc(100%/3),#ccc 0 120deg,#0000 0),
            conic-gradient(from 120deg at calc(100%/3) calc(500%/6),#ffffff 0 120deg,#0000 0),
            conic-gradient(from 120deg at calc(200%/3) calc(500%/6),#ffffff 0 120deg,#0000 0),
            conic-gradient(from -180deg at calc(100%/3) 50%,#ccc  60deg,#ffffff 0 120deg,#0000 0),
            conic-gradient(from 60deg at calc(200%/3) 50%,#ffffff  60deg,#999 0 120deg,#0000 0),
            conic-gradient(from -60deg at 50% calc(100%/3),#ffffff 120deg,#ccc 0 240deg,#999 0);
        background-size: 97px 56px;
        `,
        `
        background:
        conic-gradient(from -60deg at 50% calc(100%/3),#000000 0 120deg,#0000 0),
        conic-gradient(from 120deg at 50% calc(200%/3),#000000 0 120deg,#0000 0),
        conic-gradient(from  60deg at calc(200%/3),#000000 60deg,#333 0 120deg,#0000 0),
        conic-gradient(from 180deg at calc(100%/3),#666 60deg,#000000 0 120deg,#0000 0),
        linear-gradient(90deg,#666 calc(100%/6),#333 0 50%,
        #666 0 calc(500%/6), #333 0);
        background-size: 97px 56px;
        `,
        `
        background:
            conic-gradient(from -60deg at 50% calc(100%/3),#7000ff 0 120deg,#0000 0),
            conic-gradient(from 120deg at 50% calc(200%/3),#7000ff 0 120deg,#0000 0),
            conic-gradient(from  60deg at calc(200%/3),#7000ff 60deg,#dc00ff 0 120deg,#0000 0),
            conic-gradient(from 180deg at calc(100%/3),#0c0093 60deg,#7000ff 0 120deg,#0000 0),
            linear-gradient(90deg,#0c0093 calc(100%/6),#dc00ff 0 50%,
            #0c0093 0 calc(500%/6), #dc00ff 0);
        background-size: 97px 56px;
        `,
        `
        background:
            radial-gradient(circle farthest-side at 0% 50%,#454545 23.5%,#0000 0)34.65px 49.5px,
            radial-gradient(circle farthest-side at 0% 50%,#3eafff 24%,#0000 0)31.35px 49.5px,
            linear-gradient(#454545 14%,#0000 0, #0000 85%,#454545 0)0 0,
            linear-gradient(150deg,#454545 24%,#3eafff 0,#3eafff 26%,#0000 0,#0000 74%,#3eafff 0,#3eafff 76%,#454545 0)0 0,
            linear-gradient(30deg,#454545 24%,#3eafff 0,#3eafff 26%,#0000 0,#0000 74%,#3eafff 0,#3eafff 76%,#454545 0)0 0,
            linear-gradient(90deg,#3eafff 2%,#454545 0,#454545 98%,#3eafff 0%)0 0 #454545;
        background-size: 66px 99px;
        background-color: #454545;
        `,
        `background:
            radial-gradient(at 80% 80%,#ff5683 25.4%,#0000 26%),
            radial-gradient(at 20% 80%,#ff5683 25.4%,#0000 26%),
            conic-gradient(from -45deg at 50% 41%,#ff5683 90deg,#ffa0df 0) 
                15.5px 0;
        background-size: 31px 31px;`
    ];

    document.body.style = backgrounds[index];

    // square renklerini güncelle
    let squares = document.querySelectorAll('.square.white, .square.black');
    squares.forEach(square => {
        if (square.classList.contains('white')) {
            square.style.backgroundColor = squareColors[index][0];
        } else if (square.classList.contains('black')) {
            square.style.backgroundColor = squareColors[index][1];
        }
    });

    // Stil bloğunu oluştur ve ekle
    let style = document.createElement('style');
    style.innerHTML = `
        .square.select::after, .square.select.circle::before, .square.black.select.point::before, .square.white.select.point::before {
            background-color: ${selectColors[index][0]};
        }
        .square.black.select.point::after, .square.white.select.point::after {
            background-color: ${selectColors[index][1]};
        }
        .square.point::after, .square.circle::after, .square.select.circle::after {
            border-color: ${selectColors[index][1]};
        }
    `;
    document.head.appendChild(style);

    // label ve number-label renklerini güncelle
    let labels = document.querySelectorAll('.label-cell, .number-label');
    labels.forEach(label => {
        label.style.backgroundColor = labelColors[index][0];
        label.style.borderColor = labelColors[index][1];
        label.style.color = labelColors[index][2];
    });
}

//Kralın Konumunu Bul
function whereIsTheKing(){
    initialPosition.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if(initialPosition[rowIndex][colIndex] === 'k'){
                kingPositions['Black'][0] = [rowIndex,colIndex]
            }
            if(initialPosition[rowIndex][colIndex] === 'K'){
                kingPositions['White'][0] = [rowIndex,colIndex]
            }
        });
    });
    console.log("KKKral Konumu değişti:",kingPositions)
}

//Selected Fonksiyonu (Tek fonksiyon yap) (Gecici)
function selectOption(Apply){
if(Apply){
    selectSquare = document.querySelector(`[data-row="${oldSelect[0][0]}"][data-col="${oldSelect[0][1]}"]`)
    selectSquare.classList.add('select' ,'back')
    selectSquare = document.querySelector(`[data-row="${oldSelect[1][0]}"][data-col="${oldSelect[1][1]}"]`)
    selectSquare.classList.add('select' ,'back')

    //Piyon işlemleri
    if(Math.abs(oldSelect[0][0]-oldSelect[1][0]) === 2 && selectSquare.firstElementChild.id.includes("Pawn")){
        console.log("SSX",oldSelect[0][0],oldSelect[1][0])
        console.log("SSX",selectSquare.firstElementChild.id)
        enPassantTarget = [oldSelect[1][0],oldSelect[1][1]]; // Geçerken alma hedefini ayarla
        oldPawnID = selectSquare.firstElementChild.id
        console.log("SSX",oldPawnID,enPassantTarget)
    }
}else{
    selectSquare = document.querySelector(`[data-row="${oldSelect[0][0]}"][data-col="${oldSelect[0][1]}"]`)
    selectSquare.classList.remove('select' ,'back')
    selectSquare = document.querySelector(`[data-row="${oldSelect[1][0]}"][data-col="${oldSelect[1][1]}"]`)
    selectSquare.classList.remove('select' ,'back')
}
}


// Ses efectlerini çalıştıran fonksiyon
function playMoveSound(sound) {
    let moveSound
    let milliseconds = 3000
    switch (sound) {
        case 'Start': moveSound =   new Audio('mp3/' + sound + '.mp3'), milliseconds = 2000;
        break;
        case 'Move1': moveSound =   new Audio('mp3/' + sound + '.mp3'); 
        break;
        case 'Move2': moveSound =   new Audio('mp3/' + sound + '.mp3'); 
        break;
        case 'Move3': moveSound =   new Audio('mp3/' + sound + '.mp3'); 
        break;
        case 'Check': moveSound =   new Audio('mp3/' + sound + '.mp3'); 
        break;
        case 'Win':   moveSound =   new Audio('mp3/' + sound + '.mp3'); 
        break;
        case 'Draw':  moveSound =   new Audio('mp3/' + sound + '.mp3'), milliseconds = 1500; 
        break;
        case 'Clock': moveSound =   new Audio('mp3/' + sound + '.mp3'); 
        break;
    }
    moveSound.currentTime = 0; // Start from the beginning
    moveSound.play();
    
    // Stop the sound after seconds
    setTimeout(() => {
        moveSound.pause();
        moveSound.currentTime = 0; // Reset the time to the beginning
    }, milliseconds); // 1000 milliseconds = 1 seconds
}