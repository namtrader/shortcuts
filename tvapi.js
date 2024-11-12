(function() {
    'use strict';

    // Biến trạng thái để theo dõi bật/tắt các tính năng
    let featuresEnabled = localStorage.getItem('featuresEnabled') === 'true';

    // Định nghĩa các phím tắt tùy chỉnh
    let shortcuts = {};

    // Các nút interval sẽ được cập nhật sau khi tìm thấy
    let intervalButtons = [];

    // Hàm chuyển đổi sang interval tiếp theo
    function switchToNextInterval() {
        let currentIndex = intervalButtons.findIndex(btn => btn.getAttribute('aria-checked') === 'true');
        currentIndex = (currentIndex + 1) % intervalButtons.length;
        intervalButtons[currentIndex].click();
    }

    // Hàm chuyển đổi sang interval trước
    function switchToPreviousInterval() {
        let currentIndex = intervalButtons.findIndex(btn => btn.getAttribute('aria-checked') === 'true');
        currentIndex = (currentIndex - 1 + intervalButtons.length) % intervalButtons.length;
        intervalButtons[currentIndex].click();
    }

    // Hàm chuyển đổi trạng thái các tính năng
    function toggleFeatures() {
        featuresEnabled = !featuresEnabled;
        localStorage.setItem('featuresEnabled', featuresEnabled);
        console.log(`Features ${featuresEnabled ? 'enabled' : 'disabled'}`);
    }

    // Thực hiện hành động tương ứng với phím tắt được nhấn
    function executeShortcut(action) {
        if (action === 'featuresEnabled') {
            toggleFeatures(); // Gọi hàm để chuyển đổi trạng thái
            return; // Dừng xử lý tiếp
        }

        // Kiểm tra nếu tính năng không được bật
        if (!featuresEnabled) {
            return; // Nếu không bật, thì không làm gì cả
        }

        if (action === 'removeAllShapes') {
            window.TradingViewApi.activeChart().removeAllShapes();
        } else if (action === 'forwardReplay') {
            const shiftRightArrowEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39,
                shiftKey: true,
                bubbles: true
            });
            document.dispatchEvent(shiftRightArrowEvent);
        } else if (action === 'deleteAction') {
            const deleteEvent = new KeyboardEvent('keydown', {
                key: 'Delete',
                code: 'Delete',
                keyCode: 46,
                bubbles: true
            });
            document.dispatchEvent(deleteEvent);
        } else if (action === 'nextInterval') {
            switchToNextInterval();
        } else if (action === 'previousInterval') {
            switchToPreviousInterval();
        } else {
            window.TradingViewApi.selectLineTool(action);
        }
    }

    function handleKeydown(e) {
        const key = e.key.toLowerCase();
        const modifiers = [];
        if (e.ctrlKey) modifiers.push('ctrl');
        if (e.altKey) modifiers.push('alt');
        if (e.shiftKey) modifiers.push('shift');

        const combinedKey = [...modifiers, key].join('+');

        // Kiểm tra nếu phím vừa nhấn là phím bật/tắt
        const toggleKey = Object.keys(shortcuts).find(k => shortcuts[k] === 'featuresEnabled');
        if (combinedKey === toggleKey) {
            toggleFeatures(); // Luôn cho phép bật/tắt tính năng khi nhấn phím tương ứng
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // Kiểm tra nếu tính năng không được bật và không xử lý phím tắt nào khác
        if (!featuresEnabled) {
            return;
        }

        const action = shortcuts[combinedKey];
        if (action) {
            executeShortcut(action);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // Định nghĩa hàm chờ cho nút interval
    function waitForIntervalButtons() {
        const observer = new MutationObserver(() => {
            const buttons = document.querySelectorAll('#header-toolbar-intervals button[data-value]');
            if (buttons.length > 0) {
                intervalButtons = Array.from(buttons); // Cập nhật danh sách nút interval
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Nhận dữ liệu từ `popup.js` qua sự kiện `shortcutsLoaded`
    document.addEventListener('shortcutsLoaded', function(e) {
        shortcuts = e.detail;
        // console.log("Received shortcuts data:", shortcuts);
    });

    // Khởi tạo
    waitForIntervalButtons();
    window.addEventListener('keydown', handleKeydown, true);

    console.log(`Features ${featuresEnabled ? 'enabled' : 'disabled'}`);
})();
