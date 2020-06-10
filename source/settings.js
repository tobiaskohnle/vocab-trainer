'use strict';

function save_progress() {
    localStorage.setItem('vocab', JSON.stringify(vocab));
    update_card();
}
function load_progress() {
    const vocab_object = localStorage.getItem('vocab');
    const stored_image_urls = localStorage.getItem('image-urls');

    if (stored_image_urls) {
        image_urls = JSON.parse(stored_image_urls);
    }
    else {
        console.error('Can\'t load images');
    }

    if (vocab_object) {
        vocab = JSON.parse(vocab_object);
        if (vocab instanceof Array) {
            update_card();
        }
    }
    else {
        reset_progress();
    }
}

function save_settings() {
    localStorage.setItem('settings', JSON.stringify(settings));
    update_card();
}
function load_settings() {
    const loaded_settings = JSON.parse(localStorage.getItem('settings'));

    Object.assign(settings, default_settings);

    if (loaded_settings instanceof Object) {
        Object.assign(settings, loaded_settings);
    }
}

function format_json(json) {
    return json
        .replace(/\,(?=\s*?[\}\]])/g, '') // trailing commas
        .replace(/['"]?(\w+)['"]?\s*:/g, '"$1":') // unquoted keys
        // .replace(/\'([^:,"\n]*)\'/g, '"$1"') // single quotes
        .replace(/([\{\[])?(?:\s|[^\{\}\[\]:,'"])+([\{\}\[\]])/g, '$1$2') // extra characters
}
