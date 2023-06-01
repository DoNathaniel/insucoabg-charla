/* INIT */
const DB = MainConfigDB();

/* SCRIPT INDEX */
if(document.location.pathname == "/index.html") {
    let index_start = document.getElementById("index_start");
    index_start.addEventListener("click", async() => {
        let verifyUser = JSON.parse(localStorage.getItem("alumno"));
        if(verifyUser) {
            document.location = `${getUrlLevel(verifyUser.u_lvl)}`
        }


        MenuRegister();
    });

    let registerProcess = [];

    async function MenuRegister() {
        const { value: formValues } = await Swal.fire({
            title: 'Antes de iniciar... (1/2)',
            input: "text",
            inputLabel: "Ingresa tu correo.",
            inputPlaceholder: "Correo",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Siguente >>>',
            willClose: () => {
                MenuRegister();
            },
            inputValidator: (value) => {
                if (!value) {
                    return "Necesitas ingresar tu correo.";
                }

                if(!value.endsWith("@insucoabg.cl")) {
                    return "El correo no es válido. (Usa tu correo institucional)";
                }
            }
        })

        if(formValues) {
            registerProcess.push(formValues);
            MenuRegister2()
        }
    }

    async function MenuRegister2() {
        const { value: formValues } = await Swal.fire({
            title: 'Antes de iniciar... (2/2)',
            input: "text",
            inputLabel: "Ingresa tu nombre.",
            inputPlaceholder: "Nombre",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '>>> Listo <<<',
            willClose: () => {
                MenuRegister2();
            },
            inputValidator: (value) => {
                if (!value) {
                    return "Necesitas ingresar tu nombre.";
                }

                let arr = JSON.parse(`[ "${value.replaceAll(" ", '","')}" ]`)
                if(arr.length > 2) return 'Nombre y apellido.'
                if(arr.length < 2) return 'Nombre y apellido.';
            }
        })

        if(formValues) {
            registerProcess.push(formValues);
        
            alumnosCreate();
        }
    }

    async function alumnosCreate() {
        let res = await axios(`${DB}/panel-admin/alumnos/nuevo/${registerProcess[0]}/${registerProcess[1]}`)
        let data = res.data;

        if(!data.status) return sendAlert("error", 3000, data.message);
        else {
            sendAlert("success", 5000, data.message);
            document.location = "/actividad/espera.html";

            localStorage.setItem("alumno", JSON.stringify({
                u_id: data.ID,
                u_lvl: 1
            }))
        }
    }
}

/* SCRIPT ESPERA */

if(document.location.pathname == "/actividad/espera.html") {
    let curso = "";
    let userData  = JSON.parse(localStorage.getItem("alumno"));
    if(!userData) document.location = "/index.html";
    
    let btnAvatar = document.getElementById("perfil-avatar");
    btnAvatar.addEventListener("click", async() => {
        document.getElementById("update-avatar-tab").classList.toggle("activo");
    });

    async function loadPerfil() {
        let res = await axios(`${DB}/panel-admin/alumnos/info/${userData.u_id}`);
        let data = res.data;
        document.getElementById("perfil-name").innerText = data.user.User_Config.Config_Name;
        document.getElementById("perfil-email").innerText = data.user.User_Config.Config_Email;
        
        document.getElementById("user-avatar").src = `../assets/images/avatars/${data.user.User_Config.Config_Avatar}.jpg`;
    }

    async function loadTabUsers() {
        let res = await axios(`${DB}/panel-admin/cursos/alumnos/${curso}`);
        let data = res.data;

        document.getElementById("top-textload").innerHTML = `[Clase ${curso}] Esperando jugadores... (${data.alumnos.length}/50) <div class="custom-loader"></div>`;

        let tabUsers = document.getElementById("tab-players");
        tabUsers.innerHTML = "";
        let count = 1;
        data.alumnos.forEach((alumno) => {
            tabUsers.innerHTML += `
                <div class="player c${count}">
                    <div class="player-avatar">
                        <img src="../assets/images/avatars/${alumno.User_Config.Config_Avatar}.jpg" class="p-a">
                    </div>
                    <div class="player-name">${alumno.User_Config.Config_Name}</div>
                </div>
            `;
            if(count == 5) count = 1;
            else count++;
        });
    }

    setInterval(() => {
        loadTabUsers();
    }, 5000)

    async function loadPage() {
        let resMain = await axios(`${DB}/panel-admin/`);
        let getCurso = await axios(`${DB}/panel-admin/cursos/curso/${resMain.data.Main_Config.main_curso}`);
        let data = getCurso.data;

        curso = data.curso.Curso;

        document.getElementById("top-textload").innerHTML = `[Clase ${data.curso.Curso}] Esperando jugadores... (${data.curso.Alumnos}/50) <div class="custom-loader"></div>`;

        loadPerfil();
        loadTabUsers();
    }

    loadPage();
}

async function updateAvatar(id) {
    document.getElementById("user-avatar").src = `../assets/images/avatars/${id}.jpg`;
};