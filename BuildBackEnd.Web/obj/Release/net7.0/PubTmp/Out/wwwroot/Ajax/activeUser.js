function activeUserRoleIdFnc() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/Panel/activeUserRoleIdJson",
            dataType: "json",
            success: function (response) {
                resolve(response);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}



export { activeUserRoleIdFnc };