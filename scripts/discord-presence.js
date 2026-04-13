// scripts/discord-presence.js
const { DiscordSDK } = window.discordSdk;
const discordSdk = new DiscordSDK("1420027881098055700"); // ضع هنا الـ Application ID الخاص بك

async function setupDiscord() {
    try {
        await discordSdk.ready();
        console.log("Discord SDK ready");
        
        // المصادقة (مطلوبة للنشاطات داخل ديسكورد)
        const { code } = await discordSdk.commands.authorize({
            client_id: "1420027881098055700",
            response_type: "code",
            scope: ["identify", "guilds"],
            prompt: "none",
        });
        
        await discordSdk.commands.authenticate({ access_token: code });
    } catch (e) {
        console.log("Discord RPC disabled: Not running inside Discord.");
    }
}

async function updateActivity(details, state) {
    if (!discordSdk.instanceId) return; // للتأكد أننا داخل ديسكورد

    await discordSdk.commands.setActivity({
        activity: {
            details: details,
            state: state,
            assets: {
                large_image: "game_logo", // الاسم الذي رفعته في Portal
                large_text: "aPuzzle",
            },
            timestamps: { start: Date.now() }
        }
    });
}

// تشغيل التهيئة فوراً
setupDiscord();
