'use strict';

let current_card = {div: null, vocab: {}};
let vocab = [];

let settings = {};

let default_settings = {
    dark_theme: false,
    auto_save: true,
    show_variants: true,
    macros: true,
    auto_compress_images: true,
    image_pixel_limit: 20000,
};

let image_urls = {};

function download_string(text, file_name) {
    const blob = new Blob([text], {type: 'txt'});

    const a = document.createElement('a');
    a.download = file_name;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = `${a.download}:${a.href}`;
    a.click();

    URL.revokeObjectURL(a.href);
}

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

onclick = function(e) {
    const path = e.path || e.composedPath();

    if (!(path.includes(document.querySelector('.menu-button'))
        || path.includes(document.querySelector('.menu')))) {
        close_menu();
    }
}

const macros = [
    {chars:'sb.',   replace_with:'[sb|somebody]',     index:0},
    {chars:'sth.',  replace_with:'[sth|something]',   index:0},
    {chars:'jmdn.', replace_with:'[jmdn.|jemanden]',  index:0},
    {chars:'jmds.', replace_with:'[jmds.|jemandes]',  index:0},
    {chars:'jmdm.', replace_with:'[jmdm.|jemandem]',  index:0},
    {chars:'etw.',  replace_with:'[etw.|etwas]',      index:0},
    {chars:'\'c',   replace_with:'\u00e7',            index:0},
    {chars:'\'C',   replace_with:'\u00c7',            index:0},
];

onkeydown = function(e) {
    if (e.ctrlKey && e.key == 's') {
        save();
        return false;
    }
    if (e.ctrlKey && e.key == 'Delete') {
        if (current_card.div) {
            remove_vocab(current_card.div);
        }
        return false;
    }
    if (e.ctrlKey && e.key == ' ') {
        new_vocab();
        return false;
    }
    if (e.key == 'ArrowUp') {
        select_relative(-1);
        return false;
    }
    if (e.key == 'ArrowDown') {
        select_relative(1);
        return false;
    }

    if (settings.macros) {
        if (e.key == 'Shift' || e.key == 'Control' || e.key == 'Alt' || e.key == 'Super') {
            return;
        }

        for (const macro of macros) {
            const chars = macro.chars.split('');

            if (e.key == chars[macro.index]) {
                macro.index++;

                if (macro.index == chars.length) {
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;

                    e.target.value = `${
                        e.target.value.substr(0,start-chars.length+1)
                    }${
                        macro.replace_with
                    }${
                        e.target.value.substr(end)
                    }`;

                    setTimeout(save);

                    e.target.selectionStart = e.target.selectionEnd = start-chars.length+macro.replace_with.length+1;
                    macro.index = 0;

                    e.preventDefault();
                    return false;
                }
            }
            else if (e.key == chars[0]) {
                macro.index = 1;
            }
            else {
                macro.index = 0;
            }
        }
    }
}

function select_relative(offset) {
    const vocab_divs = Array.from(document.querySelectorAll('.vocab'));
    const vocab_div = vocab_divs[(vocab_divs.indexOf(current_card.div)+offset+vocab_divs.length) % vocab_divs.length];
    select_card(vocab_div);

    return false;
}

