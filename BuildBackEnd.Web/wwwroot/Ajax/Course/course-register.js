$(document).ready(function () {
    $(".course-register").click(function () {
        var courseId = $(this).data("id");
        $.ajax({
            url: "/Home/UserRegisterToCourse",
            type: "POST",
            data: { courseId: courseId },
            success: function (response) {
                alert(response.message);
                window.location.reload();
            }
        });
    });
});
