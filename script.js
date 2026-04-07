/* ========================================
   LEXRA STUDIO — Interactive JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // === Loading Screen ===
    const loader = document.getElementById('loader');
    const loaderFill = document.getElementById('loaderFill');
    
    document.body.classList.add('loading');
    
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        loaderFill.style.width = progress + '%';
        
        if (progress === 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.remove('loading');
                initAnimations();
            }, 500);
        }
    }, 150);

    // === Cursor Glow ===
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.classList.add('visible');
    });
    
    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('visible');
    });
    
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // === Navbar Scroll Effect ===
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Mobile Navigation ===
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });
    
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // === Hero Particles ===
    const heroParticles = document.getElementById('heroParticles');
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('hero-particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        heroParticles.appendChild(particle);
    }

    // === Counter Animation ===
    function animateCounters() {
        const counters = document.querySelectorAll('.hero-stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad
                const eased = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(eased * target);
                
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }

    // === Scroll Animations (Intersection Observer) ===
    function initAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger delay from data attribute
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Service cards
        document.querySelectorAll('.service-card').forEach(card => observer.observe(card));
        
        // Portfolio items
        document.querySelectorAll('.portfolio-item').forEach(item => observer.observe(item));
        
        // Process Steps
        document.querySelectorAll('.process-step').forEach(step => observer.observe(step));
        
        // Pricing cards
        document.querySelectorAll('.pricing-card').forEach(card => observer.observe(card));
        
        // Counter animation
        const heroStatObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroStatObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) heroStatObserver.observe(heroStats);
    }

    // === Portfolio Filter ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.transition = 'all 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // === Testimonials Slider ===
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;
    
    // Create dots
    testimonialCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    
    function goToSlide(index) {
        currentSlide = index;
        testimonialsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide > 0 ? currentSlide - 1 : totalSlides - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
    });
    
    // Auto-play testimonials
    let autoPlayInterval = setInterval(() => {
        goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
    }, 5000);
    
    // Pause on hover
    const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
    testimonialsWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    testimonialsWrapper.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
        }, 5000);
    });

    // === Contact Form ===
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btnSpan = submitBtn.querySelector('span');
        const originalText = btnSpan.textContent;
        
        // Simulate submission
        submitBtn.disabled = true;
        btnSpan.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
        
        setTimeout(() => {
            btnSpan.textContent = 'Message Sent! ✓';
            submitBtn.style.background = '#22c55e';
            submitBtn.style.opacity = '1';
            
            setTimeout(() => {
                btnSpan.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 1500);
    });

    // === Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === Parallax effect on hero ===
    const heroBgImg = document.querySelector('.hero-bg-img');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (heroBgImg && scrollY < window.innerHeight) {
            heroBgImg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
        }
    });

    // === Tilt effect on service cards ===
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
