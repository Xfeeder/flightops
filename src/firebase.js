import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBtRu1MOJV2z3RfUEbu_G-CoAIDokgyJps',
  authDomain: 'flightops-login.firebaseapp.com',
  projectId: 'flightops-login',
  storageBucket: 'flightops-login.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)