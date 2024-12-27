function format(d) {
    console.table(d);

    var languageProducts = d.languageProducts;
    var languages = "";

    if (languageProducts) {
        let badges = languageProducts
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




    console.log(d);
    var table = `<table class="table table-bordered text-start">
        <tbody>
            <tr>
                 <td> Editing</td>
                 <td>${d.editingDate ? moment(d.editingDate).format('DD/MM/YYYY') : null}</td>
            </tr>
            <tr>
                <td> Annatation</td>
                <td>${d.annotations.length}</td>
            </tr>

            ${languages}
            </tbody>
        </table>`;

    var annotationTable = `<table class='table table-bordered text-start'><thead class='bg-dark text-white rounded-3'><tr><th style ='width:100px'>Order No</th><th>Title</th><th >Description</th><th style="width:150px"></th></tr></thead><tbody>`;
    d.annotations.forEach((item, index) => {
        annotationTable += `
        <tr>
            <td>${item.orderNo}</td>
            <td>${item.name}</td>
            <td><small>${item.description}</small></td>
            <td>
            <a href="/AnnotationUpdate/${d.id}/${item.id}" class="btn btn-warning me-1" data-bs-toggle="tooltip" title="Edit Annotation">
            <i class="fa-solid fa-pen"></i>
        </a>
        <button type="button" class="btn btn-danger deleteButtonAnnotation me-1" data-id="${item.id}" data-bs-toggle="tooltip" title="Delete Annotation">
            <i class="fa-solid fa-trash"></i>
        </button>
        <a href="/AnnotationMedias/${item.id}" class="btn btn-primary" data-bs-toggle="tooltip" title="View Medias">
            <i class="fa-solid fa-image"></i>
        </a>
        
            </td>
        </tr>
   `;
    });
    annotationTable += "</tbody></table>";

    return table + annotationTable;
}






$(document).ready(function () {
    // setting();

    $('#example').on('click', 'tbody td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = $("#example").DataTable().row(tr);

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
            CategoryId = $("#CategoryId").val(),
            ProductCategoryId = $("#ProductCategoryId").val(),
            from = $("#from").datepicker("getDate") ?? null,
            todate = $("#todate").datepicker("getDate") ?? null;


        from = from ? from.toLocaleDateString() : null;
        todate = todate ? todate.toLocaleDateString() : null;

        tableFunc(CountryId, from, todate, CategoryId, ProductCategoryId);
    });




    function tableFunc(CountryId = null, from = null, todate = null, categoryId = null, productCategoryId = null) {

        var userHasSorted = false;
        var table = $('#example').DataTable({
            "preDrawCallback": function (settings) {
                var api = new $.fn.dataTable.Api(settings);
                if (!userHasSorted) {
                    api.order([]); // Başlangıçta sıralama yapılmamasını sağlar
                }
            },
            "ajax": {
                "url": "/Product/TableData",
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
                    d.categoryId = categoryId;
                    d.productGroupId = productCategoryId;
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
                    "data": "name", render: function (data, type, row, meta) {
                        return row.name + ` <span class="badge bg-primary">${row.annotations.length}</span>`;
                    }
                },
                {
                    "data": null,
                    "orderable": false,
                    "searchable": false,
                    render: function (data, type, row, meta) {
                        var productCategories = row.productCategories;
                        var returnData = "";
                         productCategories.map(function (item) {
                            if (item.productGroup) {
                                returnData += `<i class="fas fa-dot-circle text-success"></i> ` + item.category.categoryParent.name+"<br>";;

                            }

                            if (!item.productGroup) {
                                returnData += `<i class="fas fa-dot-circle text-success"></i> ` + item.category.name +"<br>";
                            }
                        });


                        var returnData2 = "";
                       productCategories.map(function (item) {
                            if (item.productGroup) {
                                returnData2 += `<div class="badge bg-primary">${item.category.name}</div>`+"<br>";;
                            }
                        });


                        return returnData +returnData2 ;

                    }
                },

                {
                    "data": null,
                    "orderable": false,
                    "searchable": false,
                    render: function (data, type, row, meta) {
                        var productCountries = row.productCountries,
                            returnData = "";
                        productCountries = productCountries.map(function (item) {
                            returnData += `<i class="fas fa-dot-circle text-dark"></i> ${item.country.name}<br>`;
                        });
                        return returnData;
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

                        var id = row.id, modelId = row.sketchfabLink,
                            buttons = `
                        <a class='btn btn-warning me-1' href="/ProductUpdate/${id}" data-bs-toggle="tooltip" title="Update Product">
                            <i class="fa-solid fa-pen"></i>
                        </a>
                    
                        <button type="button" class="btn btn-danger deleteButton me-1" data-id="${id}" data-bs-toggle="tooltip" title="Delete Product">
                            <i class="fa-solid fa-trash"></i>
                        </button>


                        <a class='btn btn-dark position-relative me-1' href="/ProductCharacteristic/${id}" data-bs-toggle="tooltip" title="Product Characteristic">
                            <i class="fa-solid fa-book-open-cover"></i>
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                ${row.productCharacteristics.length}
                            </span>
                        </a>
                    
                        <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-toggle="tooltip" title="More Options">
                            <i class="fa-solid fa-caret-down"></i>
                        </button>
                    
                        <ul class="dropdown-menu">
                            <li>
                                <button type="button" class="dropdown-item" id="getDataAgainBtn" data-id="${id}" data-model-id="${modelId}" data-bs-toggle="tooltip" title="Get Data Again">
                                    <i class="fa-solid fa-repeat me-3 mt-1"></i>
                                    <small>Get Data Again</small>
                                </button>
                            </li>
                            <li>
                                <button type="button" class="dropdown-item" id="getDataAgainControlBtn" data-id="${id}" data-model-id="${modelId}" data-bs-toggle="tooltip" title="Control Data Fetch">
                                    <i class="fa-solid fa-repeat me-3 mt-1"></i>
                                    <small>Get Data Control</small>
                                </button>
                            </li>
                        </ul>
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
                        url: '/Product/RemoveJson',
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

    $('#example tbody').on('click', '.deleteButtonAnnotation', function (e) {
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
                        url: '/Annotation/RemoveJson',
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

    $('#example tbody').on('click', '#getDataAgainBtn', function (e) {
        var modelId = $(this).data("model-id"); // Model ID'yi al
        var id = $(this).data("id");

        iziToast.question({
            timeout: 20000, close: false, overlay: true, displayMode: 'once', id: 'question', zindex: 999, title: 'Hey', message: 'When you perform the data extraction, the saved English data will be reset and the unsaved pictures will be deleted?', position: 'center', buttons: [
                ['<button><b>YES</b></button>', function (instance, toast) {



                    $(".loading-overlay").css({ "visibility": "visible", "opacity": "0.5" });


                    try {
                        var version = '1.12.1'; // Sketchfab API versiyonu
                        var iframe = document.getElementById('api-frame'); // iframe elementini al
                        var client = new window.Sketchfab(version, iframe); // Sketchfab API client'ını oluştur

                        // Hata fonksiyonu
                        var error = function () {
                            alert('Sketchfab API error');
                            $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });

                        };

                        // Başarı fonksiyonu
                        var success = function (api) {
                            api.start(function () {
                                api.addEventListener('viewerready', function () {
                                    $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });


                                    // Viewer hazır olduğunda yapılacak işlemler

                                    api.getAnnotationList(function (err, annotations) {
                                        var annotaiton = [];

                                        if (err) {
                                            console.log('Error getting annotations');
                                        }

                                        if (!err) {
                                            annotations.forEach(function (annotation, index) {

                                                var parser = new DOMParser();
                                                var doc = parser.parseFromString(annotation.content.rendered, 'text/html');


                                                // Hem span.lazyload hem de img etiketlerini seç
                                                var imageElements = doc.querySelectorAll('span.lazyload, img');
                                                var imageLinks = Array.from(imageElements).map(function (element) {
                                                    var imageLink;
                                                    if (element.tagName.toLowerCase() === 'span') {
                                                        imageLink = element.getAttribute('data-uri');
                                                        // Span'ı DOM'dan kaldır
                                                        element.parentNode.removeChild(element);
                                                    } else if (element.tagName.toLowerCase() === 'img') {
                                                        imageLink = element.getAttribute('src');
                                                        // Img'yi DOM'dan kaldır
                                                        element.parentNode.removeChild(element);
                                                    }

                                                    // URL'den gereksiz boşlukları ve satır sonu karakterlerini kaldır
                                                    imageLink = imageLink.replace(/\s+/g, '').replace(/\\n/g, '');
                                                    return imageLink;
                                                });

                                                var cleanedContent = doc.body.innerHTML; // Temizlenmiş içeriği al

                                                var images = [];

                                                imageLinks.forEach(function (imageLink) { images.push(imageLink); });

                                                annotaiton.push({
                                                    OrderNo: index + 1,
                                                    Name: annotation.name,
                                                    Description: cleanedContent,
                                                    Images: images,
                                                });


                                            });



                                        }

                                        $.ajax({
                                            type: "POST",
                                            url: "/Product/getDataAgainJson",
                                            data: {
                                                productId: id,
                                                annotations: annotaiton,
                                            },
                                            success: function (response) {
                                                if (!response.success) {
                                                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                                                }

                                                if (response.success) {
                                                    iziToast.success({ timeout: 1500, title: 'Success!', message: response.message });
                                                    tableFunc();
                                                }
                                            }
                                        });


                                    });

                                    // Animasyonları oynatma (Örnek)
                                    api.getAnimations(function (err, animations) {
                                        if (!err && animations.length > 0) {
                                            api.setCurrentAnimationByUID(animations[0][0]);
                                            api.pause(function (err) {
                                                if (!err) {
                                                    console.log('Animation paused');
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        };

                        // Sketchfab API'sini model ID ile başlat
                        client.init(modelId, {
                            success: success,
                            error: error,
                            autostart: 1,
                            preload: 0,
                            // Diğer gerekli konfigürasyonlar...
                        });






                    } catch (e) {
                        alert('Sketchfab API error');
                        $("#annotationInputs").empty();
                        $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });
                    }






                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');






                }, true],
                ['<button>NO</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }],
            ]
        });
    });
    $('#example tbody').on('click', '#getDataAgainControlBtn', function (e) {
        var modelId = $(this).data("model-id"); // Model ID'yi al
        var id = $(this).data("id");

        iziToast.question({
            timeout: 20000, close: false, overlay: true, displayMode: 'once', id: 'question', zindex: 999, title: 'Hey', message: 'When you perform the data extraction, the saved English data will be reset and the unsaved pictures will be deleted?', position: 'center', buttons: [
                ['<button><b>YES</b></button>', function (instance, toast) {



                    $(".loading-overlay").css({ "visibility": "visible", "opacity": "0.5" });


                    try {
                        var version = '1.12.1'; // Sketchfab API versiyonu
                        var iframe = document.getElementById('api-frame'); // iframe elementini al
                        var client = new window.Sketchfab(version, iframe); // Sketchfab API client'ını oluştur
                        //



                        // Hata fonksiyonu
                        var error = function () {
                            alert('Sketchfab API error');
                            $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });

                        };

                        // Başarı fonksiyonu
                        var success = function (api) {
                            api.start(function () {
                                api.addEventListener('viewerready', function () {
                                    $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });


                                    // Viewer hazır olduğunda yapılacak işlemler

                                    api.getAnnotationList(function (err, annotations) {
                                        var annotaiton = [];

                                        if (err) {
                                            console.log('Error getting annotations');
                                        }

                                        if (!err) {
                                            annotations.forEach(function (annotation, index) {

                                                var parser = new DOMParser();
                                                var doc = parser.parseFromString(annotation.content.rendered, 'text/html');


                                                // Hem span.lazyload hem de img etiketlerini seç
                                                var imageElements = doc.querySelectorAll('span.lazyload, img');
                                                var imageLinks = Array.from(imageElements).map(function (element) {
                                                    var imageLink;
                                                    if (element.tagName.toLowerCase() === 'span') {
                                                        imageLink = element.getAttribute('data-uri');
                                                        // Span'ı DOM'dan kaldır
                                                        element.parentNode.removeChild(element);
                                                    } else if (element.tagName.toLowerCase() === 'img') {
                                                        imageLink = element.getAttribute('src');
                                                        // Img'yi DOM'dan kaldır
                                                        element.parentNode.removeChild(element);
                                                    }

                                                    // URL'den gereksiz boşlukları ve satır sonu karakterlerini kaldır
                                                    imageLink = imageLink.replace(/\s+/g, '').replace(/\\n/g, '');
                                                    return imageLink;
                                                });

                                                var cleanedContent = doc.body.innerHTML; // Temizlenmiş içeriği al

                                                var images = [];

                                                imageLinks.forEach(function (imageLink) { images.push(imageLink); });

                                                annotaiton.push({
                                                    OrderNo: index + 1,
                                                    Name: annotation.name,
                                                    Description: cleanedContent,
                                                    Images: images,
                                                });


                                            });



                                        }

                                        $.ajax({
                                            type: "POST",
                                            url: "/Product/getDataAgainControlJson",
                                            data: {
                                                productId: id,
                                                annotations: annotaiton,
                                            },
                                            success: function (response) {
                                                if (!response.success) {
                                                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                                                }

                                                if (response.success) {
                                                    iziToast.success({ timeout: 1500, title: 'Success!', message: response.message });
                                                    tableFunc();
                                                }
                                            }
                                        });


                                    });

                                    // Animasyonları oynatma (Örnek)
                                    api.getAnimations(function (err, animations) {
                                        if (!err && animations.length > 0) {
                                            api.setCurrentAnimationByUID(animations[0][0]);
                                            api.pause(function (err) {
                                                if (!err) {
                                                    console.log('Animation paused');
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        };

                        // Sketchfab API'sini model ID ile başlat
                        client.init(modelId, {
                            success: success,
                            error: error,
                            autostart: 1,
                            preload: 0,
                            // Diğer gerekli konfigürasyonlar...
                        });






                    } catch (e) {
                        alert('Sketchfab API error');
                        $("#annotationInputs").empty();
                        $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });
                    }

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true],
                ['<button>NO</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }],
            ]
        });
    });


});



