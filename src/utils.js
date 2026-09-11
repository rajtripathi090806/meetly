
function calculateDuration(participant) {
    let totalMilliseconds = 0;
    participant.sessions.forEach(session => { totalMilliseconds += session.leave - session.join; });
    return totalMilliseconds;
}

function formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

function formatTime(timestamp) {
    if (timestamp == null) { console.log("Null Timestamp Received."); return "NaN"; }
    return timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
}

function formatDate(timestamp) {
    if (timestamp == null) { console.log("Null Timestamp Received."); return "NaN"; }
    return timestamp.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric"}).replace(/\//g, "-");
}

// ==========================================================================================

function applyCommonFormatting(sheet) {
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    sheet["!cols"] = [];
    for (let col = range.s.c; col <= range.e.c; col++) { sheet["!cols"][col] = { wch: 10 }; } // setting a default width for data columns
}

function formatSummarySheet(summarySheet) {
    summarySheet["!cols"][0] = { wch: 5 };  // S.No.
    summarySheet["!cols"][1] = { wch: 25 }; // Name
    summarySheet["!cols"][2] = { wch: 15 }; // Total Duration
    summarySheet["!cols"][3] = { wch: 12 }; // First Join
    summarySheet["!cols"][4] = { wch: 8 };  // Rejoin(s)
    summarySheet["!cols"][6] = { wch: 27 }; // Profile Photo URL / Unique Id
}

function formatSessionSheet(sessionSheet) {
    sessionSheet["!cols"][0] = { wch: 5 };  // S.No.
    sessionSheet["!cols"][1] = { wch: 25 }; // Name
    sessionSheet["!cols"][2] = { wch: 12 }; // Join Time
    sessionSheet["!cols"][3] = { wch: 12 }; // Leave Time
    sessionSheet["!cols"][4] = { wch: 15 }; // Session Duration
    sessionSheet["!cols"][6] = { wch: 27 }; // Profile Photo URL / Unique Id
}

function formatDetailsSheet(meetingDetailsSheet) {
    meetingDetailsSheet["!cols"][0] = { wch: 18 };  // Title
    meetingDetailsSheet["!cols"][1] = { wch: 25 }; // Description
    meetingDetailsSheet["!cols"][2] = { wch: 25 }; // Host
    meetingDetailsSheet["!cols"][3] = { wch: 12 }; // Date
    meetingDetailsSheet["!cols"][4] = { wch: 12 }; // Day
    meetingDetailsSheet["!cols"][5] = { wch: 12 }; // Start Time
    meetingDetailsSheet["!cols"][6] = { wch: 12 }; // End Time
    meetingDetailsSheet["!cols"][7] = { wch: 10 }; // Duration

}
