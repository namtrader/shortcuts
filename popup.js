// popup.js
function injectScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('tvapi.js');
    (document.head || document.documentElement).appendChild(script);
    script.onload = function() {
        // Đọc phím tắt từ `chrome.storage.sync`
        chrome.storage.sync.get(['shortcuts'], function(result) {
            if (result.shortcuts) {
                const event = new CustomEvent('shortcutsLoaded', { detail: result.shortcuts });
                document.dispatchEvent(event);
            }
        });

        // Xóa thẻ script sau khi đã chèn xong
        script.remove();
    };
}

// Gọi hàm chèn script
injectScript();

// Mở tab key.html khi nhấn nút
document.addEventListener('DOMContentLoaded', function () {
    const openKeyTabButton = document.getElementById('openKeyTab');
    if (openKeyTabButton) {
        openKeyTabButton.addEventListener('click', function() {
            chrome.tabs.create({ url: 'key.html' });
        });
    }
});
