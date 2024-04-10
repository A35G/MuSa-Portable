var path;
var detailsModal;
let dataJSON;
var btn = $('#button');
var page = 1;
const bxpage = 10;
var pages = 0;
var bx = 1;

$(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});

btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
});

function nl2br(str, replaceMode, isXhtml) {
    var breakTag = (isXhtml) ? '<br />' : '<br>';
    var replaceStr = (replaceMode) ? '$1'+ breakTag : '$1'+ breakTag +'$2';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
}

function validJSON(text) {
    if (typeof text !== "string") {
        return false;
    }

    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
}

function strip_tags(input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

$("body").on("click",".showInfo",function() {
    var idnInfo = $(this).data("src");

    if (typeof idnInfo !== undefined 
        && typeof idnInfo !== null 
        && idnInfo.length > 0) {

        if ($("#" + idnInfo).length > 0) {
            var cntData = $("#" + idnInfo).html();

            if (typeof cntData !== undefined 
                && typeof cntData !== null 
                && cntData.length > 0 
                && validJSON(cntData)) {

                try {
                    var m = JSON.parse(cntData);
                } catch(e) {
                    console.log(e);
                    return false;
                }

                $("#tramaLabel").html(m.titoloFilm);

                if (typeof m.locandinaFilm !== undefined 
                    && typeof m.locandinaFilm !== null 
                    && m.locandinaFilm.length > 0) {

                    var imgc = document.createElement("img");
                    imgc.className = "bd-placeholder-img card-img-top shadow";
                    imgc.setAttribute("src", m.locandinaFilm);
                    imgc.setAttribute("width", "100%");

                    document.getElementById("coverModal").appendChild(imgc);
                } else {
                    $("#coverModal").addClass("d-none");
                }

                if (m.annoFilm === "" 
                    && m.genereFilm === "" 
                    && m.durataFilm === "") {
                    $("#infom").addClass("d-none");
                } else {
                    let prd = ((m.annoFilm === "") ? " -  - " : m.annoFilm);
                    $("#yrv").html(prd);

                    let gnr = ((m.genereFilm === "") ? " -  - " : m.genereFilm);
                    $("#lstg").html(gnr);

                    let tm = ((m.durataFilm === "") ? " -  - " : m.durataFilm);
                    $("#tmdr").html(tm);
                }

                if ($("#coverModal").hasClass("d-none") 
                    && $("#infom").hasClass("d-none")) {
                    $("#latsx").addClass("d-none");
                    $("#latdx").removeClass("col-md-8").addClass("col-md-12");
                }

                if (m.testoTrama !== "") {
                    $("#textModal").html(nl2br(m.testoTrama));
                } else {
                    $("#strmd").removeClass("modal-lg");
                }

                detailsModal = bootstrap.Modal.getOrCreateInstance("#dettTrama");

                detailsModal.show();
            }
        }
    }
});

$("body").on("hidden.bs.modal","#dettTrama",function() {
    $("#coverModal").removeClass("d-none");
    $("#coverModal").html("");
    $("#infom").removeClass("d-none");
    $("#latsx").removeClass("d-none");
    $("#latdx").removeClass("col-md-12").addClass("col-md-8");
    $("#textModal").html("");
    $("#tramaLabel").html("");
    $("#strmd").addClass("modal-lg");
});

$("body").on("keyup","input[name='q']",function() {
    let search = $(this).val();
    search = search.trim();
    if (search !== '' && search !== null) {
        search = strip_tags(search);

        $("#boxd").html("");

        if ($("#navi").hasClass("d-none")) {
            $("#navi").removeClass("d-none");
        }

        document.getElementById("ttlm").textContent = 'Hai cercato: ' + search;

        const newElements = dataJSON.archive
        .filter((item) => {
            return (
                item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search)
            );
        });

        if (newElements.length > 0 && newElements[0] !== '') {
            var newj = {
                template: dataJSON.template,
                totalmedia: newElements.length,
                archive: newElements
            }

            pages = loadPages(newj, bxpage);

            makeBox(newj, 1, bxpage);
        }

    } else {
        $("#navi").addClass("d-none");
        document.getElementById("ttlm").textContent = '';

        makeBox(dataJSON, 1, bxpage);
    }
});

