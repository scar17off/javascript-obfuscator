document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('textarea');
    const obfuscateBtn = document.getElementById('obfuscateBtn');
    const settings = {
        renameVariables: document.getElementById('renameVariables'),
        stringEncryption: document.getElementById('stringEncryption'),
        controlFlowFlattening: document.getElementById('controlFlowFlattening'),
        deadCodeInjection: document.getElementById('deadCodeInjection'),
        debugProtection: document.getElementById('debugProtection'),
        functionReordering: document.getElementById('functionReordering'),
        constantFolding: document.getElementById('constantFolding'),
        codeSplitting: document.getElementById('codeSplitting'),
        stringArray: document.getElementById('stringArray'),
        stringArrayShuffle: document.getElementById('stringArrayShuffle'),
        stringArrayThreshold: document.getElementById('stringArrayThreshold'),
        stringArrayIndexShift: document.getElementById('stringArrayIndexShift'),
        stringArrayIndexesType: document.getElementById('stringArrayIndexesType'),
        stringInsane: document.getElementById('stringInsane'),
        stringInsaneThreshold: document.getElementById('stringInsaneThreshold')
    };

    function loadOptions() {
        Object.keys(settings).forEach(key => {
            const element = settings[key];
            if (element) {
                const savedValue = localStorage.getItem(key);
                if (savedValue !== null) {
                    if (element.type === 'checkbox') {
                        element.checked = savedValue === 'true';
                    } else if (element.type === 'number') {
                        element.value = savedValue;
                    } else if (element.tagName === 'SELECT') {
                        element.value = savedValue;
                    }
                }
            }
        });
    }

    function saveOptions() {
        Object.keys(settings).forEach(key => {
            const element = settings[key];
            if (element) {
                if (element.type === 'checkbox') {
                    localStorage.setItem(key, element.checked);
                } else if (element.type === 'number' || element.tagName === 'SELECT') {
                    localStorage.setItem(key, element.value);
                }
            }
        });
    }

    Object.values(settings).forEach(element => {
        if (element) {
            element.addEventListener('change', saveOptions);
        }
    });

    if (obfuscateBtn) {
        obfuscateBtn.addEventListener('click', () => {
            const code = textarea.value;
            const options = Object.fromEntries(
                Object.entries(settings).map(([key, element]) => {
                    if (element) {
                        if (element.type === 'checkbox') {
                            return [key, element.checked];
                        } else if (element.type === 'number') {
                            return [key, parseInt(element.value, 10)];
                        } else if (element.tagName === 'SELECT') {
                            return [key, element.value];
                        }
                    }
                    return [key, null];
                }).filter(([_, value]) => value !== null)
            );
            const result = obfuscate(code, options);
            
            if (typeof result === 'string' && result.startsWith('Error:')) {
                alert(result);
            } else {
                const { header, code: obfuscatedCode } = result;
                textarea.value = header + obfuscatedCode;
            }
        });
    }

    loadOptions();
});