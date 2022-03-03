$(document).ready(function () {
    // scroll to the top of the window to see error message
    let scrollToBottom = function (element = null) {
        element.scrollTop(1E10);
    }

    // Setup socket-io main connection
    const socket = io('http://localhost:3001');

    // handle connection event
    socket.on('connect', () => {
        console.log("Connection established");
    });

    // handle chat messages
    socket.on('chat message', function (data) {
        addMessageReceived(data);
    });

    // add message received to chat history
    let addMessageReceived = (data) => {
        const previousChats = $("#chatHistory").html();
        const msgElement = `
        <li class="clearfix">
            <div class="status online message-data text-right">
                <span class="time">${data.timestamp}</span>
                <span class="name">${data.senderName}</span>
            </div>
            <div class="message other-message float-right">${data.message}</div>
        </li>
        `;
        $("#chatHistory").html(previousChats + msgElement);
    }

    // message sent to chat history
    let addMessageSent = (data) => {
        const previousChats = $("#chatHistory").html();
        const msgElement = `
        <li>
            <div class="status message-data">
                <span class="name">${data.senderName}</span>
                <span class="time">${data.timestamp}</span>
            </div>
            <div class="message my-message">
                <p>${data.message}</p>
            </div>
        </li>
        `;
        $("#chatHistory").html(previousChats + msgElement);
    }

    // add event to message field
    $("input[name='message']").on("keypress", function (e) {
        // handle event only if the enter key is pressed
        if (e.which == 13) {
            // get the message
            const message = $(this).val().trim();

            // send the message if it's not an empty string
            if (message.length > 0) {
                // compose the data to be sent
                const data = {
                    senderName: $(this).attr("data-username"),
                    timestamp: new Date(),
                    message: message,
                    channelID: $(this).attr("data-channel")
                };

                // send message
                socket.emit('chat message', data);

                // add the message to the sender's chat history
                addMessageSent(data);

                // clear text field
                $(this).val("");

                // scroll to the bottom of the chat for the most recent chat
                scrollToBottom($("#chatHistory"));
            }
        }
    });
});