function compress_image(url,max_pixel_amount=settings.image_pixel_limit||default_settings.image_pixel_limit) {
    const image = new Image;
    image.src = url;

    return new Promise(function(resolve, reject) {
        image.onload = function() {
            let width = image.width;
            let height = image.height;

            const image_pixel_amount = width*height;

            let ratio = 1;
            if (image_pixel_amount > max_pixel_amount) {
                ratio = Math.sqrt(max_pixel_amount/image_pixel_amount);
                width *= ratio;
                height *= ratio;
                width |= 0;
                height |= 0;
            }

            // const offscreen_canvas = new OffscreenCanvas(width,height);
            const offscreen_canvas = document.createElement('canvas');
            offscreen_canvas.width = width;
            offscreen_canvas.height = height;

            const offscreen_context = offscreen_canvas.getContext('2d');
            offscreen_context.drawImage(image,0,0,image.width,image.height,0,0,width,height);

            const downscaled_image_url = offscreen_canvas.toDataURL('image/png');

            resolve({ratio,url:downscaled_image_url});
        }

        image.onerror = function() {
            reject();
        }
    });
}
function remove_image() {
    delete current_card.vocab.image;

    document.querySelector('.image-name').innerText = '<no image>';
    document.querySelector('.image-name').style.color = 'var(--inactive-color)';

    document.querySelector('.add-image-button').style.display = '';
    document.querySelector('.remove-image-button').style.display = 'none';
}
function add_image(file_name) {
    current_card.vocab.image = file_name;

    document.querySelector('.image-name').style.color = '';
    document.querySelector('.image-name').innerText = file_name;

    document.querySelector('.add-image-button').style.display = 'none';
    document.querySelector('.remove-image-button').style.display = '';
}
onbeforeunload = function() {
    save();
}
onload = function() {
    clear_card();

    document.querySelectorAll('.input').forEach(element => {
        element.oninput = function() {
            if (settings.auto_save) {
                setTimeout(save);
            };
        }
    });

    load_settings();
    update_switches();
    update_theme();

    load_progress();

    document.querySelector('.new-vocab').scrollIntoView({block: 'end'});

    document.querySelector('.add-image-button').onclick = function() {
        const file_input_element = document.createElement('input');
        file_input_element.setAttribute('type', 'file');
        file_input_element.click();

        file_input_element.onchange = function() {
            const [file] = file_input_element.files;

            delete current_card.vocab.image;

            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = function() {
                    if (settings.auto_compress_images) {
                        compress_image(reader.result).then(({url}) => {
                            image_urls[file.name] = url;
                        });
                    }

                    image_urls[file.name] = reader.result;
                    add_image(file.name);
                };

                reader.onerror = remove_image;
            }
            else {
                remove_image();
                save();
            }
        }
    };

    document.querySelector('.remove-image-button').onclick = function() {
        remove_image();
        save();
    }

    // save();
}

function load_example() {
    const add_example_vocab = function(voc) {
        vocab.push(voc);

        new_vocab(voc);
        select_card(current_card.div);
    };

    const function_load_example = function() {
        remove_all_vocab();
        add_example_vocab({
            en: 'jewel',
            de: '[Juwel, Edelstein]',
        });
        add_example_vocab({
            en: 'to proclaim [sb|somebody] [empress/emperor]',
            de: '[jmdn.|jemanden] [zur Kaiserin/zum Kaiser] ausrufen',
            collocation_of: '[to] proclaim',
        });
        add_example_vocab({
            en: 'former',
            de: '[ehemalige(r\\/s), frühere(r\\/s)]',
            antonym: 'future',
        });
        add_example_vocab({
            en: 'amateur',
            de: '[Amateur(in)|Amateur|Amateurin]',
        });
        add_example_vocab({
            en: 'zu [jmds.|jemandes] [Gunsten/Vorteil]',
            de: 'for [sb|somebody]\'s benefit',
        });
    };

    if (vocab.length) {
        open_popup_confirm('Discard All Vocab And Load Example?', function_load_example);
    }
    else {
        function_load_example();
    }
}

