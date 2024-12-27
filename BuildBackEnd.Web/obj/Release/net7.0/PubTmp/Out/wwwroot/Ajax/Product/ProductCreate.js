/*import { ImageDelete } from "../helpFnc.js";*/


$("#CreateForm").submit(function (e) {
    e.preventDefault();
    // Tüm annotation'ları dolaş
    var annotationsData = [];
    var durum = true;
    $(".form-annotations").each(function (index) {
        var annotationIndex = index + 1; // Index numarası
        var title = $(this).find("input[type='text']").val(); // Başlık
        var content = $(this).find(".jodit-wysiwyg").html(); // İçerik

        if (title == "" || content == "" || content == "<p><br></p>" || content == "<p></p>" || title == null || content == null || title == undefined || content == undefined) {
            iziToast.warning({ timeout: 5000, title: 'Error!', message: "Please fill in the annotation fields = "+  annotationIndex });
            durum = false;
            return;
        }



        var imageElements = $(this).next(".image-gallery").find("img"); // Resimlerin bulunduğu img elementleri
        var images = [];

        // Resimlerin src'lerini al
        imageElements.each(function () {
            images.push($(this).attr("src"));
        });

        // Toplanan bilgileri bir objede sakla
        annotationsData.push({
            OrderNo: annotationIndex,
            Name: title,
            Description: content,
            Images: images
        });
    });
    if (!durum) {
        return;
    }


    // if (annotationsData.length == 0) {
    //     iziToast.warning({ timeout: 1500, title: 'Error!', message: "Please add annotation" });
    //     return;
    // }



    let base64 = $("#croppedImage").attr("src");

    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/products/"
        },
        success: function (response) {
            if (!response.success) {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }

            if (response.success) {
                CreateFormData(response.data);// ekleme işlemini başlat
            }
        }
    });

    function CreateFormData(MediaName) {

        let languageId = $("#LanguageId").val(),
            countryId = $("#CountryId").val(),
            categoryId = $("#CategoryId").val(),
            productCategoryId = $("#ProductCategoryId").val(),

            ProductVM = {
                Name: $("#Name").val(),
                MediaName: MediaName,
                SketchfabLink: $("#SketchfabLink").val(),
                OrderNo: $("#OrderNo").val(),
            };

        var data = {
            product: ProductVM,
            countries: countryId,
            categories: categoryId,
            annotations: annotationsData
        }

        if (productCategoryId != null) {
            data.productgroup = productCategoryId;
        }

        if (languageId != null) {
            data.languages = languageId;
        }


        $.ajax({
            type: "POST",
            url: "/Product/CreateJson",
            async: false,
            data: data,
            success: function (response) {
                responseError(response.errors);

                if (!response.success) {
                    ImageDelete(response.data);
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }


                if (response.success) {
                    if (languageId != null) {
                        translationFormData(response.data);
                    }

                    iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
                }
            }
        });
    }



});


$("#SketchfabLink").change(function () {
    $(".loading-overlay").css({ "visibility": "visible", "opacity": "0.5" });
    $("#annotationInputs").empty();

    try {
        var modelId = $(this).val(); // Model ID'yi al
        var version = '1.12.1'; // Sketchfab API versiyonu
        var iframe = document.getElementById('api-frame'); // iframe elementini al
        var client = new window.Sketchfab(version, iframe); // Sketchfab API client'ını oluştur




        // Hata fonksiyonu
        var error = function () {
            alert('Sketchfab API error');
            $("#annotationInputs").empty();
            $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });

        };

        // Başarı fonksiyonu
        var success = function (api) {
            api.start(function () {
                api.addEventListener('viewerready', function () {
                    $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });


                    // Viewer hazır olduğunda yapılacak işlemler

                    api.getAnnotationList(function (err, annotations) {
                        if (!err) {
                            annotations.forEach(function (annotation, index) {
                                var parser = new DOMParser();
                                var doc = parser.parseFromString(annotation.content.rendered, 'text/html');

                                // Span.lazyload ve img etiketlerini seç ve imageLink'leri al
                                var imageLinks = Array.from(doc.querySelectorAll('span.lazyload, img')).map(function (element) {
                                    var imageLink;
                                    if (element.tagName.toLowerCase() === 'span') {
                                        imageLink = element.getAttribute('data-uri');
                                    } else if (element.tagName.toLowerCase() === 'img') {
                                        imageLink = element.getAttribute('src');
                                    }
                                    element.remove(); // Elemanı DOM'dan kaldır

                                    // URL'den gereksiz boşlukları ve satır sonu karakterlerini kaldır
                                    return imageLink.trim().replace(/\s+/g, '').replace(/\\n/g, '');
                                });

                                var cleanedContent = doc.body.innerHTML; // Temizlenmiş içeriği al

                                var images = imageLinks.map(function (imageLink) {
                                    return `<img src="${imageLink}" class="img-fluid" alt="Annotation Image">`;
                                }).join('');

                                var formGroup = `
                                    <div class="col-lg-6 border-top pt-3">
                                        <div class="form-group mt-2 form-annotations">
                                            <label class="form-label">Annotation ${index + 1}</label>
                                            <input type="text" class="form-control mb-2" value="${annotation.name}"/>
                                            <textarea type="text" class="form-control annotation--textarea--description">${cleanedContent}</textarea>
                                        </div>
                                        <div class="mb-2 mt-5 image-gallery row">
                                            ${images}
                                        </div>
                                    </div>
                                `;

                                $("#annotationInputs").append(formGroup);
                            });

                            // Summernote'u Jodit ile değiştirme işlemi
                            $('.annotation--textarea--description').each(function () {
                                new Jodit(this, {
                                    language: 'en' // İngilizce dil ayarı
                                })
                            });
                        } else {
                            console.log('Error getting annotations');
                        }
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



});


