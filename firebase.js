import { initializeApp } from 'firebase/app';

function storeHighScore(userId, score) {
  const db = getDatabase();
  const reference = ref(db, 'users/' + userId);
  set(reference, {
    highscore: score,
  });
}

const firebaseConfig = {
    apiKey: "AIzaSyDxDEz5rvgRMHA1_tp6R0PGqTgq03tx_mA",
    authDomain: "farm-aadfb.firebaseapp.com",
    projectId: "farm-aadfb",
    storageBucket: "farm-aadfb.appspot.com",
    messagingSenderId: "94555810509",
    appId: "1:94555810509:web:01bc77dfadb6ff97cc9784",
    measurementId: "G-MXMDDLPXM1"
};
  

const myApp = initializeApp(firebaseConfig);

export default myApp;