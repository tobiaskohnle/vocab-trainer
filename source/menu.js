'use strict';

function array_flat(array, depth=1) {
    let new_array = [];

    if (depth > 0) {
        let any_flattened = false;

        for (const element of array) {
            if (element instanceof Array) {
                new_array.push(...element);
                any_flattened = true;
            }
            else {
                new_array.push(element);
            }
        }

        if (any_flattened) {
            return array_flat(new_array, depth-1);
        }
    }

    return array;
}

const type = {
    translation:    'translation',
    synonym:        'synonym',
    antonym:        'antonym',
    collocation_of: 'collocation_of',
    collocation:    'collocation',
    form:           'form',
    gaps:           'gaps',
};

function toggle_menu() {
    const menu = document.querySelector('.menu');
    if (menu.style.display == 'grid') {
        menu.style.display = 'none';
    }
    else {
        menu.style.display = 'grid';
    }
}

function close_menu() {
    document.querySelector('.menu').style.display = 'none';
}

function popup_container_click(e) {
    if (e.target == document.querySelector('.popup-container')) {
        close_popup();
    }
}

function close_popup() {
    document.querySelector('.popup-container').style.display = 'none';
    document.querySelector('.popup-info')     .style.display = 'none';
    document.querySelector('.popup-confirm')  .style.display = 'none';
    document.querySelector('.popup-query')    .style.display = 'none';
}

function open_popup_info(text) {
    document.querySelector('.popup-container').style.display = 'grid';
    document.querySelector('.popup-info').style.display = 'inherit';

    document.querySelector('.popup-info span').innerText = `${text}`;
    document.querySelector('.popup-info .popup-button.confirm').onclick = function() {
        close_popup();
    };
}

function open_popup_confirm(text, onconfirm) {
    document.querySelector('.popup-container').style.display = 'grid';
    document.querySelector('.popup-confirm').style.display = 'inherit';

    document.querySelector('.popup-confirm span').innerText = `${text}`;
    document.querySelector('.popup-confirm .popup-button.confirm').onclick = onconfirm;
}

function open_popup_login() {
    document.querySelector('.popup-container').style.display = 'grid';
    document.querySelector('.popup-login').style.display = 'inherit';
}

let popup_query_loaded_vocab = [];

function open_popup_query(query_placeholder='') {
    document.querySelector('.popup-container').style.display = 'grid';
    document.querySelector('.popup-query').style.display = 'inherit';

    document.querySelector('.popup-query input').value = query_placeholder;

    function check_query() {
        popup_query_loaded_vocab = load_vocab(document.querySelector('.popup-query input').value);
        update_popup_span();
    }

    function update_popup_span() {
        document.querySelector('.popup-query span').innerHTML
            = `<span style='color:${
                popup_query_loaded_vocab.length == 0
                ? 'var(--popup-update-red-span-color)'
                : 'var(--popup-update-green-span-color)'
            }'>${popup_query_loaded_vocab.length} cards selected<span>`;
    }

    document.querySelector('.popup-query .popup-button.update').onclick = function() {
        if (document.querySelector('.popup-query input').value.toLowerCase() == 'files') {
            upload_vocab(function(vocab) {
                popup_query_loaded_vocab.push(...vocab);
                update_popup_span();
            });
        }
        else {
            check_query();
        }
    }

    check_query();

    document.querySelector('.popup-query .popup-button.confirm').onclick = function() {
        add_vocab(popup_query_loaded_vocab);

        new_vocab();

        close_popup();
        open_popup_info(`${popup_query_loaded_vocab.length} cards added.\n${vocab.length} cards in total.`);
    };

    // document.querySelector('.popup-query span').innerText = `${text}`;
    // document.querySelector('.popup-query .popup-button.confirm').onclick = onconfirm;
}

