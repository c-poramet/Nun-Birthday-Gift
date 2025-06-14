document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quiz-form');
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
        
        const answers = {};
        const formData = new FormData(form);
        
        for (let [key, value] of formData.entries()) {
            if (key === 'decimalNumber') {
                answers[key] = parseFloat(value).toFixed(3);
            } else {
                answers[key] = value;
            }
        }

        // Add metadata
        answers._metadata = {
            timestamp: new Date().toISOString(),
            type: 'birthday_quiz_answers',
            version: '1.0'
        };

        // Create and download JSON file
        const jsonData = JSON.stringify(answers, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `birthday_quiz_answers_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success message
        alert('>>> ANSWERS SAVED TO DISK! <<<\n\nFile downloaded successfully!');
    });

    // Initialize displays
    colorDisplay.textContent = colorInput.value.toUpperCase();
    decimalOutput.textContent = parseFloat(decimalRange.value).toFixed(3);
    luckyOutput.textContent = luckyRange.value;
});
