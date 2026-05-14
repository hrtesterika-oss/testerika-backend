require("dotenv").config();
const optionsController = require("./controller/options.controller");

// Mock req and res
const req = {
    params: { id: 1 }
};
const res = {
    status: function(s) { this.statusCode = s; return this; },
    json: function(j) { this.body = j; console.log(JSON.stringify(j, null, 2)); }
};

async function testGetMenu() {
    try {
        console.log("Testing getAuthorizedAsideMenu for ID 1...");
        await optionsController.getAuthorizedAsideMenu(req, res);
        process.exit(0);
    } catch (err) {
        console.error("Error testing menu:", err);
        process.exit(1);
    }
}

testGetMenu();
