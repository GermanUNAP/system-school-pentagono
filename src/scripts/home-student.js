import { onAuthStateChanged, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';
import { auth, db } from '../app/firebase.js';
import { showToast } from '../app/showMesage.js';
import { doc, getDoc, query, where, getDocs, collection} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', async () => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Usuario no autenticado, redirige a index.html
            window.location.href = '../index.html';
        } else {
            showToast('Cargando datos', 'success');
            
            // Obtén el ID de usuario
            const userId = user.uid;
            const userDocRef = doc(db, "usuarios", userId);
            const docSnap = await getDoc(userDocRef);

            document.getElementById('nombreEstudiante').innerText = `Estudiante: `;

            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log(userData);

                // Llena los datos en el HTML
                document.getElementById('nombreEstudiante').innerText = `Estudiante: ${userData.nombres} ${userData.apellidos}`;
                document.getElementById('gradoEstudiante').innerText = `Grado: ${userData.grado}`;
                document.getElementById('seccionEstudiante').innerText = `Código: ${userData.seccion}`;
            } else {
                console.log("No se encontró documento para el usuario con este UID.");
            }

            const mesesAsistencias = [];
            for (let mes = 1; mes <= 12; mes++) {
                const asistenciasMes = await filtrarAsistenciasPorMes(userId, mes);
                mesesAsistencias.push(asistenciasMes);
            }
            console.log(mesesAsistencias);
            // Llenar la tabla con los datos de asistencias por mes
            llenarTablaConAsistenciasPorMes(mesesAsistencias);
        }
    });
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


async function filtrarAsistenciasPorMes(userId, mes) {
    const asistenciasCollection = collection(db, 'asistencias');

    // Consulta para obtener las asistencias del usuario actual para el mes dado
    const q = query(asistenciasCollection, where('uid', '==', userId));

    const asistenciasSnapshot = await getDocs(q);

    const asistenciasMes = [];

    asistenciasSnapshot.forEach((doc) => {
        const asistencia = doc.data();
        const fecha = asistencia.fecha.toDate();
        const mesAsistencia = fecha.getMonth() + 1;

        if (mesAsistencia === mes) {
            asistenciasMes.push(asistencia);
        }
    });

    return asistenciasMes;
}