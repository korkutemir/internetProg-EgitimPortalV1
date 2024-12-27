$(document).ready(function () {
    // $("#CategoryId").select2({
    //     ajax: {
    //         url: "/Group/GetCategorySelect",
    //         dataType: 'json',
    //         delay: 250,
    //         data: function (params) {
    //             var query = params.term || '';
    //             return {
    //                 q: query,
    //                 page: params.page || 1
    //             };
    //         },
    //         processResults: function (data, params) {
    //             params.page = params.page || 1;
    //             return {
    //                 results: $.map(data.items, function (item) {
    //                     if (item.languageCode != "en") {
    //                         return {
    //                             id: item.id,
    //                             text: item.name,
    //                             languageCode: item.languageCode
    //                         };
    //                     }
    //                 }),
    //                 pagination: {
    //                     more: ((params.page * 10) < data.total_count)
    //                 }
    //             };
    //         },
    //         cache: true
    //     },
    //     theme: "bootstrap-5",
    //     width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    //     placeholder: $(this).data('placeholder'),
    //     allowClear: true
    // });

    $("#ProductCategoryId").select2({
        ajax: {
            url: "/Group/GetProductCategorySelect",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var query = params.term || '';
                return {
                    q: query,
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: $.map(data.items, function (item) {
                        if (item.languageCode != "en") {
                            return {
                                id: item.id,
                                text: item.name,
                                languageCode: item.languageCode
                            };
                        }
                    }),
                    pagination: {
                        more: ((params.page * 10) < data.total_count)
                    }
                };
            },
            cache: true
        },
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        allowClear: true
    });







    $("#CountryId").select2({
        ajax: {
            url: "/Country/GetCountrySelect",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var query = params.term || '';
                return {
                    q: query,
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: $.map(data.items, function (item) {
                        if (item.languageCode != "en") {
                            return {
                                id: item.id,
                                text: item.name,
                            };
                        }
                    }),
                    pagination: {
                        more: ((params.page * 10) < data.total_count)
                    }
                };
            },
            cache: true
        },
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        allowClear: true
    });


    $(document).ready(function () {
        var $categoryId = $("#CategoryId");  // Cache the selector for performance
    
        // Initialize select2 with Ajax support for fetching data
        $categoryId.select2({
            ajax: {
                url: "/Group/GetCategorySelect",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    var query = params.term || '';
                    return {
                        q: query,
                        page: params.page || 1
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    return {
                        results: $.map(data.items, function (item) {
                            return { id: item.id, text: item.name };  // Simplified the result construction
                        }),
                        pagination: {
                            more: ((params.page * 10) < data.total_count)
                        }
                    };
                },
                cache: true
            },
            theme: "bootstrap-5",
            width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
            placeholder: $(this).data('placeholder'),
            allowClear: true
        });
    
        // Event handler when the Product Category changes
        $("#ProductCategoryId").change(function() {
            var val = $(this).val();
            if (val) {
                // Disable select2 while loading data
                // $categoryId.prop('disabled', true);
                $categoryId.select2("enable", true);
    
                $.ajax({
                    type: "POST",
                    url: "/Group/CategoryById",
                    data: { categoryId: val },
                    success: function(response) {
                        // Assuming response contains the ID and name of the category
                        var newOption = new Option(response.name, response.id, true, true);
                        $categoryId.empty().append(newOption).trigger('change');
    
                        // Re-enable select2 now that the data has been loaded
                       
                    },
                    error: function() {
                        // Handle errors if the AJAX call fails
                        alert('Error loading data');
                  
                    }
                });
            } else {
                // If no value is selected, clear and disable the CategoryId select2
                $categoryId.val(null).trigger('change').prop('disabled', false);
                
            }
        });
    });
    


});




