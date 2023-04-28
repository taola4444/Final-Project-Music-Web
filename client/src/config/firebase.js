import {getApp,getApps,initializeApp} from 'firebase/app';
import  {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHlI_uR0JPXA_So1gdVuoUYS60sAqD9mE",
  authDomain: "music-app-main.firebaseapp.com",
  projectId: "music-app-main",
  storageBucket: "music-app-main.appspot.com",
  messagingSenderId: "166088214327",
  appId: "1:166088214327:web:c6c5be2fea2f1c7b97fcb2",
  measurementId: "G-43KK0GDYPB"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export {app,storage};