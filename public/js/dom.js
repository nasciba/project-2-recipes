window.addEventListener('load', () => {
    const menuIcon = document.querySelector('.menu-icon');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li')
    
    
    menuIcon.addEventListener('click', () => {
        //Toggle Nav
        nav.classList.toggle('nav-active');
        //Animate Links
        navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = ''
        }
        else {
            ink.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.7}s`
        }
        // console.log(index / 7);
        })
            //Menu icon animation   
        menuIcon.classList.toggle('toggle')
    })
    
    
});








