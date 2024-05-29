const exercises = [
    { name: "Push-ups", reps: "15", time: 60 },
    { name: "Squats", reps: "20", time: 45 },
    { name: "Plank", reps: "45 seconds", time: 45 },
    { name: "Lunges", reps: "12 (each leg)", time: 60 },
    { name: "Jumping Jacks", reps: "20", time: 30 },
    { name: "Side Lunge", reps: "12 (each leg)", time: 30 },
    { name: "Tricep Pushups", reps: "10", time: 30 },
    { name: "Crunches", reps: "20", time: 45 },
    { name: "Mountian climbers", reps: "35", time: 40 },
  ];
  
  const exerciseButton = document.getElementById('exerciseButton');
  const exerciseInfo = document.getElementById('exerciseInfo');
  const timerDisplay = document.getElementById('timer');
  let countdown;
  
  exerciseButton.addEventListener('click', function() {
    clearInterval(countdown);
    const randomIndex = Math.floor(Math.random() * exercises.length);
    const randomExercise = exercises[randomIndex];
    exerciseInfo.innerHTML = `Exercise: ${randomExercise.name}<br>Reps: ${randomExercise.reps}`;
  
    let timeLeft = randomExercise.time;
    timerDisplay.innerHTML = `Time: ${timeLeft} seconds left`;
  
    countdown = setInterval(function() {
      timeLeft--;
      timerDisplay.innerHTML = `Time: ${timeLeft} seconds left`;
  
      if (timeLeft <= 0) {
        clearInterval(countdown);
        timerDisplay.innerHTML = `Time's up!`;
      }
    }, 1000);
  });
