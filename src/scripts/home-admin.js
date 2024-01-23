import { onAuthStateChanged, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';
import { auth, db } from '../app/firebase.js';
import { showToast } from '../app/showMesage.js';  // Asegúrate de que la ruta sea correcta
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Usuario no autenticado, redirige a index.html
            window.location.href = '../index.html';
        } else {
            showToast('conectado', 'success');
        }
    });
});

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

