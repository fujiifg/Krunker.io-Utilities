// ==UserScript==
// @name         Krunker.io Utilities Mod
// @description  Krunker.io Mod
// @updateURL    https://github.com/Tehchy/Krunker.io-Utilities/raw/master/lite.user_yomiage.js
// @downloadURL  https://github.com/Tehchy/Krunker.io-Utilities/raw/master/lite.user_yomiage.js
// @version      0.5.1
// @author       Tehchy
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?.+)$/
// @grant        none
// @run-at       document-start
// ==/UserScript==

class Utilities {
    constructor() {
        /* 音量などの設定は↓の数値を弄ってね！！！ ------------------------------- */
        this.volume = 0.7; // 音量 0-1 初期値:1
        this.rate = 1.2; // 速度 0.1-10 初期値:1 (倍速なら2, 半分の倍速なら0.5)
        this.pitch = 1.4; // 高さ 0-2 初期値:1
        /* ------------------------------------------------------------------ */
        this.onLoad();
    }
    createObservers() {
        //speak chat
        this.newObserver(chatList, 'childList', (target) => {
            if (!'SpeechSynthesisUtterance' in window) {
                alert('Speech synthesis(音声合成) APIには未対応です.');
                return;
            }
            // 発話機能をインスタンス化 ※コンストラクタあたりに貼り付ける
            var msg = new SpeechSynthesisUtterance();
            var voices = window.speechSynthesis.getVoices();
            //console.log(voices);

            //リセット
            window.addEventListener('beforeunload', function(){
                window.speechSynthesis.cancel();
            });

            // 以下オプション設定（日本語は効かないもよう。。）
            msg.voice = voices[11]; // 11:Google 日本人 ja-JP ※他は英語のみ（次項参照） 0  Google US English en-US
            // Voice一覧 https://codepen.io/rodhamjun/full/jQJEWQ/
            msg.volume = this.volume;
            msg.rate = this.rate;
            msg.pitch = this.pitch;
            msg.lang = 'ja-JP'; // 言語 (日本語:ja-JP, アメリカ英語:en-US, イギリス英語:en-GB, 中国語:zh-CN, 韓国語:ko-KR)
            var chatcolor = "#00aaaa";
            console.log (msg);

            var chatlog = target.getElementsByClassName("chatItem");
            chatlog = chatlog[chatlog.length-1];

            var chattarget = target;
            //チャットログに : が含まれる = 人間の発言。
            if (chatlog.innerText.indexOf(": ") != -1 ) {
                chatlog.style.background = chatcolor;

                chattarget = chattarget.getElementsByClassName("chatMsg");
                chattarget = chattarget[chattarget.length-1].innerText;
                msg.text = chattarget; // 喋る内容
                speechSynthesis.speak(msg); // 発話実行
            }
        }, false);
    }

    newObserver(elm, check, callback, onshow = true) {
        return new MutationObserver((mutationsList, observer) => {
            if (check == 'src' || onshow && mutationsList[0].target.style.display == 'block' || !onshow) {
                callback(mutationsList[0].target);
            }
        }).observe(elm, check == 'childList' ? {childList: true} : {attributes: true, attributeFilter: [check]});
    }
    onLoad() {
        this.createObservers();
    }
}
