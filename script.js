document.addEventListener('DOMContentLoaded', function() {
    const startStopButton = document.getElementById('startStop');
    const resetButton = document.getElementById('reset');
    const timerElement = document.getElementById('timer');
    const roundTimeValue = document.getElementById('roundTimeValue');
    const numRoundsValue = document.getElementById('numRoundsValue');
    const roundTime = document.getElementById('roundTime');
    const numRounds = document.getElementById('numRounds');
    const roundTimeManual = document.getElementById('roundTimeManual');
    const numRoundsManual = document.getElementById('numRoundsManual');
    const breakTimeSlider = document.getElementById('breakTimeSlider');
    const breakTimeSliderValue = document.getElementById('breakTimeSliderValue');
    const breakTime = document.getElementById('breakTime');

    let interval;
    let timeLeft = 0;
    let isRunning = false;
    let currentRound = 0;
    let totalRounds = parseInt(numRounds.value);
    let isBreak = false;

    // Slider interaction
    roundTime.addEventListener('input', function(e) {
        roundTimeValue.textContent = e.target.value;
    });

    numRounds.addEventListener('input', function(e) {
        numRoundsValue.textContent = e.target.value;
        totalRounds = parseInt(e.target.value);
    });

    breakTimeSlider.addEventListener('input', function(e) {
        breakTimeSliderValue.textContent = e.target.value;
        breakTime.value = e.target.value;
    });

    // Manual input handling for round time
    roundTimeManual.addEventListener('change', function() {
        const manualValue = parseFloat(this.value);
        if(manualValue >= 0.5 && manualValue <= 30) {
            roundTime.value = manualValue;
            roundTimeValue.textContent = manualValue;
        }
    });

    // Manual input handling for number of rounds
    numRoundsManual.addEventListener('change', function() {
        const manualValue = parseInt(this.value);
        if(manualValue >= 1 && manualValue <= 30) {
            numRounds.value = manualValue;
            numRoundsValue.textContent = manualValue;
            totalRounds = manualValue;
        }
    });

    breakTime.addEventListener('change', function() {
        const manualValue = parseInt(this.value);
        if(manualValue >= 0 && manualValue <= 300) {
            breakTimeSlider.value = manualValue;
            breakTimeSliderValue.textContent = manualValue;
        }
    });

    // Play sounds
    const roundEndSound = new Howl({ src: ['SoundEffects/NetworkDojoDesignKit/ENDOFROUND.mp3'] });
    const allDoneSound = new Howl({ src: ['SoundEffects/NetworkDojoDesignKit/FIGHTSOVER.mp3'] });
    const roundStartSound = new Howl({ src: ['SoundEffects/NetworkDojoDesignKit/ROUNDSTARTS.mp3'] });

    function startTimer() {
        if (!isRunning) {
            // Only reset time if starting fresh (not resuming from pause)
            if (timeLeft === 0) {
                timeLeft = parseFloat(roundTime.value) * 60;
                currentRound = 0;
                isBreak = false;
                roundStartSound.play();
            }
            timerElement.textContent = formatTime(timeLeft);
            isRunning = true;
            interval = setInterval(updateTimer, 1000);
            startStopButton.textContent = 'Stop';
        } else {
            clearInterval(interval);
            isRunning = false;
            startStopButton.textContent = 'Start';
        }
    }

    function updateTimer() {
        timeLeft--;
        timerElement.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(interval);

            if (isBreak) {
                // End of break, start new round
                timeLeft = parseFloat(roundTime.value) * 60; // Round time in seconds
                roundStartSound.play();
                isBreak = false;
                interval = setInterval(updateTimer, 1000);
            } else {
                // End of round, check if more rounds left
                currentRound++;
                if (currentRound < totalRounds) {
                    timeLeft = parseFloat(breakTime.value); // Break time in seconds
                    roundEndSound.play();
                    isBreak = true;
                    interval = setInterval(updateTimer, 1000);
                } else {
                    allDoneSound.play();
                    isRunning = false;
                    isBreak = false;
                    startStopButton.textContent = 'Start';
                }
            }
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    }

    function resetTimer() {
        clearInterval(interval);
        isRunning = false;
        isBreak = false;
        currentRound = 0;
        timeLeft = 0;
        timerElement.textContent = '00:00';
        startStopButton.textContent = 'Start';
    }

    startStopButton.addEventListener('click', startTimer);
    resetButton.addEventListener('click', resetTimer);
});