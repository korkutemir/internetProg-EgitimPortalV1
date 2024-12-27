$(document).ready(function () {
    $(".loading-overlay").css({"visibility": "hidden", "opacity": "0"});



    $(".toggle-password").click(function () {
        $(this).children("i").toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

});




$("#signInForm").submit(function (e) {
    e.preventDefault();

    var formData = $("#signInForm").serialize();
    $.ajax({
        type: "POST",
        url: "/Member/SignIn",
        data: formData,
        dataType: "json",
        success: function (response) {
            if (!response.success) {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }


            if (response.success) {
                iziToast.success({ timeout: 1500, icon: 'fas fa-check', title: 'You are being redirected...', message: response.message });
                setTimeout(function () {
                     window.location = response.data;
                }, 1500);
            }

        }
    });

});
