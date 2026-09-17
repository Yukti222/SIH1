import { db } from './firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

async function clearCollection(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    for (let document of querySnapshot.docs) {
        await deleteDoc(doc(db, collectionName, document.id));
    }
    console.log(`🗑️ Purana '${collectionName}' collection saaf kar diya!`);
}

async function uploadData() {
    console.log("Firebase refresh karna shuru... 🚀");
    try {
        await clearCollection("jobs");
        await clearCollection("qualifications");

        for (let job of data.jobs) {
            await addDoc(collection(db, "jobs"), job);
        }
        console.log("✅ Saari Jobs/Schemes (including PM-AJAY) upload ho gayi!");

        if (data.qualifications) {
            for (let course of data.qualifications) {
                await addDoc(collection(db, "qualifications"), course);
            }
            console.log("✅ Saare Courses upload ho gaye!");
        }
        
        console.log("🎉 SUCCESS! Pura data update ho chuka hai.");
        process.exit();
    } catch (e) {
        console.error("Backend Error:", e);
        process.exit(1);
    }
}

uploadData();
