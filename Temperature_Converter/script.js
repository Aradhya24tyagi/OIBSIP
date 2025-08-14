
        function convertTemp() {
            let temp = parseFloat(document.getElementById("tempInput").value);
            let unit = document.getElementById("unit").value;
            let result = document.getElementById("result");

            if (isNaN(temp)) {
                result.textContent = "Please enter a valid number.";
                return;
            }

            let converted = "";
            if (unit === "C") {
                converted = `${(temp * 9 / 5 + 32).toFixed(2)} °F | ${(temp + 273.15).toFixed(2)} K`;
            } else if (unit === "F") {
                converted = `${((temp - 32) * 5 / 9).toFixed(2)} °C | ${(((temp - 32) * 5 / 9) + 273.15).toFixed(2)} K`;
            } else if (unit === "K") {
                converted = `${(temp - 273.15).toFixed(2)} °C | ${((temp - 273.15) * 9 / 5 + 32).toFixed(2)} °F`;
            }

            result.textContent = converted;
        }