/* ═════════════════════════════════════════════════
   BRAYAN GARCÍA — PORTAFOLIO PERSONAL
   Script Principal & Navegación Estilo App Móvil
   ═════════════════════════════════════════════════ */

import { initCircularGallery } from './CircularGallery.js';

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. Inicialización de Librerías Externas ── */
    AOS.init({ 
        once: true, 
        easing: 'ease-out-cubic', 
        offset: 80 
    });
    
    // Renderiza los íconos de la interfaz y de la barra móvil inferior
    lucide.createIcons();


    /* ── 2. Animación Líquida (Pill Nav Desktop) con GSAP ── */
    const pills = document.querySelectorAll('.pill');
    
    pills.forEach((pill) => {
        const circle = pill.querySelector('.hover-circle');
        const label = pill.querySelector('.pill-label');
        const hoverLabel = pill.querySelector('.pill-label-hover');

        const updateLayout = () => {
            if (!pill.offsetWidth) return;
            const w = pill.offsetWidth;
            const h = pill.offsetHeight;
            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;

            if (circle) {
                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });
            }

            if (label) gsap.set(label, { y: 0 });
            if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);

        let tl = gsap.timeline({ paused: true });
        if (circle) {
            tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0);
        }
        
        if (label) {
            tl.to(label, { y: -(pill.offsetHeight + 8), duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0);
        }
        
        if (hoverLabel) {
            gsap.set(hoverLabel, { y: Math.ceil(pill.offsetHeight + 100), opacity: 0 });
            tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0);
        }

        let tween = null;

        pill.addEventListener('mouseenter', () => {
            tween?.kill();
            tween = tl.tweenTo(tl.duration(), { duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
        });

        pill.addEventListener('mouseleave', () => {
            tween?.kill();
            tween = tl.tweenTo(0, { duration: 0.2, ease: 'power3.out', overwrite: 'auto' });
        });
    });


    /* ── 3. Sincronización de sección Activa en la Barra Móvil Inferior ── */
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                mobileNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });


    /* ── 4. Efecto Tilted Card 3D para la Foto (Sobre Mí) ── */
    const cardFigure = document.getElementById('tilted-card-container');
    if (cardFigure) {
        const cardInner = cardFigure.querySelector('.tilted-card-inner');
        const cardCaption = cardFigure.querySelector('.tilted-card-caption');
        
        const rotateAmplitude = 14;
        let lastY = 0;

        cardFigure.addEventListener('mousemove', (e) => {
            const rect = cardFigure.getBoundingClientRect();
            const offsetX = e.clientX - rect.left - rect.width / 2;
            const offsetY = e.clientY - rect.top - rect.height / 2;

            const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
            const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

            cardInner.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(1.05)`;

            const xPos = e.clientX - rect.left;
            const yPos = e.clientY - rect.top;
            const velocityY = offsetY - lastY;
            const capRotation = -velocityY * 0.4;

            cardCaption.style.transform = `translate(${xPos + 15}px, ${yPos - 25}px) rotate(${capRotation}deg)`;
            cardCaption.style.opacity = '1';

            lastY = offsetY;
        });

        cardFigure.addEventListener('mouseenter', () => {
            cardInner.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
        });

        cardFigure.addEventListener('mouseleave', () => {
            cardInner.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease';
            cardInner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            cardCaption.style.opacity = '0';
        });
    }


    /* ── 5. Inicializar Galería 3D Interactiva para HABILIDADES ── */
    const skillsGalleryContainer = document.getElementById('skills-gallery');
    
    if (skillsGalleryContainer) {
        const mySkills = [
            { text: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
            { text: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
            { text: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
            { text: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg' },
            { text: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
            { text: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
            { text: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
            { text: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' }
        ];

        initCircularGallery(skillsGalleryContainer, {
            items: mySkills,
            bend: 2.5,
            textColor: '#ffffff',
            borderRadius: 0.08
        });
    }


    /* ── 6. Fondo Animado de Estrellas (Warp Speed / Starfield) ── */
    const canvas = document.getElementById('space-background');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const numStars = 400;
        const speed = 0.8;
        const stars = [];

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = (Math.random() - 0.5) * width * 2;
                this.y = (Math.random() - 0.5) * height * 2;
                this.z = Math.random() * width;
                this.origZ = this.z;
                this.color = Math.random() > 0.3 ? '#a78bfa' : '#ffffff';
            }

            update() {
                this.z -= speed * 3;
                if (this.z <= 0) {
                    this.reset();
                    this.z = width;
                }
            }

            draw() {
                const k = 250 / this.z;
                const px = this.x * k + width / 2;
                const py = this.y * k + height / 2;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    const pSize = Math.max(1, (1 - this.z / width) * 2.5);
                    const prevK = 250 / (this.z + speed * 8);
                    const prevPx = this.x * prevK + width / 2;
                    const prevPy = this.y * prevK + height / 2;

                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(prevPx, prevPy);
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = pSize;
                    ctx.stroke();
                }
            }
        }

        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }

        function animateSpace() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.25)';
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < stars.length; i++) {
                stars[i].update();
                stars[i].draw();
            }

            requestAnimationFrame(animateSpace);
        }

        animateSpace();
    }

});