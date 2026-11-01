// Configuração do Google Firebase (Firestore) - Projeto: semente-multiplicacao
window.FIREBASE_CONFIG = Object.freeze({
  apiKey: "AIzaSyCTkCZOiakbvyiRGAIpa06ebh1RIqKFIec",
  authDomain: "semente-multiplicacao.firebaseapp.com",
  projectId: "semente-multiplicacao",
  storageBucket: "semente-multiplicacao.firebasestorage.app",
  messagingSenderId: "267403455746",
  appId: "1:267403455746:web:9a9e2b6b585e4b6a24a61b",
  measurementId: "G-PY4KHX6BCK"
});

// Inicialização automática do Firebase Firestore
(function initFirebase() {
  const config = window.FIREBASE_CONFIG;
  if (typeof firebase !== 'undefined' && config && config.apiKey && !config.apiKey.startsWith('SEU_')) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
      window.db = firebase.firestore();
      console.log('Firebase conectado com sucesso ao projeto semente-multiplicacao.');
    } catch (err) {
      console.warn('Não foi possível inicializar o Firebase:', err);
    }
  }
})();
