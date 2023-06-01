/* INIT */
const DB = MainConfigDB();
mainReloadPanel();

/* RELOAD */
const loadConfig = {
    main_curso: "-",
    main_next: null
}

async function mainReloadPanel() {
    let res = await axios(`${DB}/panel-admin/re-load`);
    let data = res.data;

    if(data.Main_Config.main_curso != loadConfig.main_curso) {
        loadConfig.main_curso = data.Main_Config.main_curso;
        document.getElementById("panel-curso").innerText = `Curso actual: ${loadConfig.main_curso}`;
    }

    if(data.Main_Config.main_next != loadConfig.main_next) {
        loadConfig.main_next = data.Main_Config.main_next;
        if(loadConfig.main_next) {
            document.getElementById("panel-etapa").innerText = `Activada`;
        } else {
            document.getElementById("panel-etapa").innerText = `Desactivada`;
        }
    }

    if(data.Main_Config.main_game != loadConfig.main_game) {
        loadConfig.main_game = data.Main_Config.main_game;
        if(loadConfig.main_game) {
            document.getElementById("panel-registro").innerText = `Registro activado`;
        } else {
            document.getElementById("panel-registro").innerText = `Registro desactivado`;
        }
    }
}

setInterval(() => {
    mainReloadPanel();
}, 5000)

/* CURSO */
let btnCurso = document.getElementById("panel-curso");
btnCurso.onclick = async() => {
    const cursos = await curso_ObtenerCursos();
    console.log(cursos);
    const { value: curso } = await Swal.fire({
        title: "Selecciona el curso.",
        input: "select",
        inputOptions: {
            'Admin': {
                nuevo: "Nuevo curso"
            },
            'Cursos creados': cursos
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '>>> <<<',
        cancelButtonText: '<<<',
        inputValidator: (value) => {
            if(!value) {
                return 'No xd';
            }
        }
    })

    if(curso == "nuevo") {
        curso_CrearNuevo();
    } else {
        curso_ConfigUsar(curso);
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

    let res = await axios(`${DB}/panel-admin/cursos/nuevo/${nuevo_curso}`);
    let data = res.data;
    if(!data) return sendAlert("error", 3000, "Ocurrio un error: C:01");
    
    if(!data.status) return sendAlert("error", 4000, data.message)
    else sendAlert("success", 5000, data.message);
}

async function curso_ObtenerCursos() {
    let res = await axios(`${DB}/panel-admin/cursos/lista`);
    let data = res.data;

    const cursos = [];
    data.cursos.forEach((c) => {
        cursos.push(c.Curso)
    })

    const cursosb = cursos.map((c, i) => {
        if((i+1) == cursos.length) {
            return `"curso_${c}":"${c}"`
        } else {
            return `"curso_${c}":"${c}",`
        }
    }).join("");

    let p = `{${cursosb}}`;
    return JSON.parse(p);
}

async function curso_ConfigUsar(curso) {
    const formatCurso = curso.replace("curso_", "");
    let res = await axios(`${DB}/panel-admin/config/curso/${formatCurso}`);
    let data = res.data;
    if(!data) return sendAlert("error", 3000, "Ocurrio un error: C:02");
    
    if(data.status) return sendAlert("success", 5000, data.message), mainReloadPanel();
    else return sendAlert("error", 3000, data.message);
}

/* ETAPA */
let btnEtapa = document.getElementById("panel-etapa");
btnEtapa.onclick = async() => {
    const { value: etapa } = await Swal.fire({
        title: "Siguente etapa.",
        input: "select",
        inputOptions: {
            desactivado: "Desactivado",
            activado: "Activado",
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '>>> <<<',
        cancelButtonText: '<<<',
        inputValidator: (value) => {
            if(!value) {
                return 'No xd';
            }
        }
    })

    etapa_ConfigEtapa(etapa);
}

async function etapa_ConfigEtapa(etapa) {
    let res = await axios(`${DB}/panel-admin/config/etapa/${etapa}`);
    let data = res.data;
    if(!data) return sendAlert("error", 3000, "Ocurrio un error: E:01");
    
    if(data.status) return sendAlert("success", 5000, data.message), mainReloadPanel();
    else return sendAlert("error", 3000, data.message);
}

/* REGISTRO */
let btnRegistro = document.getElementById("panel-registro");
btnRegistro.onclick = async() => {
    const { value: registro } = await Swal.fire({
        title: "Estado de registro.",
        input: "select",
        inputOptions: {
            desactivado: "Registro desactivado",
            activado: "Registro activado",
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '>>> <<<',
        cancelButtonText: '<<<',
        inputValidator: (value) => {
            if(!value) {
                return 'No xd';
            }
        }
    })

    etapa_ConfigRegistro(registro);
}

async function etapa_ConfigRegistro(registro) {
    let res = await axios(`${DB}/panel-admin/config/registro/${registro}`);
    let data = res.data;
    if(!data) return sendAlert("error", 3000, "Ocurrio un error: E:01");
    
    if(data.status) return sendAlert("success", 5000, data.message), mainReloadPanel();
    else return sendAlert("error", 3000, data.message);
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