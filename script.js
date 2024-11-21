// Selecione os 6 países fixos
const fixedTeams = [
  "Brasil", "Argentina", "Espanha", "Inglaterra", 
  "Franca", "Portugal"
];

const allTeams = [
  "Holanda", "Alemanha", 
  "Japao", "Coreia", "Italia", "Senegal",
  "Croacia", "Belgica", "Uruguai", "Mexico",
  "Marrocos", "EUA", "Equador", "Canada",
  "Australia", "Suica", "Dinamarca", "Gana"
];

let currentStage = "oitavas";
let matches = [];
let results = [];
let simulationMode = "random"; // "random" ou "manual"


// Função para obter 10 equipes aleatórias
function getRandomTeams(allTeams) {
  return [...allTeams].sort(() => Math.random() - 0.5).slice(0, 10);
}

// Combina as equipes fixas com as aleatórias
let teams = [...fixedTeams, ...getRandomTeams(allTeams)];

// Resto do código permanece igual...

// Seletores
const homeScreen = document.getElementById("home-screen");
const matchScreen = document.getElementById("match-screen");
const finalScreen = document.getElementById("final-screen");
const stageTitle = document.getElementById("stage-title");
const matchesContainer = document.getElementById("matches");
const champion = document.getElementById("champion");
const winnerFlag = document.getElementById("winner-flag");

document.getElementById("random-simulation").addEventListener("click", () => {
  simulationMode = "random";
  startSimulation();
});

document.getElementById("manual-simulation").addEventListener("click", () => {
  simulationMode = "manual";
  startSimulation();
});

document.getElementById("simulate-games").addEventListener("click", simulateGames);
document.getElementById("advance").addEventListener("click", advanceStage);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("restart").addEventListener("click", reset);

function startSimulation() {
  homeScreen.classList.add("hidden");
  matchScreen.classList.remove("hidden");
  createMatches();
}

function createMatches() {
  matchesContainer.innerHTML = "";
  matches = [];

  const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffledTeams.length; i += 2) {
    const match = {
      team1: shuffledTeams[i],
      team2: shuffledTeams[i + 1],
      result: simulationMode === "manual" ? null : generateResult()
    };
    matches.push(match);

    const matchElement = document.createElement("div");
    matchElement.classList.add("match");

    matchElement.innerHTML = `
      <div class="team">
        <img src="img/${match.team1.toLowerCase().replace(/\s+/g, '-')}.png" alt="${match.team1}">
        <span>${match.team1}</span>
        ${
          simulationMode === "manual"
            ? `<input type="number" min="0" id="score1-${i / 2}" class="score-input" />`
            : `<span>${match.result?.split("x")[0] || "?"}</span>`
        }
      </div>
      <span>X</span>
      <div class="team">
        
        
        <img src="img/${match.team2.toLowerCase().replace(/\s+/g, '-')}.png" alt="${match.team2}">
        <span>${match.team2}</span>
        ${
          simulationMode === "manual"
            ? `<input type="number" min="0" id="score2-${i / 2}" class="score-input" />`
            : `<span>${match.result?.split("x")[1] || "?"}</span>`
        }
      </div>
    `;
    matchesContainer.appendChild(matchElement);
  }
  updateStageTitle();
}

function updateStageTitle() {
  stageTitle.textContent = currentStage === "oitavas" ? "Oitavas de Final" :
                           currentStage === "quartas" ? "Quartas de Final" :
                           currentStage === "semis" ? "Semifinal" : "Final da Copa";
}

function generateResult() {
  let score1, score2;
  do {
    score1 = Math.floor(Math.random() * 5); // Gera entre 0 e 4
    score2 = Math.floor(Math.random() * 5);
  } while (score1 === score2); // Evita empate

  return `${score1}x${score2}`;
}

function simulateGames() {
  if (simulationMode === "random") {
    matches.forEach((match, index) => {
      const result = generateResult();  // Gera o resultado aleatório
      match.result = result;

      // Seleciona o elemento correto do jogo na página
      const matchElement = matchesContainer.querySelectorAll('.match')[index];

      // Atualiza o placar do time 1 (lado esquerdo)
      matchElement.querySelector(".team:nth-of-type(2) span:nth-of-type(2)").textContent = result.split("x")[0];

      // Atualiza o placar do time 2 (lado direito), sem alterar o nome do time
      matchElement.querySelector(".team:nth-of-type(1) span:nth-of-type(2)").textContent = result.split("x")[1];
    
      // Identifica o vencedor do jogo
    const [score1, score2] = result.split("x").map(Number);
    if (score1 > score2) {
      match.winner = match.team1;  // Time 1 vence
    } else {
      match.winner = match.team2;  // Time 2 vence
    }
    // Atualiza a lista de times vencedores para a próxima fase
    teams = matches.map(match => match.winner);  // Pega apenas os vencedores
  });
  }
}


function advanceStage() {
  if (simulationMode === "manual") {
    for (let i = 0; i < matches.length; i++) {
      const score1 = parseInt(document.getElementById(`score1-${i}`).value) || 0;
      const score2 = parseInt(document.getElementById(`score2-${i}`).value) || 0;

      if (score1 === score2) {
        alert("Empates não são permitidos. Ajuste o placar!");
        return;
      }
      matches[i].result = `${score1}x${score2}`;  
      
    }
  }

  results.push(...matches);
  teams.length = 0;

  matches.forEach(match => {
    const [score1, score2] = match.result.split("x").map(Number);
    teams.push(score1 > score2 ? match.team1 : match.team2);
  });

  if (teams.length === 1) {
    const winner = teams[0];
    matchScreen.classList.add("hidden");
    finalScreen.classList.remove("hidden");
    winnerFlag.src = `img/${winner.toLowerCase().replace(/\s+/g, '-')}.png`;
    champion.textContent = `CAMPEÃO: ${winner}`;
    return;
  }

  currentStage =
    currentStage === "oitavas"
      ? "quartas"
      : currentStage === "quartas"
      ? "semis"
      : "final";

  createMatches();
}

function reset() {
  currentStage = "oitavas";
  results = [];
  teams.length = 0;
  teams = getRandomTeams(allTeams); // Redefine 16 novas equipes ao reiniciar
  homeScreen.classList.remove("hidden");
  matchScreen.classList.add("hidden");
  finalScreen.classList.add("hidden");
}
