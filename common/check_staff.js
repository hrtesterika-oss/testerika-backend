require("dotenv").config();
const dbContext = require("./models");

async function checkStaff() {
    try {
        const staff = await dbContext.Staff.findAll();
        console.log("Current Staff in tblstaff:");
        staff.forEach(s => {
            console.log(`- ID: ${s.id}, Email: ${s.email}, Admin: ${s.admin}`);
        });
        process.exit(0);
    } catch (err) {
        console.error("Error checking staff:", err);
        process.exit(1);
    }
}

checkStaff();
