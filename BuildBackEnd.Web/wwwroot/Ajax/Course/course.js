$(document).ready(function () {
    loadCourses();
    loadDropdowns();

    // Load Courses
    function loadCourses() {
        $.ajax({
            type: "POST",
            url: "/Course/GetCourses",
            success: function (response) {
                console.log(response)
                let tableBody = $("#courseTable tbody");
                tableBody.empty();
                if (response && response.length > 0) {
                    response.forEach(course => {
                        tableBody.append(`
                            <tr>
                                <td>${course.id}</td>
                                <td>${course.name}</td>
                                <td>${course.description}</td>
                                //<td>${course.category.name}</td>
                                //<td>${course.instructor.name}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm btn-update"
                                        data-id="${course.id}"
                                        data-name="${course.name}"
                                        data-description="${course.description}"
                                        data-category="${course.categoryId}"
                                        data-instructor="${course.instructorId}"
                                        data-orderno="${course.orderNo}">Update</button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${course.id}">Delete</button>
                                </td>
                            </tr>
                        `);
                    });
                }
            },
            error: function () {
                alert("Failed to load courses.");
            }
        });
    }

    // Load Dropdowns
    function loadDropdowns() {
        $.ajax({
            type: "POST",
            url: "/Category/GetCategories", // Update with the actual endpoint for categories
            success: function (categories) {
                let categorySelects = $("#AddCourseCategory, #UpdateCourseCategory");
                categorySelects.empty();
                categories.forEach(category => {
                    categorySelects.append(`<option value="${category.id}">${category.name}</option>`);
                });
            }
        });

        $.ajax({
            type: "POST",
            url: "/Instructor/GetInstructors", // Update with the actual endpoint for instructors
            success: function (instructors) {
                let instructorSelects = $("#AddCourseInstructor, #UpdateCourseInstructor");
                instructorSelects.empty();
                instructors.forEach(instructor => {
                    instructorSelects.append(`<option value="${instructor.id}">${instructor.name}</option>`);
                });
            }
        });
    }

    // Add Course
    $("#AddCourseForm").submit(function (e) {
        e.preventDefault();
        let course = {
            Name: $("#AddCourseName").val(),
            Description: $("#AddCourseDescription").val(),
            CategoryId: $("#AddCourseCategory").val(),
            InstructorId: $("#AddCourseInstructor").val(),
            OrderNo: $("#AddCourseOrderNo").val()
        };

        $.ajax({
            type: "POST",
            url: "/Course/CreateJson",
            data: course,
            success: function (response) {
                if (response.success) {
                    alert("Course added successfully!");
                    $("#AddCourseModal").modal("hide");
                    loadCourses();
                } else {
                    alert("Error adding course: " + response.errors);
                }
            }
        });
    });

    // Update Course
    $(document).on("click", ".btn-update", function () {
        let id = $(this).data("id");
        $("#UpdateCourseId").val(id);
        $("#UpdateCourseName").val($(this).data("name"));
        $("#UpdateCourseDescription").val($(this).data("description"));
        $("#UpdateCourseCategory").val($(this).data("category"));
        $("#UpdateCourseInstructor").val($(this).data("instructor"));
        $("#UpdateCourseOrderNo").val($(this).data("orderno"));
        $("#UpdateCourseModal").modal("show");
    });

    $("#UpdateCourseForm").submit(function (e) {
        e.preventDefault();
        let course = {
            Id: $("#UpdateCourseId").val(),
            Name: $("#UpdateCourseName").val(),
            Description: $("#UpdateCourseDescription").val(),
            CategoryId: $("#UpdateCourseCategory").val(),
            InstructorId: $("#UpdateCourseInstructor").val(),
            OrderNo: $("#UpdateCourseOrderNo").val()
        };

        $.ajax({
            type: "POST",
            url: "/Course/UpdateJson",
            data: course,
            success: function (response) {
                if (response.success) {
                    alert("Course updated successfully!");
                    $("#UpdateCourseModal").modal("hide");
                    loadCourses();
                } else {
                    alert("Error updating course: " + response.errors);
                }
            }
        });
    });

    // Delete Course
    $(document).on("click", ".btn-delete", function () {
        if (confirm("Are you sure you want to delete this course?")) {
            let id = $(this).data("id");
            $.ajax({
                type: "POST",
                url: "/Course/RemoveJson",
                data: { id: id },
                success: function (response) {
                    if (response.success) {
                        alert("Course deleted successfully!");
                        loadCourses();
                    } else {
                        alert("Error deleting course: " + response.errors);
                    }
                }
            });
        }
    });
});
