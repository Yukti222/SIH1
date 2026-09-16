import { db } from "./firebase.js";
import { collection, doc, setDoc } from "firebase/firestore";
import fs from "fs";

// data.json file ko padhna
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

async function uploadData() {
  console.log("Data Firebase me jaa raha hai... ⏳");
  try {
    for (const item of data.qualifications) {
      const newDocRef = doc(collection(db, "qualifications"), item.qualification_id);
      await setDoc(newDocRef, item);
    }
    
    for (const item of data.jobs) {
      const newDocRef = doc(collection(db, "jobs"), item.job_id);
      await setDoc(newDocRef, item);
    }
    
    console.log("Badhai ho! Saara data Firebase me chala gaya ✅");
    process.exit(); 
  } catch (error) {
    console.error("Error aa gaya:", error);
  }
}

uploadData();