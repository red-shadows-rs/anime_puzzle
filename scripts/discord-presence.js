let discordSdk;

async function setupDiscord() {
    const root = window.discordSdk || window.DiscordSDK;
    const SDKClass = root?.DiscordSDK || root;

    if (!SDKClass || typeof SDKClass !== 'function') {
        console.log("Searching for Discord SDK...");
        setTimeout(setupDiscord, 500);
        return;
    }

    try {
        discordSdk = new SDKClass("1420027881098055700");
        await discordSdk.ready();

        // خطوة المصادقة (إجبارية لظهور الحالة)
        const { code } = await discordSdk.commands.authorize({
            client_id: "1420027881098055700",
            response_type: "code",
            scope: ["identify", "rpc.activities.write"],
            prompt: "none", 
        });

        await discordSdk.commands.authenticate({ access_token: code });
        
        console.log("Authenticated Successfully!");

        // استدعاء الحالة بناءً على الصفحة الحالية
        broadcastInitialActivity();

    } catch (e) {
        console.error("SDK Setup Error (Check Redirect URI or Scopes):", e);
    }
}

function broadcastInitialActivity() {
    let details = "يستعد للعب";
    let state = "القائمة الرئيسية";

    if (window.location.pathname.includes("levels.html")) {
        details = "يختار لغزاً";
        state = "قائمة المستويات";
    } else if (window.location.pathname.includes("shop.html")) {
        details = "يتسوق";
        state = "المتجر";
    } else if (window.location.pathname.includes("play.html")) {
        details = "يحل لغز أنمي";
        state = "داخل اللعبة";
    }

    updateActivity(details, state);
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
                    large_text: "Anime Puzzle"
                },
                timestamps: { 
                    start: Date.now() 
                }
            }
        });
        console.log("Activity update sent: " + details);
    } catch (err) {
        console.error("Failed to set activity:", err);
    }
}

setupDiscord();
