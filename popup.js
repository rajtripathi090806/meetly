
const notificationSwitch = document.getElementById("notificationSwitch");

// loading saved notification preference
chrome.storage.local.get(
    { notificationEnabled: true },
    (result) => { notificationSwitch.checked = result.notificationEnabled; }
);

// saving preference when switch changes
notificationSwitch.addEventListener("change", () => {
    chrome.storage.local.set({ notificationEnabled: notificationSwitch.checked });
});
