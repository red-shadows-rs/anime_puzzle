/**
 * Discord Embedded App SDK - Browser Global Build
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.discordSdk = {}));
})(this, (function (exports) { 'use strict';

    class DiscordSDK {
        constructor(clientId) {
            this.clientId = clientId;
            this.instanceId = window.location.search.split('instance_id=')[1]?.split('&')[0];
            this.commands = this._setupCommands();
        }
        async ready() {
            return new Promise((resolve) => {
                const check = () => {
                    if (document.readyState === 'complete') resolve();
                    else window.addEventListener('load', resolve, { once: true });
                };
                check();
            });
        }
        _setupCommands() {
            return {
                authorize: async (opts) => this._send('AUTHORIZE', opts),
                authenticate: async (opts) => this._send('AUTHENTICATE', opts),
                setActivity: async (opts) => this._send('SET_ACTIVITY', opts),
            };
        }
async _send(cmd, args) {
    return new Promise((resolve, reject) => {
        const nonce = Math.random().toString(36).substring(2);
        // التعديل هنا: ديسكورد يتوقع كائن يحتوي على cmd و args و nonce
        const payload = {
            cmd: cmd,
            args: args,
            nonce: nonce,
        };
        
        window.parent.postMessage(payload, "*"); // أرسل الكائن مباشرة بدون JSON.stringify

        const handler = (event) => {
            const data = event.data;
            if (data && data.nonce === nonce) {
                window.removeEventListener('message', handler);
                if (data.evt === 'ERROR') reject(data.data);
                else resolve(data.data);
            }
        };
        window.addEventListener('message', handler);
    });
}
    }

    exports.DiscordSDK = DiscordSDK;
    Object.defineProperty(exports, '__esModule', { value: true });
}));
