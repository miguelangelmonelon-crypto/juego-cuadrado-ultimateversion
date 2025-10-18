let square = document.getElementById("square");
let score = document.getElementById("score");
let gameArea = document.getElementById("game-area");
let gameOverText = document.getElementById("game-over");

let points = 0;
let speed = 2000;
let interval;
let countdownInterval;
let gameActive = false; // controla si el juego puede recibir clics

// Cargar récord desde localStorage o poner 0 si no existe
let highScore = localStorage.getItem("highScore") || 0;

// Mostrar récord en pantalla
const highScoreDisplay = document.createElement("p");
highScoreDisplay.textContent = `Récord: ${highScore}`;
gameArea.insertAdjacentElement("afterend", highScoreDisplay);

// Mueve el cuadrado a una posición aleatoria
function moveSquare() {
  let maxX = gameArea.clientWidth - 50;
  let maxY = gameArea.clientHeight - 50;
  let x = Math.floor(Math.random() * maxX);
  let y = Math.floor(Math.random() * maxY);
  square.style.left = x + "px";
  square.style.top = y + "px";
}

// Reinicia el intervalo con la velocidad actual
function restartInterval() {
  clearInterval(interval);
  interval = setInterval(moveSquare, speed);
}

// Función para reiniciar juego
function resetGame() {
  points = 0;
  score.textContent = points;
  speed = 2000;
  gameActive = true; // ahora el juego está activo
  moveSquare();
  restartInterval();
}

// Cuenta atrás de 3 segundos antes de iniciar
function startCountdown(callback) {
  clearInterval(countdownInterval);
  let countdown = 3;
  gameOverText.style.color = "blue";
  gameOverText.style.display = "block";
  gameOverText.textContent = countdown;
  gameActive = false; // mientras cuenta atrás, no se puede jugar

  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      gameOverText.textContent = countdown;
    } else {
      clearInterval(countdownInterval);
      gameOverText.style.display = "none";
      callback();
    }
  }, 1000);
}

// Clic correcto en el cuadrado
square.addEventListener("click", function(event) {
  if (!gameActive) return; // si no está activo, no hace nada
  event.stopPropagation();
  points++;
  score.textContent = points;

  if (speed > 500) speed -= 150;
  restartInterval();
  moveSquare();

  gameOverText.style.display = "none";
});

// Clic fuera del cuadrado → GAME OVER + cuenta atrás
gameArea.addEventListener("click", function() {
  if (!gameActive) return; // si no está activo, no hacer nada
  gameActive = false; // desactivar mientras se muestra GAME OVER

  gameOverText.style.color = "red";
  gameOverText.textContent = "GAME OVER";
  gameOverText.style.display = "block";

  clearInterval(interval);

  // Actualizar récord si es necesario y guardar en localStorage
  if (points > highScore) {
    highScore = points;
    highScoreDisplay.textContent = `Récord: ${highScore}`;
    localStorage.setItem("highScore", highScore);
  }

  // Después de 1.5s, iniciar la cuenta atrás para reiniciar
  setTimeout(() => {
    startCountdown(resetGame);
  }, 1500);
});

// Inicia el juego con cuenta atrás al cargar la página
startCountdown(() => {
  resetGame();
});
