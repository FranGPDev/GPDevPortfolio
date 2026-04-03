/**
 * Mi Arquitectura Frontend
 * Defino mi Script Principal - Vanilla JS
 */

/* =========================================
   Fuerzo el inicio en la parte superior al recargar
   ========================================= */
// Tomo el control absoluto del scroll nativo de mi navegador
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Si la URL tiene un hash (ej: #stack) de una visita anterior, limpio mi URL sin recargar
if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
}

// Envío mi página al píxel 0 de forma inmediata
window.scrollTo(0, 0);


document.addEventListener("DOMContentLoaded", () => {
    // Inicializo mi observador para revelar elementos al hacer scroll.
    // NOTA TÉCNICA: Usar el evento global 'window.addEventListener("scroll")' aquí sería una chapuza terrible que hundiría los FPS. Por eso aplico Intersection Observer, que es asíncrono y no bloquea el hilo principal.
    
    const revealElements = document.querySelectorAll(".reveal");

    const revealOptions = {
        threshold: 0.15, // Configuro que la animación salte cuando vea el 15% de mi elemento
        rootMargin: "0px 0px -50px 0px" // Ajusto el margen para que salte un poco antes de chocar con el borde inferior
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("active");
                // Dejo de observar mi elemento una vez que ya apareció para no derrochar memoria ni procesador a lo tonto
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // Creo mi lógica para el menú hamburguesa sin frameworks
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            // Alterno mis clases para activar la animación CSS (X) y deslizar el menú
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
            
            // Actualizo mi aria-expanded dinámicamente para lectores de pantalla
            const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", !isExpanded);
        });
    }

    /* =========================================
       Tomo el control absoluto de mi navegación
       ========================================= */
    const internalLinks = document.querySelectorAll('.nav-links a[href^="#"], .logo-container a');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Anulo el salto nativo del navegador. A partir de aquí, yo mando.
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Si estoy en móvil y el menú está abierto, lo repliego por UX
                const hamburger = document.querySelector(".hamburger");
                const navLinks = document.querySelector(".nav-links");
                if (hamburger && hamburger.classList.contains("active")) {
                    hamburger.classList.remove("active");
                    navLinks.classList.remove("active");
                    hamburger.setAttribute("aria-expanded", "false");
                }
                
                // Calculo mi distancia exacta.
                // Si la pantalla es móvil (<=768px), mi offset será 120px (100px de navbar + 20px de aire).
                // Si es escritorio, mi offset será 120px para no pisar mi logo gigante.
                const offset = window.innerWidth <= 768 ? 120 : 120; 
                
                // Obtengo la posición matemática exacta del elemento en el DOM
                const elementPosition = targetSection.getBoundingClientRect().top;
                
                // Calculo el punto final absoluto sumando el scroll actual y restando mi parachoques
                const offsetPosition = elementPosition + window.scrollY - offset;
                
                // Ordeno al navegador deslizarse hacia allí con precisión matemática
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});