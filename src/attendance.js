
let attendance = {};
let prevParticipants = [];

// ==========================================================================================

function trackAttendance(panel) {

    // we are using difference algorithm (compareParticipants) to track participants join / leave events

    prevParticipants = getParticipantsList(panel);
    prevParticipants[0].isCurrUser = true;
    prevParticipants.forEach(participant => recordJoinEntry(participant)); // initial entry for all the participants present at the start of the meeting

    observeDOM(() => {
        const currParticipants = getParticipantsList(panel);
        compareParticipants(prevParticipants, currParticipants);
        prevParticipants = currParticipants;
    });
}

// ==========================================================================================

function getParticipantsList(panel) {

    // this function will return UNIQUE participants list
    // i.e., checks if the participant is NOT already joined with another device

    const participantsTable = panel.querySelectorAll('[role="listitem"]');
    const participantsList = [];

    participantsTable.forEach(row => {

        const id = row.querySelector("img").getAttribute("src"); // profile image src is the id because it is unique
        const name = row.getAttribute("aria-label");

        // checking if the participant is NOT already joined with another device
        if (!participantsList.some(participant => participant.id == id)) {
            participantsList.push({ id: id, name: name.trim(), isCurrUser: false });
        }
    });

    return participantsList; // format of participantsList is as follows

    /*
        [
            {
                id: "<_photo_link_>",
                name: "<_participant_name_>",
                isCurrUser: false
            },
            {
                id: "<_photo_link_>",
                name: "<_participant_name_>",
                isCurrUser: false
            }
        ]
    */
}

function compareParticipants(oldList, newList) {

    const oldIds = oldList.map(participant => participant.id);
    const newIds = newList.map(participant => participant.id);

    // participants who joined
    newIds.forEach(id => {
        if (!oldIds.includes(id)) {
            const newParticipant = newList.find(participant => participant.id == id);
            recordJoinEntry(newParticipant);
        }
    });

    // participants who left
    oldIds.forEach(id => {
        if (!newIds.includes(id)) {
            const oldParticipant = oldList.find(participant => participant.id == id);
            recordLeaveEntry(oldParticipant);
        }
    });
}

// ==========================================================================================

function recordJoinEntry(participant) {

    const id = participant.id;
    const name = participant.name;
    const isCurrUser = participant.isCurrUser;
    const joinTime = new Date();

    if (!attendance[id]) { attendance[id] = { name: name, isCurrUser: isCurrUser, firstJoin: joinTime, rejoins: 0, sessions: [] }; }
    else { attendance[id].rejoins++; }
    
    attendance[id].sessions.push({ join: joinTime, leave: null });

    notify(
        "JOINED : " + name + (isCurrUser ? " (You)" : "") +
        "\nRejoin(s) : " + attendance[id].rejoins,
        "success"
    );
}

function recordLeaveEntry(participant) {

    const id = participant.id;
    const name = participant.name;
    const isCurrUser = participant.isCurrUser;
    const leaveTime = new Date();

    // updating the leave time for the lastSession of the participant
    const lastSession = attendance[id].sessions[attendance[id].sessions.length - 1];
    lastSession.leave = leaveTime;

    notify(
        "LEFT : " + name + (isCurrUser ? " (You)" : "") +
        "\nSession Duration : " + formatDuration(lastSession.leave - lastSession.join) +
        "\nTotal Duration : " + formatDuration(calculateDuration(attendance[id])),
        "error"
    );
}
