document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const birthdayAnswersTextarea = document.getElementById('birthdayAnswers');
    const guessesListTextarea = document.getElementById('guessesList');
    const resultsDiv = document.getElementById('results');
    const scoreboardDiv = document.getElementById('scoreboard');
    const detailedResultsDiv = document.getElementById('detailedResults');

    analyzeBtn.addEventListener('click', function() {
        try {
            // Parse birthday person's answers
            const birthdayAnswers = JSON.parse(birthdayAnswersTextarea.value.trim());
            
            // Parse all guesses
            const guessesText = guessesListTextarea.value.trim();
            const guessesLines = guessesText.split('\n').filter(line => line.trim());
            
            if (guessesLines.length === 0) {
                alert('>>> ERROR: NO GUESSES PROVIDED! <<<');
                return;
            }
            
            const allGuesses = guessesLines.map(line => JSON.parse(line.trim()));
            
            // Calculate scores
            const results = calculateScores(birthdayAnswers, allGuesses);
            
            // Display results
            displayResults(results, birthdayAnswers);
            
            resultsDiv.style.display = 'block';
            
        } catch (error) {
            alert('>>> ERROR: INVALID JSON FORMAT! <<<\n\nPlease check your JSON formatting.');
            console.error('Analysis error:', error);
        }
    });

    function calculateScores(birthdayAnswers, allGuesses) {
        const results = [];
        
        allGuesses.forEach(guess => {
            const guesserName = guess._metadata?.guesserName || 'Unknown';
            let score = 0;
            let maxScore = 0;
            const details = {};
            
            // Compare each answer
            Object.keys(birthdayAnswers).forEach(key => {
                if (key === '_metadata') return;
                
                maxScore++;
                const birthdayAnswer = birthdayAnswers[key];
                const guessAnswer = guess[key];
                
                let points = 0;
                
                if (key === 'favoriteColor') {
                    // Color comparison (hex values)
                    points = birthdayAnswer === guessAnswer ? 1 : 0;
                } else if (key === 'decimalNumber') {
                    // Decimal number comparison (closer = better)
                    const diff = Math.abs(parseFloat(birthdayAnswer) - parseFloat(guessAnswer));
                    points = Math.max(0, 1 - (diff * 10)); // Scale so 0.1 diff = 0 points
                } else if (key === 'luckyNumber') {
                    // Lucky number comparison (closer = better)
                    const diff = Math.abs(parseInt(birthdayAnswer) - parseInt(guessAnswer));
                    points = Math.max(0, 1 - (diff / 50)); // Scale so 50 diff = 0 points
                } else if (typeof birthdayAnswer === 'string' && typeof guessAnswer === 'string') {
                    // Text comparison (case insensitive, partial match)
                    const birthday = birthdayAnswer.toLowerCase().trim();
                    const guessed = guessAnswer.toLowerCase().trim();
                    
                    if (birthday === guessed) {
                        points = 1;
                    } else if (birthday.includes(guessed) || guessed.includes(birthday)) {
                        points = 0.5;
                    } else {
                        points = 0;
                    }
                } else {
                    // Exact match for other types
                    points = birthdayAnswer === guessAnswer ? 1 : 0;
                }
                
                details[key] = {
                    birthday: birthdayAnswer,
                    guess: guessAnswer,
                    points: points,
                    match: points > 0
                };
                
                score += points;
            });
            
            results.push({
                name: guesserName,
                score: score,
                maxScore: maxScore,
                percentage: (score / maxScore * 100).toFixed(1),
                details: details
            });
        });
        
        // Sort by score (highest first)
        results.sort((a, b) => b.score - a.score);
        
        return results;
    }

    function displayResults(results, birthdayAnswers) {
        // Create scoreboard
        let scoreboardHTML = '<div class="scoreboard">';
        scoreboardHTML += '<h4>🏆 FINAL SCOREBOARD 🏆</h4>';
        
        results.forEach((result, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
            scoreboardHTML += `
                <div class="score-entry ${index === 0 ? 'winner' : ''}">
                    <span class="rank">${medal} #${index + 1}</span>
                    <span class="name">${result.name}</span>
                    <span class="score">${result.score.toFixed(1)}/${result.maxScore} (${result.percentage}%)</span>
                </div>
            `;
        });
        
        scoreboardHTML += '</div>';
        scoreboardDiv.innerHTML = scoreboardHTML;
        
        // Create detailed results
        let detailedHTML = '<div class="detailed-analysis">';
        detailedHTML += '<h4>📋 DETAILED BREAKDOWN 📋</h4>';
        
        results.forEach(result => {
            detailedHTML += `
                <div class="person-analysis">
                    <h5>${result.name} - ${result.percentage}% Match</h5>
                    <div class="question-breakdown">
            `;
            
            Object.keys(result.details).forEach(key => {
                const detail = result.details[key];
                const questionNum = getQuestionNumber(key);
                const questionText = getQuestionText(key);
                
                detailedHTML += `
                    <div class="question-result ${detail.match ? 'correct' : 'incorrect'}">
                        <span class="q-num">[${questionNum}]</span>
                        <span class="q-text">${questionText}</span>
                        <div class="answers">
                            <div class="birthday-answer">Birthday: ${detail.birthday}</div>
                            <div class="guess-answer">Guess: ${detail.guess}</div>
                            <div class="points">Points: ${detail.points.toFixed(1)}</div>
                        </div>
                    </div>
                `;
            });
            
            detailedHTML += '</div></div>';
        });
        
        detailedHTML += '</div>';
        detailedResultsDiv.innerHTML = detailedHTML;
    }

    function getQuestionNumber(key) {
        const questionMap = {
            'favoriteColor': '01',
            'decimalNumber': '02',
            'favoriteSong': '03',
            'favoriteMovie': '04',
            'favoriteFood': '05',
            'favoriteAnimal': '06',
            'travelDestination': '07',
            'morningOrNight': '08',
            'coffeeOrTea': '09',
            'luckyNumber': '10',
            'favoriteEmoji': '11',
            'favoriteSeason': '12',
            'superpower': '13',
            'oneWord': '14',
            'spiritVegetable': '15'
        };
        return questionMap[key] || '??';
    }

    function getQuestionText(key) {
        const questionMap = {
            'favoriteColor': 'Favorite Color',
            'decimalNumber': 'Decimal Number',
            'favoriteSong': 'Favorite Song',
            'favoriteMovie': 'Favorite Movie',
            'favoriteFood': 'Favorite Food',
            'favoriteAnimal': 'Spirit Animal',
            'travelDestination': 'Dream Destination',
            'morningOrNight': 'Morning/Night Person',
            'coffeeOrTea': 'Coffee or Tea',
            'luckyNumber': 'Lucky Number',
            'favoriteEmoji': 'Favorite Emoji',
            'favoriteSeason': 'Favorite Season',
            'superpower': 'Superpower',
            'oneWord': 'One Word Description',
            'spiritVegetable': 'Spirit Vegetable'
        };
        return questionMap[key] || 'Unknown Question';
    }
});
