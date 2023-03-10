$(document).ready(function () {
    $("#addFieldBtn").click(function (e) {
        e.preventDefault();
        let paragraph = $("<p><input name='additionalFieldsNames' />&nbsp;&nbsp;<button>Удалить</button></p>");
        $(paragraph).find('button').click(function () { $(paragraph).remove(); });
        $("#categoryInfo p:last").before(paragraph);
    });

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
        $("p:has(>[name^='additionalFieldsValues'])").remove();
    });    

    function clearInputs() {
        $('#productInfo').trigger('reset');
        $('#productImage').css('display', 'none');
    }

    function fillDropdown() {
        let dropdown = $('[name=categoryId]');
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
        $("p:has(>[name^='additionalFieldsValues'])").remove();
        if (selectedValue) {
            getAdditionalFields();
        }
    });

    function getAdditionalFields(callback) {
        let selectedCategoryId = $('[name=categoryId]').val();
        $.ajax({
            url: "/api/Category/" + selectedCategoryId,
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $(data.additionalFields).each(function (index, val) {
                    let paragraph = $(`<p>${val.name}<br/><input additional-field-id='${val.id}' name='additionalFieldsValues[${val.id}]' /></p>`);
                    $("#productInfo p:last").before(paragraph);
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
        $("p:has(>[name^='additionalFieldsValues'])").remove();
        getAdditionalFields(function () { fillAdditionalFieldsValues(product.productAdditionalFieldValues) });
    }

    function getProducts() {
        $("tbody").html("");
        $.ajax({
            url: "/api/Product",
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $(data).each(function (index, val) {
                    let tr = $(`<tr><td>${val['name']}</td><td><button class='viewBtn'>Просмотр</button></td><td><button class='removeBtn'>Удалить</button></td></tr>`);
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