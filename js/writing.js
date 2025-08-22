document.addEventListener('DOMContentLoaded', function() {
    // Character data
    const characters = {
        '日': {
            strokes: [
                'M30,10 L70,10',
                'M70,10 L70,90',
                'M70,90 L30,90',
                'M30,90 L30,10',
                'M30,50 L70,50'
            ],
            meaning: 'Sun, day',
            readings: 'On: ニチ, ジツ; Kun: ひ, -か, -び'
        },
        '本': {
            strokes: [
                'M50,10 L50,90',
                'M30,30 L70,30',
                'M20,70 L80,70'
            ],
            meaning: 'Book, origin, main',
            readings: 'On: ホン; Kun: もと'
        },
        '語': {
            strokes: [
                'M20,20 L40,20 L40,80 L20,80 Z',
                'M60,20 L80,20 L80,80 L60,80 Z',
                'M30,40 L50,40',
                'M30,60 L50,60',
                'M60,40 L80,40',
                'M60,60 L80,60'
            ],
            meaning: 'Language, word',
            readings: 'On: ゴ; Kun: かた(る)'
        },
        '山': {
            strokes: [
                'M50,20 L30,80',
                'M50,20 L70,80',
                'M40,60 L60,60'
            ],
            meaning: 'Mountain',
            readings: 'On: サン; Kun: やま'
        },
        '川': {
            strokes: [
                'M30,20 L30,80',
                'M50,20 L50,80',
                'M70,20 L70,80'
            ],
            meaning: 'River',
            readings: 'On: セン; Kun: かわ'
        },
        '愛': {
            strokes: [
                'M30,20 L50,40 L70,20',
                'M50,40 L50,80',
                'M30,60 L70,60',
                'M20,80 L80,80'
            ],
            meaning: 'Love',
            readings: 'On: アイ; Kun: いと(しい)'
        },
        '水': {
            strokes: [
                'M50,10 L50,50',
                'M30,70 L50,50 L70,70',
                'M40,90 L50,70 L60,90'
            ],
            meaning: 'Water',
            readings: 'On: スイ; Kun: みず'
        },
        '火': {
            strokes: [
                'M50,10 L30,50',
                'M50,10 L70,50',
                'M40,30 L60,30',
                'M30,70 L70,70'
            ],
            meaning: 'Fire',
            readings: 'On: カ; Kun: ひ'
        }
    };
    
    // Current character and stroke
    let currentChar = '日';
    let currentStroke = 0;
    let isDrawing = false;
    let showReference = false;
    
    // DOM elements
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const referenceOverlay = document.getElementById('reference-overlay');
    const currentCharElement = document.getElementById('current-char');
    const charMeaningElement = document.getElementById('char-meaning');
    const charReadingsElement = document.getElementById('char-readings');
    const strokeOrderStepsElement = document.getElementById('stroke-order-steps');
    const clearBtn = document.getElementById('clear-btn');
    const compareBtn = document.getElementById('compare-btn');
    const toggleGuideBtn = document.getElementById('toggle-guide-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const charSelectBtns = document.querySelectorAll('.char-select-btn');
    
    // Set canvas size
    function resizeCanvas() {
        if (!canvas) return;
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawCanvas();
    }
    
    // Initialize the app
    function init() {
        if (!canvas || !ctx) return;
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Load first character
        loadCharacter(currentChar);
        
        // Set up event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Touch support
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);
        
        if (clearBtn) clearBtn.addEventListener('click', clearCanvas);
        if (compareBtn) compareBtn.addEventListener('click', toggleCompare);
        if (toggleGuideBtn) toggleGuideBtn.addEventListener('click', toggleGuide);
        if (prevBtn) prevBtn.addEventListener('click', prevStroke);
        if (nextBtn) nextBtn.addEventListener('click', nextStroke);
        
        charSelectBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const char = this.getAttribute('data-char');
                loadCharacter(char);
            });
        });
    }
    
    // Load a character and its stroke order
    function loadCharacter(char) {
        currentChar = char;
        currentStroke = 0;
        
        // Update character display
        if (currentCharElement) currentCharElement.textContent = char;
        if (charMeaningElement) charMeaningElement.textContent = characters[char].meaning;
        if (charReadingsElement) charReadingsElement.textContent = characters[char].readings;
        
        // Generate stroke order steps
        if (strokeOrderStepsElement) {
            strokeOrderStepsElement.innerHTML = '';
            characters[char].strokes.forEach((stroke, index) => {
                const step = document.createElement('div');
                step.className = 'stroke-order-step bg-orange-50 p-2 rounded-lg text-center cursor-pointer';
                if (index === 0) step.classList.add('active');
                
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('viewBox', '0 0 100 100');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '80');
                
                // Draw all previous strokes in light color
                for (let i = 0; i <= index; i++) {
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', characters[char].strokes[i]);
                    path.setAttribute('stroke', i === index ? '#ea580c' : '#fdba74');
                    path.setAttribute('stroke-width', i === index ? '4' : '3');
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke-linecap', 'round');
                    svg.appendChild(path);
                }
                
                step.appendChild(svg);
                step.innerHTML += `<div class="text-sm font-medium text-orange-700 mt-1">Stroke ${index + 1}</div>`;
                
                step.addEventListener('click', () => {
                    document.querySelectorAll('.stroke-order-step').forEach(el => el.classList.remove('active'));
                    step.classList.add('active');
                    currentStroke = index;
                    redrawCanvas();
                });
                
                strokeOrderStepsElement.appendChild(step);
            });
        }
        
        // Clear canvas and redraw
        clearCanvas();
    }
    
    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function draw(e) {
        if (!isDrawing || !ctx) return;
        
        const rect = canvas.getBoundingClientRect();
        let x, y;
        
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ea580c';
        
        if (ctx.lastX && ctx.lastY) {
            ctx.beginPath();
            ctx.moveTo(ctx.lastX, ctx.lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        
        ctx.lastX = x;
        ctx.lastY = y;
    }
    
    function stopDrawing() {
        isDrawing = false;
        if (ctx) {
            ctx.lastX = null;
            ctx.lastY = null;
        }
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    
    function handleTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup');
        canvas.dispatchEvent(mouseEvent);
    }
    
    // Canvas control functions
    function clearCanvas() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redrawCanvas();
    }
    
    function redrawCanvas() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the reference if enabled
        if (showReference) {
            ctx.save();
            ctx.globalAlpha = 0.2;
            drawCharacterStrokes(ctx, characters[currentChar].strokes, '#ea580c');
            ctx.restore();
        }
        
        // Draw the current stroke guide
        if (currentStroke < characters[currentChar].strokes.length) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            drawStroke(ctx, characters[currentChar].strokes[currentStroke], '#ea580c');
            ctx.restore();
        }
    }
    
    function drawCharacterStrokes(context, strokes, color) {
        context.strokeStyle = color;
        context.lineWidth = 4;
        context.lineCap = 'round';
        
        strokes.forEach(stroke => {
            context.beginPath();
            const commands = stroke.split(' ');
            let i = 0;
            
            while (i < commands.length) {
                const cmd = commands[i];
                
                if (cmd === 'M') {
                    const x = parseFloat(commands[i+1].split(',')[0]) / 100 * canvas.width;
                    const y = parseFloat(commands[i+1].split(',')[1]) / 100 * canvas.height;
                    context.moveTo(x, y);
                    i += 2;
                } else if (cmd === 'L') {
                    const x = parseFloat(commands[i+1].split(',')[0]) / 100 * canvas.width;
                    const y = parseFloat(commands[i+1].split(',')[1]) / 100 * canvas.height;
                    context.lineTo(x, y);
                    i += 2;
                } else if (cmd === 'Z') {
                    context.closePath();
                    i += 1;
                } else {
                    // Handle path data without commands (implicit L)
                    const x = parseFloat(commands[i].split(',')[0]) / 100 * canvas.width;
                    const y = parseFloat(commands[i].split(',')[1]) / 100 * canvas.height;
                    context.lineTo(x, y);
                    i += 1;
                }
            }
            
            context.stroke();
        });
    }
    
    function drawStroke(context, stroke, color) {
        context.strokeStyle = color;
        context.lineWidth = 4;
        context.lineCap = 'round';
        
        context.beginPath();
        const commands = stroke.split(' ');
        let i = 0;
        
        while (i < commands.length) {
            const cmd = commands[i];
            
            if (cmd === 'M') {
                const x = parseFloat(commands[i+1].split(',')[0]) / 100 * canvas.width;
                const y = parseFloat(commands[i+1].split(',')[1]) / 100 * canvas.height;
                context.moveTo(x, y);
                i += 2;
            } else if (cmd === 'L') {
                const x = parseFloat(commands[i+1].split(',')[0]) / 100 * canvas.width;
                const y = parseFloat(commands[i+1].split(',')[1]) / 100 * canvas.height;
                context.lineTo(x, y);
                i += 2;
            } else if (cmd === 'Z') {
                context.closePath();
                i += 1;
            } else {
                // Handle path data without commands (implicit L)
                const x = parseFloat(commands[i].split(',')[0]) / 100 * canvas.width;
                const y = parseFloat(commands[i].split(',')[1]) / 100 * canvas.height;
                context.lineTo(x, y);
                i += 1;
            }
        }
        
        context.stroke();
    }
    
    function toggleCompare() {
        showReference = !showReference;
        if (compareBtn) compareBtn.classList.toggle('bg-orange-600');
        redrawCanvas();
    }
    
    function toggleGuide() {
        // This would toggle the current stroke guide visibility
        // For simplicity, we'll just redraw to show/hide the guide
        redrawCanvas();
    }
    
    function prevStroke() {
        if (currentStroke > 0) {
            currentStroke--;
            updateActiveStroke();
            redrawCanvas();
        }
    }
    
    function nextStroke() {
        if (currentStroke < characters[currentChar].strokes.length - 1) {
            currentStroke++;
            updateActiveStroke();
            redrawCanvas();
        }
    }
    
    function updateActiveStroke() {
        const steps = document.querySelectorAll('.stroke-order-step');
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStroke);
        });
    }
    
    // Initialize the app
    init();
});
