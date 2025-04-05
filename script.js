document.addEventListener('DOMContentLoaded', function() {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    const minimumLoadTime = 1000;
    const startTime = performance.now();

    function hideLoader() {
        const elapsedTime = performance.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);

        setTimeout(() => {
            loaderWrapper.classList.add('fade-out');
            setTimeout(() => {
                loaderWrapper.remove();
            }, 500);
        }, remainingTime);
    }

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    const backToTopButton = document.querySelector('.back-to-top');

    function debounce(func, wait = 100) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    function handleScroll() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', debounce(handleScroll));

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        } else {
            themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        }
    }

    function setInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    setInitialTheme();

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    const navbar = document.getElementById('navbar');
    let lastScrollPosition = 0;
    let ticking = false;

    function updateNavbar() {
        const currentScrollPosition = window.pageYOffset;

        if (currentScrollPosition <= 0) {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.top = '20px';
            return;
        }

        if (currentScrollPosition > lastScrollPosition) {
            navbar.style.top = '-100px';
        } else {
            navbar.style.top = '20px';
            navbar.classList.add('navbar-scrolled');
        }

        lastScrollPosition = currentScrollPosition;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    function toggleMobileMenu() {
        const isActive = navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = isActive 
            ? '<i class="bi bi-x-lg"></i>' 
            : '<i class="bi bi-list"></i>';
        mobileMenuBtn.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = parseInt(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue('--navbar-height')
                );

                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });

                history.pushState(null, null, targetId);
            }
        });
    });

    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });

    function handleMobileMenuFocus(e) {
        if (!navLinks.classList.contains('active')) return;

        const focusableElements = navLinks.querySelectorAll('a[href], button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }

        if (e.key === 'Escape') {
            toggleMobileMenu();
            mobileMenuBtn.focus();
        }
    }

    document.addEventListener('keydown', handleMobileMenuFocus);

    function calculateAge(birthdate) {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    document.getElementById('current-year').textContent = new Date().getFullYear();

    const birthdate = '2006-11-30';
    const ageElement = document.getElementById('age');
    if (ageElement) {
        const age = calculateAge(birthdate);
        ageElement.textContent = age;
    }

    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-level');
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            console.log({ name, email, subject, message });
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
});
