require("dotenv").config();
const dbContext = require("./models");

const defaultAsideMenu = [
    { name: "Users", url: "/users", icon: "/media/icons/duotune/general/gen051.svg", status: 1 },
    { name: "Permissions", url: "/permissions", icon: "/media/icons/duotune/general/gen058.svg", status: 1 },
    { name: "Roles", url: "/roles", icon: "/media/icons/duotune/general/gen059.svg", status: 1 },
    { name: "Staffs", url: "/staff/list", icon: "/media/icons/duotune/general/gen054.svg", status: 1 },
    { 
        name: { 
            label: "Settings", 
            url: "/settings/general", 
            icon: "/media/icons/duotune/general/gen055.svg", 
            status: 1,
            value: [
                { name: "General Settings", url: "/settings/general", status: 1 },
                { name: "Company Information", url: "/settings/company-information", status: 1 },
                { name: "AWS Settings", url: "/settings/quizophy-AWS-settings", status: 1 },
                { name: "Localization", url: "/settings/localization", status: 1 },
                { name: "Finance", url: "/settings/finance", status: 1 },
                { name: "Payment Gateways", url: "/settings/payment-gateways", status: 1 },
                { name: "Customers", url: "/settings/customers", status: 1 },
                { name: "PDF Settings", url: "/settings/PDF", status: 1 },
                { name: "SMS Settings", url: "/settings/SMS", status: 1 },
                { name: "Cron Jobs", url: "/settings/cron-jobs", status: 1 },
                { name: "Misc", url: "/settings/misc", status: 1 },
                { name: "Cash Bonus", url: "/settings/cash-bonus", status: 1 },
                { name: "Wallet Min Balance", url: "/settings/wallet-minimun-balance", status: 1 },
                { name: "App Version", url: "/settings/app-current-version", status: 1 },
                { name: "Spin the Wheel", url: "/settings/spin-the-wheel", status: 1 },
                { name: "Email Settings", url: "/settings/email", status: 1 },
                { name: "Aside Menu Status", url: "/settings/aside-menu-status", status: 1 }
            ]
        }, 
        url: "/settings", 
        icon: "/media/icons/duotune/general/gen055.svg", 
        status: 1 
    },
    { name: "Question Bank", url: "/questions", icon: "/media/icons/duotune/general/gen056.svg", status: 1 },
    { name: "Quiz", url: "/quiz", icon: "/media/icons/duotune/general/gen002.svg", status: 1 },
    { name: "Coupons", url: "/coupon", icon: "/media/icons/duotune/general/gen003.svg", status: 1 },
    { 
        name: { 
            label: "Sponsorship", 
            url: "/sponsor", 
            icon: "/media/icons/duotune/communication/com012.svg", 
            status: 1,
            value: [
                { name: "Sponsors", url: "/sponsor/sponsors", status: 1 },
                { name: "Program", url: "/sponsor/programs", status: 1 },
                { name: "Subscriptions", url: "/sponsor/subscriptions", status: 1 }
            ]
        }, 
        url: "/sponsor", 
        icon: "/media/icons/duotune/communication/com012.svg", 
        status: 1 
    },
    { 
        name: { 
            label: "Sales", 
            url: "/sales", 
            icon: "/media/icons/duotune/communication/com013.svg", 
            status: 1,
            value: [
                { name: "Wallet", url: "/sales/wallet", status: 1 },
                { name: "Withdrawal", url: "/sales/withdrawal", status: 1 },
                { name: "Payment Support", url: "/sales/payment-support", status: 1 }
            ]
        }, 
        url: "/sales", 
        icon: "/media/icons/duotune/communication/com013.svg", 
        status: 1 
    },
    { 
        name: { 
            label: "Course Setup", 
            url: "/courses", 
            icon: "/media/icons/duotune/communication/com014.svg", 
            status: 1,
            value: [
                { name: "Courses", url: "/course/courses", status: 1 },
                { name: "Course Category", url: "/course/course-category", status: 1 },
                { name: "Subjects", url: "/course/subjects", status: 1 }
            ]
        }, 
        url: "/courses", 
        icon: "/media/icons/duotune/communication/com014.svg", 
        status: 1 
    },
    { name: "Books", url: "/books", icon: "/media/icons/duotune/general/gen005.svg", status: 1 },
    { name: "Feedbacks", url: "/feedback", icon: "/media/icons/duotune/general/gen006.svg", status: 1 }
];

async function seedOptions() {
    try {
        console.log("Seeding tbloptions...");
        
        // 1. aside_menu
        const existingAsideMenu = await dbContext.Options.findOne({ where: { name: "aside_menu" } });
        if (existingAsideMenu) {
            await existingAsideMenu.update({ value: defaultAsideMenu });
        } else {
            await dbContext.Options.create({
                name: "aside_menu",
                value: defaultAsideMenu,
                auto_load: 1
            });
        }
        console.log("- Updated aside_menu");

        // 2. quizophy_icons_container
        await dbContext.Options.findOrCreate({
            where: { name: "quizophy_icons_container" },
            defaults: {
                name: "quizophy_icons_container",
                value: {
                    quizophy_dark_logo: "/media/logos/logo-1-dark.svg",
                    play_store_icon: "/media/svg/brand-logos/google-play.svg"
                },
                auto_load: 1
            }
        });
        console.log("- Seeded quizophy_icons_container");

        // 3. email_details
        await dbContext.Options.findOrCreate({
            where: { name: "email_details" },
            defaults: {
                name: "email_details",
                value: {
                    SMTP_Host: "smtp.gmail.com",
                    SMTP_Port: 465,
                    Email: "test@gmail.com",
                    SMTP_Password: "password"
                },
                auto_load: 1
            }
        });
        console.log("- Seeded email_details");

        console.log("Seeding completed.");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding options:", err);
        process.exit(1);
    }
}

seedOptions();
