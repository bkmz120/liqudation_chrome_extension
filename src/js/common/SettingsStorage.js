export default class SettingsStorage {
    static getAll() {
        let loadPromise = new Promise((resolve,reject)=>{
            chrome.storage.local.get(['settings'],(items)=>{
                resolve(items.settings);
            });
        });
        return loadPromise;
    }

    static saveAll(settings) {
        let savePromise = new Promise((resolve,reject)=>{
            chrome.storage.local.set({settings:settings},()=>{
                resolve();
            });
        });
        return savePromise;
    }
}