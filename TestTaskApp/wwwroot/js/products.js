$(document).ready(function () {
    $("#productInfo").on("submit", function (e) {
        e.preventDefault();

        var formData = new FormData(this);

        $.ajax({
            url: $(this).attr("action"),
            type: "post",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                clearInputs();
                alert('Added successfully');
                getProducts();
            },
            failure: function () {
                alert('Failed to add');
            }
        });

        return false;
    });

    $("#productInfo button[type=reset]").click(function () {
        $('#productImage').css('display', 'none');
        $('#productInfo button[type=reset]').css('display', 'none');
        $('#productInfo button[type=reset]').css('display', 'none');
        $('#productInfo input[type=submit]').css('display', 'block');
        $("div:has(>[name^='additionalFieldsValues'])").remove();
    });

    function clearInputs() {
        $('#productInfo').trigger('reset');
        $('#productImage').css('display', 'none');
        $("div:has(>[name^='additionalFieldsValues'])").remove();
    }

    function fillDropdown() {
        let dropdown = $('[name^=categoryId]');
        $.ajax({
            url: "/api/Category",
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $(data).each(function (index, val) {
                    dropdown.append(`<option value='${val['id']}'>${val['name']}</option>`);
                });
            }
        });
    }

    $('[name=categoryId]').change(function () {
        let selectedValue = $(this).val();
        $("div:has(>[name^='additionalFieldsValues'])").remove();
        if (selectedValue) {
            getAdditionalFields();
        }
    });

    $('[name=categoryIdFilter]').change(function () {
        let selectedValue = $(this).val();
        $("#additionalFieldsFiltersArea").html("");
        if (selectedValue) {
            getAdditionalFieldsFilters(selectedValue);
        }
    });
    function getAdditionalFieldsFilters(selectedCategoryId) {
        $.ajax({
            url: "/api/Category/" + selectedCategoryId,
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $(data.additionalFields).each(function (index, val) {
                    let el = $(`<div class='form-group col col-md-3'><label>${val.name}</label><input class='form-control' name='additionalFieldValuesFilter[${val.id}]' /></div>`);
                    $("#additionalFieldsFiltersArea").append(el);
                });
            }
        });
    }

    function getAdditionalFields(callback) {
        let selectedCategoryId = $('[name=categoryId]').val();
        $.ajax({
            url: "/api/Category/" + selectedCategoryId,
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $(data.additionalFields).each(function (index, val) {
                    let el = $(`<div class='form-group'><label>${val.name}</label><input class='form-control' additional-field-id='${val.id}' name='additionalFieldsValues[${val.id}]' /></div>`);
                    $("#productInfo input[type=submit]").before(el);
                    callback && callback();
                });
            }
        });
    }

    function fillAdditionalFieldsValues(additionalFieldsValues) {
        $("[name^='additionalFieldsValues']").each(function () {
            let additionalFieldId = $(this).attr('additional-field-id');
            let additionalFieldValue = additionalFieldsValues.find(obj => obj.additionalFieldId == additionalFieldId).value;
            if (additionalFieldValue) {
                $(this).val(additionalFieldValue);
            }
        });
    }

    function fillInputs(product) {
        $('[name=name]').val(product.name);
        $('[name=description]').val(product.description);
        $('[name=price]').val(product.price);
        $('[name=categoryId]').val(product.categoryId);
        $('#productImage').attr('src', `data:image/png;base64, ${product.image}`);
        $('#productImage').css('display', 'block');
        $('#productInfo input[type=submit]').css('display', 'none');
        $("#productInfo button[type=reset]").css('display', 'block');
        $("div:has(>[name^='additionalFieldsValues'])").remove();
        getAdditionalFields(function () { fillAdditionalFieldsValues(product.productAdditionalFieldValues) });
    }

    $("#searchBtn").click(getProducts);

    function getProducts() {
        let data = $("#searchForm").serialize();
        $("tbody").html("");
        $.ajax({
            url: "/api/Product",
            type: "get",
            data: data,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $(data).each(function (index, val) {
                    let tr = $(`<tr><td>${val['name']}</td><td>${val['description']}</td><td>${val['price']}</td><td>${val.category.name}</td><td><button class='btn btn-primary viewBtn'>Просмотр</button>&nbsp;&nbsp;<button class='btn btn-danger removeBtn'>Удалить</button></td></tr>`);
                    $(tr).find("button.removeBtn").click(function () {
                        $.ajax({
                            url: "/api/Product/" + val['id'],
                            type: "delete",
                            contentType: "application/json; charset=utf-8",
                            success: function () {
                                getProducts();
                            }
                        });
                    });
                    $(tr).find("button.viewBtn").click(function () {
                        $.ajax({
                            url: "/api/Product/" + val['id'],
                            type: "get",
                            contentType: "application/json; charset=utf-8",
                            success: function (data) {
                                fillInputs(data);
                            }
                        });
                    });
                    $("tbody").append(tr);
                });
            }
        });
    }

    fillDropdown();
    getProducts();
});