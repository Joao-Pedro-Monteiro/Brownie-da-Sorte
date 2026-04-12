 //* MÚSICA e SONS
const backgroundMusicMP3 = new Audio('../js/music/Talk Show Tonight  Music for content creator.mp3');
const wheelSoundMP3 = new Audio('../js/music/Spinning Wheel Sound Effect.mp3');
const winSoundMP3 = new Audio('../js/music/Win.mp3');

backgroundMusicMP3.volume = 0.5;
backgroundMusicMP3.loop = true;
let isBackgroundMusicPlaying = false;

wheelSoundMP3.volume = 0.5;
let isWheelSoundPlaying = false;

winSoundMP3.volume = 0.5;
let isWinSoundPlaying = false;

function backgroundMusic(action){
    switch(action){
        case 'play':
          backgroundMusicMP3.play();
          isBackgroundMusicPlaying = true;
          break;
        case 'pause':
          backgroundMusicMP3.pause();
          isBackgroundMusicPlaying = false;
          break;
        case 'stop':
          backgroundMusicMP3.pause();
          backgroundMusicMP3.currentTime = 0; // Reinicia a música para o início
          isBackgroundMusicPlaying = false;
          break;
        default:
          console.log('Ação inválida. Use "play", "stop"');
          break;
    }
}

function wheelSound(action){
    switch(action){
        case 'play':
          wheelSoundMP3.play();
          isWheelSoundPlaying = true;
          break;
        case 'pause':
          wheelSoundMP3.pause();
          isWheelSoundPlaying = false;
          break;
        case 'stop':
          wheelSoundMP3.pause();
          wheelSoundMP3.currentTime = 0;
          isWheelSoundPlaying = false;
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
          isWinSoundPlaying = true;
          break;
        case 'pause':
          winSoundMP3.pause();
          isWinSoundPlaying = false;
          break;
        case 'stop':
          winSoundMP3.pause();
          winSoundMP3.currentTime = 0;
          isWinSoundPlaying = false;
          break;
        default:
          console.log('Ação inválida. Use "play", "stop"');
          break;
    }
}


//* TOGGLE DE MÚSICA COM DOIS CLIQUES
window.addEventListener('dblclick', function(){
    if(isBackgroundMusicPlaying){
        backgroundMusic('pause');
    } else {
        backgroundMusic('play');
    }
})


//* PRÊMIOS
const prizes = [
  { label: "1 Brownie Grátis", angle: 0},
  { label: "Compre 2 Leve 3", angle: 45},
  { label: "Vale R$100,00", angle: 90},
  { label: "Compre 2 Leve 3", angle: 135},
  { label: "1 Brownie Grátis", angle: 180},
  { label: "Compre 2 Leve 3", angle: 225},
  { label: "1 Brownie Grátis", angle: 270},
  { label: "Compre 2 Leve 3", angle: 315}
];


//* ROLETA
let currentRotation = 0;
let isSpinning = false;

function spinWheel() {
  if (isSpinning) return; // Verifica se já está girando para evitar erros
  isSpinning = true;
  
  //? Diminui o volume da música de fundo se estiver tocando
  isBackgroundMusicPlaying ? backgroundMusicMP3.volume = 0.2 : null;

  wheelSound('play');

  const randomPrize = getRandomPrize();
  const totalRotation = calculateTotalRotation(randomPrize.angle);
  
  applyWheelRotation(totalRotation);

  setTimeout(() => {
    isSpinning = false;
    showPrizeResult(randomPrize.label);
    wheelSound('stop');
    backgroundMusicMP3.volume = 0.5; //* Restaura o volume da música de fundo
  }, 9300); // Tempo de rotação + tempo para mostrar o resultado
}

function getRandomPrize() {
  const randomIndex = Math.floor(Math.random() * prizes.length);
  return prizes[randomIndex];
}

function calculateTotalRotation(prizeAngle) {
  const extraSpins = 3 + Math.floor(Math.random() * 4); // Gera 3 a 6 giros extras
  const extraRotation = extraSpins * 360;
  return currentRotation + extraRotation + (360 - prizeAngle);
}

function applyWheelRotation(totalRotation) {
  const wheel = document.getElementById('wheel');
  wheel.style.transition = 'transform 9s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheel.style.transform = `rotate(${totalRotation}deg)`;
  currentRotation = totalRotation;
}


//* POPUP DE RESULTADO
function showPrizeResult(prizeLabel) {
  // Processa niome do usuário para exibição
  ux_name = localStorage.getItem('username');
  ux_name = ux_name.split(' ')[0]; // Pega apenas o primeiro nome
  document.querySelector('.popup h2 p').textContent = ux_name; // Exibe o nome do usuário no popup
  
  document.getElementById('prizeText').textContent = prizeLabel;
  winSound('play');
  document.getElementById('overlay').classList.add('show');
}

function closeResult() {
  document.getElementById('overlay').classList.remove('show');
  winSound('stop');
  currentRotation = 0;
}


//* POPUP DE LOGIN
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('resultPopup').style.display = 'none';
  document.getElementById('overlay').classList.add('show');
});


//* registro de nome de usuário
function usernameRegistration(){
  const username = document.getElementById('usernameInput').value.trim();
  
  if(username === ''){
    window.location.reload(); // Recarrega a página para mostrar o popup de login novamente
  }

  localStorage.setItem('username', username);

  /* 
  * Remove o popup de login e 
  * volta as configurações de eibição do popup de resultado
  */
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('resultPopup').style.display = 'block';
  document.getElementById('loginPopup').style.display = 'none';
};