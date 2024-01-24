import { db } from '../app/firebase.js';
import { showToast } from '../app/showMesage.js';  // Asegúrate de que la ruta sea correcta
import { doc, setDoc, collection, getDocs, where, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

scanner.addListener('scan', async function (content) {
    showToast('Asistencia registrada correctamente', "success");
    console.log(content);
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    const userData = await getUserDataByUID(content);
    console.log(userData);

    if (userData) {
        const userType = userData.tipo; 
        if (userType === "estudiante") {
            // Obtener datos del estudiante
            const { uid, nombres, apellidos, grado, seccion } = userData;
            const nombreCompleto = `${userData.apellidos} ${userData.nombres}`;

            // Actualizar elementos HTML con la información de la asistencia
            document.getElementById('nombre').textContent = nombreCompleto;
            document.getElementById('tipo').textContent = `${userType === 'estudiante' ? 'Estudiante' : 'Docente'}`;
    
            // Verificar si la hora actual es superior a las 8:00 AM
            const horaActual = hoy.getHours();
            const esPuntual = horaActual <= 8;

            // Crear un nuevo documento en la colección "asistencias"
            const asistenciasCollection = collection(db, "asistencias");
            const asistenciaData = {
                uid: uid,
                nombres: `${nombres} ${apellidos}`,
                grado: grado,
                seccion: seccion,
                tipo: "estudiante",
                fecha: serverTimestamp(),
                tardanza: !esPuntual,
                falta: false
            };

            // Añadir el documento a la colección "asistencias"
            await setDoc(doc(asistenciasCollection), asistenciaData);

            console.log('Asistencia registrada para estudiante.');
        }
        else if (userType === "docente") {
            // Obtener datos del docente
            const { uid, nombres, apellidos } = userData;

            // Verificar si la hora actual es superior a las 8:00 AM
            const horaActual = hoy.getHours();
            const esPuntual = horaActual <= 8;

            // Crear un nuevo documento en la colección "asistencias"
            const asistenciasCollection = collection(db, "asistencias");
            const asistenciaData = {
                uid: uid,
                nombres: `${nombres} ${apellidos}`,
                tipo: "docente",
                fecha: serverTimestamp(),
                puntual: esPuntual,
                falta: false
            };

            // Añadir el documento a la colección "asistencias"
            await setDoc(doc(asistenciasCollection), asistenciaData);

            console.log('Asistencia registrada para docente.');
        }
    } else {
        console.log("No se encontraron datos del usuario en Firestore.");
    }
});

Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        console.error('No se encontraron cámaras en el dispositivo.');
    }
}).catch(function (e) {
    console.error(e);
});

async function getUserDataByUID(uid) {
    const usersCollection = collection(db, "usuarios");
    const q = query(usersCollection, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        return userData;
    } else {
        console.log("Usuario no encontrado en Firestore.");
        return null;
    }
}