onsubmit = function(e) {
    e.preventDefault();
}
onclick = function(e) {
    const path = e.path || e.composedPath();

    if (!(path.includes(document.querySelector('.menu-button'))
        || path.includes(document.querySelector('.menu')))) {
        close_menu();
    }
}

function update_switches() {
    for (const setting in settings) {
        const element = document.querySelector(`[setting=${setting}]`);

        if (element) {
            element.checked = settings[setting];
        }
    }
}

function update_theme() {
    document.querySelector('.custom-stylesheet').href = `source/style-${settings.dark_theme ? 'dark' : 'light'}.css`;
}

function card_onbeforeinput() {
    if (current_card.confirm_mistake) {
        check_current_vocab();
    }
}
function card_oninput() {
    update_submit_button();
}

function update_settings_vocab_marked() {
    document.querySelector('.hard-menu-item' ).classList.remove('menu-item-marked');
    document.querySelector('.tough-menu-item').classList.remove('menu-item-marked');
    document.querySelector('.easy-menu-item' ).classList.remove('menu-item-marked');
    document.querySelector('.ignore-menu-item' ).classList.remove('menu-item-marked');

    if (current_card.vocab) {
        switch (current_card.vocab.marked) {
            case marked.hard:
                document.querySelector('.hard-menu-item' ).classList.add('menu-item-marked');
                break;
            case marked.tough:
                document.querySelector('.tough-menu-item').classList.add('menu-item-marked');
                break;
            case marked.easy:
                document.querySelector('.easy-menu-item' ).classList.add('menu-item-marked');
                break;
            case marked.ignore:
                document.querySelector('.ignore-menu-item' ).classList.add('menu-item-marked');
                break;
        }
    }
}

function add_vocab(new_vocab) {
    if (new_vocab) {
        if (!vocab) {
            vocab = [];
        }

        console.info(`Added ${new_vocab.length} new vocab.`);

        vocab.push(...new_vocab);
        save_progress();
    }
}

