// Configuração do Google Firebase (Firestore)
// Substitua os dados abaixo pelos dados do seu projeto no Console do Firebase:
// https://console.firebase.google.com/
window.FIREBASE_CONFIG = Object.freeze({
  apiKey: "SEU_API_KEY",
  authDomain: "semente-site.firebaseapp.com",
  projectId: "semente-site",
  storageBucket: "semente-site.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
});

// Inicialização automática do Firebase Firestore
(function initFirebase() {
  const config = window.FIREBASE_CONFIG;
  if (typeof firebase !== 'undefined' && config && config.projectId && config.projectId !== 'semente-site') {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
      window.db = firebase.firestore();
      console.log('Firebase conectado com sucesso.');
    } catch (err) {
      console.warn('Não foi possível inicializar o Firebase:', err);
    }
  }
})();