function loadPages(data, perPage) {
    if (typeof data !== 'undefined' && data !== '') {
        const totalItems = data.totalmedia;
        perPage = perPage ? perPage : 1;
        return Math.ceil(totalItems/perPage);
    }
}

function dataFromFilter(args) {
    let valid = false;
    if (typeof args !== 'undefined') {
        let fl = args.get("f");
        if (fl !== null && fl !== '') {
            if (args.has("type")) {
                let tx = strip_tags(args.get("type"));
                if (tx == 'genre') {

                    if ($("#navi").hasClass("d-none")) {
                        $("#navi").removeClass("d-none");
                    }

                    document.getElementById("ttlm").textContent = 'Genere: ' + fl;

                    let rs = dataJSON.archive.filter(function(e) {
                        return e.tags.some((el) => fl === el);
                    });

                    if (rs.length > 0) {
                        valid = true;

                        var newj = {
                            template: dataJSON.template,
                            totalmedia: rs.length,
                            archive: rs
                        }

                        pages = loadPages(newj, bxpage);

                        makeBox(newj, 1, bxpage);
                    }
                }

                if (tx == 'year') {

                    if ($("#navi").hasClass("d-none")) {
                        $("#navi").removeClass("d-none");
                    }

                    document.getElementById("ttlm").textContent = 'Anno: ' + fl;

                    let rs = dataJSON.archive.filter(function(e) {
                        return e.year == fl;
                    });

                    if (rs.length > 0) {
                        valid = true;

                        var newj = {
                            template: dataJSON.template,
                            totalmedia: rs.length,
                            archive: rs
                        }

                        pages = loadPages(newj, bxpage);

                        makeBox(newj, 1, bxpage);
                    }
                }
            }
        }
    }

    if (!valid) {
        location.href = path;
    }
}

function findMedia(args) {
    let valid = false;
    if (typeof args !== 'undefined') {
        let m = args.get("v");
        if (m !== null && m !== '') {
            let rs = dataJSON.archive.filter(function(e) {
                return e.identity == m
            });

            if (rs.length > 0) {
                valid = true;
                loadVideo(rs);
            }
        }
    }

    if (!valid) {
        location.href = path;
    }
}

function initApp() {
    if (typeof dataJSON !== 'undefined' && dataJSON !== '') {
        makeFilters();

        var params = new URLSearchParams(window.location.search);
        if (params.has("v")) {
            findMedia(params);
        } else if (params.has("f")) {
            dataFromFilter(params);
        } else {
            pages = loadPages(dataJSON, bxpage);

            if ('template' in dataJSON) {
                if (dataJSON.template == 'default') {
                    makeBox(dataJSON, page, bxpage);
                } else if (dataJSON.template == 'simple') {
                    makeTable(dataJSON);
                }
            } else {
                makeBox(dataJSON, page, bxpage);
            }
        }
    }
}

function loadDatabase() {
    if (typeof json !== 'undefined' && validJSON(json)) {
        try {
            var j = JSON.parse(json);
            dataJSON = j;
        } catch(e) {
            console.log(e);
            return false;
        }

        initApp();
    }
}

$(document).ready(function() {
    var base = location.href;
    var pathname = location.pathname;
    var index1 = base.indexOf(pathname);
    path = base.substr(0, index1);
    path += pathname;

    loadDatabase();

    if ($("#contbox").length > 0) {
        let div = document.querySelector("#contbox");

        div.addEventListener("scroll", () => {
            if (Math.abs(div.scrollHeight - div.clientHeight - div.scrollTop) < 1) {
                if (page < pages) {
                    makeBox(dataJSON, page, bxpage);
                }
            }
        }, {
            passive: true
        });
    }
});
