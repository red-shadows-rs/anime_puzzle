// scripts/discord-presence.js

// 1. تعريف المتغير في النطاق العام لضمان الوصول إليه
let discordSdk;

async function setupDiscord() {
    // التأكد من أن المكتبة محملة
    if (typeof window.discordSdk === 'undefined') {
        console.error("Discord SDK not loaded! Check your script tags.");
        return;
    }

    const { DiscordSDK } = window.discordSdk;
    discordSdk = new DiscordSDK("1420027881098055700"); // ضع الـ ID هنا

    try {
        await discordSdk.ready();
        console.log("Discord SDK is ready");
        
        // المصادقة
        const { code } = await discordSdk.commands.authorize({
            client_id: "1420027881098055700",
            response_type: "code",
            scope: ["identify", "guilds"],
            prompt: "none",
        });
        
        await discordSdk.commands.authenticate({ access_token: code });
    } catch (e) {
        console.warn("Discord RPC: Running outside Discord or Auth failed.");
    }
}

// 2. تعديل الوظيفة لتجنب أخطاء Initialization
async function updateActivity(details, state) {
    if (!discordSdk) {
        console.log("Waiting for Discord SDK...");
        return; 
    }

    try {
        await discordSdk.commands.setActivity({
            activity: {
                details: details,
                state: state,
                assets: {
                    large_image: "game_logo",
                    large_text: "aPuzzle",
                },
                timestamps: { start: Date.now() }
            }
        });
    } catch (err) {
        console.error("Failed to set activity:", err);
    }
}

// بدء التشغيل
setupDiscord();
