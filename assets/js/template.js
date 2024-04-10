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

function makeFilters() {
    if (typeof dataJSON !== 'undefined' && dataJSON !== '') {
        let gnr = dataJSON.genres;
        if (gnr.length > 0 && gnr[0] !== '') {
            $("#vgenre").html("");

            let u = 0;
            for (var i = 0; i < gnr.length; i++) {
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

            $("#fgenre").removeClass("d-none");
        }

        let yrs = dataJSON.years;
        if (yrs.length > 0 && yrs[0] !== '') {
            $("#vyear").html("");

            let m = 0;
            for (var i = 0; i < yrs.length; i++) {
                if (parseInt(m) == 0) {
                    var sxv = document.createElement("div");
                    sxv.className = "row row-cols-1 row-cols-sm-2 row-cols-md-4";
                }

                let yr = document.createElement("div");
                yr.className = "col text-start";

                let ayr = document.createElement("a");
                ayr.className = "text-reset text-decoration-none";
                ayr.textContent = yrs[i];
                ayr.setAttribute("href", path + '?f=' + yrs[i] + '&type=year');

                yr.appendChild(ayr);

                sxv.appendChild(yr);
                m++;

                if (parseInt(m) == 4) {
                    document.getElementById("vyear").appendChild(sxv);
                    m = 0;
                }
            }

            $("#fyear").removeClass("d-none");
        }
    }
}

function loadVideo(args) {
    if (typeof args !== undefined && typeof args !== null) {
        let opx = args[0];
        if (opx.filename !== "") {
            document.getElementById("boxd").textContent = "";

            $("#navi").removeClass("d-none");

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

function makeBox(args, page, perPage) {
    const element = document.getElementById("boxd");
    element.textContent = "";

    if (parseInt(page) === 1) {
        var ddm = document.createElement("div");
        ddm.className = "row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3";
        ddm.id = "contbox";
    }

    const fragment = document.createDocumentFragment();

    if (typeof args !== undefined && typeof args !== null ) {

        let dataj = args.archive;
        let index, offSet;
  
        if (page == 1 || page <=0)  {
            index = 0;
            offSet = perPage;
        } else if (page > dataj.length) {
            index = page - 1;
            offSet = dataj.length;
        } else {
            index = page * perPage - perPage;
            offSet = index + perPage;
        }

        const slicedItems = dataj.slice(index, offSet);

        for (var x = 0; x < slicedItems.length; ++x) {

            let mloc = "";
            if (slicedItems[x].hasOwnProperty('cover')) {
                if (slicedItems[x].cover !== "") {
                    mloc = "./media/cover/" + slicedItems[x].cover;
                }
            }

            let shortTrama = "";
            if (slicedItems[x].hasOwnProperty('description')) {
                let textTrama = slicedItems[x].description;
                
                if (textTrama !== "") {
                    shortTrama = strip_tags(textTrama);
                    shortTrama = (shortTrama.length > 70) ? shortTrama.substring(0, 70) + "..." : shortTrama;
                }
            }

            var obis = {
                titoloFilm: slicedItems[x].title,
                testoTrama: slicedItems[x].description,
                locandinaFilm: mloc,
                annoFilm: (slicedItems[x].year === "" || parseInt(slicedItems[x].year) === 0) ? "" : parseInt(slicedItems[x].year),
                genereFilm: (slicedItems[x].tags === "" || slicedItems[x].tags[0] === "") ? "" : slicedItems[x].tags.join(", "),
                durataFilm: (slicedItems[x].duration2 === "") ? "" : slicedItems[x].duration2
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
                divCard.appendChild(svgc);
            }

            const cardB = document.createElement("div");
            cardB.className = "card-body";

            const h5 = document.createElement("h5");
            h5.className = "card-title text-truncate";
            h5.textContent = slicedItems[x].title;

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
            sm3.textContent += " " + slicedItems[x].year;
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
            var ustr = path + "?v=" + slicedItems[x].identity;
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
    }

    ddm.appendChild(fragment);

    if (parseInt(page) === 1) {
        element.appendChild(ddm);
    }

    page++;
}

function makeTable(args) {
    const element = document.getElementById("boxd");
    element.textContent = "";

    const fragment = document.createDocumentFragment();

    if (typeof args !== undefined && typeof args !== null ) {
        var bx = 1;

        const tbl = document.createElement("table");
        tbl.className = "table table-hover table-sm";
        tbl.setAttribute("cellpadding", "3");
        tbl.setAttribute("cellspacing", "0");

        const th = document.createElement("thead");
        th.className = "table-light";

        const thtr = document.createElement("tr");

        let thls = ["#","Titolo","Anno","Durata",""];

        for (var i = 0; i < thls.length; i++) {
            const thr = document.createElement("th");
            thr.setAttribute("scope", "col");
            thr.textContent = thls[i];

            if (parseInt(i) == 0) {
                thr.className = "text-center";
                thr.setAttribute("style", "width: 5%;");
            }

            if (parseInt(i) == 2 || parseInt(i) == 3 || parseInt(i) == 4) {
                thr.className = "text-center";
                thr.setAttribute("style", "width: 10%;");
            }

            thtr.appendChild(thr);
        }

        th.appendChild(thtr);

        tbl.appendChild(th);

        const tb = document.createElement("tbody");
        tb.className = "table-group-divider";

        for (var x = 0; x < args.archive.length; ++x) {
            const tbtr = document.createElement("tr");

            for (var i = 0; i < thls.length; i++) {
                var tbr = document.createElement("td");

                if (parseInt(i) == 0) {
                    tbr.className = "text-center align-middle";
                    let sm0 = document.createElement("small");
                    sm0.textContent = bx;
                    tbr.appendChild(sm0);
                }

                if (parseInt(i) == 1) {
                    tbr.className = "align-middle";

                    let sm1 = document.createElement("small");
                    let spn = document.createElement("span");
                    spn.textContent = args.archive[x].title
                    sm1.appendChild(spn);

                    tbr.appendChild(sm1);

                    let mloc = "";
                    if (args.archive[x].hasOwnProperty('cover')) {
                        if (args.archive[x].cover !== "") {
                            mloc = "./media/cover/" + args.archive[x].cover;
                        }
                    }

                    var obis = {
                        titoloFilm: args.archive[x].title,
                        testoTrama: args.archive[x].description,
                        locandinaFilm: mloc,
                        annoFilm: (args.archive[x].year === "" || parseInt(args.archive[x].year) === 0) ? "" : parseInt(args.archive[x].year),
                        genereFilm: (args.archive[x].tags === "" || args.archive[x].tags[0] === "") ? "" : args.archive[x].tags.join(", "),
                        durataFilm: (args.archive[x].duration2 === "") ? "" : args.archive[x].duration2
                    }

                    let dataMedia = JSON.stringify(obis);

                    const dvh = document.createElement("div");
                    dvh.className = "d-none";
                    dvh.id = "trm" + bx;
                    dvh.textContent = dataMedia;

                    tbr.appendChild(dvh);
                }

                if (parseInt(i) == 2) {
                    tbr.className = "text-center align-middle";
                    let yr = (args.archive[x].year === "" || parseInt(args.archive[x].year) === 0) ? " -  - " : args.archive[x].year;
                    let sm2 = document.createElement("small");
                    sm2.textContent = yr;
                    tbr.appendChild(sm2);
                }

                if (parseInt(i) == 3) {
                    tbr.className = "text-center align-middle";
                    let tm = ((args.archive[x].duration2 === "") ? " -  - " : args.archive[x].duration2);
                    let sm3 = document.createElement("small");
                    sm3.textContent = tm;
                    tbr.appendChild(sm3);
                }

                if (parseInt(i) == 4) {
                    tbr.className = "text-center align-middle";

                    let alnk = document.createElement("a");
                    alnk.className = "btn btn-sm btn-icon border-0 showInfo";
                    alnk.setAttribute("title", "Info");
                    alnk.setAttribute("data-src", "trm" + bx);

                    let aimg = document.createElement("i");
                    aimg.className = "bi-info-circle";

                    alnk.appendChild(aimg);

                    tbr.appendChild(alnk);

                    let apln = document.createElement("a");
                    let ustr = path + "?v=" + args.archive[x].identity;
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

            tb.appendChild(tbtr);

            ++bx;
        }

        tbl.appendChild(tb);

        fragment.appendChild(tbl);
    }

    element.appendChild(fragment);
}