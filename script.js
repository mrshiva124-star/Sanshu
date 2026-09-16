/* ==========================================
   INTERACTIVE JAVASCRIPT LOGIC & ANIMATIONS
   Project: Romantic Apology & Birthday Website
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // DOM ELEMENT REFERENCES
    // -----------------------------------------------------------------
    const initialModal = document.getElementById('initial-modal');
    const openExperienceBtn = document.getElementById('open-experience-btn');
    const mainContent = document.getElementById('main-content');
    
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const noBtnText = document.getElementById('no-btn-text');
    const forgivenessArea = document.getElementById('forgiveness-area');
    
    const celebrationSection = document.getElementById('celebration-section');
    
    const playfulModal = document.getElementById('playful-modal');
    const alertTitle = document.getElementById('alert-title');
    const alertMsg = document.getElementById('alert-msg');
    const alertEmoji = document.getElementById('alert-emoji');
    const alertCloseBtn = document.getElementById('alert-close-btn');
    
    const bgAudio = document.getElementById('bg-audio');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const audioBtnIcon = document.getElementById('audio-btn-icon');
    const musicDisc = document.getElementById('music-disc');
    const trackStatus = document.getElementById('track-status');
    const equalizer = document.getElementById('equalizer');

    // State Variables
    let noClickCount = 0;
    let isAudioPlaying = false;
    let audioContext = null;
    let synthInterval = null;

    // -----------------------------------------------------------------
    // 1. FLOATING BACKGROUND HEARTS GENERATOR
    // -----------------------------------------------------------------
    function createFloatingHearts() {
        const heartsContainer = document.getElementById('hearts-container');
        const heartSymbols = ['❤️', '💖', '💕', '💗', '🌸', '✨', '🌹'];
        
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            
            // Random horizontal position & font size
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
            heart.style.animationDuration = (Math.random() * 5 + 6) + 's';
            
            heartsContainer.appendChild(heart);
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                heart.remove();
            }, 11000);
        }, 600);
    }
    createFloatingHearts();

    // -----------------------------------------------------------------
    // 2. INITIAL MODAL OPENING SEQUENCE
    // -----------------------------------------------------------------
    openExperienceBtn.addEventListener('click', () => {
        initialModal.classList.remove('active');
        mainContent.classList.remove('content-hidden');
        
        // Start background ambient audio synth or audio player
        tryPlayAudio();
        
        // Trigger small initial celebratory heart shower
        spawnHeartBurst(5);
    });

    // -----------------------------------------------------------------
    // 3. PLAYFUL STUBBORN 'NO' BUTTON LOGIC
    // -----------------------------------------------------------------
    const playfulDialogs = [
        {
            title: "Ab to maaf krdo please! 🥺",
            msg: "I promise I'll buy you your favorite ice cream and treat you like a queen!",
            emoji: "🥺",
            btnText: "Think again! 💭"
        },
        {
            title: "Are you sure? Try again! 💔",
            msg: "Look at my sad puppy eyes... How can you say no to this face?",
            emoji: "🐶",
            btnText: "Okay maybe? 🥺"
        },
        {
            title: "Ek baar aur soch lo babu! 🌹",
            msg: "I won't let you stay angry for long! Look how big the YES button is getting!",
            emoji: "🌹",
            btnText: "Give one more chance!"
        },
        {
            title: "Kitna nakhra dikhaogi? Plsss! 🙈",
            msg: "Fine! But you still love me right? Just tap YES already!",
            emoji: "🙈",
            btnText: "Fine fine! 🥰"
        },
        {
            title: "Final Offer: 1000 Hugs & Kisses! 💖",
            msg: "The NO button is practically disappearing. YES is your destiny!",
            emoji: "👑",
            btnText: "Click YES! ✨"
        }
    ];

    const noButtonLabels = [
        "No 😤",
        "Still Angry 💔",
        "Think Again 😜",
        "No Way 🙈",
        "Almost Yes? 🤏",
        "Just Click YES! 🥰"
    ];

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        noClickCount++;

        // Select playful message
        const dialog = playfulDialogs[(noClickCount - 1) % playfulDialogs.length];
        alertTitle.innerText = dialog.title;
        alertMsg.innerText = dialog.msg;
        alertEmoji.innerText = dialog.emoji;
        alertCloseBtn.querySelector('span').innerText = dialog.btnText;

        // Open playful alert modal
        playfulModal.classList.add('active');

        // Update 'No' button text
        const nextLabel = noButtonLabels[Math.min(noClickCount, noButtonLabels.length - 1)];
        noBtnText.innerText = nextLabel;

        // GROW THE 'YES' BUTTON
        const scaleFactor = 1 + (noClickCount * 0.28);
        yesBtn.style.transform = `scale(${scaleFactor})`;
        yesBtn.style.zIndex = '100';

        // Add extra glowing pulse to YES button
        yesBtn.classList.add('pulse-btn');

        // Slightly move the NO button to be playful
        if (noClickCount > 2) {
            const randomX = (Math.random() - 0.5) * 60;
            const randomY = (Math.random() - 0.5) * 30;
            noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }
    });

    alertCloseBtn.addEventListener('click', () => {
        playfulModal.classList.remove('active');
    });

    // Dodge effect on hover/touch for 'No' button if clicked more than 3 times
    noBtn.addEventListener('mouseenter', () => {
        if (noClickCount >= 3) {
            const randomX = (Math.random() - 0.5) * 120;
            const randomY = (Math.random() - 0.5) * 60;
            noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }
    });

    // -----------------------------------------------------------------
    // 4. SUCCESS 'YES' LOGIC & CELEBRATION TRANSITION
    // -----------------------------------------------------------------
    yesBtn.addEventListener('click', () => {
        // Hide forgiveness area with smooth fade
        forgivenessArea.style.opacity = '0';
        
        setTimeout(() => {
            forgivenessArea.classList.add('hidden');
            
            // Show celebration section
            celebrationSection.classList.remove('hidden');
            celebrationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Trigger Confetti Fireworks
            fireConfettiExplosion();
            
            // Spawn mega heart shower
            spawnHeartBurst(25);
            
            // Ensure audio is playing
            if (!isAudioPlaying) {
                tryPlayAudio();
            }
        }, 500);
    });

    // -----------------------------------------------------------------
    // 5. CANVAS CONFETTI EXPLOSION
    // -----------------------------------------------------------------
    function fireConfettiExplosion() {
        if (typeof confetti === 'function') {
            const count = 200;
            const defaults = {
                origin: { y: 0.7 }
            };

            function fire(particleRatio, opts) {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
                colors: ['#ff4d6d', '#ff758f', '#ffffff']
            });
            fire(0.2, {
                spread: 60,
                colors: ['#ffd166', '#ff4d6d']
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                colors: ['#ffffff', '#ffb3c1', '#ffd166']
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
    }

    function spawnHeartBurst(amount) {
        const heartsContainer = document.getElementById('hearts-container');
        for (let i = 0; i < amount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerText = '💖';
            heart.style.left = Math.random() * 95 + 'vw';
            heart.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
            heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
            heartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 6000);
        }
    }

    // -----------------------------------------------------------------
    // 6. AUDIO PLAYER & WEB AUDIO API FALLBACK MELODY
    // -----------------------------------------------------------------
    function tryPlayAudio() {
        const playPromise = bgAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setAudioPlayingState(true);
                trackStatus.innerText = "Playing Our Romantic Song ❤️";
            }).catch(() => {
                // MP3 file missing or browser blocked autoplay -> start web synth fallback!
                startSynthFallbackMelody();
                setAudioPlayingState(true);
                trackStatus.innerText = "Playing Romantic Melody 🎵";
            });
        }
    }

    function setAudioPlayingState(playing) {
        isAudioPlaying = playing;
        if (playing) {
            audioBtnIcon.innerText = "⏸️";
            musicDisc.classList.add('playing');
            equalizer.classList.add('active');
        } else {
            audioBtnIcon.innerText = "▶️";
            musicDisc.classList.remove('playing');
            equalizer.classList.remove('active');
        }
    }

    audioToggleBtn.addEventListener('click', () => {
        if (isAudioPlaying) {
            bgAudio.pause();
            stopSynthMelody();
            setAudioPlayingState(false);
            trackStatus.innerText = "Paused ⏸️";
        } else {
            tryPlayAudio();
        }
    });

    // WEB AUDIO API ROMANTIC SYNTHESIZER FALLBACK
    // Plays a soft, ethereal romantic chord pattern (Cmaj9 - Am9 - Fmaj7 - G7)
    function startSynthFallbackMelody() {
        if (audioContext && audioContext.state === 'running') return;
        
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const chords = [
                [261.63, 329.63, 392.00, 493.88], // Cmaj7
                [220.00, 261.63, 329.63, 392.00], // Am7
                [174.61, 220.00, 261.63, 329.63], // Fmaj7
                [196.00, 246.94, 293.66, 349.23]  // G7
            ];
            
            let chordIdx = 0;
            
            function playChord() {
                if (!audioContext || audioContext.state === 'closed') return;
                const notes = chords[chordIdx % chords.length];
                chordIdx++;
                
                notes.forEach(freq => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                    
                    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.04, audioContext.currentTime + 0.8);
                    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 3.8);
                    
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.start();
                    osc.stop(audioContext.currentTime + 4.0);
                });
            }
            
            playChord();
            synthInterval = setInterval(playChord, 3600);
        } catch (e) {
            console.log("Audio Synth error: ", e);
        }
    }

    function stopSynthMelody() {
        if (synthInterval) clearInterval(synthInterval);
        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }
    }
});

// -----------------------------------------------------------------
// 7. LIGHTBOX MODAL & VOUCHERS GLOBAL FUNCTIONS
// -----------------------------------------------------------------
function openLightbox(imgSrc, captionText) {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxImg.src = imgSrc;
    lightboxCaption.innerText = captionText;
    lightboxModal.classList.add('active');
}

function closeLightbox() {
    const lightboxModal = document.getElementById('lightbox-modal');
    lightboxModal.classList.remove('active');
}

function redeemVoucher(cardElement) {
    if (!cardElement.classList.contains('redeemed')) {
        cardElement.classList.add('redeemed');
        const statusSpan = cardElement.querySelector('.voucher-status');
        statusSpan.innerText = "REDEEMED! ❤️";
        
        // Small confetti pop for voucher redemption
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.8 }
            });
        }
    }
}
