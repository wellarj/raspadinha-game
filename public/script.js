document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    const modal = document.getElementById('modal');
    const challengeImage = document.getElementById('challenge-image');
    const challengeText = document.getElementById('challenge-text');

    // Adjust canvas size to match the container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let isDrawing = false;

    // Load the first challenge and setup the canvas
    fetch('/api/challenge')
        .then(response => response.json())
        .then(data => {
            loadChallengeImage(data.image);
            challengeImage.src = data.image;
            challengeText.textContent = data.text;
        });

    function loadChallengeImage(imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            applyScratchLayer(); // Apply scratch layer after the image is loaded
        };
    }

    function applyScratchLayer() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-out';
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchmove', scratch);

    function startDrawing(e) {
        isDrawing = true;
        scratch(e);
    }

    function stopDrawing() {
        isDrawing = false;
        checkScratchCompletion();
    }

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2, false);
        ctx.fill();
    }

    function checkScratchCompletion() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let total = imageData.data.length / 4;
        let count = 0;

        for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] === 0) {
                count++;
            }
        }

        if (count / total > 0.5) {
            revealChallenge();
        }
    }

    function revealChallenge() {
        modal.classList.remove('hidden');
    }

    document.getElementById('accept-btn').addEventListener('click', () => {
        modal.classList.add('hidden');
        resetCanvas();
    });

    document.getElementById('pay-btn').addEventListener('click', () => {
        modal.classList.add('hidden');
        resetCanvas();
    });

    function resetCanvas() {
        fetch('/api/challenge')
            .then(response => response.json())
            .then(data => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                loadChallengeImage(data.image);
                challengeImage.src = data.image;
                challengeText.textContent = data.text;
            });
    }
});
