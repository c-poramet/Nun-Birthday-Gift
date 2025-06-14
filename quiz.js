document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quiz-form');
    const colorInput = form.elements['favoriteColor'];
    const colorDisplay = document.getElementById('colorDisplay');
    const numberSlider = form.elements['favoriteNumber'];
    const numberOutput = document.getElementById('numberOutput');

    // Color picker display
    colorInput.addEventListener('input', function() {
        colorDisplay.textContent = colorInput.value.toUpperCase();
        colorDisplay.style.color = colorInput.value;
    });

    // Number slider display
    numberSlider.addEventListener('input', function() {
        numberOutput.textContent = parseFloat(numberSlider.value).toFixed(3);
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const answers = {};
        const formData = new FormData(form);

        // Color and number
        answers.favoriteColor = colorInput.value;
        answers.favoriteNumber = parseFloat(numberSlider.value).toFixed(3);

        // DND class
        answers.favoriteDNDClass = formData.get('favoriteDNDClass');

        // 5 coordinate system questions
        answers.planFlexX = parseFloat(formData.get('planFlexX'));
        answers.introExtroY = parseFloat(formData.get('introExtroY'));
        answers.orderChaosX = parseFloat(formData.get('orderChaosX'));
        answers.logicEmotionY = parseFloat(formData.get('logicEmotionY'));
        answers.leaderSupportX = parseFloat(formData.get('leaderSupportX'));
        answers.optimistRealistY = parseFloat(formData.get('optimistRealistY'));
        answers.fastThoroughX = parseFloat(formData.get('fastThoroughX'));
        answers.riskCautiousY = parseFloat(formData.get('riskCautiousY'));
        answers.techNatureX = parseFloat(formData.get('techNatureX'));
        answers.minCollectorY = parseFloat(formData.get('minCollectorY'));

        // The rest as dropdowns
        answers.favoriteProvince = formData.get('favoriteProvince');
        answers.favoriteMovie = formData.get('favoriteMovie');
        answers.favoriteSongGenre = formData.get('favoriteSongGenre');
        answers.favoriteFood = formData.get('favoriteFood');
        answers.favoriteAnimal = formData.get('favoriteAnimal');
        answers.favoriteEmoji = formData.get('favoriteEmoji');
        answers.favoriteSeason = formData.get('favoriteSeason');

        // Add metadata
        answers._metadata = {
            timestamp: new Date().toISOString(),
            type: 'birthday_quiz_answers',
            version: '2.0'
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
        alert('>>> ANSWERS SAVED TO DISK! <<<\n\nFile downloaded successfully!');
    });

    // Initialize displays
    colorDisplay.textContent = colorInput.value.toUpperCase();
    numberOutput.textContent = parseFloat(numberSlider.value).toFixed(3);
});
