window.onload = function() {
    /*Načtení dat z formuláře*/
    document.getElementById("countBox").oninput = function() {mathPrice()};
    document.getElementById("priceBox").oninput = function() {mathPrice()};
    document.getElementById("confirmButton").onclick = function() {getApi()};
    let count = document.getElementById("countBox");
    let price = document.getElementById("priceBox");
    let fullPrice = document.getElementById("fullPrice");
    let name = document.getElementById("nameBox");
    let product = document.getElementById("productBox");
    let apiString = 'empty';

    /*Výpočet celkové ceny reagující na změny hodnot uživatele*/
    function mathPrice() {
        if(price.checkValidity() && count.checkValidity())
        {
            fullPrice.innerText = "Celková částka: " + (price.value * count.value).toString() + ",-";
        }
        else
        {
            fullPrice.innerText = "Neplatná hodnota.";
        }
    }

    /*Načtení kurzovního lístku*/
    let url = 'https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt';
    /*Upravený kód CORS Anywhere*/
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
    function doCORSRequest(options, printResult) {
        var x = new XMLHttpRequest();
        x.open(options.method, cors_api_url + options.url);
        x.onload = x.onerror = function() {
            printResult(
                options.method + ' ' + options.url + '\n' +
                x.status + ' ' + x.statusText + '\n\n' +
                (x.responseText || '')
            );
        };
        x.send(options.data);
    }
    function getApi() {
        /*ověření validity*/
        if (price.checkValidity() && count.checkValidity() && name.checkValidity() && product.checkValidity())
        {
            doCORSRequest({
                method: 'GET',
                url: url
            }, function printResult(result) {
                apiString = result;
                confirm();
            });
        }
    }

    function confirm() {
        /*Příprava rekapitulace*/
        let nadpisElement = document.createElement("h1");
        let nameElement = document.createElement("p");
        let productElement = document.createElement("p");
        let priceElement = document.createElement("p");
        let countElement = document.createElement("p");
        let fullPriceElement = document.createElement("p");
        let texedFullPriceElement = document.createElement("p");
        let dolarElement = document.createElement("p");

        /*Nastavení hodnot rekapitulace*/
        nadpisElement.innerText = "Rekapitulace";
        nameElement.innerText = "Jméno: " + name.value;
        productElement.innerText = "Produkt: " + product.value;
        priceElement.innerText = "Cena produktu: " + price.value;
        countElement.innerText = "Počet kusů: " + count.value;
        fullPriceElement.innerText = "Celková cena: " + (price.value * count.value).toString();
        texedFullPriceElement.innerText = "Celková cena s DPH: " + ((price.value * count.value) * 1.21).toString();

        /*Určení ceny dolaru*/
        let apiStringArray = apiString.split("\n");
        let dolarValueArray;
        for (let i = 0; i < apiStringArray.length; i++) {
            if (apiStringArray[i].substr(0, 3) === "USA")
                dolarValueArray = apiStringArray[i].split('|');
        }
        dolarElement.innerText = "Platba v dolarech: " + (((price.value * count.value) * 1.21) / parseFloat(dolarValueArray[4])).toString();

        /*Vypsání rekapitulace*/
        let formElement = document.getElementById("mainForm");
        document.body.removeChild(formElement);

        document.body.appendChild(nadpisElement);
        document.body.appendChild(nameElement);
        document.body.appendChild(productElement);
        document.body.appendChild(priceElement);
        document.body.appendChild(countElement);
        document.body.appendChild(fullPriceElement);
        document.body.appendChild(texedFullPriceElement);
        document.body.appendChild(dolarElement);
    }

}