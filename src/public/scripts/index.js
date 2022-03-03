$(document).ready(function () {

    // get the form div
    var joinChannelFormDiv = $("form[name='joinChannelForm']");

    // show success and error messages
    var showMsg = function (form, type, msg) {
        var alert = $(`
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

    // scroll to the top of the window to see error message
    var scrollToTop = function (component = null) {
        if (component) {
            component.scrollTop(0);
        }

        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    // hide and show 
    $("input[name='existingUser']").on("change", function(e) {
        if ($(this).prop("checked")) {
            $(".newUsersOnly").hide();
        } else {
            $(".newUsersOnly").show();
        }
    });

    // join channel button click event
    $("button[name='joinChannelBtn']").on("click", function (event) {
        event.preventDefault();

        // validate the form data
        let valid = $("form[name='joinChannelForm']").validate({
            rules: {
                'username': {
                    required: true,
                    minlength: 3,
                    pattern: /^.{1,50}$/
                },
                'fullname': {
                    required: false,
                    minlength: 3,
                    pattern: /^.{1,50}$/
                },
                'channel': {
                    required: true
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
        $("button[name='joinChannelBtn']").html(`JOINING CHANNEL <span class="spinner-border spinner-border-sm"></span>`);

        // disable form clicks and keypress events
        $("input[name='username']").attr("disabled", "disabled");
        $("input[name='fullname']").attr("disabled", "disabled");
        $("select[name='channel']").attr("disabled", "disabled");
        $("button[name='joinChannelBtn']").attr("disabled", "disabled");

        // handle request
        $.ajax({
            type: "POST",

            url: "/join",

            enctype: "application/x-www-form-urlencoded",

            data: {
                username: $("input[name='username']").val().trim(),
                fullname: $("input[name='fullname']").val().trim(),
                channel: $("select[name='channel']").val().trim(),
                existingUser: $("input[name='existingUser']").prop("checked"),
            },

            success: function (result, status, xhr) {
                // stop spinner
                $("button[name='joinChannelBtn']").html("JOIN CHANNEL");

                // enable form clicks and keypress events
                $("input[name='username']").removeAttr("disabled");
                $("input[name='fullname']").removeAttr("disabled");
                $("select[name='channel']").removeAttr("disabled");
                $("button[name='joinChannelBtn']").removeAttr("disabled");

                // reset the form
                joinChannelForm.reset();

                // scroll to the top of the window to see error message
                scrollToTop();

                // show success message
                showMsg(joinChannelFormDiv, "success", xhr.responseJSON.message);

                // reload page
                setTimeout(() => {
                    location.href = '/chat';
                }, 2000);
            },

            error: function (xhr, status, error) {
                // stop spinner
                $("button[name='joinChannelBtn']").html("JOIN CHANNEL");

                // enable form clicks and keypress events
                $("input[name='username']").removeAttr("disabled");
                $("input[name='fullname']").removeAttr("disabled");
                $("select[name='channel']").removeAttr("disabled");
                $("button[name='joinChannelBtn']").removeAttr("disabled");

                // show error message
                showMsg(joinChannelFormDiv, "danger", xhr.responseJSON.message);

                // scroll to the top of the window to see error message
                scrollToTop();
            }
        });

    });
});