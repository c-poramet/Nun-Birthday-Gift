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
                } else if (key === 'favoriteNumber') {
                    // Decimal number comparison (closer = better)
                    const diff = Math.abs(parseFloat(birthdayAnswer) - parseFloat(guessAnswer));
                    points = Math.max(0, 1 - (diff * 10)); // Scale so 0.1 diff = 0 points
                } else if (key.endsWith('X') || key.endsWith('Y')) {
                    // Coordinate plane comparison (closer = better)
                    const diff = Math.abs(parseFloat(birthdayAnswer) - parseFloat(guessAnswer));
                    points = Math.max(0, 1 - (diff * 2)); // Scale so 0.5 diff = 0 points
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
            'favoriteNumber': '02',
            'favoriteDNDClass': '03',
            'planFlexX': '04a',
            'introExtroY': '04b',
            'orderChaosX': '05a',
            'logicEmotionY': '05b',
            'leaderSupportX': '06a',
            'optimistRealistY': '06b',
            'fastThoroughX': '07a',
            'riskCautiousY': '07b',
            'techNatureX': '08a',
            'minCollectorY': '08b',
            'favoriteProvince': '09',
            'favoriteMovie': '10',
            'favoriteSongGenre': '11',
            'favoriteFood': '12',
            'favoriteAnimal': '13',
            'favoriteEmoji': '14',
            'favoriteSeason': '15'
        };
        return questionMap[key] || '??';
    }

    function getQuestionText(key) {
        const questionMap = {
            'favoriteColor': 'Favorite Color',
            'favoriteNumber': 'Favorite Number (0-1)',
            'favoriteDNDClass': 'Favorite DND Class',
            'planFlexX': 'Planning vs Flexibility (X)',
            'introExtroY': 'Introvert vs Extrovert (Y)',
            'orderChaosX': 'Order vs Chaos (X)',
            'logicEmotionY': 'Logic vs Emotion (Y)',
            'leaderSupportX': 'Leader vs Supporter (X)',
            'optimistRealistY': 'Optimist vs Realist (Y)',
            'fastThoroughX': 'Fast vs Thorough (X)',
            'riskCautiousY': 'Risk-Taker vs Cautious (Y)',
            'techNatureX': 'Techie vs Nature-Lover (X)',
            'minCollectorY': 'Minimalist vs Collector (Y)',
            'favoriteProvince': 'Favorite Province in Thailand',
            'favoriteMovie': 'Favorite Movie',
            'favoriteSongGenre': 'Favorite Song Genre',
            'favoriteFood': 'Favorite Food',
            'favoriteAnimal': 'Spirit Animal',
            'favoriteEmoji': 'Favorite Emoji',
            'favoriteSeason': 'Favorite Season'
        };
        return questionMap[key] || 'Unknown Question';
    }
});
