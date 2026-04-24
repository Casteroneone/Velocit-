// =============================================
//  Velocità — Global Nav (Hamburger + Auth)
// =============================================
(function () {
    // ── Auth-aware login link ──────────────────────────────────
    const loginLink = document.querySelector('a.login-btn');
    if (loginLink) {
        const stored = localStorage.getItem('admin');
        const admin  = stored ? JSON.parse(stored) : null;
        if (admin) {
            const name = `${admin.first_name} ${admin.last_name.charAt(0)}.`;
            loginLink.textContent = name;
            loginLink.href = '../Adminpage/admin.html';
            loginLink.title = 'Go to admin panel';
        }
    }

    // ── Hamburger menu toggle ──────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    if (!hamburger) return;

    const header = hamburger.closest('header');

    function openNav() {
        header.classList.add('nav-open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
        header.classList.remove('nav-open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    function toggleNav() {
        header.classList.contains('nav-open') ? closeNav() : openNav();
    }

    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleNav();
    });

    header.querySelectorAll('nav a, .admin-nav a, nav button').forEach(el => {
        el.addEventListener('click', closeNav);
    });

    document.addEventListener('click', function (e) {
        if (!header.contains(e.target)) closeNav();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
    });
})();
