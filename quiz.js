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

    // --- Coordinate Plane Logic ---
    function setupCoordinatePlanes() {
        document.querySelectorAll('.coordinate-plane').forEach(function(plane) {
            // Settings
            const width = 220, height = 220;
            const xName = plane.dataset.x;
            const yName = plane.dataset.y;
            const xLabelLeft = plane.dataset.xlabelLeft;
            const xLabelRight = plane.dataset.xlabelRight;
            const yLabelTop = plane.dataset.ylabelTop;
            const yLabelBottom = plane.dataset.ylabelBottom;
            
            // Create container for canvas and labels
            const container = document.createElement('div');
            container.className = 'plane-container';
            
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            container.appendChild(canvas);
            
            // Create axis labels positioned around the canvas
            const xLeftLabel = document.createElement('div');
            xLeftLabel.className = 'axis-label x-left';
            xLeftLabel.textContent = xLabelLeft;
            container.appendChild(xLeftLabel);
            
            const xRightLabel = document.createElement('div');
            xRightLabel.className = 'axis-label x-right';
            xRightLabel.textContent = xLabelRight;
            container.appendChild(xRightLabel);
            
            const yTopLabel = document.createElement('div');
            yTopLabel.className = 'axis-label y-top';
            yTopLabel.textContent = yLabelTop;
            container.appendChild(yTopLabel);
            
            const yBottomLabel = document.createElement('div');
            yBottomLabel.className = 'axis-label y-bottom';
            yBottomLabel.textContent = yLabelBottom;
            container.appendChild(yBottomLabel);
            
            plane.appendChild(container);
            
            // Create coordinate display
            const coordDisplay = document.createElement('div');
            coordDisplay.className = 'coordinate-display';
            coordDisplay.textContent = 'Click to set position';
            plane.appendChild(coordDisplay);
            
            // Hidden inputs
            const xInput = plane.parentElement.querySelector(`input[name='${xName}']`);
            const yInput = plane.parentElement.querySelector(`input[name='${yName}']`);
            
            // Initial values
            let x = 0.5, y = 0.5;
            xInput.value = x;
            yInput.value = y;
            
            // Update coordinate display
            function updateCoordDisplay() {
                coordDisplay.textContent = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
            }
            updateCoordDisplay();
            
            // Draw function
            function draw() {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, width, height);
                
                // Draw grid
                ctx.strokeStyle = '#e0d5c7';
                ctx.lineWidth = 1;
                for (let i = 1; i < 4; i++) {
                    ctx.beginPath();
                    ctx.moveTo(i * width / 4, 0);
                    ctx.lineTo(i * width / 4, height);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(0, i * height / 4);
                    ctx.lineTo(width, i * height / 4);
                    ctx.stroke();
                }
                
                // Draw center lines
                ctx.strokeStyle = '#d4c4b0';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(width / 2, 0);
                ctx.lineTo(width / 2, height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.stroke();
                
                // Draw point
                const px = x * width;
                const py = y * height;
                ctx.beginPath();
                ctx.arc(px, py, 8, 0, 2 * Math.PI);
                ctx.fillStyle = '#8b7355';
                ctx.fill();
                ctx.strokeStyle = '#5d4e37';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            draw();
            
            // Drag logic
            let dragging = false;
            function setFromEvent(e) {
                const rect = canvas.getBoundingClientRect();
                let cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
                let cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
                x = Math.max(0, Math.min(1, cx / width));
                y = Math.max(0, Math.min(1, cy / height));
                xInput.value = x.toFixed(3);
                yInput.value = y.toFixed(3);
                updateCoordDisplay();
                draw();
            }
            canvas.addEventListener('mousedown', function(e) {
                dragging = true;
                setFromEvent(e);
            });
            canvas.addEventListener('touchstart', function(e) {
                dragging = true;
                setFromEvent(e);
            });
            window.addEventListener('mousemove', function(e) {
                if (dragging) setFromEvent(e);
            });
            window.addEventListener('touchmove', function(e) {
                if (dragging) setFromEvent(e);
            });
            window.addEventListener('mouseup', function() { dragging = false; });
            window.addEventListener('touchend', function() { dragging = false; });
        });
    }
    setupCoordinatePlanes();

    // Initialize displays
    colorDisplay.textContent = colorInput.value.toUpperCase();
    numberOutput.textContent = parseFloat(numberSlider.value).toFixed(3);
});
