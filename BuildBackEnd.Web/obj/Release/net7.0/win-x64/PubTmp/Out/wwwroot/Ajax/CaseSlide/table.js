function format(d) {
    console.log(d);
    let tableHTML = `<table class="table table-bordered text-start">
        <tbody>
            <tr>
                <td> Editing</td>
                <td>${d.editingDate ? moment(d.editingDate).format('DD/MM/YYYY') : null}</td>
            </tr>
        </tbody>
    </table>`;

    let mediaTableHTML = `<table class='table table-bordered text-start'>
        <thead class='bg-dark text-white rounded-3'>
            <tr><th >Media</th><th>Type</th><th >Lang</th><th style="width:150px"></th></tr>
        </thead>
        <tbody>`;

    const mediaTypeLabels = ["Sound", "Video", "Model"];

    d.caseSlideMedias.forEach((item, index) => {
        var lang = item.language?.name ?? "";
        const type = mediaTypeLabels[item.mediaType] || "";
        mediaTableHTML += `<tr>
            <td>${item.mediaType == 2 ? item.mediaName: "<a href='/Uploads/CaseSlides/" + item.mediaName+ "' target='_blank' >"+item.mediaName+"</a>"}</td>
            <td>${type}</td>++
            <td><small>${lang}</small></td>
            <td>`;
        // if (item.mediaType == 0) {
        //     mediaTableHTML += `
        //         <a href="/AnnotationUpdate/${d.id}/${item.id}" class="btn btn-warning me-1"><i class="fa-solid fa-pen"></i></a>`;
        // }
        mediaTableHTML += `<button type="button" class="btn btn-danger deleteMediaButton me-1" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button></td></tr>`;
    });

    mediaTableHTML += `</tbody></table>`;

    return tableHTML + mediaTableHTML;
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








    var userHasSorted = false;
    var table = $('#example').DataTable({
        "preDrawCallback": function (settings) {
            var api = new $.fn.dataTable.Api(settings);
            if (!userHasSorted) {
                api.order([]); // Başlangıçta sıralama yapılmamasını sağlar
            }
        },
        "ajax": {
            "url": "/CaseSlide/TableDataJson",
            "type": "POST",
            "datatype": "json",
            "data": function (d) {
                if (userHasSorted) {
                    d.orderColumnIndex = d.order[0].column;
                    d.orderColumnName = d.columns[d.orderColumnIndex].data;
                    d.orderDir = d.order[0].dir;
                }
                d.caseId = $("#caseId").val();
            },
        },
        "rowId": 'id',
        "columns": [
            {
                "className": 'dt-control',
                "orderable": false,
                "searchable": false,
                "data": null,
                "defaultContent": ''
            },
            { "data": "orderNo" },
            {
                "orderable": false,
                "searchable": false,
                "data": null, "render": function (row) {
                    return `
                        <a href="/Uploads/CaseSlides/${row.mediaName}" target="_blank">
                            <img src="/Uploads/CaseSlides/${row.mediaName}" class="img-fluid" alt="Responsive image" style="max-width: 100px; max-height: 100px;">
                        </a>
                   `;
                }

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

                    var id = row.id;

                    var buttons = `
                    <a class='btn btn-warning me-1' href="/CaseSlideUpdate/${id}" data-bs-toggle="tooltip" title="Edit Slide"><i class="fa-solid fa-pen"></i></a>
                    <button type="button" class="btn btn-danger me-1 deleteButton" data-id="${id}" data-bs-toggle="tooltip" title="Delete Slide"><i class="fa-solid fa-trash"></i></button>
                    <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-toggle="tooltip" title="More Options">
                        <i class="fa-solid fa-caret-down"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li>
                            <a class="dropdown-item" href="/CaseSlideSoundCreate/${id}" data-bs-toggle="tooltip" title="Create Sound"><i class="fa-solid fa-plus me-3 mt-1"></i><small>Sound Create</small></a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="/CaseSlideModelCreate/${id}" data-bs-toggle="tooltip" title="Create Model"><i class="fa-solid fa-plus me-3 mt-1"></i><small>Model Create</small></a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="/CaseSlideVideoCreate/${id}" data-bs-toggle="tooltip" title="Create Video"><i class="fa-solid fa-plus me-3 mt-1"></i><small>Video Create</small></a>
                        </li>
                    </ul>`;
                
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
            // const columns = [
            //     // { index: 4, style: { "text-align": "center" } },
            //     { index: 1, style: { "text-align": "center" } },
            //     { index: 6, style: { "text-align": "center" } },
            //     { index: 7, style: { "text-align": "center" } },
            //     // { index: 9, style: { "text-align": "center" } },

            // ];
            // columns.forEach(col => {
            //     $(`#example tbody tr td:nth-child(${col.index})`)
            //         .attr("data-title", col.title)
            //         .css(col.style || {});
            // });
        },

    });


    // start();
    table.on('stateLoaded', (e, settings, data) => {
        for (var i = 0; i < data.childRows.length; i++) {
            var row = table.row(data.childRows[i]);
            row.child(format(row.data())).show();
        }
    });
    table.on('click', 'th', function () {
        userHasSorted = true;
    });

    $('#example tbody').on('click', '.deleteButton', function (e) {
        e.preventDefault();
        var id = $(this).data('id');


        iziToast.question({
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: 'Hey',
            message: 'Are you sure about that?',
            position: 'center',
            buttons: [
                ['<button><b>YES</b></button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    $.ajax({
                        type: "POST",
                        url: '/CaseSlide/RemoveJson',
                        data: {
                            "id": id
                        },
                        success: function (response) {
                            if (response.success) {
                                table.ajax.reload();
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

    $('#example tbody').on('click', '.deleteMediaButton', function (e) {
        e.preventDefault();
        var id = $(this).data('id');


        iziToast.question({
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: 'Hey',
            message: 'Are you sure about that?',
            position: 'center',
            buttons: [
                ['<button><b>YES</b></button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    $.ajax({
                        type: "POST",
                        url: '/CaseSlide/MediaRemoveJson',
                        data: {
                            "id": id
                        },
                        success: function (response) {
                            if (response.success) {
                                table.ajax.reload();
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



