// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace the following configuration with your own Firebase project details
// Visit https://firebase.google.com/ console to create a new project and get these details
const firebaseConfig = {
    apiKey: "AIzaSyCJK_-CMvATaJLnDU6cdaQ3ZUNCgdrKaUU",
    authDomain: "civic-loop-app.firebaseapp.com",
    projectId: "civic-loop-app",
    storageBucket: "civic-loop-app.firebasestorage.app",
    messagingSenderId: "1035576177738",
    appId: "1:1035576177738:web:de2d5f0a3b25f92825e2b3"
};

// Initialize Firebase
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // console.log("Firebase initialized"); // Commented out to reduce console noise
} catch (error) {
    console.error("Firebase init error:", error);
}

// --- UI Interaction & Animations ---

// 1. Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 2. Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// 3. Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Trigger stats counter if it's the about section
            if (entry.target.id === 'about') {
                animateStats();
            }

            // Animate skill bars if it's the skills section
            if (entry.target.id === 'skills') {
                entry.target.querySelectorAll('.fill').forEach(bar => {
                    bar.style.width = bar.parentElement.previousElementSibling.innerText === 'Unity 3D/2D' ? '90%' :
                        bar.parentElement.previousElementSibling.innerText === 'C# Programming' ? '85%' :
                            bar.parentElement.previousElementSibling.innerText === 'Game Logic' ? '80%' :
                                bar.parentElement.previousElementSibling.innerText === 'UI / UX' ? '75%' :
                                    bar.parentElement.previousElementSibling.innerText === 'Level Design' ? '70%' : '80%';
                });
                // Note: The inline style in HTML handles the width mostly, but this ensures it animates on scroll
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// 4. Stats Counter Animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const increment = target / 50; // Speed adjustment

        const updateCount = () => {
            const count = +stat.innerText;
            if (count < target) {
                stat.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 40);
            } else {
                stat.innerText = target;
            }
        };
        updateCount();
    });
}

// 5. Typing Effect
const textElement = document.querySelector('.typing-text');
if (textElement) {
    const text = "Game Developer | Unity Specialist";
    // Simple cursor blink effect is in CSS, JS can restart it or change text if needed
    // For now, static text with CSS animation is efficient enough or we can add dynamic typing:
    /* 
    let i = 0;
    textElement.textContent = "";
    function typeWriter() {
        if (i < text.length) {
            textElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    // typeWriter(); // Uncomment to enable real JS typing
    */
}

// 6. 3D Tilt Effect for Cards
const cards = document.querySelectorAll('.tilt-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// 7. Hero Canvas Particles
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray = [];
    const numberOfParticles = 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = 'rgba(0, 255, 204, 0.3)';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.01;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function handleParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // Connect particles
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 204, ${0.1 - distance / 1000})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }

            if (particlesArray[i].size <= 0.3) {
                particlesArray.splice(i, 1);
                i--;
                particlesArray.push(new Particle());
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(animateCanvas);
    }

    initParticles();
    animateCanvas();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 8. Chatbot Logic
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatBody = document.getElementById('chat-body');

if (chatToggle && chatWindow && chatClose) {
    // Toggle Chat Window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            setTimeout(() => chatInput.focus(), 300);
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Send Message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === "") return;

        // Add User Message
        addMessage(message, 'user-message');
        chatInput.value = "";

        // Bot Response
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot-message');
        }, 500);
    }

    chatSend.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.innerHTML = text; // simple innerHTML for links support
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
            return "Greetings! How can I assist you with Akib's portfolio today?";
        } else if (lowerInput.includes('skills') || lowerInput.includes('stack') || lowerInput.includes('technology')) {
            return "Akib is proficient in <strong>Unity (3D/2D)</strong>, <strong>C#</strong>, Game Logic, UI/UX Design, and Level Design.";
        } else if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('portfolio')) {
            return "You can check out his projects in the <a href='#projects' style='color: var(--primary-color)'>Projects section</a>. He has worked on Neon Racer, Space Explorer, and more!";
        } else if (lowerInput.includes('github') || lowerInput.includes('git')) {
            return "Check out Akib's code on <a href='https://github.com/akibshaikh12' target='_blank' style='color: var(--primary-color)'>GitHub</a>.";
        } else if (lowerInput.includes('instagram') || lowerInput.includes('insta') || lowerInput.includes('social')) {
            return "Follow Akib on <a href='https://instagram.com/only.1.umar' target='_blank' style='color: var(--secondary-color)'>Instagram</a> or scan the QR code in the contact section!";
        } else if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('hire')) {
            return "Interested in collaborating? Use the <a href='#contact' style='color: var(--primary-color)'>Contact Form</a> or email him directly!";
        } else if (lowerInput.includes('name') || lowerInput.includes('who are you')) {
            return "I am DevBot, here to showcase Shekh Akib's work. Akib is a passionate Game Developer.";
        } else {
            return "I'm still learning! Try asking about 'skills', 'projects', or 'contact'.";
        }
    }
}

