import { auth } from '../app/firebase.js';
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
import {showToast} from '../app/showMesage.js'

const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
 
    
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
    console.log(email, password);

    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        
        if(result){
          showToast('Ha ingresado correctamente', 'success');
          window.location.href = 'pages/inicio-sesion.html';
        }
        
    } catch (error) {
        console.error("Error de autenticación:", error.code, error.message, error.serverResponse);
    }
    
});
