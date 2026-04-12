 //* MÚSICA
const backgroundMusicMP3 = new Audio('../js/music/Talk Show Tonight  Music for content creator.mp3');
const wheelSoundMP3 = new Audio('../js/music/Spinning Wheel Sound Effect.mp3');
const winSoundMP3 = new Audio('../js/music/Win.mp3');
backgroundMusicMP3.volume = 0.5;
wheelSoundMP3.volume = 0.5;
winSoundMP3.volume = 0.5;

function backgroundMusic(action){
    switch(action){
        case 'play':
            backgroundMusicMP3.play();
            break;
        case 'stop':
            backgroundMusicMP3.pause();
            backgroundMusicMP3.currentTime = 0; // Reinicia a música para o início
        default:
            console.log('Ação inválida. Use "play", "stop"');
            break;
    }
}

function wheelSound(action){
    switch(action){
        case 'play':
            wheelSoundMP3.play();
            break;
        case 'stop':
            wheelSoundMP3.pause();
            wheelSoundMP3.currentTime = 0;
            break;
        default:
            console.log('Ação inválida. Use "play", "stop"');
            break;
    }
}

function winSound(action){
    switch(action){
        case 'play':
            winSoundMP3.play();
            break;
        case 'stop':
            winSoundMP3.pause();
            winSoundMP3.currentTime = 0; 
            break;
        default:
            console.log('Ação inválida. Use "play", "stop"');
            break;
    }
}


//* ROLETA

const prizes = [
    { label: "1 Brownie Grátis",    angle: 0  },
    { label: "Compre 2 Leve 3",  angle: 45  },
    { label: "Vale R$100,00",  angle: 90  },
    { label: "Compre 2 Leve 3",  angle: 135 },
    { label: "1 Brownie Grátis",  angle: 180 },
    { label: "Compre 2 Leve 3",  angle: 225 },
    { label: "1 Brownie Grátis",  angle: 270 },
    { label: "Compre 2 Leve 3",  angle: 315 }
  ];

  let currentRotation = 0;
  let isSpinning = false;

  function spinWheel() {
    if (isSpinning) return; // Verifica se já está girando para evitar erros
    isSpinning = true;
    wheelSound('play');

    const randomPrize = getRandomPrize();
    const totalRotation = calculateTotalRotation(randomPrize.angle);
    
    applyWheelRotation(totalRotation);

    setTimeout(() => {
      isSpinning = false;
      showPrizeResult(randomPrize.label);
      wheelSound('stop');
    }, 9300); // Tempo de rotação + tempo para mostrar o resultado
  }

  function getRandomPrize() {
    const randomIndex = Math.floor(Math.random() * prizes.length);
    return prizes[randomIndex];
  }

  function calculateTotalRotation(prizeAngle) {
    const extraSpins = 3 + Math.floor(Math.random() * 4); // Gera 3, 4, 5 ou 6 giros extras
    const extraRotation = extraSpins * 360;
    return currentRotation + extraRotation + (360 - prizeAngle); // + 90 para centralizar o prêmio
  }

  function applyWheelRotation(totalRotation) {
    const wheel = document.getElementById('wheel');
    wheel.style.transition = 'transform 9s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    currentRotation = totalRotation;
  }
  
  function resetWheel(){
    const weel = document.getElementById('wheel');
  }

  function showPrizeResult(prizeLabel) {

    document.getElementById('prizeText').textContent = prizeLabel;
    winSound('play');
    document.getElementById('overlay').classList.add('show');
  }

  function closeResult() {
    resetWheel();
    document.getElementById('overlay').classList.remove('show');
    winSound('stop');
    currentRotation = 0;
  }