function upload_json() {
    const input = document.createElement('input');
    input.type = 'file';
    // input.setAttribute('multiple', '');
    // input.setAttribute('directory', '');
    // input.setAttribute('webkitdirectory', '');

    input.click();

    input.onchange = function(e) {
        const files = input.files;

        for (const file of files) {
            const reader = new FileReader;

            reader.onload = function() {
                open_popup_confirm('Discard Current Vocab And Load New Vocab?', function() {
                    remove_all_vocab();

                    const parsed_file = JSON.parse(reader.result);
                    let parsed_vocab;

                    if (parsed_file.vocab) {
                        const {vocab:_parsed_vocab, image_urls:parsed_image_urls} = parsed_file;

                        parsed_vocab = _parsed_vocab;

                        for (const [image,url] of Object.entries(parsed_image_urls)) {
                            image_urls[image] = url;
                        }
                    }
                    else {
                        parsed_vocab = parsed_file;

                        for (const voc of parsed_vocab) {
                            if (voc.image) {
                                voc.image = voc.image.name;
                            }
                        }
                    }

                    for (const voc of parsed_vocab) {
                        vocab.push(voc);

                        new_vocab(voc);
                        select_card(current_card.div);
                    }
                });
            }

            reader.readAsText(file);
        }
    }
}

function download_json() {
    download_string(JSON.stringify({vocab,image_urls}, null, 2), 'vocab.json');
}

function local_storage_size_info() {
    const bytes_per_char = 2;

    let local_storage_bytes = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            local_storage_bytes += localStorage.getItem(key).length * bytes_per_char;
        }
    }

    let vocab_images_bytes = 0;
    let amount_images = 0;

    for (const voc of vocab) {
        if (voc.image) {
            const url = image_urls[voc.image];

            if (!url) {
                console.warn(`url for image '${url}' does not exist`);
                continue;
            }

            amount_images++;
            vocab_images_bytes += url.length * bytes_per_char;
        }
    }

    const pixel_limit = settings.image_pixel_limit;
    return {amount_images, vocab_images_bytes, pixel_limit, storage_bytes:local_storage_bytes, storage_byte_quota:10*1024*1024};
}
function recompress_all_images_popup() {
    open_popup_confirm_error(`Compress all images?`, recompress_all_images);
}
function recompress_all_images() {
    const info_before_compression = local_storage_size_info();

    return Promise
        .allSettled(Object
            .entries(image_urls)
            .map(([image,url]) =>
                compress_image(url).then(({url}) => {
                    image_urls[image] = url;
                })
            )
        )
        .then(() => {
            const info = local_storage_size_info();
            info.vocab_image_bytes_before = info_before_compression.vocab_images_bytes;
            console.warn(Object.entries(info).map(([key,value]) => `${key}: ${value}`).join('\n'));

            open_popup_info(`All images compressed.`);
        });
}
function set_local_storage_item_on_error(error) {
    console.error(error);

    if (error.name == 'QuotaExceededError') {
        open_popup_info_error('Saving failed because local storage is full.');
    }
}
function export_vocab() {
    open_popup_confirm('Reset Progress and Replace Current Vocab?', function() {
        try {
            localStorage.setItem('image-urls', JSON.stringify(image_urls));
            localStorage.setItem('vocab', JSON.stringify(try_convert_vocab(vocab)));
        }
        catch (error) {
            set_local_storage_item_on_error(error);
        }
    });
}

