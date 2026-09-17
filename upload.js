import { db } from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

// JSON file padhna
const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

async function uploadData() {
    console.log("Firebase me naya data bhejna shuru... 🚀");
    try {
        // Jobs upload kar rahe hain
        for (let job of data.jobs) {
            await addDoc(collection(db, "jobs"), job);
        }
        console.log("✅ Saari Jobs upload ho gayi!");

        // Courses/Qualifications upload kar rahe hain
        if (data.qualifications) {
            for (let course of data.qualifications) {
                await addDoc(collection(db, "qualifications"), course);
            }
            console.log("✅ Saare Courses bhi upload ho gaye!");
        }
        
        console.log("🎉 SUCCESS! Ab apna Recommendation test karo.");
        process.exit(); // Script ko theek se band karne ke liye
    } catch (e) {
        console.error("Backend Error:", e);
        process.exit(1);
    }
}

uploadData();