$(document).ready(function () {
    loadInstructors();

    // Load Instructors
    function loadInstructors() {
        $.ajax({
            type: "POST",
            url: "/Instructor/GetInstructors",
            success: function (response) {
                let tableBody = $("#instructorTable tbody");
                tableBody.empty();
                if (response && response.length > 0) {
                    response.forEach(instructor => {
                        tableBody.append(`
                            <tr>
                                <td>${instructor.id}</td>
                                <td>${instructor.name}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm btn-update"
                                        data-id="${instructor.id}"
                                        data-name="${instructor.name}"
                                        data-email="${instructor.email}">Update</button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${instructor.id}">Delete</button>
                                </td>
                            </tr>
                        `);
                    });
                }
            },
            error: function () {
                alert("Failed to load instructors.");
            }
        });
    }

    // Add Instructor
    $("#AddInstructorForm").submit(function (e) {
        e.preventDefault();
        let instructor = {
            Name: $("#AddInstructorName").val(),
            Email: $("#AddInstructorEmail").val()
        };

        $.ajax({
            type: "POST",
            url: "/Instructor/CreateJson",
            data: instructor,
            success: function (response) {
                if (response.success) {
                    alert("Instructor added successfully!");
                    $("#AddInstructorModal").modal("hide");
                    loadInstructors();
                } else {
                    alert("Error adding instructor: " + response.errors);
                }
            }
        });
    });

    // Update Instructor
    $(document).on("click", ".btn-update", function () {
        let id = $(this).data("id");
        $("#UpdateInstructorId").val(id);
        $("#UpdateInstructorName").val($(this).data("name"));
        $("#UpdateInstructorModal").modal("show");
    });

    $("#UpdateInstructorForm").submit(function (e) {
        e.preventDefault();
        let instructor = {
            Id: $("#UpdateInstructorId").val(),
            Name: $("#UpdateInstructorName").val(),
        };

        $.ajax({
            type: "POST",
            url: "/Instructor/UpdateJson",
            data: instructor,
            success: function (response) {
                if (response.success) {
                    alert("Instructor updated successfully!");
                    $("#UpdateInstructorModal").modal("hide");
                    loadInstructors();
                } else {
                    alert("Error updating instructor: " + response.errors);
                }
            }
        });
    });

    // Delete Instructor
    $(document).on("click", ".btn-delete", function () {
        if (confirm("Are you sure you want to delete this instructor?")) {
            let id = $(this).data("id");
            $.ajax({
                type: "POST",
                url: "/Instructor/RemoveJson",
                data: { id: id },
                success: function (response) {
                    if (response.success) {
                        alert("Instructor deleted successfully!");
                        loadInstructors();
                    } else {
                        alert("Error deleting instructor: " + response.errors);
                    }
                }
            });
        }
    });
});
