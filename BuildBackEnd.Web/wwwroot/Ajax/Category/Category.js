$(document).ready(function () {
    // Load categories on page load
    loadCategories();

    function loadCategories() {
        $.ajax({
            type: "POST",
            url: "/Category/GetCategories", // Adjust based on your controller
            success: function (response) {
                let tableBody = $("#categoryTable tbody");
                tableBody.empty();
                if (response && response.length > 0) {
                    response.forEach(category => {
                        tableBody.append(`
                            <tr>
                                <td>${category.id}</td>
                                <td>${category.name}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm btn-update" data-id="${category.id}" data-name="${category.name}">Update</button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${category.id}">Delete</button>
                                </td>
                            </tr>
                        `);
                    });
                }
            },
            error: function () {
                alert("Failed to load categories.");
            }
        });
    }

    // Add Category
    $("#AddForm").submit(function (e) {
        e.preventDefault();
        let name = $("#AddCategoryName").val();
        $.ajax({
            type: "POST",
            url: "/Category/CreateJson",
            data: { Name: name },
            success: function (response) {
                if (response.success) {
                    alert("Category added successfully!");
                    $("#AddModal").modal("hide");
                    loadCategories();
                } else {
                    alert("Error adding category: " + response.errors);
                }
            }
        });
    });

    // Update Category
    $(document).on("click", ".btn-update", function () {
        let id = $(this).data("id");
        let name = $(this).data("name");
        $("#UpdateCategoryId").val(id);
        $("#UpdateCategoryName").val(name);
        $("#UpdateModal").modal("show");
    });

    $("#UpdateForm").submit(function (e) {
        e.preventDefault();
        let id = $("#UpdateCategoryId").val();
        let name = $("#UpdateCategoryName").val();
        $.ajax({
            type: "POST",
            url: "/Category/UpdateJson",
            data: { Id: id, Name: name },
            success: function (response) {
                if (response.success) {
                    alert("Category updated successfully!");
                    $("#UpdateModal").modal("hide");
                    loadCategories();
                } else {
                    alert("Error updating category: " + response.errors);
                }
            }
        });
    });

    // Delete Category
    $(document).on("click", ".btn-delete", function () {
        if (confirm("Are you sure you want to delete this category?")) {
            let id = $(this).data("id");
            $.ajax({
                type: "POST",
                url: "/Category/RemoveJson",
                data: { id: id },
                success: function (response) {
                    if (response.success) {
                        alert("Category deleted successfully!");
                        loadCategories();
                    } else {
                        alert("Error deleting category: " + response.errors);
                    }
                }
            });
        }
    });
});
