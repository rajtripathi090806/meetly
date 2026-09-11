
function exportAttendance() {

    // collecting attendance data
    const attendanceSummary = collectAttendanceSummary();
    const sessionHistory = collectSessionHistory();
    const meetingData = collectMeetingData();

    // creating sheets from the collected data
    const summarySheet = XLSX.utils.aoa_to_sheet(attendanceSummary);
    const sessionSheet = XLSX.utils.aoa_to_sheet(sessionHistory);
    const meetingDetailsSheet = XLSX.utils.aoa_to_sheet(meetingData);

    // formatting the sheets
    applyCommonFormatting(summarySheet);
    applyCommonFormatting(sessionSheet);
    applyCommonFormatting(meetingDetailsSheet);
    formatSummarySheet(summarySheet);
    formatSessionSheet(sessionSheet);
    formatDetailsSheet(meetingDetailsSheet);

    // appending sheets to a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Attendance Summary");
    XLSX.utils.book_append_sheet(workbook, sessionSheet, "Attendance History");
    XLSX.utils.book_append_sheet(workbook, meetingDetailsSheet, "Meeting Details");

    // downloading the workbook
    const meetingTitle = meetingDetails.title;
    const meetingDate = formatDate(meetingDetails.startTimestamp);
    XLSX.writeFile(workbook, meetingTitle + " - " + meetingDate + " - " + "Attendance" + ".xlsx");
}

// ==========================================================================================

function collectAttendanceSummary() {

    const attendanceSummary = [];

    attendanceSummary.push([
        "S.No.",
        "Name",
        "Total Duration",
        "First Join",
        "Rejoin(s)",
        "",
        "Profile Photo URL / Unique Id",
    ]);

    let sn = 1;

    for (const id in attendance) {
        
        const participant = attendance[id];
        const totalDuration = formatDuration(calculateDuration(participant));

        attendanceSummary.push([
            sn++,
            participant.name + (participant.isCurrUser ? " (You)" : ""),
            totalDuration,
            formatTime(participant.firstJoin),
            participant.rejoins,
            "",
            id
        ]);
    }

    return attendanceSummary;
}



function collectSessionHistory() {

    const sessionHistory = [];

    sessionHistory.push([
        "S.No.",
        "Name",
        "Join Time",
        "Leave Time",
        "Session Duration",
        "",
        "Profile Photo URL / Unique Id",
    ]);

    let sn = 1;

    for (const id in attendance) {

        const participant = attendance[id];

        for (const session of participant.sessions) {

            const sessionDuration = formatDuration(session.leave - session.join);

            sessionHistory.push([
                sn++,
                participant.name + (participant.isCurrUser ? " (You)" : ""),
                formatTime(session.join),
                formatTime(session.leave),
                sessionDuration,
                "",
                id
            ]);
        }
    }

    return sessionHistory;
}



function collectMeetingData() {
    
    const meetingData = [];

    meetingData.push([
        "Title",
        "Description",
        "Host",
        "Date",
        "Day",
        "Start Time",
        "End Time",
        "Duration"
    ]);

    meetingData.push(Object.values(meetingDetails).slice(0, 8));
    return meetingData;
}
