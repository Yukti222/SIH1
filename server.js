import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { db } from './firebase.js'; 
import { collection, addDoc, getDocs } from 'firebase/firestore';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. PROCESS AUDIO / TEXT & EXTRACT PROFILE
app.post('/api/process-audio', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text nahi mila" });

        console.log("Aapka Text:", text);
        console.log("Gemini profile nikal raha hai... ⏳");

        const prompt = `
        Analyze this user's text and extract a structured JSON profile for livelihood matching.
        Extract exactly these fields if found: "education", "skills", "experience", "employment_preference", "income_goal".
        User Text: "${text}"
        Return ONLY valid JSON format without markdown.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
        });

        const rawText = response.text.replace(/```json|```/g, '').trim();
        const extractedProfile = JSON.parse(rawText);

        const docRef = await addDoc(collection(db, "beneficiaries"), extractedProfile);

        res.json({ 
            success: true, 
            message: "Profile save ho gayi!", 
            id: docRef.id, 
            profile: extractedProfile 
        });

    } catch (error) {
        console.error("Backend error:", error);
        res.status(500).json({ error: "Backend Error", details: error.message });
    }
});

// 2. MATCHMAKING / RECOMMENDATION API
app.post('/api/get-recommendation', async (req, res) => {
    try {
        const { profile } = req.body; 
        if (!profile) return res.status(400).json({ error: "Profile data nahi mila" });

        console.log("⚡ HIT /get-recommendation | Skills:", profile.skills);

        const userSkills = (profile.skills || "").toLowerCase().split(',').map(s => s.trim()).filter(Boolean);

        const jobsSnapshot = await getDocs(collection(db, "jobs"));
        let matchedJobs = [];
        jobsSnapshot.forEach(doc => {
            const job = doc.data();
            const reqSkills = (job.required_skill || "").toLowerCase();
            const jobTitle = (job.job_title?.en || "").toLowerCase();
            
            const isMatch = userSkills.some(skill => reqSkills.includes(skill) || jobTitle.includes(skill));
            if (isMatch) {
                matchedJobs.push({ id: doc.id, ...job });
            }
        });

        const coursesSnapshot = await getDocs(collection(db, "qualifications"));
        let matchedCourses = [];
        coursesSnapshot.forEach(doc => {
            const course = doc.data();
            const titleEn = (course.title?.en || "").toLowerCase();
            const sector = (course.sector || "").toLowerCase();
            
            const isMatch = userSkills.some(skill => titleEn.includes(skill) || sector.includes(skill));
            if (isMatch) {
                matchedCourses.push({ id: doc.id, ...course });
            }
        });

        res.json({
            success: true,
            message: "Matching successful!",
            matches: {
                jobs: matchedJobs.length > 0 ? matchedJobs : ["Abhi koi exact job match nahi mili"],
                courses: matchedCourses.length > 0 ? matchedCourses : ["Abhi koi exact course match nahi mila"]
            }
        });

    } catch (error) {
        console.error("Matchmaking error:", error);
        res.status(500).json({ error: "Recommendation nikalne me error aaya", details: error.message });
    }
});

app.listen(5000, () => {
    console.log('🚀 SIH Backend Server chalu ho gaya hai: http://localhost:5000');
});
