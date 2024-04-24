var messages = {
    "musa-title": "Progetto MuSa",
    "table-title": "Titolo",
    "table-year": "Anno",
    "table-duration": "Durata",
    "table-head-nav": "elementi per pagina",
    "table-no-data": "Nessuna informazioni",
    "table-footer-page": "Vai alla pagina:",
    "table-footer-show": "Risultati da ",
    "table-footer-to": " a ",
    "table-footer-of": " di ",
    "table-footer-entries": " elementi",
    "table-footer-prevbutt": "Precedente",
    "table-footer-nextbutt": "Successivo",
    "head-genre-filter": "Genere",
    "head-year-filter": "Anno",
    "head-search": "Cerca..."
};

Musa.prototype.loadLocale = function() {
    if (typeof messages !== '' && messages !== 'undefined') {
        this.translations = messages;
    }
}
