
let meetingDetails = {
    title: null,
    description: null,
    host: null,
    date: null,
    day: null,
    startTime: null,
    endTime: null,
    duration: null,
    startTimestamp: null,
    endTimestamp: null
};

function setMeetingDetails() {

    meetingDetails.title = prompt("Enter Meeting Title");
    const meetingStartTimestamp = new Date();

    meetingDetails.date = formatDate(meetingStartTimestamp);
    meetingDetails.day = meetingStartTimestamp.toLocaleDateString("en-IN", { weekday: "long" });
    meetingDetails.startTime = formatTime(meetingStartTimestamp);
    meetingDetails.startTimestamp = meetingStartTimestamp;
}

function recordMeetingEndTime() {

    const meetingEndTimestamp = new Date();

    meetingDetails.endTime = formatTime(meetingEndTimestamp);
    meetingDetails.endTimestamp = meetingEndTimestamp;
    meetingDetails.duration = formatDuration(meetingDetails.endTimestamp - meetingDetails.startTimestamp);

    for (const id in attendance) {
        const participant = attendance[id];
        const lastSession = participant.sessions[participant.sessions.length - 1];
        if (lastSession.leave == null) { lastSession.leave = meetingEndTimestamp; }
    }
}
