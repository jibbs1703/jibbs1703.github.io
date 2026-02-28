(function() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.top-nav');
    const storedTheme = localStorage.getItem('site-theme');
    if (storedTheme === 'light') body.classList.add('light-theme');

    function updateThemeButton() {
        themeToggle.textContent = body.classList.contains('light-theme') ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-pressed', body.classList.contains('light-theme'));
    }

    themeToggle && themeToggle.addEventListener('click', function() {
        const isLight = body.classList.toggle('light-theme');
        localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
        updateThemeButton();
    });

    updateThemeButton();

    // Menu toggle for mobile
    menuToggle && menuToggle.addEventListener('click', function() {
        const isOpen = nav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.top-nav a').forEach(a => {
        a.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });
    });

    // Scroll spy: set active nav link based on section or in-page anchor in view
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

    // Skills collapse toggles for mobile: collapse lists that overflow
    function initSkillsCollapses() {
        const lists = Array.from(document.querySelectorAll('.skill-list'));
        lists.forEach(list => {
            const toggle = list.parentElement.querySelector('.skills-toggle');
            if (!toggle) return;
            // If list is taller than collapsed height, start collapsed on small screens
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

    // Initialize on load and on resize (so desktop->mobile toggles behave)
    window.addEventListener('resize', () => { initSkillsCollapses(); });
    initSkillsCollapses();

    // Contact form: open default mail client with filled subject/body
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
