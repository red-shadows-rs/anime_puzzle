// scripts/discord-presence.js
let discordSdk;

async function setupDiscord() {
    // الوصول الآمن للمكتبة لعدم كسر السكربت
    const root = window.discordSdk || window.DiscordSDK;
    const SDKClass = root?.DiscordSDK || root;

    // التأكد أن ما وجدناه هو "Constructor" (دالة لإنشاء كائن) وليس مجرد كائن فارغ
    if (typeof SDKClass !== 'function') {
        console.warn("Discord SDK not found yet, retrying...");
        setTimeout(setupDiscord, 500);
        return;
    }

    try {
        // إنشاء الكائن باستخدام الكلاس الذي وجدناه
        discordSdk = new SDKClass("1420027881098055700");

        await discordSdk.ready();
        console.log("Discord SDK ready!");
        
        // المصادقة (تأكد من إعداد الـ Redirect URI في Developer Portal إذا لزم الأمر)
        const { code } = await discordSdk.commands.authorize({
            client_id: "1420027881098055700",
            response_type: "code",
            scope: ["identify", "guilds"],
            prompt: "none",
        });

        await discordSdk.commands.authenticate({ access_token: code });

        console.log("Discord Authenticated!");

        // --- الإضافة هنا: تحديث الحالة فوراً بناءً على الصفحة الحالية ---
        if (window.location.pathname.includes("levels.html")) {
            updateActivity("يختار لغزاً مناسباً", "في قائمة المستويات 🧩");
        } else if (window.location.pathname.includes("shop.html")) {
            updateActivity("يتسوق في المتجر", "يشتري أدوات مساعدة 🛒");
        }
        // -------------------------------------------------------
        // تحديث الحالة فور الدخول

    } catch (e) {
        console.warn("Discord SDK Init/Auth failed - expected if not in Discord Activity.", e);
    }
}

async function updateActivity(details, state) {
    if (!discordSdk) return;

    try {
        await discordSdk.commands.setActivity({
            // أضف pid: 0 لضمان التوافق
            pid: 0, 
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
        console.log("Activity updated:", details);
    } catch (err) {
        console.error("RPC Error details:", err);
    }
}

// بدء التشغيل
setupDiscord();
