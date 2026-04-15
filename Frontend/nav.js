// =============================================
//  Velocità — Global Hamburger Nav Toggle
// =============================================
(function () {
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

    // Toggle on hamburger click
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleNav();
    });

    // Close when any nav link is clicked
    header.querySelectorAll('nav a, .admin-nav a, nav button').forEach(el => {
        el.addEventListener('click', closeNav);
    });

    // Close when clicking outside the header
    document.addEventListener('click', function (e) {
        if (!header.contains(e.target)) closeNav();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
    });
})();
