 const racistStatements = [
      "Discrimination is an inherent part of society.",
      "Certain races are superior to others.",
      "Racial stereotypes are accurate representations.",
      "Segregation is justifiable.",
      "People of different races should not mix."
    ];

    let racismLevel = 0;
    const levelSpan = document.getElementById('level');
    const statementsDiv = document.getElementById('racistStatements');

    function increaseRacismLevel() {
      racismLevel++;
      levelSpan.innerText = racismLevel;
      showRacistStatement();
    }