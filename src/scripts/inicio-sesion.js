import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';
import { auth, db } from '../app/firebase.js';
import { collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

console.log('linked');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Usuario autenticado:", user);
    console.log(user.uid)

    const userData = await getUserDataByUID(auth.currentUser.uid);

    if (userData) {
      const userType = userData.type; 
      if(userType === "administrador"){
        window.location.href = 'home-admin.html';
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
    window.location.href = 'home-admin.html';
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

