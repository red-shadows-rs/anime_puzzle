// scripts/discord-presence.js
let discordSdk;
let isAuthed = false;

async function setupDiscord() {
    const root = window.discordSdk || window.DiscordSDK;
    const SDKClass = root?.DiscordSDK || root;

    if (typeof SDKClass !== 'function') {
        setTimeout(setupDiscord, 500);
        return;
    }

try {
        console.log("Checking Authorization...");
        const { code } = await discordSdk.commands.authorize({
            client_id: "1420027881098055700",
            response_type: "code",
            scope: ["identify", "rpc", "rpc.activities.write"],
            redirect_uri: "https://discordsays.com/.proxy/oauth2/callback",
            prompt: "none", // بما أنك وافقت سلفاً، نتركها none
        });

        console.log("Code received, authenticating...");
        await discordSdk.commands.authenticate({ access_token: code });
        
        isAuthed = true;
        console.log("Discord Auth Success! Status should appear now.");

        // أرسل تحديث الحالة فوراً
        broadcastInitialActivity();

    } catch (e) {
        console.error("Auth failed error details:", e);
        // إذا كان الخطأ بسبب أنك وافقت سلفاً، قد نحتاج لتجربة prompt: 'default' لمرة واحدة فقط لتجديد التوكن
    }
}

function broadcastInitialActivity() {
    if (window.location.pathname.includes("levels.html")) {
        updateActivity("يختار لغزاً", "في قائمة المستويات");
    } else if (window.location.pathname.includes("shop.html")) {
        updateActivity("يتسوق", "في المتجر");
    } else if (window.location.pathname.includes("play.html")) {
        // في play.html سننتظر بيانات المستوى
    } else {
        updateActivity("يستعد للعب", "القائمة الرئيسية");
    }
}

async function updateActivity(details, state) {
    if (!discordSdk || !isAuthed) {
        console.log("Waiting for Auth before updating activity...");
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
        console.log("Activity Update Sent:", details);
    } catch (err) {
        console.error("RPC Error:", err);
    }
}

setupDiscord();
