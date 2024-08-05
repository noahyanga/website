document.querySelector('.navbar-toggler').addEventListener('click', function() {
    var navLinks = document.getElementById('navbarNav');
    if (navLinks.style.display === 'block') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'block';
    }
});