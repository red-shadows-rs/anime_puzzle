// scripts/discord-presence.js
let discordSdk;
let isAuthed = false;

async function setupDiscord() {
    // جلب الكائن الأساسي من الملف الآخر
    const root = window.discordSdk || window.DiscordSDK;
    // التأكد من الوصول للفئة (Class) الصحيحة
    const SDKClass = root?.DiscordSDK || root;

    if (!SDKClass || typeof SDKClass !== 'function') {
        console.log("Searching for SDK Class...");
        setTimeout(setupDiscord, 500);
        return;
    }

    try {
        // تعريف المتغير محلياً أولاً للتأكد من إنشائه
        const instance = new SDKClass("1420027881098055700");
        discordSdk = instance; // إسناده للمتغير العالمي

        await discordSdk.ready();
        console.log("Discord SDK ready and instance created!");

        console.log("Checking Authorization...");
        // استخدام instance مباشرة هنا لضمان عدم وجود undefined
        const { code } = await instance.commands.authorize({
            client_id: "1420027881098055700",
            response_type: "code",
            scope: ["identify", "rpc", "rpc.activities.write"],
            redirect_uri: "https://discordsays.com/.proxy/oauth2/callback",
            prompt: "default", 
        });

        console.log("Code received, authenticating...");
        await instance.commands.authenticate({ access_token: code });
        
        isAuthed = true;
        console.log("Discord Auth Success! Status should appear now.");

        broadcastInitialActivity();

    } catch (e) {
        console.error("Auth failed error details:", e);
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
