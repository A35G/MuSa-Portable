function Musa(json, options) {
    let defOpt = {
        template: "full",
        perPages: 10,
        entrow: [10, 25, 50, 100],
        container: "boxd"
    }

    options = { ...defOpt, ...options };

    let _this = this;
    let startIndex = 1;
    let endIndex = 1;
    var path, j, nj;
    let locale;
    this.translations = {};
    let btn = document.getElementById("btop");

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

    function loadDatabase() {
        if (typeof json !== 'undefined' && validJSON(json)) {
            try {
                j = JSON.parse(json);
            } catch(e) {
                console.log(e);
                return false;
            }

            return true;
        }
    }

    function isNum(args) {
        return (!isNaN(args) && !isNaN(parseFloat(args)));
    }

    function nl2br(str, replaceMode, isXhtml) {
        let breakTag = (isXhtml) ? '<br />' : '<br>';
        let replaceStr = (replaceMode) ? '$1'+ breakTag : '$1'+ breakTag +'$2';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
    }

    function strip_tags(input, allowed) {
        allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)

        let tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

        return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
    }

    function loadPages(nelm, perPage) {
        const totalItems = nelm;
        perPage = perPage ? perPage : 1;
        return Math.ceil(totalItems/perPage);
    }

    async function translateApp(element) {
        const key = element.getAttribute("data-i18n");
        const translation = _this.translations[key];
        if (element.tagName == "INPUT") {
            element.setAttribute("placeholder", translation);
            element.setAttribute("aria-label", translation);
        } else {
            element.innerText = translation;
        }
    }

    this.init = function() {
        let base = location.href;
        let pathname = location.pathname;
        let x1 = base.indexOf(pathname);
        path = base.substr(0, x1);
        path += pathname;

        if (typeof this.loadLocale !== "undefined" && typeof this.loadLocale === "function") {
            this.loadLocale();
        }

        if (loadDatabase()) {
            this.makeFilter();

            var params = new URLSearchParams(window.location.search);
            if (params.has("v")) {
                this.findMedia(params);
            } else if (params.has("f")) {
                this.dataFromFilter(params);
            } else {
                if (options.template === "simple") {
                    let t = this.prepareTable();
                    if (t) {
                        let nmrs = document.getElementById("rwnt").value;
                        let nmr = (isNum(nmrs)) ? nmrs : options.perPages;
                        this.loadTableData(startIndex, nmr);
                    }
                }

                if (options.template === "full") {
                    let b = this.prepareBox();
                    if (b) {
                        this.loadBoxData(startIndex, options.perPages);

                        window.addEventListener("scroll", async () => {
                            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                                await _this.loadBoxData(startIndex, options.perPages);
                            }
                        });
                    }
                }
            }

            window.addEventListener("scroll", () => {
                if (window.scrollY > 300) {
                    btn.classList.add('show');
                } else {
                    btn.classList.remove('show');
                }
            });

            document.addEventListener('input', function(event) {
                if (event.target.id == "qr") {
                    let search = event.target.value;
                    search = search.trim();
                    if (search !== '' && search !== null) {
                        search = strip_tags(search);

                        const brdc = document.getElementById("navi");
                        const isHide = brdc.classList.contains("d-none");
                        if (isHide) {
                            brdc.classList.remove("d-none"); 
                        }

                        document.getElementById("ttlm").textContent = 'Hai cercato: ' + search;
                        startIndex = 1;

                        const newElements = j.archive
                        .filter((item) => {
                            return (
                                item.title.toLowerCase().includes(search) ||
                                item.description.toLowerCase().includes(search)
                            );
                        });

                        if (newElements.length > 0 && newElements[0] !== '') {
                            nj = {
                                template: j.template,
                                totalmedia: newElements.length,
                                archive: newElements
                            }

                            if (options.template === 'full') {
                                let b = _this.prepareBox();
                                if (b) {
                                    _this.loadBoxData(startIndex, options.perPages);

                                    window.addEventListener("scroll", async () => {
                                        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                                            await _this.loadBoxData(startIndex, options.perPages);
                                        }
                                    });
                                }
                            }

                            if (options.template === 'simple') {
                                let t = _this.prepareTable();
                                if (t) {
                                    let nmrs = document.getElementById("rwnt").value;
                                    let nmr = (isNum(nmrs)) ? nmrs : options.perPages;
                                    _this.loadTableData(startIndex, nmr);
                                }
                            }
                        }
                    } else {
                        document.getElementById("navi").classList.add("d-none");
                        document.getElementById("ttlm").textContent = '';

                        nj = void 0;
                        startIndex = 1;

                        if (options.template === 'full') {
                            let b = _this.prepareBox();
                            if (b) {
                                _this.loadBoxData(startIndex, options.perPages);

                                window.addEventListener("scroll", async () => {
                                    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                                        await _this.loadBoxData(startIndex, options.perPages);
                                    }
                                });
                            }
                        }

                        if (options.template === 'simple') {
                            let t = _this.prepareTable();
                            if (t) {
                                let nmrs = document.getElementById("rwnt").value;
                                let nmr = (isNum(nmrs)) ? nmrs : options.perPages;
                                _this.loadTableData(startIndex, nmr);
                            }
                        }
                    }
                }
            });

            btn.addEventListener("click",function(event) {
                event.preventDefault();
                window.scroll({top: 0, left: 0, behavior: 'smooth'});
            });

            document.addEventListener("DOMContentLoaded", () => {
                let html = document.querySelector("html");
                html.setAttribute("dir", _this.translations["musa-lang-dir"]);
                html.setAttribute("lang", _this.translations["musa-lang-name"]);

                document.querySelectorAll("[data-i18n]")
                .forEach(translateApp);
            });
        }
    }

    this.makeFilter = function() {
        if ('genres' in j) {
            let gnr = j.genres;
            if (gnr.length > 0 && gnr[0] !== '') {
                document.getElementById("vgenre").textContent = "";

                let u = 0;
                for (let i = 0; i < gnr.length; i++) {
                    if (parseInt(u) == 0) {
                        var bxv = document.createElement("div");
                        bxv.className = "row row-cols-1 row-cols-sm-2 row-cols-md-4";
                    }

                    let gm = document.createElement("div");
                    gm.className = "col text-start";

                    let agn = document.createElement("a");
                    agn.className = "text-reset text-decoration-none";
                    agn.textContent = gnr[i];
                    agn.setAttribute("href", path + '?f=' + gnr[i] + '&type=genre');

                    gm.appendChild(agn);

                    bxv.appendChild(gm);
                    u++;

                    if (parseInt(u) == 4) {
                        document.getElementById("vgenre").appendChild(bxv);
                        u = 0;
                    }
                }

                if (gnr.length % 4) {
                    document.getElementById("vgenre").appendChild(bxv);
                }

                document.getElementById("fgenre").classList.remove("d-none");
            }
        }

        if ('years' in j) {
            let yrs = j.years;
            if (yrs.length > 0 && yrs[0] !== '') {
                document.getElementById("vyear").textContent = "";

                let m = 0;
                for (let y = 0; y < yrs.length; y++) {
                    if (parseInt(m) == 0) {
                        var sxv = document.createElement("div");
                        sxv.className = "row row-cols-1 row-cols-sm-2 row-cols-md-4";
                    }

                    let yr = document.createElement("div");
                    yr.className = "col text-start";

                    let ayr = document.createElement("a");
                    ayr.className = "text-reset text-decoration-none";
                    ayr.textContent = yrs[y];
                    ayr.setAttribute("href", path + '?f=' + yrs[y] + '&type=year');

                    yr.appendChild(ayr);

                    sxv.appendChild(yr);
                    m++;

                    if (parseInt(m) == 4) {
                        document.getElementById("vyear").appendChild(sxv);
                        m = 0;
                    }
                }

                if (yrs.length % 4) {
                    document.getElementById("vyear").appendChild(sxv);
                }

                document.getElementById("fyear").classList.remove("d-none");
            }
        }
    }

    this.prepareTable = function() {
        const element = document.getElementById(options.container);
        element.textContent = "";

        //  Header options
        const upnavtable = document.createElement("div");
        upnavtable.className = 'row mb-3';

        const col1 = document.createElement("div");
        col1.className = 'col-md-3';

        const cnt2 = document.createElement("select");
        cnt2.className = 'form-select form-select-sm mx-2 text-center';
        cnt2.setAttribute("style", "width: 80px; float: left;");
        cnt2.setAttribute("name", "nment");
        cnt2.id = 'rwnt';

        options.entrow.forEach((elm) => {
            const opt = document.createElement("option");
            opt.setAttribute("value", elm);
            opt.textContent = elm;

            if (parseInt(options.perPages) == parseInt(elm)) {
                opt.setAttribute("selected", "selected");
            }

            cnt2.appendChild(opt);
        });

        col1.appendChild(cnt2);

        cnt2.addEventListener("change", function(event) {
            _this.editEntryPage(event.target.value);
        });

        const cnt3 = document.createElement("span");
        cnt3.className = 'mt-1';
        cnt3.setAttribute("style", "float: left;");
        const sm2 = document.createElement("small");
        sm2.textContent = 'entries per page';
        sm2.setAttribute("data-i18n","table-head-nav");
        cnt3.appendChild(sm2);

        col1.appendChild(cnt3);

        upnavtable.appendChild(col1);

        element.appendChild(upnavtable);

        //  Table
        const tbl = document.createElement("table");
        tbl.className = "table table-hover table-sm";
        tbl.setAttribute("cellpadding", "3");
        tbl.setAttribute("cellspacing", "0");
        tbl.id = "mediaList";

        const th = document.createElement("thead");
        th.className = "table-light";

        const thtr = document.createElement("tr");

        let thls = ["#","Title","Year","Duration",""];
        let n = 0;

        thls.forEach((lb) => {
            const thr = document.createElement("th");
            thr.setAttribute("scope", "col");
            thr.textContent = lb;

            if (n == 0) {
                thr.className = "text-center";
                thr.setAttribute("style", "width: 5%;");
            }

            if (n == 1) {
                thr.setAttribute("data-i18n","table-title");
            }

            if (n == 2) {
                thr.setAttribute("data-i18n","table-year");
            }

            if (n == 3) {
                thr.setAttribute("data-i18n","table-duration");
            }

            if (n == 2 || n == 3 || n == 4) {
                thr.className = "text-center";
                thr.setAttribute("style", "width: 10%;");
            }

            thtr.appendChild(thr);

            n++;
        });

        th.appendChild(thtr);

        tbl.appendChild(th);

        const tb = document.createElement("tbody");
        tb.className = "table-group-divider";
        tb.id = "mvbody";

        const deftr = document.createElement("tr");
        const deftd = document.createElement("td");
        deftd.setAttribute("colspan", 5);
        deftd.className = "text-center";
        deftd.textContent = "No data";
        deftd.setAttribute("data-i18n","table-no-data");

        deftr.appendChild(deftd);
        tb.appendChild(deftr);

        tbl.appendChild(tb);

        element.appendChild(tbl);

        //  Footer options
        const footfnc = document.createElement("div");
        footfnc.className = 'row';

        const fcol1 = document.createElement("div");
        fcol1.className = 'col-md-3';
        const sp1 = document.createElement("span");
        sp1.className = 'mt-1';
        sp1.setAttribute("style", "float: left;");
        const sp1cn = document.createElement("small");
        sp1cn.textContent = 'Go to page:';
        sp1cn.setAttribute("data-i18n","table-footer-page");

        sp1.appendChild(sp1cn);
        fcol1.appendChild(sp1);

        footfnc.appendChild(fcol1);

        const fslc = document.createElement("select");
        fslc.className = 'form-select form-select-sm mx-2 text-center';
        fslc.setAttribute("style", "width: 70px; float: left;");
        fslc.id = 'selpg';
        fslc.setAttribute("name", "selectpage");

        const defopt = document.createElement("option");
        defopt.setAttribute("value", 1);
        defopt.textContent = 1;

        fslc.appendChild(defopt);

        fcol1.appendChild(fslc);

        fslc.addEventListener("change", function(event) {
            _this.loadPage(event.target.value);
        });

        const fcol2 = document.createElement("div");
        fcol2.className = 'col-md-3';

        const fsm2 = document.createElement("small");
        fsm2.className = 'mx-5';

        const spsh = document.createElement("span");
        spsh.setAttribute("data-i18n","table-footer-show");
        spsh.textContent = "Showing ";
        fsm2.append(spsh);

        const sp2 = document.createElement("span");
        sp2.id = 'actp';
        sp2.textContent = 0;

        fsm2.append(sp2);

        const spto = document.createElement("span");
        spto.setAttribute("data-i18n","table-footer-to");
        spto.textContent = " to ";
        fsm2.append(spto);

        const sp3 = document.createElement("span");
        sp3.id = 'lstp';
        sp3.textContent = 0;

        fsm2.append(sp3);

        const spof = document.createElement("span");
        spof.setAttribute("data-i18n","table-footer-of");
        spof.textContent = " of ";
        fsm2.append(spof);

        const sp4 = document.createElement("span");
        sp4.id = 'totp';
        sp4.textContent = 0;

        fsm2.append(sp4);

        const spent = document.createElement("span");
        spent.setAttribute("data-i18n","table-footer-entries");
        spent.textContent = " entries";
        fsm2.append(spent);

        fcol2.appendChild(fsm2);

        footfnc.appendChild(fcol2);

        const fcol3 = document.createElement("div");
        fcol3.className = 'col-md-6 text-end';

        const nav = document.createElement("nav");
        const lsn = document.createElement("ul");
        lsn.id = 'tablenav';
        lsn.className = 'pagination pagination-sm justify-content-end';

        const pbutt = document.createElement("li");
        pbutt.id = 'prevs';
        pbutt.className = "page-item disabled";

        const plnk = document.createElement("a");
        plnk.className = 'page-link';
        plnk.setAttribute("href", "javascript:;");
        plnk.setAttribute("data-act", "prev");
        plnk.textContent = "Previous";
        plnk.setAttribute("data-i18n","table-footer-prevbutt");
        pbutt.appendChild(plnk);

        plnk.addEventListener("click", function() {
            _this.previous();
        });

        const nbutt = document.createElement("li");
        nbutt.id = 'nexta';
        nbutt.className = 'page-item disabled';

        const nlnk = document.createElement("a");
        nlnk.className = 'page-link';
        nlnk.setAttribute("href", "javascript:;");
        nlnk.setAttribute("data-act", "next");
        nlnk.textContent = "Next";
        nlnk.setAttribute("data-i18n","table-footer-nextbutt");
        nbutt.appendChild(nlnk);

        nlnk.addEventListener("click", function() {
            _this.next();
        });

        lsn.appendChild(pbutt);
        lsn.appendChild(nbutt);

        nav.appendChild(lsn);

        fcol3.appendChild(nav);

        footfnc.appendChild(fcol3);

        element.appendChild(footfnc);

        return true;
    }

    this.loadTableData = function(i, n) {
        let tpage = parseInt(i);
        const element = document.getElementById("mvbody");
        element.textContent = "";

        const fragment = document.createDocumentFragment();

        let totalr = 0;

        let dataj = (typeof nj !== '' && typeof nj !== 'undefined') ? nj.archive : j.archive;
        let index, offSet;
  
        if (parseInt(tpage) == 1 || parseInt(tpage) <= 0)  {
            index = 0;
            offSet = parseInt(n);
        } else if (parseInt(tpage) > dataj.length) {
            index = parseInt(tpage) - 1;
            offSet = dataj.length;
        } else {
            index = parseInt(tpage) * parseInt(n) - parseInt(n);
            offSet = parseInt(index) + parseInt(n);
        }

        const pItem = dataj.slice(index, offSet);
        totalr = dataj.length;

        let bx = 1;
        if (parseInt(i) > 1) {
            let ov = ((parseInt(i) * parseInt(n)) - parseInt(n));
            bx = (parseInt(bx) + parseInt(ov));
        }

        let cln = document.getElementById('mediaList').rows[0].cells.length;

        for (let x = 0; x < pItem.length; ++x) {
            const tbtr = document.createElement("tr");

            for (let u = 0; u < cln; u++) {
                var tbr = document.createElement("td");
                let dvc = "trm" + bx;

                if (parseInt(u) == 0) {
                    tbr.className = "text-center align-middle";
                    let sm0 = document.createElement("small");
                    sm0.textContent = bx;
                    tbr.appendChild(sm0);
                }

                if (parseInt(u) == 1) {
                    tbr.className = "align-middle";

                    let sm1 = document.createElement("small");
                    let spn = document.createElement("span");
                    spn.textContent = pItem[x].title
                    sm1.appendChild(spn);

                    tbr.appendChild(sm1);

                    let mloc = "";
                    if (pItem[x].hasOwnProperty('cover')) {
                        if (pItem[x].cover !== "") {
                            mloc = "./media/cover/" + pItem[x].cover;
                        }
                    }

                    var obis = {
                        titoloFilm: pItem[x].title,
                        testoTrama: pItem[x].description,
                        locandinaFilm: mloc,
                        annoFilm: (pItem[x].year === "" || parseInt(pItem[x].year) === 0) ? "" : parseInt(pItem[x].year),
                        genereFilm: (pItem[x].tags === "" || pItem[x].tags[0] === "") ? "" : pItem[x].tags.join(", "),
                        durataFilm: (pItem[x].duration2 === "") ? "" : pItem[x].duration2
                    }

                    let dataMedia = JSON.stringify(obis);

                    const dvh = document.createElement("div");
                    dvh.className = "d-none";
                    dvh.id = dvc;
                    dvh.textContent = dataMedia;

                    tbr.appendChild(dvh);
                }

                if (parseInt(u) == 2) {
                    tbr.className = "text-center align-middle";
                    let yr = (pItem[x].year === "" || parseInt(pItem[x].year) === 0) ? " -  - " : pItem[x].year;
                    let sm2 = document.createElement("small");
                    sm2.textContent = yr;
                    tbr.appendChild(sm2);
                }

                if (parseInt(u) == 3) {
                    tbr.className = "text-center align-middle";
                    let tm = ((pItem[x].duration2 === "") ? " -  - " : pItem[x].duration2);
                    let sm3 = document.createElement("small");
                    sm3.textContent = tm;
                    tbr.appendChild(sm3);
                }

                if (parseInt(u) == 4) {
                    tbr.className = "text-center align-middle";

                    let alnk = document.createElement("a");
                    alnk.className = "btn btn-sm btn-icon border-0 showInfo";
                    alnk.setAttribute("title", "Info");
                    alnk.setAttribute("data-src", dvc);

                    let aimg = document.createElement("i");
                    aimg.className = "bi-info-circle";

                    alnk.appendChild(aimg);

                    tbr.appendChild(alnk);

                    alnk.addEventListener("click", function() {
                        _this.loadMediaCard(dvc);
                    });

                    let apln = document.createElement("a");
                    let ustr = path + "?v=" + pItem[x].identity;
                    apln.className = "btn btn-sm btn-icon border-0 viewVideo";
                    apln.setAttribute("href", ustr);
                    apln.setAttribute("title", "Avvia");

                    let pimg = document.createElement("i");
                    pimg.className = "bi-play-circle";

                    apln.appendChild(pimg);

                    tbr.appendChild(apln);
                }

                tbtr.appendChild(tbr);
            }

            fragment.appendChild(tbtr);

            ++bx;
        }

        element.appendChild(fragment);

        let bw = 1;
        if (parseInt(i) > 1) {
            bw = (parseInt(bw) + parseInt(index));
        }

        document.getElementById("actp").textContent = parseInt(bw);

        let dr = ((parseInt(bw) + parseInt(n)) - 1);
        document.getElementById("lstp").textContent = ((parseInt(dr) > parseInt(totalr)) ? parseInt(totalr) : parseInt(dr));

        document.getElementById("totp").textContent = parseInt(totalr);

        if (parseInt(i) === 1) {
            if (document.getElementById("prevs").classList.contains("disabled") == false) {
                document.getElementById("prevs").classList.add("disabled"); 
            }
        } else {
            if (document.getElementById("prevs").classList.contains("disabled")) {
                document.getElementById("prevs").classList.remove("disabled"); 
            }
        }

        const ntm = (typeof nj !== '' && typeof nj !== 'undefined') ? nj.totalmedia : j.totalmedia;
        let pages = loadPages(ntm, n);
        if (parseInt(i) === parseInt(pages)) {
            if (document.getElementById("nexta").classList.contains("disabled") == false) {
                document.getElementById("nexta").classList.add("disabled"); 
            }
        } else {
            if (document.getElementById("nexta").classList.contains("disabled")) {
                document.getElementById("nexta").classList.remove("disabled"); 
            }
        }

        const pgsl = document.getElementById("selpg");
        pgsl.innerHTML = "";

        const frgsel = document.createDocumentFragment();
        for (let rs = 1; rs <= pages; rs++) {
            const opts = document.createElement("option");
            opts.textContent = rs;
            opts.setAttribute("value", rs);

            frgsel.appendChild(opts);
        }

        pgsl.appendChild(frgsel);

        startIndex = i;
        endIndex = pages;

        return true;
    }

    this.next = function() {
        if (isNum(startIndex)) {
            let newI = parseInt(startIndex) + 1;
            let nmrs = document.getElementById("rwnt").value;
            let nmr = (isNum(nmrs)) ? nmrs : options.perPages;
            if (this.loadTableData(newI, nmr)) {
                document.querySelector("#selpg").value = startIndex;
            }
        }
    }

    this.previous = function() {
        if (isNum(startIndex)) {
            let newI = parseInt(startIndex) - 1;
            let nmrs = document.getElementById("rwnt").value;
            let nmr = (isNum(nmrs)) ? nmrs : options.perPages;
            if (this.loadTableData(newI, nmr)) {
                document.querySelector("#selpg").value = startIndex;
            }
        }
    }

    this.loadPage = function(n) {
        if (isNum(n)) {
            let nmrs = document.getElementById("rwnt").value;
            let nmr = (isNum(nmrs)) ? nmrs : options.perPages;
            if (this.loadTableData(n, nmr)) {
                document.querySelector("#selpg").value = n;
            }
        }
    }

    this.editEntryPage = function(r) {
        if (isNum(r)) {
            if (this.loadTableData(1, r)) {
                document.querySelector("#selpg").value = 1;
            }
        }
    }

    this.dataFromFilter = function(args) {
        let valid = false;
        if (typeof args !== 'undefined') {
            let fl = args.get("f");
            if (fl !== null && fl !== '') {
                if (args.has("type")) {
                    let tx = strip_tags(args.get("type"));
                    if (tx == 'genre') {
                        const brdc = document.getElementById("navi");
                        const isHide = brdc.classList.contains("d-none");
                        if (isHide) {
                            brdc.classList.remove("d-none"); 
                        }

                        document.getElementById("ttlm").textContent = 'Genere: ' + fl;

                        let rs = j.archive.filter(function(e) {
                            return e.tags.some((el) => fl === el);
                        });

                        if (rs.length > 0) {
                            valid = true;

                            nj = {
                                template: j.template,
                                totalmedia: rs.length,
                                archive: rs
                            };

                            if (options.template === "simple") {
                                let t = this.prepareTable();
                                if (t) {
                                    let nmrs = document.getElementById("rwnt").value;
                                    let nmr = (isNum(nmrs)) ? nmrs : options.perPages;

                                    this.loadTableData(1, nmr);
                                }
                            }

                            if (options.template === "full") {
                                let b = this.prepareBox();
                                if (b) {
                                    this.loadBoxData(startIndex, options.perPages);

                                    window.addEventListener("scroll", async () => {
                                        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                                            await _this.loadBoxData(startIndex, options.perPages);
                                        }
                                    });
                                }
                            }
                        }
                    }

                    if (tx == 'year') {
                        const brdc = document.getElementById("navi");
                        const isHide = brdc.classList.contains("d-none");
                        if (isHide) {
                            brdc.classList.remove("d-none"); 
                        }

                        document.getElementById("ttlm").textContent = 'Anno: ' + fl;

                        let rs = j.archive.filter(function(e) {
                            return e.year == fl;
                        });

                        if (rs.length > 0) {
                            valid = true;

                            nj = {
                                template: j.template,
                                totalmedia: rs.length,
                                archive: rs
                            };

                            if (options.template === "simple") {
                                let t = this.prepareTable();
                                if (t) {
                                    let nmrs = document.getElementById("rwnt").value;
                                    let nmr = (isNum(nmrs)) ? nmrs : options.perPages;

                                    this.loadTableData(1, nmr);
                                }
                            }

                            if (options.template === "full") {
                                let b = this.prepareBox();
                                if (b) {
                                    this.loadBoxData(startIndex, options.perPages);

                                    window.addEventListener("scroll", async () => {
                                        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                                            await _this.loadBoxData(startIndex, options.perPages);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!valid) {
            location.href = path;
        }
    }

    this.findMedia = function(args) {
        let valid = false;
        if (typeof args !== 'undefined') {
            let m = args.get("v");
            if (m !== null && m !== '') {
                let rs = j.archive.filter(function(e) {
                    return e.identity == m
                });

                if (rs.length > 0) {
                    valid = true;
                    this.loadVideo(rs);
                }
            }
        }

        if (!valid) {
            location.href = path;
        }
    }

    this.loadVideo = function(args) {
        if (typeof args !== undefined && typeof args !== null) {
            let opx = args[0];
            if (opx.filename !== "") {
                document.getElementById("boxd").textContent = "";

                const brdc = document.getElementById("navi");
                const isHide = brdc.classList.contains("d-none");
                if (isHide) {
                    brdc.classList.remove("d-none"); 
                }

                document.getElementById("ttlm").textContent = opx.title;

                let cntr = document.createElement("center");
                let vdp = document.createElement("video");
                vdp.setAttribute("controls", true);
                vdp.setAttribute("width", "100%");
                vdp.setAttribute("height", "510");
                vdp.setAttribute("poster", "./media/cover/" + opx.cover);
                let srcv = document.createElement("source");
                srcv.setAttribute("type", "video/mp4");
                srcv.setAttribute("src", "./media/video/" + opx.filename);
                let vadv = document.createElement("p");
                let tx = "Il tuo Browser non supporta la visualizzazione diretta ";
                tx += "di video.";
                vadv.textContent = tx;

                vdp.appendChild(srcv);
                vdp.appendChild(vadv);
                cntr.appendChild(vdp);

                document.getElementById("boxd").appendChild(cntr);

                let nfm = document.createElement("div");
                nfm.className = "alert alert-light mt-3";
                nfm.setAttribute("role", "alert");

                let h4 = document.createElement("h4");
                h4.className = "alert-heading";
                h4.textContent = opx.title;

                let brk = document.createElement("br");

                let txm = document.createElement("p");
                txm.innerHTML = nl2br(opx.description);

                nfm.appendChild(h4);
                nfm.appendChild(brk);
                nfm.appendChild(txm);

                document.getElementById("boxd").appendChild(nfm);
            }
        }
    }

    this.prepareBox = function() {
        const element = document.getElementById(options.container);
        element.textContent = "";

        var ddm = document.createElement("div");
        ddm.className = "row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3";
        ddm.id = "contbox";

        element.appendChild(ddm);

        return true;
    }
    
    this.makeDefaultCover = function() {
        let svgc = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgc.className = "bd-placeholder-img card-img-top";
        svgc.setAttribute("width", "100%");
        svgc.setAttribute("height", "411");
        svgc.setAttribute("role", "img");
        svgc.setAttribute("aria-label", "Placeholder: Locandina");
        svgc.setAttribute("preserveAspectRatio", "xMidYMid slice");
        svgc.setAttribute("focusable", "false");

        const svgt = document.createElementNS("http://www.w3.org/2000/svg", "title");
        svgt.textContent = "Placeholder";

        const svgr = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        svgr.setAttribute("width", '100%');
        svgr.setAttribute("height", '100%');
        svgr.setAttribute("fill", "#55595c");

        const tx = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tx.setAttribute("x", "35%");
        tx.setAttribute("y", "50%");
        tx.setAttribute("fill", "#eceeef");
        tx.setAttribute("dy", ".3em");
        tx.textContent = "Locandina";

        svgc.appendChild(svgt);
        svgc.appendChild(svgr);
        svgc.appendChild(tx);

        return svgc;
    }

    this.loadBoxData = function(p, n) {
        const element = document.getElementById("contbox");

        const fragment = document.createDocumentFragment();

        let dataj = (typeof nj !== '' && typeof nj !== 'undefined') ? nj.archive : j.archive;
        let index, offSet;
  
        if (parseInt(p) == 1 || parseInt(p) <= 0)  {
            index = 0;
            offSet = parseInt(n);
        } else if (parseInt(p) > dataj.length) {
            index = parseInt(p) - 1;
            offSet = dataj.length;
        } else {
            index = parseInt(p) * parseInt(n) - parseInt(n);
            offSet = parseInt(index) + parseInt(n);
        }

        const sItems = dataj.slice(index, offSet);

        let bx = 1;
        if (parseInt(p) > 1) {
            let ov = ((parseInt(p) * parseInt(n)) - parseInt(n));
            bx = (parseInt(bx) + parseInt(ov));
        }

        for (let x = 0; x < sItems.length; ++x) {
            let mloc = "";
            if (sItems[x].hasOwnProperty('cover')) {
                if (sItems[x].cover !== "") {
                    mloc = "./media/cover/" + sItems[x].cover;
                }
            }

            let shortTrama = "";
            if (sItems[x].hasOwnProperty('description')) {
                let textTrama = sItems[x].description;
                
                if (textTrama !== "") {
                    shortTrama = strip_tags(textTrama);
                    shortTrama = (shortTrama.length > 70) ? shortTrama.substring(0, 70) + "..." : shortTrama;
                }
            }

            let obis = {
                titoloFilm: sItems[x].title,
                testoTrama: sItems[x].description,
                locandinaFilm: mloc,
                annoFilm: (sItems[x].year === "" || parseInt(sItems[x].year) === 0) ? "" : parseInt(sItems[x].year),
                genereFilm: (sItems[x].tags === "" || sItems[x].tags[0] === "") ? "" : sItems[x].tags.join(", "),
                durataFilm: (sItems[x].duration2 === "") ? "" : sItems[x].duration2
            }

            let dataMedia = JSON.stringify(obis);

            const divCol = document.createElement("div");
            divCol.className = 'col';

            const divCard = document.createElement("div");
            divCard.className = 'card shadow-sm h-100';

            if (mloc !== "") {
                const cprt = document.createElement("img");
                cprt.src = mloc;
                cprt.className = 'bd-placeholder-img card-img-top';
                cprt.setAttribute("width",'100%');
                cprt.setAttribute("height",'411');

                divCard.appendChild(cprt);
            } else {
                divCard.appendChild(this.makeDefaultCover());
            }

            const cardB = document.createElement("div");
            cardB.className = "card-body";

            const h5 = document.createElement("h5");
            h5.className = "card-title text-truncate";
            h5.textContent = sItems[x].title;

            cardB.appendChild(h5);

            const p = document.createElement("p");
            p.className = "card-text";
            p.setAttribute("height", "50");

            if (shortTrama !== "") {
                const em = document.createElement("em");
                const sm1 = document.createElement("small");
                sm1.textContent = shortTrama;

                em.appendChild(sm1);
                p.appendChild(em);
            } else {
                p.innerHTML = "<br /><br />";
            }

            cardB.appendChild(p);

            const dj = document.createElement("div");
            dj.className = "d-flex justify-content-between align-items-center";

            const extd = document.createElement("div");
            const sm2 = document.createElement("small");
            sm2.className = "text-body-secondary";
            sm2.textContent = "Anno:";
            const blx = document.createElement("b");
            blx.appendChild(sm2);
            extd.appendChild(blx);
            const sm3 = document.createElement("small");
            sm3.className = "text-body-secondary";
            sm3.textContent += " " + sItems[x].year;
            extd.appendChild(sm3);

            dj.appendChild(extd);

            const dvb = document.createElement("div");
            dvb.className = "btn-group";

            const btt1 = document.createElement("button");
            btt1.setAttribute("type", "button");
            btt1.setAttribute("data-src", "trm" + bx);
            btt1.className = "btn btn-sm btn-outline-secondary showInfo";
            btt1.textContent = "Info";

            dvb.appendChild(btt1);

            const btt2 = document.createElement("a");
            let ustr = path + "?v=" + sItems[x].identity;
            btt2.setAttribute("href", ustr);
            btt2.className = "btn btn-sm btn-outline-secondary viewVideo";
            btt2.textContent = "Avvia";

            dvb.appendChild(btt2);

            dj.appendChild(dvb);

            cardB.appendChild(dj);

            const dvh = document.createElement("div");
            dvh.className = "d-none";
            dvh.id = "trm" + bx;
            dvh.textContent = dataMedia;

            cardB.appendChild(dvh);

            divCard.appendChild(cardB);

            divCol.appendChild(divCard);

            fragment.appendChild(divCol);

            ++bx;
        }

        const ntm = (typeof nj !== '' && typeof nj !== 'undefined') ? nj.totalmedia : j.totalmedia;
        let pages = loadPages(ntm, n);

        if (parseInt(p) == parseInt(startIndex)) {
            element.appendChild(fragment);
        }

        if (parseInt(startIndex) <= parseInt(pages)) {
            ++startIndex;
        }
    }

    this.loadMediaCard = function(args) {
        if (typeof args !== 'undefined' && typeof args !== '') {
            let elem = document.getElementById(args);
            if (typeof(elem) !== 'undefined' && elem !== null) {
                var cntData = elem.textContent;

                if (typeof cntData !== 'undefined' 
                    && typeof cntData !== null 
                    && cntData.length > 0 
                    && validJSON(cntData)) {

                    try {
                        var m = JSON.parse(cntData);
                    } catch(e) {
                        console.log(e);
                        return false;
                    }

                    document.getElementById("tramaLabel").textContent = m.titoloFilm;

                    if (typeof m.locandinaFilm !== undefined 
                        && typeof m.locandinaFilm !== null 
                        && m.locandinaFilm.length > 0) {
                        document.getElementById("coverModal").textContent = "";

                        var imgc = document.createElement("img");
                        imgc.className = "bd-placeholder-img card-img-top shadow";
                        imgc.setAttribute("src", m.locandinaFilm);
                        imgc.setAttribute("width", "100%");

                        document.getElementById("coverModal").appendChild(imgc);
                    } else {
                        document.getElementById("coverModal").classList.add("d-none");
                    }

                    if (m.annoFilm === "" 
                        && m.genereFilm === "" 
                        && m.durataFilm === "") {
                        document.getElementById("coverModal").classList.add("d-none");
                    } else {
                        let prd = ((m.annoFilm === "") ? " -  - " : m.annoFilm);
                        document.getElementById("yrv").textContent = prd;

                        let gnr = ((m.genereFilm === "") ? " -  - " : m.genereFilm);
                        document.getElementById("lstg").textContent = gnr;

                        let tm = ((m.durataFilm === "") ? " -  - " : m.durataFilm);
                        document.getElementById("tmdr").textContent = tm;
                    }

                    let cvr = document.getElementById("coverModal");
                    let nfr = document.getElementById("infom");
                    if (cvr.classList.contains("d-none") 
                        && nfr.classList.contains("d-none")) {
                        document.getElementById("latsx").classList.add("d-none");
                        document.getElementById("latdx").classList.remove("col-md-8");
                        document.getElementById("latdx").classList.add("col-md-12");
                    }

                    if (m.testoTrama !== "") {
                        document.getElementById("textModal").innerHTML = nl2br(m.testoTrama);
                    } else {
                        document.getElementById("strmd").classList.remove("modal-lg");
                    }

                    detailsModal = bootstrap.Modal.getOrCreateInstance("#dettTrama");

                    detailsModal.show();
                }
            }
        }
    }

    this.init();
}
