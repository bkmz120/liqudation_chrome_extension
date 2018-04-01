import $ from "jquery";
import Parser from "./Parser.js";

export default class PageInjecter {
    constructor(document) {
        this._document = document;
    }

    inject() {
        $(this._document).ready(()=>{
            if (!this._isProductListPage()) return false;
            let self = this;
            $(".item.search_grid_view .thumbnail",this._document).css("height","490px");
            $(".product-listing > .item ").each(function(){
                let productId = $(".thumbnail",this).attr("data-id");
                let parser = new Parser(productId);

                let $showQuoteLinkWrap = $("<li>",{
                    class:"ce-resultItem ce-resultItem_first"
                });
                let $showQuoteLink = $("<span>",{
                    text:"SHOW THE S_QUOTE",
                    class:"ce-showQuote",
                }).on("click", function(){
                    self._loadShippingPrice.call(self,this,parser);
                });


                $showQuoteLinkWrap.append($showQuoteLink);

                let manifestUrl = parser.getManifestLink();
                let $openManifestLinkWrap = $("<li>",{
                    class:"ce-resultItem"
                });
                let $openManifestLink = $("<a />",{
                    text:"OPEN Manifest",
                    class:"ce-manifest-link",
                    target:"_blank",
                    href:manifestUrl
                })

                $openManifestLinkWrap.append($openManifestLink);

                let $copyManifestLinkWrap = $("<li>",{
                    class:"ce-resultItem"
                });
                let $copyManifestLinkSuccess = $("<span />",{
                    text:"copied",
                    class:"ce-manifest-copy-success",
                })
                let copyLinkText;
                if ($(this).hasClass("search_grid_view")){
                    copyLinkText = "COPY Manifest";
                }
                else {
                    copyLinkText = "COPY Manifest link";
                }
                let $copyManifestLink = $("<span />",{
                    text:copyLinkText,
                    class:"ce-manifest-link",
                }).on("click", function(){
                    self._copyManifestLink($copyManifestLinkSuccess,manifestUrl);
                });
                $copyManifestLinkWrap.append($copyManifestLink);
                $copyManifestLinkWrap.append($copyManifestLinkSuccess);


                let $detailsList = $(".auction-details",this);
                $detailsList.append($showQuoteLinkWrap);
                $detailsList.append($openManifestLinkWrap);
                $detailsList.append($copyManifestLinkWrap);
            });

        });

    }

    _isProductListPage() {
        if ($(".product-listing",this._document).length>0) return true;
        else return false;
    }

    _loadShippingPrice(link,parser) {
        let $showQuoteLink = $(link);
        if ($showQuoteLink.attr("status")=="loading") return false;
        $showQuoteLink.html("Loading...");
        $showQuoteLink.attr("status","loading");
        $showQuoteLink.addClass("ce-showQuote_loading");
        let $showQuoteLinkWrap = $showQuoteLink.parent();
        let $item = $showQuoteLink.closest(".item");
        let productId = $(".thumbnail",$item).attr("data-id");
        let $detailsList = $(".auction-details",$item);


        parser.parseShippingPrice().then((parseResult)=>{
            $(".item.search_grid_view .thumbnail",this._document).css("height","580px");

            let resultText = parseResult.join("<br>");
            let $shippingPriceResult = $("<span>",{
                html:resultText,
                class:"ce-shipping-price"
            });
            $showQuoteLink.remove();
            $showQuoteLinkWrap.append($shippingPriceResult);
        });
    }

    _copyManifestLink($success,manifestUrl) {
        var textArea = document.createElement("textarea");
        textArea.value = manifestUrl;
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            if (successful){
                $success.addClass("ce-manifest-copy-success_visible");
                setTimeout(function(){
                    $success.removeClass("ce-manifest-copy-success_visible");
                },2000);
            }

        } catch (err) {
            console.error('Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }
}