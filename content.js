(function() {
    'use strict';

    let keyBindings = {
        switchNextModifier: 'none',
        switchNextKey: 'D',
        switchPreviousModifier: 'none',
        switchPreviousKey: 'A',
        forwardReplayModifier: 'none',
        forwardReplayKey: 'F',
        deleteActionModifier: 'none',
        deleteActionKey: 'S',
        goToCustomIntervalModifier: 'none',
        goToCustomIntervalKey: 'G',
        goToCustomIntervalValue: '15',
        horizontalLineModifier: 'none',
        horizontalLineKey: 'H',
        mouseControl: false,
        featuresEnabled: true
    };

    chrome.storage.sync.get('keyBindings', function(data) {
        if (data.keyBindings) {
            keyBindings = data.keyBindings;
        }
        initializeBindings();
    });

    function initializeBindings() {
        function waitForIntervalButtons(callback) {
            const observer = new MutationObserver((mutationsList, observer) => {
                const buttons = document.querySelectorAll('#header-toolbar-intervals button[data-value]');
                if (buttons.length > 0) {
                    observer.disconnect();
                    callback(Array.from(buttons));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        function initialize(intervalButtons) {
            let currentIndex = intervalButtons.findIndex(btn => btn.getAttribute('aria-checked') === 'true');

            function clickButton(index) {
                if (index >= 0 && index < intervalButtons.length) {
                    intervalButtons[index].click();
                } else {
                    console.error(`Chỉ số ${index} không hợp lệ.`);
                }
            }

            function switchToNextInterval() {
                currentIndex = (currentIndex + 1) % intervalButtons.length;
                clickButton(currentIndex);
            }

            function switchToPreviousInterval() {
                currentIndex = (currentIndex - 1 + intervalButtons.length) % intervalButtons.length;
                clickButton(currentIndex);
            }

            function handleKeydown(e) {
                if (e.key === 'F2') {
                    keyBindings.featuresEnabled = !keyBindings.featuresEnabled;
                    chrome.storage.sync.set({ keyBindings: keyBindings });
                    console.log(`Các tính năng ${keyBindings.featuresEnabled ? 'bật' : 'tắt'}`);
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (!keyBindings.featuresEnabled) {
                    return;
                }

                const key = e.key.toUpperCase();
                const ctrlKey = e.ctrlKey ? 'ctrl' : 'none';
                const altKey = e.altKey ? 'alt' : 'none';
                const shiftKey = e.shiftKey ? 'shift' : 'none';

                if (keyBindings.switchNextModifier === ctrlKey || keyBindings.switchNextModifier === altKey || keyBindings.switchNextModifier === shiftKey || keyBindings.switchNextModifier === 'none') {
                    if (key === keyBindings.switchNextKey) {
                        e.preventDefault();
                        switchToNextInterval();
                    }
                }

                if (keyBindings.switchPreviousModifier === ctrlKey || keyBindings.switchPreviousModifier === altKey || keyBindings.switchPreviousModifier === shiftKey || keyBindings.switchPreviousModifier === 'none') {
                    if (key === keyBindings.switchPreviousKey) {
                        e.preventDefault();
                        switchToPreviousInterval();
                    }
                }

                if (keyBindings.forwardReplayModifier === ctrlKey || keyBindings.forwardReplayModifier === altKey || keyBindings.forwardReplayModifier === shiftKey || keyBindings.forwardReplayModifier === 'none') {
                    if (key === keyBindings.forwardReplayKey) {
                        e.preventDefault();
                        const shiftRightArrowEvent = new KeyboardEvent('keydown', {
                            key: 'ArrowRight',
                            code: 'ArrowRight',
                            keyCode: 39,
                            shiftKey: true,
                            bubbles: true
                        });
                        document.dispatchEvent(shiftRightArrowEvent);
                    }
                }

                if (keyBindings.deleteActionModifier === ctrlKey || keyBindings.deleteActionModifier === altKey || keyBindings.deleteActionModifier === shiftKey || keyBindings.deleteActionModifier === 'none') {
                    if (key === keyBindings.deleteActionKey) {
                        e.preventDefault();
                        const deleteEvent = new KeyboardEvent('keydown', {
                            key: 'Delete',
                            code: 'Delete',
                            keyCode: 46,
                            bubbles: true
                        });
                        document.dispatchEvent(deleteEvent);
                    }
                }

                if (keyBindings.goToCustomIntervalModifier === ctrlKey || keyBindings.goToCustomIntervalModifier === altKey || keyBindings.goToCustomIntervalModifier === shiftKey || keyBindings.goToCustomIntervalModifier === 'none') {
                    if (key === keyBindings.goToCustomIntervalKey) {
                        e.preventDefault();
                        const interval = intervalButtons.find(btn => btn.getAttribute('data-value') === keyBindings.goToCustomIntervalValue);
                        if (interval) {
                            currentIndex = intervalButtons.indexOf(interval);
                            clickButton(currentIndex);
                        }
                    }
                }

                if (keyBindings.horizontalLineModifier === ctrlKey || keyBindings.horizontalLineModifier === altKey || keyBindings.horizontalLineModifier === shiftKey || keyBindings.horizontalLineModifier === 'none') {
                    if (key === keyBindings.horizontalLineKey) {
                        e.preventDefault();
                        const horizontalLineEvent = new KeyboardEvent('keydown', {
                            key: 'H',
                            code: 'KeyH',
                            keyCode: 72,
                            altKey: true,
                            bubbles: true
                        });
                        document.dispatchEvent(horizontalLineEvent);
                    }
                }


            }

            function handleMouseup(e) {
                if (!keyBindings.featuresEnabled || !keyBindings.mouseControl) {
                    return;
                }

                if (typeof e === 'object' && [3, 4].includes(e.button)) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (e.button === 3) {
                        switchToPreviousInterval();
                    } else if (e.button === 4) {
                        switchToNextInterval();
                    }
                }
            }

            window.addEventListener('keydown', handleKeydown, true);
            window.addEventListener('mouseup', handleMouseup, true);

            console.log(`Các tính năng ${keyBindings.featuresEnabled ? 'bật' : 'tắt'}`);
        }

        waitForIntervalButtons(initialize);
    }
})();
