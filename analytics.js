 // Add click event listener to document
 document.addEventListener("click", function (event) {
    var clickedElement = event.target;
    console.log("Clicked element:", clickedElement);

    // Example of tracking specific elements by class
    // if (clickedElement.classList.contains('track-me')) {
    //     // Send click data to the central server
    // }
    getCurrentIpAddress();
});

// Function to fetch the current IP address and location
function getCurrentIpAddress() {
    fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            const ipAddress = data.ip;
            const message = { url: window.location.href, ip: ipAddress };
            fetch("https://golittle.ngrok.app/analytics/proxy/" + ipAddress, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Received Data:", data);
                    data.fullscreen = !!document.fullscreenElement;
                    data.action = window.location.hostname;
                    sendDataToServer(data);
                    
                    console.log("Phone Number", phoneNumber);

                    if (data.phone) {
                        phoneNumber = data.phone
                    }

                    console.log("Phone Number", phoneNumber);

                    console.log("Data:", data);
                }).then(data => {
                    // const date = new Date();
                    // document.getElementById("ip_add").textContent = "IP: " + data.ip + " " + date.toLocaleString("en-US");
                    // document.getElementById("city").textContent = "Location: " + data.city + ", " + data.country;
                    // document.getElementById("isp").textContent = "ISP: " + data.org;
                })
                .catch(error => {
                    console.log("Error fetching location and ISP:", error);
                    if (document.getElementById("city")) {
                        document.getElementById("city").innerHTML = "Location: Unavailable";
                    }
                    if (document.getElementById('isp')) {
                        document.getElementById("isp").innerHTML = "ISP: Unavailable";
                    }
                });
        })
        .catch(error => {
            console.error("Error fetching IP address:", error);
            document.getElementById("ip_add").innerHTML = "Address IP: Unavailable";
        });
}

// Function to send click data to the central server
function sendDataToServer(data) {
    console.log("Fetch API Called", data);
    fetch("https://golittle.ngrok.app/analytics/trackclicks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                console.error("Failed to send click data to server");
            }
        })
        .catch(error => {
            console.error("Error sending click data:", error);
        });
}

// Call the function to get the current IP address on script load
getCurrentIpAddress();
