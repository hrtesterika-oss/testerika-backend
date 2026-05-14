require("dotenv").config(); // MUST BE FIRST
const dbContext = require("./models");

async function checkOptions() {
    try {
        const options = await dbContext.Options.findAll();
        console.log("Current Options in tbloptions:");
        options.forEach(opt => {
            console.log(`- ${opt.name}: ${JSON.stringify(opt.value).substring(0, 100)}...`);
        });
        
        const asideMenu = await dbContext.Options.findOne({ where: { name: "aside_menu" } });
        if (!asideMenu) {
            console.log("\n'aside_menu' option is MISSING!");
        } else {
            console.log("\n'aside_menu' found:", JSON.stringify(asideMenu.value));
        }

        process.exit(0);
    } catch (err) {
        console.error("Error checking options:", err);
        process.exit(1);
    }
}

checkOptions();
