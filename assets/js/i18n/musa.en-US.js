var messages = {
    "musa-lang-dir": "ltr",
    "musa-lang-name": "en",
    "musa-title": "MuSa Project",
    "table-title": "Title",
    "table-year": "Year",
    "table-duration": "Duration",
    "table-head-nav": "entries per page",
    "table-no-data": "No data",
    "table-footer-page": "Go to page:",
    "table-footer-show": "Showing ",
    "table-footer-to": " to ",
    "table-footer-of": " of ",
    "table-footer-entries": " entries",
    "table-footer-prevbutt": "Previous",
    "table-footer-nextbutt": "Next",
    "head-genre-filter": "Genre",
    "head-year-filter": "Year",
    "head-search": "Search..."
};

Musa.prototype.loadLocale = function() {
    if (typeof messages !== '' && messages !== 'undefined') {
        this.translations = messages;
    }
}
