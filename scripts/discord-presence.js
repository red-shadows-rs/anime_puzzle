// scripts/discord-presence.js
let discordSdk;

async function setupDiscord() {
    // في نسخة index.global.js التي رفعتها:
    // المكتبة تعرف نفسها كـ window.discordSdk وبداخلها DiscordSDK
    const SDKClass = window.discordSdk?.DiscordSDK;

    if (!SDKClass) {
        // فحص إضافي: هل هي موجودة مباشرة في window؟
        const AlternativeClass = window.DiscordSDK;
        
        if (!AlternativeClass) {
            console.warn("Discord SDK not found yet, retrying...");
            setTimeout(setupDiscord, 500);
            return;
        }
        
        // إذا وجدها في window مباشرة
        discordSdk = new AlternativeClass("1420027881098055700");
    } else {
        // إذا وجدها داخل الكائن المغلف (وهذا هو المتوقع من ملفك الحالي)
        discordSdk = new SDKClass("1420027881098055700");
    }

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
