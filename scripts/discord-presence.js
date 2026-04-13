let discordSdk;

async function setupDiscord() {
    // محاولة جلب الـ SDK من النافذة العالمية
    const root = window.discordSdk || window.DiscordSDK;
    const SDKClass = root?.DiscordSDK || root;

    if (!SDKClass || typeof SDKClass !== 'function') {
        console.log("Searching for Discord SDK...");
        setTimeout(setupDiscord, 500);
        return;
    }

    try {
        // 1. إنشاء الكائن باستخدام ID تطبيقك
        discordSdk = new SDKClass("1420027881098055700");
        
        // 2. الانتظار حتى يصبح الـ SDK جاهزاً
        await discordSdk.ready();
        console.log("Discord SDK is Ready!");

        // 3. تحديث الحالة فوراً عند الدخول
        // ملاحظة: جربنا تجاوز مرحلة الـ Auth لأنها تتعارض مع نطاق discordsays
        broadcastInitialActivity();

    } catch (e) {
        console.error("SDK Setup Error:", e);
    }
}

function broadcastInitialActivity() {
    // تحديد النص بناءً على الصفحة الحالية
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
                    large_image: "game_logo", // تأكد أن هذا الاسم موجود في الـ Developer Portal
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

// بدء التشغيل
setupDiscord();
