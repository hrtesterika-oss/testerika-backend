require("dotenv").config();
const dbContext = require("./models");

async function checkPermissions() {
    try {
        const perms = await dbContext.Permissions.findAll();
        console.log(`Current Permissions in tblpermissions: ${perms.length}`);
        perms.forEach(p => {
            console.log(`- ${p.id}: ${p.name}`);
        });
        process.exit(0);
    } catch (err) {
        console.error("Error checking permissions:", err);
        process.exit(1);
    }
}

checkPermissions();