function save() {
    document.querySelector('.input.en')            .style.borderColor = '';
    document.querySelector('.input.de')            .style.borderColor = '';
    document.querySelector('.input.synonym')       .style.borderColor = '';
    document.querySelector('.input.antonym')       .style.borderColor = '';
    document.querySelector('.input.form')          .style.borderColor = '';
    document.querySelector('.input.collocation')   .style.borderColor = '';
    document.querySelector('.input.collocation_of').style.borderColor = '';
    document.querySelector('.input.gaps')          .style.borderColor = '';

    function set_vocab_type(type) {
        delete current_card.vocab[type];

        const value = document.querySelector(`.input.${type}`).value;
        if (value) {
            current_card.vocab[type] = value;
        }
    }

    set_vocab_type('en');
    set_vocab_type('de');
    set_vocab_type('synonym');
    set_vocab_type('antonym');
    set_vocab_type('form');
    set_vocab_type('collocation');
    set_vocab_type('collocation_of');
    set_vocab_type('gaps');

    if (current_card.div) {
        current_card.div.classList.remove('todo');
    }

    const is_valid = {};

    function check_is_valid(type) {
        try {
            if (current_card.vocab[`${type}`]) {
                get_variants(current_card.vocab[`${type}`] || '');
                is_valid[type] = true;
                return;
            }
        }
        catch {}

        is_valid[type] = false;
    }

    check_is_valid('en');
    check_is_valid('de');
    check_is_valid('synonym');
    check_is_valid('antonym');
    check_is_valid('form');
    check_is_valid('collocation');
    check_is_valid('collocation_of');
    is_valid.gaps = !!current_card.vocab.gaps;

    // check_if_valid('gaps')
    // try {
    //     get_gaps_text(current_cards.vocab.gaps);
    //     is_valid.gaps = true;
    // }
    // catch {
    //     is_valid.gaps = false;
    // }

    function mark_as_todo(type) {
        if (current_card.div) {
            current_card.div.classList.add('todo');
        }
        document.querySelector(`.input.${type}`).style.borderColor = 'var(--todo-border-color)';
    }

    if (!is_valid.en && !is_valid.gaps) {
        mark_as_todo('en');
    }
    if (!is_valid.synonym && !is_valid.antonym && !is_valid.form && !is_valid.collocation && !is_valid.collocation_of && !is_valid.de) {
        mark_as_todo('de');
    }

    if (current_card.div) {
        if (!current_card.vocab.en && current_card.vocab.gaps) {
            current_card.div.innerText = `${current_card.vocab.gaps}`;
        }
        else if (current_card.vocab.en && current_card.vocab.de) {
            current_card.div.innerText = `${current_card.vocab.en}: ${current_card.vocab.de}`;
        }
        else if (current_card.vocab.en && current_card.vocab.synonym) {
            current_card.div.innerText = `${current_card.vocab.en} = ${current_card.vocab.synonym}`
        }
        else if (current_card.vocab.en && current_card.vocab.antonym) {
            current_card.div.innerText = `${current_card.vocab.en} \u2260 ${current_card.vocab.antonym}`
        }
        else if (current_card.vocab.en && current_card.vocab.form) {
            current_card.div.innerText = `form of ${current_card.vocab.en}: ${current_card.vocab.form}`
        }
        else if (current_card.vocab.en && current_card.vocab.collocation) {
            current_card.div.innerText = `collocation of ${current_card.vocab.en}: ${current_card.vocab.collocation}`
        }
        else if (current_card.vocab.en && current_card.vocab.collocation_of) {
            current_card.div.innerText = `collocation of ${current_card.vocab.collocation_of}: ${current_card.vocab.en}`
        }
        else if (current_card.vocab.en) {
            current_card.div.innerText = `${current_card.vocab.en}: ?`
        }
        else if (current_card.vocab.de) {
            current_card.div.innerText = `?: ${current_card.vocab.de}`
        }
        else {
            current_card.div.innerText = '?: ?';
        }
    }

    save_progress();
    update_variants();
}

