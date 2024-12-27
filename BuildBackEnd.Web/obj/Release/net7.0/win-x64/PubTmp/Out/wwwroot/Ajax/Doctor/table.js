function format(d) {
    console.log(d);

    var languageDoctor = d.languageDoctor;
    var languages = "";

    if (languageDoctor) {
        let badges = languageDoctor
            .map(item => `<span class="badge bg-primary">${item.language.name}</span><br>`)
            .join(''); // Tüm HTML parçalarını birleştir

        if (badges) {
            languages = `
            <tr>
                <td>Languages</td>
                <td>${badges}</td>
            </tr>
            `;
        }
    }

    var table = `<table class="table table-bordered text-start">
        <tbody>
            <tr>
                 <td> Editing</td>
                 <td>${d.editingDate ? moment(d.editingDate).format('DD/MM/YYYY') : null}</td>
            </tr>
            ${languages}
            </tbody>
        </table>`;
    return table;
}






$(document).ready(function () {




    // setting();

    $('#example').on('click', 'tbody td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
        }
    });
    $('#example').on('requestChild.dt', function (e, row) {
        row.child(format(row.data())).show();
    });


    $("#ozelFilter").click(function (e) {
        e.preventDefault();
        let CountryId = $("#CountryId").val(),
            from = $("#from").datepicker("getDate") ?? null,
            todate = $("#todate").datepicker("getDate") ?? null;

        from = from ? from.toLocaleDateString() : null;
        todate = todate ? todate.toLocaleDateString() : null;

        tableFunc(CountryId, from, todate);
    });







    function tableFunc(CountryId = null, from = null, todate = null) {
        var userHasSorted = false;
        var table = $('#example').DataTable({
            "preDrawCallback": function (settings) {
                var api = new $.fn.dataTable.Api(settings);
                if (!userHasSorted) {
                    api.order([]); // Başlangıçta sıralama yapılmamasını sağlar
                }
            },
            "ajax": {
                "url": "/Doctor/TableData",
                "type": "POST",
                "datatype": "json",
                "data": function (d) {
                    if (userHasSorted) {
                        d.orderColumnIndex = d.order[0].column;
                        d.orderColumnName = d.columns[d.orderColumnIndex].data;
                        d.orderDir = d.order[0].dir;
                    }
                    d.from = from;
                    d.fromtodate = todate ?? from;
                    d.countryId = CountryId;
                },
            },
            destroy: true,
            "rowId": 'id',
            "columns": [

                {
                    "className": 'dt-control',
                    "orderable": false,
                    "searchable": false,
                    "data": null,
                    "defaultContent": ''
                },
                {
                    "data": "orderNo"
                },
                {
                    "data": "name"
                },
                {
                    "data": "country.name"
                },
                {
                    "data": "createdDate",
                    "render": function (data, type, row) {

                        var date = moment(data).format('DD/MM/YYYY'); // 
                        return date;
                    }
                },
                {
                    "orderable": false,
                    "searchable": false,
                    "data": null, "render": function (row) {

                        var id = row.id,
                            buttons = `
                        <a class='btn btn-warning me-1' href="/DoctorUpdate/${id}" data-bs-toggle="tooltip" title="Update Doctor"><i class="fa-solid fa-pen"></i></a>
                        <button type="button" class="btn btn-danger deleteButton me-1" data-id="${id}" data-bs-toggle="tooltip" title="Delete Doctor">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    `;
                        return buttons;


                    }
                }
            ],
            "language": {
                "url": "/Ajax/_dataTable/language.json"
            },
            "draw": 1,
            "processing": true,
            "serverSide": true,
            "searchable": true,
            "search": {
                "value": "my search value",
                "regex": false
            },
            "stateSave": true,
            "pageLength": 25,
            "drawCallback": function () {
            },

        });

        table.on("stateLoaded", (e, settings, data) => {  // burasıda değişti
            console.log(data); // data nesnesini kontrol et
            if (data.childRows && Array.isArray(data.childRows)) {
                for (var i = 0; i < data.childRows.length; i++) {
                    var row = table.row(data.childRows[i]);
                    row.child(format(row.data())).show();
                }
            } else {
                console.error("childRows is not defined or not an array");
            }
        });
        table.on('click', 'th', function () {
            userHasSorted = true;
        });

    }

    tableFunc();


    $('#example tbody').on('click', '.deleteButton', function (e) {
        e.preventDefault();
        var id = $(this).data('id');

        iziToast.question({timeout: 20000,close: false,overlay: true,displayMode: 'once',id: 'question',zindex: 999,title: 'Hey',message: 'Are you sure about that?',position: 'center',
            buttons: [
                ['<button><b>YES</b></button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    $.ajax({
                        type: "POST",
                        url: '/Doctor/RemoveJson',
                        data: {
                            "id": id
                        },
                        success: function (response) {
                            if (response.success) {
                                tableFunc();
                                iziToast.success({ timeout: 4000, icon: 'fas fa-check', title: 'Success!', message: response.message });
                            }
                            else {
                                iziToast.warning({ timeout: 4000, icon: 'fas fa-times', title: 'Warning!', message: response.message });
                            }
                        }
                    });

                }, true],
                ['<button>NO</button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                }],
            ],
            onClosing: function (instance, toast, closedBy) {
                console.info('Closing | closedBy: ' + closedBy);
            },
            onClosed: function (instance, toast, closedBy) {
                console.info('Closed | closedBy: ' + closedBy);
            }
        });
    });


});



