// key.js

// Danh sách các công cụ mà người dùng có thể gán phím tắt
const shapes = [
    'featuresEnabled',
    'nextInterval',
    'previousInterval',
    'forwardReplay',
    'removeAllShapes',
    'deleteAction',
    'text',
    'anchored_text',
    'balloon',
    'arrow_up',
    'arrow_down',
    'arrow_left',
    'arrow_right',
    'price_label',
    'flag',
    'xabcd_pattern',
    'abcd_pattern',
    'triangle_pattern',
    '3divers_pattern',
    'head_and_shoulders',
    'cypher_pattern',
    'elliott_impulse_wave',
    'elliott_triangle_wave',
    'elliott_triple_combo',
    'elliott_correction',
    'elliott_double_combo',
    'cyclic_lines',
    'time_cycles',
    'sine_line',
    'rectangle',
    'rotated_rectangle',
    'ellipse',
    'triangle',
    'polyline',
    'curve',
    'double_curve',
    'arc',
    'vertical_line',
    'horizontal_line',
    'cross_line',
    'horizontal_ray',
    'trend_line',
    'trend_infoline',
    'trend_angle',
    'arrow',
    'ray',
    'extended',
    'parallel_channel',
    'disjoint_angle',
    'flat_bottom',
    'fib_spiral',
    'pitchfork',
    'schiff_pitchfork_modified',
    'schiff_pitchfork',
    'inside_pitchfork',
    'pitchfan',
    'gannbox_square',
    'gannbox_fan',
    'gannbox',
    'fib_speed_resist_fan',
    'fib_retracement',
    'fib_trend_ext',
    'fib_timezone',
    'fib_trend_time',
    'fib_circles',
    'fib_speed_resist_arcs',
    'fib_wedge',
    'fib_channel',
    'date_range',
    'price_range',
    'date_and_price_range',
    'long_position',
    'short_position',
    'projection',
    'forecast',
    'ghost_feed',
    'bars_pattern',
    'brush',
    'eraser',
    'measure',
    'zoom',
    'cursor',
    'dot',
    'path'
];

let shortcuts = {};

// Tạo giao diện tùy chỉnh phím tắt cho từng công cụ
function createShortcutElements() {
    const container = document.getElementById('shortcutsContainer');
    shapes.forEach(shape => {
        const div = document.createElement('div');
        div.className = 'shortcut';
        div.innerHTML = `
            ${shape} 
            <select name="${shape}Modifier">
                <option value="">none</option>
                <option value="alt">alt</option>
                <option value="ctrl">ctrl</option>
                <option value="shift">shift</option>
            </select> + 
            <input type="text" name="${shape}Key" value="" maxlength="1" />
        `;
        container.appendChild(div);
    });
}

// Lưu các phím tắt vào `chrome.storage.sync`
function saveShortcuts() {
    shortcuts = {}; // Reset đối tượng shortcuts
    shapes.forEach(shape => {
        const modifierSelect = document.querySelector(`select[name="${shape}Modifier"]`);
        const keyInput = document.querySelector(`input[name="${shape}Key"]`);
        const modifier = modifierSelect.value;
        const key = keyInput.value.toLowerCase();

        let shortcutKey = key;
        if (modifier) {
            shortcutKey = `${modifier}+${key}`;
        }

        if (key) {
            shortcuts[shortcutKey] = shape;
        }
    });

    // Lưu phím tắt vào chrome.storage.sync
    chrome.storage.sync.set({ shortcuts: shortcuts }, function() {
        console.log('Shortcuts saved:', shortcuts);
        displayShortcuts();
    });
}

// Hiển thị các phím tắt đã lưu
function displayShortcuts() {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<strong>Shortcuts saved:</strong><br>';
    outputDiv.innerHTML += '<pre>' + JSON.stringify(shortcuts, null, 2) + '</pre>';
}

function resetShortcuts() {
    shortcuts = {}; // Reset đối tượng shortcuts
    shapes.forEach(shape => {
        const modifierSelect = document.querySelector(`select[name="${shape}Modifier"]`);
        const keyInput = document.querySelector(`input[name="${shape}Key"]`);

        if (modifierSelect) {
            modifierSelect.value = ''; // Đặt lại giá trị của select thành 'none'
        }
        if (keyInput) {
            keyInput.value = ''; // Đặt lại giá trị của input thành rỗng
        }
    });

    // Lưu phím tắt rỗng vào chrome.storage.sync
    chrome.storage.sync.set({ shortcuts: shortcuts }, function() {
        console.log('Shortcuts reset and saved:', shortcuts);
        displayShortcuts(); // Hiển thị lại phím tắt (sẽ không có gì)
    });
}

// Tải các phím tắt từ chrome.storage.sync khi trang được tải
window.onload = function() {
    chrome.storage.sync.get(['shortcuts'], function(result) {
        if (result.shortcuts) {
            shortcuts = result.shortcuts;

            for (const [key, value] of Object.entries(shortcuts)) {
                const shape = value;
                const modifier = key.includes('+') ? key.split('+')[0] : '';
                const keyWithoutModifier = key.includes('+') ? key.split('+')[1] : key;

                const modifierSelect = document.querySelector(`select[name="${shape}Modifier"]`);
                const keyInput = document.querySelector(`input[name="${shape}Key"]`);

                if (modifierSelect) {
                    modifierSelect.value = modifier;
                }
                if (keyInput) {
                    keyInput.value = keyWithoutModifier;
                }
            }
            displayShortcuts();
        }
    });
};

// Thêm sự kiện cho nút "Lưu Phím Tắt"
document.getElementById('saveShortcuts').addEventListener('click', saveShortcuts);
document.getElementById('resetShortcuts').addEventListener('click', resetShortcuts);

// Khởi tạo giao diện phím tắt
createShortcutElements();
