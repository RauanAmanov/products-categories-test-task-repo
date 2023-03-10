$(document).ready(function () {
    $("#addFieldBtn").click(function (e) {
        e.preventDefault();
        let paragraph = $("<p><input name='additionalFieldsNames' />&nbsp;&nbsp;<button>Удалить</button></p>");
        $(paragraph).find('button').click(function () { $(paragraph).remove(); });
        $("#categoryInfo p:last").before(paragraph);
    });

    $("#categoryInfo").on("submit", function (e) {
        e.preventDefault();

        $.ajax({
            url: $(this).attr("action"),
            type: "post",
            data: $(this).serialize(),
            success: function () {
                $('[name=name]').val('');
                $("p:has(>[name=additionalFieldsNames])").remove();
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
                    let tr = $(`<tr><td>${val['name']}</td><td><button>Удалить</button></td></tr>`);
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