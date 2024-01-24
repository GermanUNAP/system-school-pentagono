import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';
import { auth, db } from '../app/firebase.js';
import { collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { showToast } from '../app/showMesage.js';


onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userData = await getUserDataByUID(auth.currentUser.uid);
    console.log(userData);
    if (userData) {
      const userType = userData.tipo; 
      if(userType === "administrador"){
        showToast("Usted esta habilitado para tomar asistencia", "success");
      }
      else if(userType === "estudiante"){
        window.location.href = 'home-student.html';
      }
      else if(userType === "docente"){
        window.location.href = 'home-teacher.html';
      }
    } else {
      console.log("No se encontraron datos del usuario en Firestore.");

    }
  } else {
    window.location.href = '../index.html';
  }
});


async function getUserDataByUID(uid) {
  const usersCollection = collection(db, "usuarios");
  const q = query(usersCollection, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.size > 0) {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    console.log("Datos del usuario:", userData);
    return userData;
  } else {
    console.log("Usuario no encontrado en Firestore.");
    return null;
  }
}