function upload_vocab(callback) {
    const upload_file_element = document.createElement('input');
    upload_file_element.type = 'file';
    upload_file_element.setAttribute('multiple', '');

    upload_file_element.click();

    upload_file_element.onchange = function(e) {
        const files = upload_file_element.files;

        for (const file of files) {
            const reader = new FileReader();

            reader.onload = function(e) {
                callback(try_parse_vocab(reader.result));
            }

            reader.readAsText(file);
        }
    }
}
function try_parse_vocab(text) {
    let parsed_text;

    try {
        parsed_text = JSON.parse(text);
    }
    catch (e) {
        try {
            parsed_text = JSON.parse(format_json(text));
        }
        catch (e) {
            console.error('Invalid json.', `Thrown exception: ${e.toString()}`);
            return [];
        }
    }

    if (parsed_text.vocab) {
        const {vocab:parsed_vocab, image_urls:parsed_image_urls} = parsed_text;

        for (const [image,url] of Object.entries(parsed_image_urls)) {
            image_urls[image] = url;
        }

        return try_convert_vocab(parsed_vocab);
    }

    return try_convert_vocab(parsed_text);
}
function try_convert_vocab(parsed_vocab) {
    if (!parsed_vocab instanceof Array) {
        console.error(`Vocab must be of type 'List'.`);
        return [];
    }

    const new_vocab_list = [];

    for (const voc of parsed_vocab) {
        try {
            if (!voc instanceof Object) {
                console.warn(`Every vocab must be of type 'Object'.`);
                continue;
            }

            function has_property(object, property, predicate) {
                if (!object.hasOwnProperty(property)) {
                    return false;
                }
                if (!predicate(object[property])) {
                    return false;
                }
                return true;
            }

            const func_is_string = string => typeof string == 'string';
            const func_is_type   = string => func_is_string(string) && Object.keys(type).includes(string.type);
            const func_is_vocab  = string => func_is_string(string);

            const new_vocab_type = has_property(voc, 'type', func_is_type) ? voc.type : type.translation;

            if (has_property(voc, 'gaps', func_is_string)) {
                new_vocab_list.push({
                    type: type.gaps,
                    segments: get_gaps_text(voc.gaps),
                    image: voc.image||null,
                });
            }
            else if (!has_property(voc, 'en', func_is_vocab)) {
                console.warn(`Every vocab must have a property 'en'. Vocab: '${JSON.stringify(voc)}'`);
                continue;
            }

            if (new_vocab_type == type.translation) {
                if (has_property(voc, 'en', func_is_vocab)) {
                    if (has_property(voc, 'de', func_is_vocab)) {
                        new_vocab_list.push({
                            type: type.translation,
                            en: get_variants(voc.en),
                            de: get_variants(voc.de),
                            image: voc.image||null,
                        });
                    }
                    if (has_property(voc, type.synonym, func_is_vocab)) {
                        new_vocab_list.push({
                            type: type.synonym,
                            en: get_variants(voc.en),
                            de: get_variants(voc.synonym),
                            image: voc.image||null,
                        });
                    }
                    if (has_property(voc, type.antonym, func_is_vocab)) {
                        new_vocab_list.push({
                            type: type.antonym,
                            en: get_variants(voc.en),
                            de: get_variants(voc.antonym),
                            image: voc.image||null,
                        });
                    }
                    if (has_property(voc, type.collocation_of, func_is_vocab)) {
                        new_vocab_list.push({
                            type: type.collocation,
                            en: get_variants(voc.en),
                            de: get_variants(voc.collocation_of),
                            image: voc.image||null,
                        });
                    }
                    if (has_property(voc, type.collocation, func_is_vocab)) {
                        new_vocab_list.push({
                            type: type.collocation,
                            en: get_variants(voc.collocation),
                            de: get_variants(voc.en),
                            image: voc.image||null,
                        });
                    }
                    if (has_property(voc, type.form, func_is_vocab)) {
                        new_vocab_list.push({
                            type: type.form,
                            en: get_variants(voc.en),
                            de: get_variants(voc.form),
                            image: voc.image||null,
                        });
                    }
                }
            }
            else {
                if (!has_property(voc, 'de', func_is_vocab)) {
                    console.warn(`Every vocab of type 'translation' must have a property 'de'. Vocab: '${JSON.stringify(voc)}'`);
                    continue;
                }

                new_vocab_list.push({
                    type: new_vocab_type,
                    en: get_variants(voc.en),
                    de: get_variants(voc.de),
                    image: voc.image||null,
                });
            }
        }
        catch (error) {
            console.warn(`Error while computing variants. Error: '${error.toString()}', Vocab: '${JSON.stringify(voc)}'`);
            throw error;
        }
    }

    return new_vocab_list;
}

