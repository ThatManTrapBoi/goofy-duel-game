let selectedBot = null;
let selectedMap = null;
let gameActive = false;

const BOTS = {
    'Cool Kid': { name: 'Cool Kid', emoji: '😎' },
    'Jimmy Boi': { name: 'Jimmy Boi', emoji: '🤡' },
    'Little Timmy': { name: 'Little Timmy', emoji: '👶' },
    'David Bazooka': { name: 'David Bazooka', emoji: '💣' }
};

const MAPS = {
    'Steven Hawk\'s Mansion': { name: 'Steven Hawk\'s Mansion', bg: 'linear-gradient(135deg, #2d1b69, #1a0f3f)' },
    'Jack\'s Boxing Ring': { name: 'Jack\'s Boxing Ring', bg: 'linear-gradient(135deg, #6b0000, #ff6b6b)' },
    'Charles Kriky\'s Basement': { name: 'Charles Kriky\'s Basement', bg: 'linear-gradient(135deg, #1a1a1a, #4a4a4a)' }
};

const WEAPONS = [
    { name: 'Baby Oil SMG', damage: 5, rof: 100 },
    { name: 'King Von Glock 19', damage: 15, rof: 150 },
    { name: 'Homer\'s Doh-Nut Launcher', damage: 20, rof: 500 },
    { name: 'Blue Shirt Kid Flash Bang', damage: 10, rof: 300 },
    { name: 'Mankey Boonana Launcher', damage: 18, rof: 400 },
    { name: 'American Eagle AK-47', damage: 12, rof: 120 },
    { name: 'Stephen Hawking\'s Dance Bomb', damage: 25, rof: 600 },
    { name: 'Fart Spray', damage: 8, rof: 80 }
];

const ABILITIES = [
    { name: 'Time Slow', duration: 3000, cooldown: 8000 },
    { name: 'Double Damage', duration: 5000, cooldown: 10000 },
    { name: 'Shield Bubble', duration: 4000, cooldown: 12000 },
    { name: 'Teleport Dash', uses: 2, cooldown: 6000 },
    { name: 'Weapon Swap Speed Boost', duration: 5000, cooldown: 10000 },
    { name: 'Size Shifter', duration: 5000, cooldown: 8000 },
    { name: 'Cloning Echo', duration: 6000, cooldown: 12000 },
    { name: 'Ammo Explosion', cooldown: 7000 }
];

let gameState = {
    playerHealth: 100,
    botHealth: 100,
    playerWeapon: null,
    botWeapon: null,
    playerAbility: null,
    botAbility: null,
    gameOver: false,
    winner: null
};

function selectBot(bot) {
    selectedBot = bot;
    updateUI();
}

function selectMap(map) {
    selectedMap = map;
    updateUI();
}

function updateUI() {
    const startBtn = document.getElementById('startBtn');
    startBtn.disabled = !(selectedBot && selectedMap);
}

function startGame() {
    if (!selectedBot || !selectedMap) return;
    
    // Reset game state
    gameState = {
        playerHealth: 100,
        botHealth: 100,
        playerWeapon: getRandomWeapon(),
        botWeapon: getRandomWeapon(),
        playerAbility: getRandomAbility(),
        botAbility: getRandomAbility(),
        gameOver: false,
        winner: null
    };
    
    gameActive = true;
    
    // Hide menu, show game
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    
    // Set up game display
    document.getElementById('botName').textContent = selectedBot;
    document.getElementById('mapDisplay').textContent = selectedMap;
    document.getElementById('weaponDisplay').textContent = `Weapon: ${gameState.playerWeapon.name}`;
    document.getElementById('abilityDisplay').textContent = `Ability: ${gameState.playerAbility.name}`;
    
    // Start game loop
    renderGame();
}

function getRandomWeapon() {
    return WEAPONS[Math.floor(Math.random() * WEAPONS.length)];
}

function getRandomAbility() {
    return ABILITIES[Math.floor(Math.random() * ABILITIES.length)];
}

function renderGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = MAPS[selectedMap].bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw decorative elements based on map
    drawMapElements(ctx, selectedMap);
    
    // Draw player
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(100, canvas.height / 2 - 30, 60, 60);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText('YOU', 110, canvas.height / 2);
    
    // Draw bot
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(canvas.width - 160, canvas.height / 2 - 30, 60, 60);
    ctx.fillStyle = '#fff';
    ctx.fillText(BOTS[selectedBot].emoji, canvas.width - 140, canvas.height / 2 + 10);
    
    // Update health displays
    document.getElementById('playerHealth').style.width = (gameState.playerHealth / 100) * 100 + '%';
    document.getElementById('botHealth').style.width = (gameState.botHealth / 100) * 100 + '%';
    document.getElementById('playerHp').textContent = gameState.playerHealth + '/100';
    document.getElementById('botHp').textContent = gameState.botHealth + '/100';
    
    // Check for game over
    if (gameState.playerHealth <= 0) {
        endGame(false);
    } else if (gameState.botHealth <= 0) {
        endGame(true);
    }
}

function drawMapElements(ctx, map) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    
    if (map === 'Steven Hawk\'s Mansion') {
        // Draw books
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(50 + i * 30, 50 + i * 20, 20, 40);
        }
        ctx.fillText('📚📚📚', 500, 100);
    } else if (map === 'Jack\'s Boxing Ring') {
        // Draw ring ropes
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(200, 150, 600, 300);
        ctx.fillText('🥊 BOXING RING 🥊', 350, 500);
    } else if (map === 'Charles Kriky\'s Basement') {
        // Draw basement elements
        ctx.fillText('🕷️ BASEMENT 🕷️', 400, 100);
        ctx.fillText('📦 📦 📦', 100, 500);
    }
}

function playerAttack() {
    if (!gameActive || gameState.gameOver) return;
    
    let damage = gameState.playerWeapon.damage;
    gameState.botHealth -= damage;
    gameState.botHealth = Math.max(0, gameState.botHealth);
    
    console.log(`You attacked for ${damage} damage!`);
}

function botAttack() {
    if (!gameActive || gameState.gameOver) return;
    
    let damage = gameState.botWeapon.damage;
    gameState.playerHealth -= damage;
    gameState.playerHealth = Math.max(0, gameState.playerHealth);
    
    console.log(`${selectedBot} attacked for ${damage} damage!`);
}

function endGame(playerWon) {
    gameActive = false;
    gameState.gameOver = true;
    
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
    
    if (playerWon) {
        document.getElementById('gameOverTitle').textContent = '🎉 YOU WIN! 🎉';
        document.getElementById('gameOverMessage').textContent = `You defeated ${selectedBot}!`;
    } else {
        document.getElementById('gameOverTitle').textContent = '💀 YOU LOST 💀';
        document.getElementById('gameOverMessage').textContent = `${selectedBot} got the best of you!`;
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        playerAttack();
        setTimeout(() => {
            botAttack();
        }, 200);
    }
    if (e.code === 'KeyE') {
        console.log('Ability used: ' + gameState.playerAbility.name);
    }
    if (e.code === 'KeyR') {
        console.log('Power-up used!');
    }
});

// Initial UI update
updateUI();

// Game loop for continuous rendering
setInterval(() => {
    if (gameActive && !gameState.gameOver) {
        renderGame();
    }
}, 50);