import $ from "jquery";
import SettingsStorage  from "./common/SettingsStorage.js";

class Popup {
    constructor() {
        $(document).ready(()=>{
            this._$zipInp = $(".js-inp-zip");
            this._$zipInp.on("input",this._saveSettings.bind(this));
            this._$countrySelect = $(".js-select-country");
            this._$countrySelect.on("change",this._saveSettings.bind(this));
            SettingsStorage.getAll()
                    .then((settings)=>{
                        if (settings !== undefined) {
                            this._$zipInp.val(settings.zip);
                            this._$countrySelect.val(settings.country);
                        }
                    });
        });
    }

    _saveSettings() {
        let self = this;
        console.log(self._$zipInp.val());
        SettingsStorage.saveAll({
            country:self._$countrySelect.val(),
            zip:self._$zipInp.val()
        });
    }
}

let popup = new Popup();