$(document).ready(function () {
    $("#addFieldBtn").click(function (e) {
        e.preventDefault();
        let paragraph = $("<div class='form-group mb-3 row'><div class='col col-md-5'><input class='form-control' name='additionalFieldsNames' placeholder='Введите название доп.поля' /></div><div class='col col-md-3'><button class='btn btn-danger'>Удалить</button></div>");
        $(paragraph).find('button').click(function () { $(paragraph).remove(); });
        $("#addFieldBtn").before(paragraph);
    });

    $("#categoryInfo").on("submit", function (e) {
        e.preventDefault();

        $.ajax({
            url: $(this).attr("action"),
            type: "post",
            data: $(this).serialize(),
            success: function () {
                $('[name=name]').val('');
                $("div.form-group:has(div:has(>[name=additionalFieldsNames]))").remove();
                alert('Added successfully');
                getCategories();
            },
            failure: function () {
                alert('Failed to add');
            }
        });

        return false;
    });

    function getCategories() {
        $("tbody").html("");
        $.ajax({
            url: "/api/Category",
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $(data).each(function (index, val) {
                    let tr = $(`<tr><td>${val['name']}</td><td><button class='btn btn-danger'>Удалить</button></td></tr>`);
                    $(tr).find("button").click(function () {
                        $.ajax({
                            url: "/api/Category/" + val['id'],
                            type: "delete",
                            contentType: "application/json; charset=utf-8",
                            success: function () {
                                getCategories();
                            }
                        });
                    });
                    $("tbody").append(tr);
                });
            }
        });
    }

    getCategories();
});