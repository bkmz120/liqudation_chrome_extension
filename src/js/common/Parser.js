import $ from "jquery";
import SettingsStorage from "./SettingsStorage.js";

export default class Parser {
    constructor (productId) {
        this._productId = productId;
        this._QUOTE_FORM_URL = "https://www.liquidation.com/auction/quote";
    }

    getManifestLink() {
        let link = "http://www.liquidation.com/aucimg/" + this._productId.substring(0,5) + "/m" + this._productId + ".html";
        return link;
    }

    parseShippingPrice() {
        let parsePromise = new Promise((resolve,reject)=>{
            SettingsStorage.getAll()
                .then((settings)=>{
                    let data = {
                        cmd:"quote",
                        id:this._productId,
                        postal_code:settings.zip,
                        country_code:settings.country
                    }

                    $.post(this._QUOTE_FORM_URL,data,(responseText)=>{
                        let parseResult = this._parseResponse(responseText);
                        resolve(parseResult);
                    });
                });
        });
        return parsePromise;
    }

    _parseResponse(responseText) {
        let $html = $("<html />",{
            html:responseText
        });
        let result = [];

        let $alert = $(".alert.alert-danger ul li:eq(0)",$html);
        if ($alert.length>0 && $alert.text()==="International shipping cannot be auto-quoted"){
            result.push("International shipping can't be auto-quoted. Check Rates <a href='http://www.liquidation.com/auction/quote' target='blank'>here</a>.");
            return result;
        }

        let trCount = 0;
        $(".quote-result tr",$html).each(function(){
            if (trCount>10) return false;
            let $td1 = $("td:eq(0)",$(this));
            let $td2 = $("td:eq(1)",$(this));
            if (trCount==0) {
                result.push($td1.text() + " " + $td2.text());
            }
            else {
                let td2Text = $td2.text();
                if (td2Text[0]==="+") {
                    result.push($td1.text() + " " + $td2.text());
                }
            }
            trCount++;
        });
        return result;
    }
}