function update_variants() {
    for (const type_string of ['en','de',...Object.values(type)]) {
        const element = document.querySelector(`.variants.${type_string}`);

        if (!element) {
            continue;
        }

        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    if (!settings.show_variants) {
        return;
    }

    function update_variants_of(type) {
        let variants;

        const element = document.querySelector(`.variants.${type}`);

        try {
            variants = get_variants(current_card.vocab[type]);
        }
        catch {
            return;
        }

        for (const variant of variants) {
            const span = document.createElement('span');
            const br = document.createElement('br');

            element.appendChild(span);
            element.appendChild(br);

            span.innerText = `"${variant}"`;
        }

        element.appendChild(document.createElement('br'));
    }

    update_variants_of('en');
    update_variants_of('de');
    update_variants_of('synonym');
    update_variants_of('antonym');
    update_variants_of('form');
    update_variants_of('collocation');
    update_variants_of('collocation_of');


    try {
        const gaps_variants = document.querySelector('.variants.gaps');

        if (current_card.vocab.gaps) {
            for (const segment of get_gaps_text(current_card.vocab.gaps)) {
                if (typeof segment == 'string') {
                    const span = document.createElement('span');
                    span.innerText = segment;

                    gaps_variants.appendChild(span);
                }
                else {
                    const span = document.createElement('span');
                    span.innerText = `${segment.gap}`;
                    span.style.fontWeight = 'bold';
                    span.style.fontStyle = 'normal';
                    span.style.textDecoration = 'underline';
                    span.style.color = 'var(--active-color)';

                    gaps_variants.appendChild(span);

                    if (segment.hint) {
                        const hint_span = document.createElement('span');
                        hint_span.innerText = ` (${segment.hint})`;
                        hint_span.style.fontStyle = 'normal';
                        hint_span.style.color = 'var(--inactive-color)';

                        gaps_variants.appendChild(hint_span);
                    }
                }
            }
        }
    }
    catch (e) {
        console.error(e);
    }
}

function clear_card() {
    document.querySelector('.input.en')            .value = '';
    document.querySelector('.input.de')            .value = '';
    document.querySelector('.input.synonym')       .value = '';
    document.querySelector('.input.antonym')       .value = '';
    document.querySelector('.input.form')          .value = '';
    document.querySelector('.input.collocation')   .value = '';
    document.querySelector('.input.collocation_of').value = '';
    document.querySelector('.input.gaps')          .value = '';
    remove_image();
}
function update_card() {
    document.querySelector('.input.en')            .value = current_card.vocab.en             || '';
    document.querySelector('.input.de')            .value = current_card.vocab.de             || '';
    document.querySelector('.input.synonym')       .value = current_card.vocab.synonym        || '';
    document.querySelector('.input.antonym')       .value = current_card.vocab.antonym        || '';
    document.querySelector('.input.form')          .value = current_card.vocab.form           || '';
    document.querySelector('.input.collocation')   .value = current_card.vocab.collocation    || '';
    document.querySelector('.input.collocation_of').value = current_card.vocab.collocation_of || '';
    document.querySelector('.input.gaps')          .value = current_card.vocab.gaps           || '';

    if (current_card.vocab.image) {
        add_image(current_card.vocab.image);
    }
    else {
        remove_image();
    }
}

function new_vocab(voc) {
    save();

    const div = document.createElement('div');
    document.querySelector('.sidebar').insertBefore(div, document.querySelector('.sidebar .new-vocab.icon.add'));

    div.classList.add('vocab', 'row');
    div.onclick = function() {
        select_card(this);
    }

    if (voc) {
        current_card = {div, vocab:voc};
    }
    else {
        if (current_card.div) {
            current_card.vocab = {};
        }
        else {
            current_card.div = div;
        }
        vocab.push(current_card.vocab);
    }

    select_card(div);
}

function remove_all_current_vocab() {
    open_popup_confirm_error('Remove All Vocab?', remove_all_vocab);
}
function remove_all_vocab() {
    vocab = [];

    const sidebar = document.querySelector('.sidebar');

    while (sidebar.querySelector('.vocab')) {
        sidebar.removeChild(sidebar.querySelector('.vocab'));
    }

    save_progress();

    select_card(null);
}

function remove_current_vocab() {
    open_popup_confirm_error('Remove Vocab?', function() {
        if (current_card.div) {
            remove_vocab(current_card.div);
        }
    });
}
function remove_vocab(div) {
    const index = Array.from(document.querySelector('.sidebar').children).indexOf(div);

    vocab.splice(index, 1);
    document.querySelector('.sidebar').removeChild(div);

    clear_card();

    const all_vocab = Array.from(document.querySelectorAll('.vocab'));
    select_card(all_vocab[index] || all_vocab[all_vocab.length-1]);
}

function select_card(div) {
    document.querySelectorAll('.vocab').forEach(element => {
        element.classList.remove('selected');
    });

    const index = Array.from(document.querySelector('.sidebar').children).indexOf(div);

    current_card = {div, vocab: vocab[index] || {}};
    update_card();
    update_variants();

    if (div) {
        div.classList.add('selected');
        document.querySelector('.input.en').focus();
        div.scrollIntoView({block: 'nearest', inline: 'nearest'});
    }

    save();
}

function update_theme() {
    document.querySelector('.custom-stylesheet').href = `source/style-${settings.dark_theme ? 'dark' : 'light'}.css`;
}

function update_setting(element) {
    settings[element.getAttribute('setting')] = element.checked;
    save_settings();
}

function save_progress() {
    try {
        localStorage.setItem('image-urls', JSON.stringify(image_urls));
        localStorage.setItem('temp-vocab', JSON.stringify(vocab));
    }
    catch (error) {
        set_local_storage_item_on_error(error);
    }
}
function load_progress() {
    const stored_vocab = localStorage.getItem('temp-vocab');
    const stored_image_urls = localStorage.getItem('image-urls');

    vocab = JSON.parse(stored_vocab);

    if (vocab) {
        for (const voc of vocab) {
            new_vocab(voc);
        }
    }
    else {
        vocab = [];
        save_progress();

        console.error('Can\'t load vocab from storage');
    }

    image_urls = JSON.parse(stored_image_urls);

    if (!image_urls) {
        image_urls = {};
        save_progress();

        console.error('Can\'t load images from storage');
    }
}

function save_settings() {
    try {
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    catch (error) {
        set_local_storage_item_on_error(error);
    }
}
function load_settings() {
    const loaded_settings = JSON.parse(localStorage.getItem('settings'));

    Object.assign(settings, default_settings);
    Object.assign(settings, loaded_settings);
}

function update_switches() {
    for (const setting in settings) {
        const element = document.querySelector(`[setting=${setting}]`);

        if (element) {
            element.checked = settings[setting];
        }
    }
}

function close_popup() {
    document.querySelector('.popup-container')     .style.display = 'none';
    document.querySelector('.popup-info')          .style.display = 'none';
    document.querySelector('.popup-confirm')       .style.display = 'none';
    document.querySelector('.popup-info-error')    .style.display = 'none';
    document.querySelector('.popup-confirm-error') .style.display = 'none';
}

function popup_container_click(e) {
    if (e.target == document.querySelector('.popup-container')) {
        close_popup();
    }
}

function open_popup_info(text) {
    document.querySelector('.popup-container').style.display = 'grid';
    document.querySelector('.popup-info').style.display = 'inherit';

    document.querySelector('.popup-info span').innerText = `${text}`;
    document.querySelector('.popup-info .popup-button.confirm').onclick = function() {
        close_popup();
    };
}
function open_popup_info_error(text) {
    document.querySelector('.popup-container').style.display = 'grid';
    document.querySelector('.popup-info-error').style.display = 'inherit';

    document.querySelector('.popup-info-error span').innerText = `${text}`;
    document.querySelector('.popup-info-error .popup-button.confirm').onclick = function() {
        close_popup();
    };
}

function open_popup_confirm(text, onconfirm) {
    document.querySelector('.popup-container').style.display = 'grid';
    document.querySelector('.popup-confirm').style.display = 'inherit';

    document.querySelector('.popup-confirm span').innerText = `${text}`;
    document.querySelector('.popup-confirm .popup-button.confirm').onclick = function(e) {
        onconfirm(e);
        close_popup();
    }
}
function open_popup_confirm_error(text, onconfirm) {
    document.querySelector('.popup-container').style.display = 'grid';
    document.querySelector('.popup-confirm-error').style.display = 'inherit';

    document.querySelector('.popup-confirm-error span').innerText = `${text}`;
    document.querySelector('.popup-confirm-error .popup-button.confirm').onclick = function(e) {
        onconfirm(e);
        close_popup();
    }
}
