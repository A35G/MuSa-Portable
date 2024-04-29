var messages = {
    "musa-lang-dir": "ltr",
    "musa-lang-name": "fr",
    "musa-title": "Projet MuSa",
    "table-title": "Titre",
    "table-year": "Année",
    "table-duration": "Durée",
    "table-head-nav": "entrées par page",
    "table-no-data": "Pas de données",
    "table-footer-page": "Aller à la page:",
    "table-footer-show": "Affichage ",
    "table-footer-to": " à ",
    "table-footer-of": " de ",
    "table-footer-entries": " entrées",
    "table-footer-prevbutt": "Précédente",
    "table-footer-nextbutt": "Suivante",
    "head-genre-filter": "Genre",
    "head-year-filter": "Année",
    "head-search": "Recherche..."
};

Musa.prototype.loadLocale = function() {
    if (typeof messages !== '' && messages !== 'undefined') {
        this.translations = messages;
    }
}
