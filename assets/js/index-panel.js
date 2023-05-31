/* CURSO */
let btnCurso = document.getElementById("panel-curso");
btnCurso.onclick = async() => {
    const { value: curso } = await Swal.fire({
        title: "Selecciona el curso.",
        input: "select",
        inputOptions: {
            'Admin': {
                nuevo: "Nuevo curso"
            },
            'Cursos creados': {
                primero_a: "1° A",
                primero_b: "1° B",
                primero_c: "1° C",
                primero_d: "1° D",
                segundo_a: "2° A"
            }
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '>>> <<<',
        cancelButtonText: '<<<'
    })

    if(curso == "nuevo") {
        curso_CrearNuevo();
    }
}

async function curso_CrearNuevo() {
    const { value: nuevo_curso } = await Swal.fire({
        title: 'Creacion de nuevo curso.',
        input: 'text',
        inputLabel: 'Curso. (EJ: 1D)',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'Necesitas escribir un curso.'
            }
        }
    })

    let res = await axios(`//localhost:5555/panel-admin/cursos/nuevo/${nuevo_curso}`);
    let data = res.data;
    if(!data) return sendAlert("error", 3000, "Ocurrio un error: C:01");
    
    if(!data.status) return sendAlert("error", 4000, data.message)
    else sendAlert("success", 5000, data.message);
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