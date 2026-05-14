require("dotenv").config();
const dbContext = require("./models");

const permissions = [
    "Users", "Permissions", "Roles", "Staffs", "Settings", 
    "Question Bank", "Quiz", "Coupons", "Sponsorship", 
    "Sales", "Course Setup", "Books", "Feedbacks",
    "General", "Company Information", "Quizophy AWS Settings", "Localization",
    "Finance", "Payment Gateways", "Customers", "PDF", "SMS",
    "Cron Jobs", "Misc", "Cash Bonus", "Wallet Minimun Balance", "App Current Version",
    "Spin The Wheel", "Email", "Aside Menu Status"
];

async function seedPermissions() {
    try {
        console.log("Seeding tblpermissions and tblstaff_permissions...");
        
        const createdPerms = [];
        for (const name of permissions) {
            const [perm] = await dbContext.Permissions.findOrCreate({
                where: { name },
                defaults: { name }
            });
            createdPerms.push(perm);
        }
        console.log(`- Seeded ${createdPerms.length} permissions.`);

        const staffId = 1;
        for (const perm of createdPerms) {
            await dbContext.StaffPermissions.findOrCreate({
                where: { staff_id: staffId, permission_id: perm.id },
                defaults: {
                    staff_id: staffId,
                    permission_id: perm.id,
                    can_view: 1,
                    can_view_own: 1,
                    can_edit: 1,
                    can_create: 1,
                    can_delete: 1
                }
            });
        }
        console.log("- Assigned all permissions to Staff ID 1.");

        process.exit(0);
    } catch (err) {
        console.error("Error seeding permissions:", err);
        process.exit(1);
    }
}

seedPermissions();
