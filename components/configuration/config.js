import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import '@firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyA3FP86Fd6TroCQOuRIn6JI9Q1HNyQF50c',
	authDomain: 'todo-dbdfb.firebaseapp.com',
	projectId: 'todo-dbdfb',
	storageBucket: 'todo-dbdfb.appspot.com',
	messagingSenderId: '36420370160',
	appId: '1:36420370160:web:7f10cdf8e4de1a522c0c35'
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export { firebase };
