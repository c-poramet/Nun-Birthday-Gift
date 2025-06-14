document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('quiz-form');
    const decimalRange = form.elements['decimalNumber'];
    const decimalOutput = form.elements['decimalOutput'];
    const luckyRange = form.elements['luckyNumber'];
    const luckyOutput = form.elements['luckyOutput'];

    // Sync output with range
    decimalRange.addEventListener('input', function () {
        decimalOutput.value = parseFloat(decimalRange.value).toFixed(3);
    });
    luckyRange.addEventListener('input', function () {
        luckyOutput.value = luckyRange.value;
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = {};
        Array.from(form.elements).forEach(el => {
            if (el.name) {
                if (el.type === 'range' && el.name === 'decimalNumber') {
                    data[el.name] = parseFloat(el.value).toFixed(3);
                } else {
                    data[el.name] = el.value;
                }
            }
        });
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'birthday_quiz_answers.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Your answers have been saved!');
    });
});