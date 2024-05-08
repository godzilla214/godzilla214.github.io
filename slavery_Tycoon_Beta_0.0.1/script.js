const names = ['Tom', 'Jerry', 'Peter', 'Alice', 'Bob', 'Eve', 'Charlie', 'Olivia', 'Max', 'Quandale', 'Luna'];

let day = 1;
let owner = "You";
let accountBalance = 10000;
let draftedPlayers = [];
let extraRationsActive = false;
let foremanActive = false;

const dayDisplay = document.getElementById('day');
const ownerDisplay = document.getElementById('owner');
const accountDisplay = document.getElementById('account');
const draftButton = document.getElementById('draftButton');
const workButton = document.getElementById('workButton');
const breakButton = document.getElementById('breakButton');
const extraRationsButton = document.getElementById('extraRationsButton');
const foremanButton = document.getElementById('foremanButton');
const ironMikeButton = document.getElementById('ironMikeButton');
const sabrin = document.getElementById('sabrin');
const fireForemanButton = document.getElementById('fireForemanButton');
const draftedList = document.getElementById('draftedList');
const popup = document.getElementById('popup');
const slaveCountDisplay = document.getElementById('slaveCount'); // Add this line to get the slave count display element

let slaveCount = 0; // Initialize slave count variable

function updateSlaveCount() {
  slaveCountDisplay.textContent = `Slaves: ${slaveCount} out of 15`;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function getRandomName() {
  return names[Math.floor(Math.random() * names.length)];
}

function deductCost(cost) {
  if (accountBalance >= cost) {
    accountBalance -= cost;
    accountDisplay.textContent = `Account Balance: $${Math.round(accountBalance)}`;
    return true;
  } else {
    return false;
  }
}

function checkMortality() {
  draftedPlayers.forEach((player, index) => {
    if (player.health > 100) {
      const healthOver100 = player.health - 100;
      const multiplier = 1 + (healthOver100 * 0.15);
      player.moneyMultiplier = multiplier;
    } else {
      player.moneyMultiplier = 1;
    }

    player.health -= Math.floor(Math.random() * 10); // Decrease health randomly

    if (player.health <= 0) {
      accountBalance -= 2000; // Penalty for killing a slave
      accountDisplay.textContent = `Account Balance: $${Math.round(accountBalance)}`;
      draftedPlayers.splice(index, 1);
      const playerItem = draftedList.querySelectorAll('li')[index];
      playerItem.remove();
      showPopup(`${player.name} died from poor health. Penalty: $2000.`);
    } else {
      const playerItem = draftedList.querySelectorAll('li')[index];
      const healthBar = playerItem.querySelector('.health-bar');
      const healthPercentage = playerItem.querySelector('.health-percentage');
      healthBar.style.width = `${player.health}%`;
      healthPercentage.textContent = `${player.health}%`;
      if (player.health < 30) {
        healthBar.classList.remove('progress');
        healthBar.classList.add('danger');
      }
    }
  });
}

function restPlayers() {
  draftedPlayers.forEach((player) => {
    player.health += 5;
    if (player.health > 100) {
      player.health = 100;
    }
  });
}

function showPopup(message) {
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000);
}

draftButton.addEventListener('click', () => {
  if (draftedPlayers.length < 15) {
    const playerCost = Math.floor(Math.random() * 2000) + 1;
    if (deductCost(playerCost)) {
      const playerName = getRandomName();
      const playerHealth = 100; // Initial health
      draftedPlayers.push({ name: playerName, cost: playerCost, health: playerHealth, moneyMultiplier: 1 });
      slaveCount++; // Increment slave count when buying a slave
      updateSlaveCount(); // Call function to update slave count display
      const playerItem = document.createElement('li');
      const healthBar = document.createElement('div');
      healthBar.classList.add('health-bar', 'progress');
      healthBar.style.width = '100%';
      const healthPercentage = document.createElement('div');
      healthPercentage.classList.add('health-percentage');
      healthPercentage.textContent = '100%';
      const freeButton = document.createElement('button');
      freeButton.classList.add('free-button');
      freeButton.textContent = 'Free';
      freeButton.addEventListener('click', () => {
        accountBalance += 250;
        accountDisplay.textContent = `Account Balance: $${Math.round(accountBalance)}`;
        draftedPlayers = draftedPlayers.filter(player => player.name !== playerName);
        playerItem.remove();
        slaveCount--; // Decrement slave count when freeing a slave
        updateSlaveCount(); // Call function to update slave count display
        showPopup(`You freed ${playerName} and received $250.`);
      });
      playerItem.textContent = `${playerName} - $${playerCost} `;
      playerItem.appendChild(freeButton);
      playerItem.appendChild(healthBar);
      playerItem.appendChild(healthPercentage);
      draftedList.appendChild(playerItem);
      scrollToTop(); // Scroll to top after adding a slave
    } else {
      showPopup("You do not have enough funds.");
    }
  } else {
    showPopup("You have reached the maximum limit of 15 slaves.");
  }
});

