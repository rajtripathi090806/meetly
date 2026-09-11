
function startMeeting() {
    openParticipantsPanel((panel) => {
        setMeetingDetails(); // meeting-details.js
        notify("Attendance Tracking : STARTED", "info");
        trackAttendance(panel); // attendance.js
    });
}

function endMeeting() {
    disconnectAllObservers(); // main.js
    notify("Attendance Tracking : ENDED", "info");
    recordMeetingEndTime(); // meeting-details.js
    exportAttendance(); // exporter.js
}

// ==========================================================================================

function openParticipantsPanel(callback) {

    clickParticipantsBtn();

    const observer = observeDOM(() => {
        const panel = document.querySelector('[aria-label="Participants"]');
        if (panel) { observer.disconnect(); callback(panel); }
    });
}

function clickParticipantsBtn() {
    const observer = observeDOM(() => {
        const btn = [...document.querySelectorAll('[role="button"]')].find(element => element.textContent.includes("People"));
        if (btn) { observer.disconnect(); btn.click(); }
    });
}
