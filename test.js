async function testRecommendation() {
    console.log("Naya data bhej kar test kar rahe hain... ⏳");
    
    // Is baar hum Data Entry ya Computer wali skill bhej rahe hain
    const newDummyProfile = {
        education: "12th Pass",
        skills: "data entry, basic computer, typing", 
        experience: "1 year",
        employment_preference: "Office Job"
    };

    const response = await fetch('http://localhost:5000/api/get-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: newDummyProfile }) 
    });
    
    const data = await response.json();
    console.log("Naye Data ke liye Best Jobs aur Courses: \n", JSON.stringify(data, null, 2));
}

testRecommendation();