$(document).ready(function () {
    // scroll to the top of the window to see error message
    let scrollToBottom = function (element = null) {
        element.scrollTop(1E10);
    }

    // scroll to the bottom of the chat for the most recent chat
    scrollToBottom($("#chatHistory"));

    // Setup socket-io main connection
    const socket = io('http://localhost:3001');

    // handle connection event
    socket.on('connect', () => {
        console.log("Connection established");
    });

    // handle chat messages
    socket.on('chat-' + $("input[name='message']").attr("data-channel"), function (data) {
        // add the message received to chat history
        addMessageReceived(data);

        // scroll to the bottom of the chat for the most recent chat
        scrollToBottom($("#chatHistory"));
    });

    // handle typing signals
    socket.on('typing-' + $("input[name='message']").attr("data-channel"), function (data) {
        setTypingMessage(data);
    });

    // add message received to chat history
    let addMessageSent = (data) => {
        const previousChats = $("#chatHistory").html();
        const msgElement = `
        <li class="clearfix">
            <div class="status message-data text-right">
                <span class="time">${new Date(data.timestamp)}</span>
                <span class="name">You</span>
            </div>
            <div class="message other-message float-right">${data.message}</div>
        </li>
        `;
        $("#chatHistory").html(previousChats + msgElement);
    }

    // message sent to chat history
    let addMessageReceived = (data) => {
        const previousChats = $("#chatHistory").html();
        const msgElement = `
        <li>
            <div class="status message-data">
                <span class="name">${data.senderName}</span>
                <span class="time">${new Date(data.timestamp)}</span>
            </div>
            <div class="message my-message">
                <p>${data.message}</p>
            </div>
        </li>
        `;
        $("#chatHistory").html(previousChats + msgElement);
    }

    // set typing message
    let setTypingMessage = (data) => {
        $("#typingNotice").text(data.senderName + " is typing...");
        // clear the message after 3 seconds
        setTimeout(() => {
            $("#typingNotice").text("");
        }, 3000);
    }

    var typingCounter = 0;
    // add event to message field
    $("input[name='message']").on("keypress keyup", function (e) {
        // handle event only if the enter key is pressed
        if (e.which == 13) {
            // get the message
            const message = $(this).val().trim();

            // send the message if it's not an empty string
            if (message.length > 0) {
                // compose the data to be sent
                const data = {
                    senderName: $(this).attr("data-username"),
                    timestamp: Date.now(),
                    message: message,
                    channelID: $(this).attr("data-channel")
                };

                // send message
                socket.emit('chat', data);

                // add the message to the sender's chat history
                addMessageSent(data);

                // clear text field
                $(this).val("");

                // scroll to the bottom of the chat for the most recent chat
                scrollToBottom($("#chatHistory"));
            }
        } else {
            // increment typing counter
            typingCounter += 1;

            // send typing signal if 3 or more character have been typed
            if (typingCounter >= 3 && $(this).val().trim().length >= 3) {
                // compose the data to be sent
                const data = {
                    senderName: $(this).attr("data-username"),
                    channelID: $(this).attr("data-channel")
                };

                // send message
                socket.emit('typing', data);

                // reset typing counter
                typingCounter = 0;
            }
        }
    });
});