fireForemanButton.addEventListener('click', () => {
  if (foremanActive) {
    foremanActive = false;
    slaveCount--; // Decrement slave count when firing a foreman
    updateSlaveCount(); // Call function to update slave count display
    showPopup("Foreman fired. Total production decreased by 90% and no additional health deduction.");
  } else {
    showPopup("You do not have an active foreman to fire.");
  }
});

workButton.addEventListener('click', () => {
  showPopup("Working...");
  workButton.disabled = true;
  setTimeout(() => {
    let earningPerSlave = Math.floor(Math.random() * 1000) + 1;
    if (extraRationsActive) {
      earningPerSlave *= 1.5; // Increase earnings by 50%
      extraRationsActive = false;
    }
    
    if (foremanActive) {
      earningPerSlave *= 1.9; // Increase earnings by 90%
      draftedPlayers.forEach((player) => {
        player.health -= Math.floor(player.health * 0.05); // Deduct an additional 5% health
      });
    }

    draftedPlayers.forEach((player) => {
      accountBalance += earningPerSlave * player.moneyMultiplier;
    });

    accountDisplay.textContent = `Account Balance: $${Math.round(accountBalance)}`;
    checkMortality();
    workButton.disabled = false;
  }, 2000);
});

breakButton.addEventListener('click', () => {
  restPlayers();
  showPopup("Your slaves have earned a break and gained extra health. Press OK to continue to the next day.");
  day++;
  dayDisplay.textContent = `Day: ${day}`;
});

extraRationsButton.addEventListener('click', () => {
  if (deductCost(1500)) {
    extraRationsActive = true;
    showPopup("Extra rations provided. Slaves will work at increased rates for 1 day.");
  } else {
    showPopup("You do not have enough funds to provide extra rations.");
  }
});

foremanButton.addEventListener('click', () => {
  if (deductCost(3000)) {
    foremanActive = true;
    showPopup("Foreman hired. Total production increased by 90%, but an additional 5% health will be deducted after each day.");
  } else {
    showPopup("You do not have enough funds to hire a foreman.");
  }
});

ironMikeButton.addEventListener('click', () => {
  if (deductCost(500000)) {
    draftedPlayers.push({ name: 'Mike Tyson', cost: 0, health: 7000, moneyMultiplier: 9 });
    const playerItem = document.createElement('li');
    const healthBar = document.createElement('div');
    healthBar.classList.add('health-bar', 'progress');
    healthBar.style.width = '100%';
    const healthPercentage = document.createElement('div');
    healthPercentage.classList.add('health-percentage');
    healthPercentage.textContent = '100%';
    playerItem.textContent = `Mike Tyson - 7000 health, earns 9x money`;
    playerItem.appendChild(healthBar);
    playerItem.appendChild(healthPercentage);
    draftedList.appendChild(playerItem);
    showPopup("You now have Mike Tyson on your team!");
  } else {
    showPopup("You do not have enough funds to get Iron Mike.");
  }
});
sabrin.addEventListener('click', () => {
  if (deductCost(600000)) {
    draftedPlayers.push({ name: 'Mike Tyson', cost: 0, health: 9000, moneyMultiplier: 21 });
    const playerItem = document.createElement('li');
    const healthBar = document.createElement('div');
    healthBar.classList.add('health-bar', 'progress');
    healthBar.style.width = '100%';
    const healthPercentage = document.createElement('div');
    healthPercentage.classList.add('health-percentage');
    healthPercentage.textContent = '100%';
    playerItem.textContent = `sabrin - 9000 health, earns 21x money`;
    playerItem.appendChild(healthBar);
    playerItem.appendChild(healthPercentage);
    draftedList.appendChild(playerItem);
    showPopup("You now have sabrin on your team!");
  } else {
    showPopup("You do not have enough funds to get Iron sabrin.");
  }
});
