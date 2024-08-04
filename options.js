document.addEventListener('DOMContentLoaded', () => {
    const optionsForm = document.getElementById('optionsForm');
    const statusElement = document.getElementById('status');

    // Load saved settings from chrome.storage.sync
    chrome.storage.sync.get('keyBindings', (data) => {
        const keyBindings = data.keyBindings || {
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

        // Set initial values in the form
        document.getElementById('switchNextModifier').value = keyBindings.switchNextModifier;
        document.getElementById('switchNextKey').value = keyBindings.switchNextKey;
        document.getElementById('switchPreviousModifier').value = keyBindings.switchPreviousModifier;
        document.getElementById('switchPreviousKey').value = keyBindings.switchPreviousKey;
        document.getElementById('forwardReplayModifier').value = keyBindings.forwardReplayModifier;
        document.getElementById('forwardReplayKey').value = keyBindings.forwardReplayKey;
        document.getElementById('deleteActionModifier').value = keyBindings.deleteActionModifier;
        document.getElementById('deleteActionKey').value = keyBindings.deleteActionKey;
        document.getElementById('goToCustomIntervalModifier').value = keyBindings.goToCustomIntervalModifier;
        document.getElementById('goToCustomIntervalKey').value = keyBindings.goToCustomIntervalKey;
        document.getElementById('goToCustomIntervalValue').value = keyBindings.goToCustomIntervalValue;
        document.getElementById('horizontalLineModifier').value = keyBindings.horizontalLineModifier;
        document.getElementById('horizontalLineKey').value = keyBindings.horizontalLineKey;
        document.getElementById('mouseControl').checked = keyBindings.mouseControl;
        document.getElementById('featuresEnabled').checked = keyBindings.featuresEnabled;
        statusElement.textContent = keyBindings.featuresEnabled ? 'Tiện ích đang bật' : 'Tiện ích đang tắt';
    });

    // Function to enforce single uppercase letter or digit input
    function enforceSingleUppercaseOrDigitInput(event) {
        let input = event.target;
        let value = input.value.toUpperCase();
        
        // Remove non-alphanumeric characters
        value = value.replace(/[^A-Z0-9]/g, '');
        
        // Update the input value to only the first character
        input.value = value.slice(0, 1); // Ensure only one character
    }

    // Function to enforce 2-character alphanumeric input
    function enforceTwoCharacterAlphanumericInput(event) {
        let input = event.target;
        let value = input.value.toUpperCase();
        
        // Remove non-alphanumeric characters
        value = value.replace(/[^A-Z0-9]/g, '');
        
        // Update the input value to only the first 2 characters
        input.value = value.slice(0, 2); // Ensure only two characters
    }

    // Apply input enforcement to all relevant fields
    const keyInputs = [
        'switchNextKey',
        'switchPreviousKey',
        'forwardReplayKey',
        'deleteActionKey',
        'goToCustomIntervalKey',
        'horizontalLineKey'
    ];

    keyInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', enforceSingleUppercaseOrDigitInput);
    });

    // Apply input enforcement to goToCustomIntervalValue
    const intervalInput = document.getElementById('goToCustomIntervalValue');
    intervalInput.addEventListener('input', enforceTwoCharacterAlphanumericInput);

    // Handle form submission
    optionsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const keyBindings = {
            switchNextModifier: document.getElementById('switchNextModifier').value,
            switchNextKey: document.getElementById('switchNextKey').value,
            switchPreviousModifier: document.getElementById('switchPreviousModifier').value,
            switchPreviousKey: document.getElementById('switchPreviousKey').value,
            forwardReplayModifier: document.getElementById('forwardReplayModifier').value,
            forwardReplayKey: document.getElementById('forwardReplayKey').value,
            deleteActionModifier: document.getElementById('deleteActionModifier').value,
            deleteActionKey: document.getElementById('deleteActionKey').value,
            goToCustomIntervalModifier: document.getElementById('goToCustomIntervalModifier').value,
            goToCustomIntervalKey: document.getElementById('goToCustomIntervalKey').value,
            goToCustomIntervalValue: document.getElementById('goToCustomIntervalValue').value,
            horizontalLineModifier: document.getElementById('horizontalLineModifier').value,
            horizontalLineKey: document.getElementById('horizontalLineKey').value,
            mouseControl: document.getElementById('mouseControl').checked,
            featuresEnabled: document.getElementById('featuresEnabled').checked,
        };

        // Save to chrome.storage.sync
        chrome.storage.sync.set({ keyBindings }, () => {
            // Update the status text
            statusElement.textContent = 'Cài đặt đã được lưu';
            // Reset status text after 2 seconds
            setTimeout(() => {
                statusElement.textContent = keyBindings.featuresEnabled ? 'Tiện ích đang bật' : 'Tiện ích đang tắt';
            }, 2000);
        });
    });
});
