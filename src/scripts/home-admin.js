import { onAuthStateChanged, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';
import { auth, db } from '../app/firebase.js';
import { showToast } from '../app/showMesage.js';  // Asegúrate de que la ruta sea correcta
import { doc, setDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', async () => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Usuario no autenticado, redirige a index.html
            window.location.href = '../index.html';
        } else {
            showToast('Cargando datos', 'success');
            const mesesAsistencias = [];
            for (let mes = 1; mes <= 12; mes++) {
                const asistenciasMes = await filtrarAsistenciasPorMes(mes);
                mesesAsistencias.push(asistenciasMes);
            }

            // Llenar la tabla con los datos de asistencias por mes
            llenarTablaConAsistenciasPorMes(mesesAsistencias);
        }
    });
});

//para enviar el modal del estudiante
document.getElementById('modalEstudiante').addEventListener('submit', async function (event) {
    event.preventDefault();

    const dni = document.getElementById('dniEstudiante').value;
    const correo = document.getElementById('correoEstudiante').value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, correo, dni);

        // Obtén el ID de usuario
        const userId = userCredential.user.uid;

        // Otros datos que deseas almacenar
        const nombres = document.getElementById('nombresEstudiante').value;
        const apellidos = document.getElementById('apellidosEstudiante').value;
        const fechaNacimiento = document.getElementById('fechaNacimientoEstudiante').value;
        const grado = document.getElementById('gradoEstudiante').value;
        const seccion = document.getElementById('seccionEstudiante').value;

        // Guarda los datos en la colección "usuarios"
        await setDoc(doc(db, "usuarios", userId), {
            uid: userId,
            dni: dni,
            correo: correo,
            nombres: nombres,
            apellidos: apellidos,
            fechaNacimiento: fechaNacimiento,
            grado: grado,
            seccion: seccion,
        });

        showToast('Se ha creado el usuario correctamente', 'success');
    } catch (error) {
        console.error('Error al crear el usuario:', error.code, error.message);
        showToast('Error al crear el usuario. Verifica que los datos sean correctos.', 'error');
    }
});


// Función para llenar la tabla con los datos de asistencias por mes
function llenarTablaConAsistenciasPorMes(mesesAsistencias) {
    const tabla = document.querySelector('.table tbody');

    tabla.innerHTML = '';

    // Calcular estadísticas generales
    
    // Mostrar los arrays de asistencias por cada mes
    mesesAsistencias.forEach((asistenciasMes, index) => {
        let totalClasesDictadas = 0;
        let totalAsistencias = 0;
        let totalTardanzas = 0;
        let totalFaltas = 0;
        let totalTardanzasJustificadas = 0;


        const mesAnio = index + 1; // Puedes ajustar esto según tu necesidad
        const totalAsistenciasMes = asistenciasMes.length;
        const totalTardanzasMes = asistenciasMes.filter(asistencia => asistencia.tardanza).length;
        const totalFaltasMes = asistenciasMes.filter(asistencia => asistencia.falta).length;

        totalClasesDictadas += totalAsistenciasMes;
        totalAsistencias += totalAsistenciasMes;
        totalTardanzas += totalTardanzasMes;
        totalFaltas += totalFaltasMes;
        // Calcula el total de tardanzas justificadas si tienes esa información en tus datos

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${mesAnio}</td>
            <td>${totalAsistenciasMes}</td>
            <td>${totalAsistencias}</td>
            <td>${totalTardanzas}</td>
            <td>${totalFaltas}</td>
            <td>${totalTardanzasJustificadas}</td>
            <td>${totalAsistencias > 0 ? ((totalTardanzas / totalAsistencias) * 100).toFixed(2) : 0}%</td>
            <td>${totalFaltas > 0 ? ((totalFaltas / totalAsistencias) * 100).toFixed(2) : 0}%</td>
        `;
        tabla.appendChild(fila);
    });
}

async function filtrarAsistenciasPorMes(mes) {
    const asistenciasQuery = await getDocs(collection(db, 'asistencias'));
    const asistenciasFiltradas = [];
    
    asistenciasQuery.forEach((doc) => {
        const asistencia = doc.data();
        const fecha = asistencia.fecha.toDate();
        const mesAsistencia = fecha.getMonth() + 1;

        if (mesAsistencia === mes) {
            asistenciasFiltradas.push(asistencia);
        }
    });

    return asistenciasFiltradas;
}
