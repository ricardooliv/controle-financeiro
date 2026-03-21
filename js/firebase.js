const firebaseConfig = {
  apiKey: "AIzaSyBG8qGNzND168K0UFBwyMlz3ZHvXNR_ri0",
  authDomain: "controle-financeiro-fed00.firebaseapp.com",
  projectId: "controle-financeiro-fed00",
  storageBucket: "controle-financeiro-fed00.firebasestorage.app",
  messagingSenderId: "31462011509",
  appId: "1:31462011509:web:4477f3152c7c815436fe3c"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();