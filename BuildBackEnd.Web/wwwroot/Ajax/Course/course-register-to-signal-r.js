$(function () {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/courseHub")
        .build();

    connection.on("ReceiveStudentRegistration", function (studentName, courseName) {
        const message = `${courseName} için kayıt yaptırdı ${studentName}`;
        $("#studentRegistrations").append(`<li>${message}</li>`);
    });

    connection.start().catch(function (err) {
        return console.error(err.toString());
    });
});
