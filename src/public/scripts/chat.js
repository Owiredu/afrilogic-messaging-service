$(document).ready(function () {
    // scroll to the top of the window to see error message
    let scrollToBottom = function (element = null) {
        element.scrollTop(1E10);
    }

    // scroll to the bottom of the chat for the most recent chat
    scrollToBottom($("#chatHistory"));

    // Setup socket-io main connection
    const socket = io(location.hostname);

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



    // CHANNEL RELATED OPERATIONS


    // show success and error messages
    let showMsg = function (form, type, msg) {
        let alert = $(`
        <div class="alert alert-${type} fade show" role="alert">
            <div class="container">
                <div class="alert-icon">
                    <i class="zmdi zmdi-${type == "success" ? "thumb-up" : "block"}"></i>
                </div>
                <span name="msg"></span>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true"><i class="zmdi zmdi-close"></i></span>
                </button>
            </div>
        </div>
        `);

        form.find('.alert').remove();
        alert.prependTo(form);
        alert.find('span[name="msg"]').html(msg);
    }

    // get the add channel form div
    var addChannelFormDiv = $("form[name='addChannelForm']");

    // add channel button click event
    $("button[name='addChannelSubmitButton']").on("click", function (event) {
        event.preventDefault();

        // validate the form data
        let valid = $("form[name='addChannelForm']").validate({
            rules: {
                'channelName': {
                    required: true,
                    minlength: 3,
                    pattern: /^.{1,50}$/
                }
            },
            highlight: function (input) {
                $(input).parents('.form-line').addClass('error');
            },
            unhighlight: function (input) {
                $(input).parents('.form-line').removeClass('error');
            },
            errorPlacement: function (error, element) {
                $(element).parents('.form-group').append(error);
            }
        }).form();

        if (!valid) return;

        // start spinner
        $("button[name='addChannelSubmitButton']").html(`SUBMITTING <span class="spinner-border spinner-border-sm"></span>`);

        // get add channel form
        var addChannelForm = $("form[name='addChannelForm']")[0];

        // disable form clicks and keypress events
        $("input[name='channelName']").attr("disabled", "disabled");
        $("button[name='addChannelSubmitButton']").attr("disabled", "disabled");

        // handle request
        $.ajax({
            type: "POST",

            url: "/chat/add-channel",

            enctype: "application/x-www-form-urlencoded",

            data: {
                name: $("input[name='channelName']").val().trim()
            },

            success: function (result, status, xhr) {
                // stop spinner
                $("button[name='addChannelSubmitButton']").html("SUBMIT");

                // show success message
                showMsg(addChannelFormDiv, "success", xhr.responseJSON.message);

                // enable form clicks and keypress events
                $("input[name='channelName']").removeAttr("disabled");
                $("button[name='addChannelSubmitButton']").removeAttr("disabled");

                // reset the form
                addChannelForm.reset();

                // remove success message after 5 seconds
                setTimeout(() => {
                    addChannelFormDiv.find('.alert').remove();
                }, 5000);
            },

            error: function (xhr, status, error) {
                // stop spinner
                $("button[name='addChannelSubmitButton']").html("SUBMIT");

                // enable form clicks and keypress events
                $("input[name='channelName']").removeAttr("disabled");
                $("button[name='addChannelSubmitButton']").removeAttr("disabled");

                // show error message
                showMsg(addChannelFormDiv, "danger", xhr.responseJSON.message);
            }
        });

    });
});