console.log("GameHub funcionando");

const initialGames = [
    { id: 1, name: "Minecraft", genre: "Sandbox", year: 2011 },
    { id: 2, name: "RedCup", genre: "Action", year: 2026 },
    { id: 3, name: "Terraria", genre: "Adventure", year: 2011 }
];

let games = loadGames();

const gamesList = document.querySelector("#gamesList");
const gameForm = document.querySelector("#gameForm");
const searchInput = document.querySelector("#searchInput");
const emptyMessage = document.querySelector("#emptyMessage");

function loadGames() {
    const savedGames = localStorage.getItem("gameshub-games");

    if (savedGames === null) {
        return initialGames;
    }

    try {
        const parsedGames = JSON.parse(savedGames);
        return Array.isArray(parsedGames) ? parsedGames : initialGames;
    } catch {
        return initialGames;
    }
}

function saveGames() {
    localStorage.setItem("gameshub-games", JSON.stringify(games));
}

function renderGames(search = "") {
    gamesList.replaceChildren();

    const filteredGames = games.filter(game =>
        game.name.toLowerCase().includes(search.toLowerCase())
    );

    emptyMessage.hidden = filteredGames.length > 0;

    filteredGames.forEach(game => {
        const card = document.createElement("article");
        card.className = "game-card";

        const title = document.createElement("h3");
        title.textContent = game.name;

        const genre = document.createElement("p");
        genre.textContent = `Género: ${game.genre}`;

        const year = document.createElement("p");
        year.textContent = `Año: ${game.year}`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", () => {
            deleteGame(game.id);
        });

        card.append(title, genre, year, deleteButton);
        gamesList.appendChild(card);
    });
}

function addGame(name, genre, year) {
    const newGame = {
        id: Date.now(),
        name,
        genre,
        year
    };

    games.push(newGame);
    saveGames();
    renderGames(searchInput.value);
}

function deleteGame(id) {
    games = games.filter(game => game.id !== id);

    saveGames();
    renderGames(searchInput.value);
}

gameForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.querySelector("#gameName").value.trim();
    const genre = document.querySelector("#gameGenre").value.trim();
    const year = Number(document.querySelector("#gameYear").value);

    if (!name || !genre || !Number.isInteger(year) ||
        year < 1950 || year > 2100) {
        return;
    }

    addGame(name, genre, year);
    gameForm.reset();
});

searchInput.addEventListener("input", () => {
    renderGames(searchInput.value);
});

renderGames();
