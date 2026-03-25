(function() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.top-nav');
    
    // Force light theme
    body.classList.add('light-theme');
    themeToggle.style.display = 'none';

    function updateThemeButton() {
        themeToggle.textContent = body.classList.contains('light-theme') ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-pressed', body.classList.contains('light-theme'));
    }

    // Theme toggle disabled for now
    // themeToggle && themeToggle.addEventListener('click', function() {
    //     const isLight = body.classList.toggle('light-theme');
    //     localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
    //     updateThemeButton();
    // });

    updateThemeButton();

    menuToggle && menuToggle.addEventListener('click', function() {
        const isOpen = nav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    document.querySelectorAll('.top-nav a').forEach(a => {
        a.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });
    });

    const navLinks = Array.from(document.querySelectorAll('.top-nav a'));
    const sections = navLinks
        .map(link => {
            const href = link.getAttribute('href') || '';
            return href.startsWith('#') ? document.querySelector(href) : null;
        })
        .filter(Boolean);

    function onScroll() {
        const scrollPos = window.scrollY + (window.innerHeight * 0.18);
        let currentId = sections[0] && sections[0].id;
        for (const sec of sections) {
            const rect = sec.getBoundingClientRect();
            const top = window.scrollY + rect.top;
            if (scrollPos >= top) currentId = sec.id;
        }
        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) {
                link.classList.remove('active');
                return;
            }
            const id = href.replace('#', '');
            if (id === currentId) link.classList.add('active'); else link.classList.remove('active');
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function initSkillsCollapses() {
        const lists = Array.from(document.querySelectorAll('.skill-list'));
        lists.forEach(list => {
            const toggle = list.parentElement.querySelector('.skills-toggle');
            if (!toggle) return;
            const needsCollapse = list.scrollHeight > 84;
            if (needsCollapse) list.classList.add('collapsed');
            function updateToggle() {
                const isCollapsed = list.classList.contains('collapsed');
                toggle.textContent = isCollapsed ? 'Show more' : 'Show less';
                toggle.setAttribute('aria-expanded', String(!isCollapsed));
            }
            toggle.addEventListener('click', () => {
                list.classList.toggle('collapsed');
                updateToggle();
            });
            updateToggle();
        });
    }

    window.addEventListener('resize', () => { initSkillsCollapses(); });
    initSkillsCollapses();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = encodeURIComponent(document.getElementById('name').value.trim());
            const email = encodeURIComponent(document.getElementById('email').value.trim());
            const message = encodeURIComponent(document.getElementById('message').value.trim());
            const subject = encodeURIComponent('Website contact from ' + (name || email));
            const body = encodeURIComponent(`Name: ${decodeURIComponent(name)}\nEmail: ${decodeURIComponent(email)}\n\n${decodeURIComponent(message)}`);
            const mailto = `mailto:abraham.ajibade@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailto;
        });
    }
})();

// Scroll reveal via IntersectionObserver
(function () {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length || !('IntersectionObserver' in window)) {
        reveals.forEach(function (el) { el.classList.add('visible'); });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
}());

// Cursor glow with smooth lag
(function () {
    var glow = document.getElementById('cursor-glow');
    if (!glow || !window.matchMedia('(pointer: fine)').matches) return;
    var mx = -200, my = -200, cx = -200, cy = -200;
    document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        glow.style.opacity = '1';
    }, { passive: true });
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });
    document.querySelectorAll('a, button, .project-card, .skill-group, .timeline-content').forEach(function (el) {
        el.addEventListener('mouseenter', function () { glow.style.width = '64px'; glow.style.height = '64px'; });
        el.addEventListener('mouseleave', function () { glow.style.width = '28px'; glow.style.height = '28px'; });
    });
    (function animate() {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        glow.style.left = cx + 'px';
        glow.style.top = cy + 'px';
        requestAnimationFrame(animate);
    }());
}());

// Scroll progress bar
(function () {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
        var doc = document.documentElement;
        var pct = (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
}());

// Typewriter / cycling text in hero
(function () {
    var el = document.getElementById('hero-type');
    if (!el) return;
    var phrases = ['production ML systems', 'scalable LLM pipelines', 'end-to-end data platforms', 'AI-powered applications'];
    var wIdx = 0, cIdx = 0, deleting = false;
    function tick() {
        var word = phrases[wIdx];
        if (!deleting) {
            el.textContent = word.slice(0, cIdx + 1);
            cIdx++;
            if (cIdx === word.length) { deleting = true; setTimeout(tick, 1800); return; }
        } else {
            el.textContent = word.slice(0, cIdx - 1);
            cIdx--;
            if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % phrases.length; }
        }
        setTimeout(tick, deleting ? 48 : 82);
    }
    setTimeout(tick, 1200);
}());

// 3D card tilt on project cards
(function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.project-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var rx = ((e.clientY - r.top - r.height / 2) / r.height) * -10;
            var ry = ((e.clientX - r.left - r.width / 2) / r.width) * 10;
            card.style.transform = 'perspective(700px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-10px)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = '';
            setTimeout(function () { card.style.transition = ''; }, 500);
        });
    });
}());

// Back to top button
(function () {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });
    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}());

// Animated stat counters
(function () {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200;
        var start = null;
        function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            el.textContent = Math.floor(easeOut(progress) * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
}());

// Animated stat counters
(function () {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200;
        var start = null;
        function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            el.textContent = Math.floor(easeOut(progress) * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
}());
