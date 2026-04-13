// scripts/discord-presence.js
let discordSdk;

async function setupDiscord() {
    // محاولة جلب المكتبة من أكثر من مصدر محتمل
    const SDK = window.discordSdk?.DiscordSDK || window.DiscordSDK;
    
    if (!SDK) {
        console.error("Discord SDK not found on window object.");
        return;
    }

    discordSdk = new SDK("1420027881098055700"); // الـ ID الخاص بك

    try {
        await discordSdk.ready();
        console.log("Discord SDK is ready!");

        // المصادقة ضرورية للـ Activities
        const { code } = await discordSdk.commands.authorize({
            client_id: "1420027881098055700",
            response_type: "code",
            scope: ["identify", "guilds"],
            prompt: "none",
        });

        await discordSdk.commands.authenticate({ access_token: code });
    } catch (e) {
        console.warn("Discord Auth failed - likely running outside Discord.");
    }
}

async function updateActivity(details, state) {
    // إذا لم يجهز بعد، انتظر ثم حاول مرة أخرى
    if (!discordSdk || !discordSdk.instanceId) {
        setTimeout(() => updateActivity(details, state), 2000);
        return;
    }

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
        console.error("Error setting activity:", err);
    }
}

setupDiscord();
