function MainConfigDB() {
    return "http://localhost:5555";
}

function getNameLevel(lvl) {
    switch(lvl) 
    {
        case 1: return "Esperando";
        case 2: return "Explicación 1";
        case 3: return "Juego Explicación 1";
        case 4: return "Explicación 2";
        case 5: return "Juego Explicación 2";
        case 6: return "Explicación 3";
        case 7: return "Juego Explicación 3";
        case 8: return "Explicación 4";
        case 9: return "Juego Explicación 4";
        case 10: return "Puntaje";
    }
}

function getUrlLevel(lvl) {
    switch(lvl) 
    {
        case 1: return "/actividad/espera.html";
        case 2: return "";
        case 3: return "";
        case 4: return "";
        case 5: return "";
        case 6: return "";
        case 7: return "";
        case 8: return "";
        case 9: return "";
        case 10: return "";
    }
}

/* HELPERS */
async function sendAlert(type, timer, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: type,
        title: message
    })
}