function load_vocab(query) {
    // 'query'               = explaination
    // '53'                  = all vocab on page no.53
    // '51:4'                = page no.51, vocab no.4
    // '51,53'               = all vocab on page no.51 AND no.53
    // '51,53:2'             = all vocab on page no.51 AND page no.51, vocab no.2
    // '53:4-53:7'           = page no.53, vocab no.4 TO no.7 including
    // '51:1-52:4,52:6'      = 51:1,51:2,51:3,51:4,51:6
    // '51-53'               = 51:1,51:2,...,51:n,52:1,52:2,...,52:n,53:1,53:2,...,53:n

    const vocab_set = new Set;

    const vocab_all = [
        vocab_35,
        vocab_37,
        vocab_39,
        vocab_41,
        vocab_43,
        vocab_45,
        vocab_47,
        vocab_49,
        vocab_51,
        vocab_53,
        vocab_55,
        vocab_57,
        vocab_77,
        vocab_79,
        vocab_81,
        vocab_83,
        vocab_85,
        vocab_87,
        vocab_89,
        vocab_91,
        vocab_167,
        vocab_169,
        vocab_171,
        vocab_173,
        vocab_201,
        vocab_203,
        vocab_205,
        vocab_207,
        vocab_215,
        vocab_217,
        vocab_219,
        vocab_sport,
        vocab_environment,
    ];

    const all_vocab = array_flat(vocab_all);

    function vocab_get_page(page) {
        const pages = [
            '35',
            '37',
            '39',
            '41',
            '43',
            '45',
            '47',
            '49',
            '51',
            '53',
            '55',
            '57',
            '77',
            '79',
            '81',
            '83',
            '85',
            '87',
            '89',
            '91',
            '167',
            '169',
            '171',
            '173',
            '201',
            '203',
            '205',
            '207',
            '215',
            '217',
            '219',
            'sport',
            'environment',
        ];
        return vocab_all[pages.indexOf(page)];
    }

    function vocab_def_get_range(vocab_def) {
        const def = vocab_def.split(/:/);

        if (vocab_def == '*') {
            return [0, all_vocab.length-1];
        }

        const page = vocab_get_page(def[0]);

        if (page) {
            if (def.length == 1) {
                return [all_vocab.indexOf(page[0]), all_vocab.indexOf(page[page.length-1])];
            }

            const index = def[1] - 1;
            if (index >= 0 && index < page.length) {
                return [all_vocab.indexOf(page[index])];
            }
        }

        return [-1];
    }

    if (query) {
        for (const vocab_range of query.replace(/\s/g, '').split(/,/)) {
            const range_def = vocab_range.split(/-/);

            let start_index = Infinity;
            let end_index = -Infinity;

            let any_index_valid = false;

            for (const vocab_def of range_def) {
                const range = vocab_def_get_range(vocab_def);

                for (const index of range) {
                    if (index >= 0) {
                        any_index_valid = true;
                        start_index = Math.min(start_index, index);
                        end_index = Math.max(end_index, index);
                    }
                }
            }

            if (any_index_valid) {
                for (let i = start_index; i <= end_index; i++) {
                    vocab_set.add(i);
                }
            }
        }
    }

    const selected_vocab = all_vocab.filter((_,i) => vocab_set.has(i));
    return try_convert_vocab(selected_vocab);
}

function mark_current_vocab(mark_as) {
    if (!current_card.vocab) {
        console.warn('cannot mark empty card');
        open_popup_info('You cannot mark an empty card.');
        return;
    }

    if (current_card.vocab.marked == mark_as) {
        current_card.vocab.marked = null;
    }
    else {
        current_card.vocab.marked = mark_as;
    }

    if (get_filtered_vocab().length == 0) {
        clear_filter();
    }

    update_card();
    save_progress();
}

function update_setting(element) {
    settings[element.getAttribute('setting')] = element.checked;
    save_settings();
}

function toggle_show_more() {
    const hidden_elements = document.querySelectorAll('.hidden');
    const visible_elements = document.querySelectorAll('.not-hidden');

    for (const element of hidden_elements) {
        element.classList.add('not-hidden');
        element.classList.remove('hidden');
    }

    for (const element of visible_elements) {
        element.classList.add('hidden');
        element.classList.remove('not-hidden');
    }
}

function update_vocab_image() {
    const card_image = document.querySelector('.card-image');

    const image = current_card.vocab && current_card.vocab.image;
    if (image) {
        const image_url = image_urls[image]||'';

        if (!current_card.vocab.image_bounds) {
            current_card.vocab.image_bounds = {};
        }

        card_image.style.display = '';
        card_image.style.backgroundImage = `url(${image_url})`;
        card_image.style.width = `${current_card.vocab.image_bounds.width||200}px`;
        card_image.style.height = `${current_card.vocab.image_bounds.height||100}px`;
        card_image.style.transform = `translate(${current_card.vocab.image_bounds.x||0}px,${current_card.vocab.image_bounds.y||0}px)`;
    }
    else {
        card_image.style.display = 'none';
    }
}
