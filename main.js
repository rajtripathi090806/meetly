
console.log("Meetly - Google Meet Attendance Exporter ... Loaded (as extension)");

// ==========================================================================================

const activeObservers = [];

function observeDOM(callback) {
    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });
    activeObservers.push(observer);
    return observer;
}

function disconnectAllObservers() {
    activeObservers.forEach(observer => { observer.disconnect(); });
    activeObservers.length = 0;
}

// ==========================================================================================

startMeeting(); // meeting-lifecycle.js

// observing the DOM and checking if the host has clicked the 'Leave call' button to end the meeting and export attendance data

observeDOM(() => {
    const leaveBtn = document.querySelector('[aria-label="Leave call"]');
    if (!leaveBtn || leaveBtn.dataset.listenerAttached) return;
    leaveBtn.dataset.listenerAttached = "true";
    leaveBtn.addEventListener("click", () => { endMeeting(); }); // meeting-lifecycle.js
});

// ==========================================================================================

const notyf = new Notyf({

    position: { x: "right", y: "top" },
    duration: 7000,
    dismissible: true,
    ripple: true,

    types: [
        { type: "success", background: "#198754", icon: false },
        { type: "error", background: "#dc3545", icon: false },
        { type: "info", background: "#0d6efd", icon: false },
    ]
});

function notify(msg, msgType) {

    console.log(msg);

    // checking if the notification switch is enabled or not

    chrome.storage.local.get(

        { notificationEnabled: true },
        
        (result) => {
            if (!result.notificationEnabled) { return; }
            notyf.open({ type: msgType, message: msg });
        }
    );
}
