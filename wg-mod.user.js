// ==UserScript==
// @name         WG Gesucht
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.wg-gesucht.de/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {

    // Mindestdatum für Auszug in Jahr, Monat, Tag
    // Monate beginnen bei 0; Januar = 0, Dezember = 11
    const minDate = new Date(2023, 12 - 1, 31);
    const destination = "Boltzmannstraße 15, 85748 Garching bei München"

    "use strict";

    console.log("WG Userscript init")

    if (document.readyState === 'complete') {
        run();
    } else {
        document.onreadystatechange = () => {
            if (document.readyState === 'complete') {
                run();
            }
        }
    }


    function run() {
        console.log("WG Userscript ready")


        // noinspection JSUnresolvedReference
        window.DetectAdBlocker.detectAdBlocker = () => false;

        // get all div elements with that have class "wgg_clard" but not "clicked_partner"
        let wggCards = document.querySelectorAll("div.wgg_card.offer_list_item:not(.clicked_partner):not(#ad_blocker_bait)");

        wggCards.forEach((wggCard) => {
            console.log(wggCard);


            if (wggCard.querySelector("span.label_verified") !== null) {
                wggCard.style.display = "none";
                //wggCard.remove();
                return;
            }

            // get the text content of the first div with classes "col-xs-5" and "text-center"
            let wggDate = wggCard.querySelector("div.col-xs-5.text-center").innerText;
            var dateRegex = /- (\d{2})\.(\d{2})\.(\d{4})/;
            var dateMatch = dateRegex.exec(wggDate);

            // check if regex matched
            if (dateMatch !== null) {
                // construct a date object from the regex matches
                let date = new Date(dateMatch[3], dateMatch[2] - 1, dateMatch[1]);

                // if the date is before the minDate, remove the card
                if (date < minDate) {
                    wggCard.style.display = "none";
                }
            }

        });

        // get the first a with href="#mapContainer

        let mapLink = document.querySelector("a[href='#mapContainer']");
        if (mapLink !== null) {
            var address = mapLink.innerText.trim();
            mapLink.href = getMapsUri(address);
        }


    }


    function getMapsUri(originStr) {
        var origin = originStr;
        var travelmode = "transit"
        var departure_time = "now"

        // get date now
        var now = new Date(Date.now());
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var dayOfWeek = today.getDay();
        today.setDate(today.getDate() + (1 + 7 - dayOfWeek) % 7);

        // get today in unix seconds
        departure_time = Math.floor(today.getTime() / 1000).toString();

        var uri = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destination) +
            "&origin=" + encodeURIComponent(origin) +
            "&travelmode=" + encodeURIComponent(travelmode) +
            "&departure_time=" + encodeURIComponent(departure_time);
        return uri;
    }




})();