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
            this.instanceId = new URLSearchParams(window.location.search).get('instance_id');
            this.commands = this._setupCommands();
        }
        async ready() {
            if (document.readyState === 'complete') return;
            return new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
        }
        _setupCommands() {
            return {
                authorize: (opts) => this._send('AUTHORIZE', opts),
                authenticate: (opts) => this._send('AUTHENTICATE', opts),
                setActivity: (opts) => this._send('SET_ACTIVITY', opts),
            };
        }
        async _send(cmd, args) {
            return new Promise((resolve, reject) => {
                const nonce = Math.random().toString(36).substring(2);
                
                // الإصلاح الجوهري: إرسال البيانات داخل مصفوفة [Object]
                // ديسكورد يتوقع format: [ {cmd, args, nonce} ]
                const message = [
                    {
                        cmd: cmd,
                        args: { ...args, pid: 0 },
                        nonce: nonce,
                    }
                ];

                window.parent.postMessage(message, "*");

                const handler = (event) => {
                    // ديسكورد يرجع البيانات أيضاً داخل مصفوفة في بعض الأحيان
                    let data = event.data;
                    if (Array.isArray(data)) data = data[0];

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
