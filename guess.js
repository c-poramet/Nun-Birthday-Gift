document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('guess-form');
    const nameInput = document.getElementById('guesserName');
    const colorInput = form.elements['favoriteColor'];
    const colorDisplay = document.getElementById('colorDisplay');
    const decimalRange = form.elements['decimalNumber'];
    const decimalOutput = document.getElementById('decimalOutput');
    const luckyRange = form.elements['luckyNumber'];
    const luckyOutput = document.getElementById('luckyOutput');

    // Color picker display
    colorInput.addEventListener('input', function() {
        colorDisplay.textContent = colorInput.value.toUpperCase();
        colorDisplay.style.color = colorInput.value;
    });

    // Decimal slider
    decimalRange.addEventListener('input', function() {
        decimalOutput.textContent = parseFloat(decimalRange.value).toFixed(3);
    });

    // Lucky number slider
    luckyRange.addEventListener('input', function() {
        luckyOutput.textContent = luckyRange.value;
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const guesserName = nameInput.value.trim();
        if (!guesserName) {
            alert('>>> ERROR: PLEASE ENTER YOUR NAME! <<<');
            nameInput.focus();
            return;
        }
        
        const guesses = {};
        const formData = new FormData(form);
        
        for (let [key, value] of formData.entries()) {
            if (key === 'decimalNumber') {
                guesses[key] = parseFloat(value).toFixed(3);
            } else {
                guesses[key] = value;
            }
        }

        // Add metadata
        guesses._metadata = {
            guesserName: guesserName,
            timestamp: new Date().toISOString(),
            type: 'birthday_quiz_guesses',
            version: '1.0'
        };

        // Create and download JSON file
        const jsonData = JSON.stringify(guesses, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz_guesses_${guesserName.replace(/\s+/g, '_')}_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success message
        alert(`>>> GUESSES SAVED TO DISK! <<<\n\nThanks ${guesserName}! File downloaded successfully!`);
    });

    // Initialize displays
    colorDisplay.textContent = colorInput.value.toUpperCase();
    decimalOutput.textContent = parseFloat(decimalRange.value).toFixed(3);
    luckyOutput.textContent = luckyRange.value;
});
