// scripts/discord-presence.js
let discordSdk;

async function setupDiscord() {
    // في نسخة المتصفح، المكتبة تكون موجودة تحت اسم discordSdk (كائن كبير)
    // أو Discord (حسب النسخة)، سنحاول الوصول إليها بذكاء
    const SDKClass = window.discordSdk?.DiscordSDK || window.Discord?.DiscordSDK;
    
    if (!SDKClass) {
        console.warn("Discord SDK not found yet, retrying...");
        setTimeout(setupDiscord, 500);
        return;
    }

    discordSdk = new SDKClass("1420027881098055700");

    try {
        await discordSdk.ready();
        console.log("Discord SDK ready!");
        
        // المصادقة
        const { code } = await discordSdk.commands.authorize({
            client_id: "1420027881098055700",
            response_type: "code",
            scope: ["identify", "guilds"],
            prompt: "none",
        });

        await discordSdk.commands.authenticate({ access_token: code });
    } catch (e) {
        console.warn("Discord Auth failed - expected if not running inside Discord Activity.");
    }
}

async function updateActivity(details, state) {
    if (!discordSdk) return;

    try {
        await discordSdk.commands.setActivity({
            activity: {
                details: details,
                state: state,
                assets: {
                    large_image: "game_logo",
                    large_text: "aPuzzle"
                },
                timestamps: { start: Date.now() }
            }
        });
    } catch (err) {
        console.error("RPC Error:", err);
    }
}

setupDiscord();
