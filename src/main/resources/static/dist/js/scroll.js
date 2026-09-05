document.addEventListener('DOMContentLoaded', function() {
    // Verifica que el PushMenu.js se haya cargado correctamente
    const sidebarToggle = document.querySelector('[data-widget="pushmenu"]');
    const header = document.querySelector('.header-fixed');

    if (!sidebarToggle || !header) {
        console.log('Los elementos no se encontraron');
        return;
    }

    // Mantén la lógica del PushMenu.js para el colapso del sidebar
    sidebarToggle.addEventListener('click', function() {
        // Aquí podrías personalizar el comportamiento del header si lo necesitas
        if (document.body.classList.contains('sidebar-collapse')) {
            header.classList.remove('colapsado');
            header.classList.add('expandido');
        } else {
            header.classList.remove('expandido');
            header.classList.add('colapsado');
        }
    });
});
