const SCRIPT_URL = "YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL";

function login() {
    const id = document.getElementById("coordinator-id").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", id, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById("login-section").style.display = "none";
            document.getElementById("scan-section").style.display = "block";
            document.getElementById("coordinator-name").textContent = data.name;
            localStorage.setItem("coordinatorID", id);
        } else {
            alert("Invalid ID or Password");
        }
    })
    .catch(err => console.error(err));
}

function logScan() {
    const batchID = document.getElementById("batch-id").value.trim();
    const coordinatorID = localStorage.getItem("coordinatorID");

    if (!batchID) return alert("Enter Batch ID");

    fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logScan", coordinatorID, batchID })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById("result").textContent = `Scan logged for Batch: ${batchID}`;
            document.getElementById("batch-id").value = "";
        } else {
            document.getElementById("result").textContent = "Error logging scan!";
        }
    })
    .catch(err => console.error(err));
}
