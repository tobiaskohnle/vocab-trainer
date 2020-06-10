'use strict';

const marked = {
    hard     : 'hard',
    tough    : 'tough',
    easy     : 'easy',
    ignore   : 'ignore',
    unmarked : 'unmarked',
};

let settings = {};

let default_settings = {
    probability_ask_en_vocab     : 1/2,
    amount_vocab_no_repeat       : 4,
    min_diff_hide_mistakes       : 7,
    vocab_index                  : 0,

    dark_theme                   : false,
    retype_incorrect_vocab       : true,
    use_sections                 : true,
    show_info                    : true,
    show_unmarked                : false,
    prioritize_vocab             : true,
    ask_for_english_translations : false,
    ask_for_german_translations  : true,
    ask_for_collocations         : true,
    ask_for_synonyms             : true,
    ask_for_forms                : false,
    visualize_mistakes           : true,
};

let image_urls = {};

let vocab;
let current_card = {};
let prioritized_vocab = Infinity;

let currently_dragging_image = false;
let currently_resizing_image = false;

onkeydown = function(e) {
    if (e.key == 'Escape') {
        clear_filter();
        close_menu();
    }
}


onload = function() {
    load_progress();
    load_settings();

    new_vocab();

    update_theme();
    update_switches();

    document.querySelector('.input').addEventListener('beforeinput', card_onbeforeinput);
}
onblur = function() {
    close_menu();
}

onmousedown = function(e) {
    if (e.target == document.querySelector('.card-image')) {
        const image_bounds = current_card.vocab.image_bounds;
        image_bounds.x = image_bounds.x||0;
        image_bounds.y = image_bounds.y||0;

        const distance_bottom_right_corner
            = Math.pow(e.x-e.target.offsetLeft-image_bounds.x-e.target.clientWidth, 2)
            + Math.pow(e.y-e.target.offsetTop-image_bounds.y-e.target.clientHeight, 2);

        if (distance_bottom_right_corner < 22*22) {
            currently_resizing_image = true;
        }
        else {
            currently_dragging_image = true;
            e.preventDefault();
        }
    }
}
onmousemove = function(e) {
    if (e.buttons) {
        if (currently_dragging_image||currently_resizing_image) {
            const card_image = document.querySelector('.card-image');
            const image_bounds = current_card.vocab.image_bounds;

            if (currently_dragging_image) {
                image_bounds.x += e.movementX;
                image_bounds.y += e.movementY;
                card_image.style.transform = `translate(${
                    current_card.vocab.image_bounds.x||0
                }px,${
                    current_card.vocab.image_bounds.y||0
                }px)`;
            }

            if (currently_resizing_image) {
                image_bounds.width = card_image.clientWidth;
                image_bounds.height = card_image.clientHeight;
            }
        }
    }
}
onmouseup = function(e) {
    if (currently_dragging_image||currently_resizing_image) {
        save_progress();
    }

    currently_dragging_image = false;
    currently_resizing_image = false;
}

function update_card() {
    update_section_bar();
    update_marked_bar();

    update_prioritized_vocab();

    update_card_border();

    update_settings_vocab_marked();

    update_display_span();

    update_vocab_image();
}

function clear_input() {
    const input = document.querySelector('.input');

    input.value = '';
    update_submit_button();

    input.focus();
    input.select();
}

function update_submit_button() {
    document.querySelector('.button').disabled = document.querySelector('.input').value == '';
}

function visual_section(section) {
    return Math.max(0, Math.min(9, section)) || 0;
}
function get_section_color(section) {
    return `var(--section-${visual_section(section)}-color)`;
}
function get_marked_color(marked_as) {
    if (marked_as == marked.unmarked) {
        return'var(--unmarked-color)';
    }

    return `var(--marked-${marked_as}-color)`;
}

function update_prioritized_vocab() {
    if (get_filtered_vocab().length == 0) {
        clear_filter();
    }
}

function update_section_bar() {
    const sections = [];

    let max_section = 0;

    for (const voc of vocab) {
        if (vocab_active(voc)) {
            const section = visual_section(voc.section);
            sections[section] = 1 + (sections[section]||0);

            max_section = Math.max(max_section, section);
        }
    }

    let amt_valid_sections = 0;
    if (settings.use_sections) {
        for (let section = 0; section <= max_section; section++) {
            if (sections[section]) {
                amt_valid_sections++;
            }
        }
    }

    const bar_section = document.querySelector('.bar-section');

    while (bar_section.childElementCount > amt_valid_sections) {
        bar_section.removeChild(bar_section.lastChild);
    }
    while (bar_section.childElementCount < amt_valid_sections) {
        bar_section.appendChild(document.createElement('div'));
    }

    if (!settings.use_sections) {
        return;
    }

    let i = 0;
    for (let section = 0; section <= max_section; section++) {
        if (sections[section]) {
            const child = bar_section.children[i++];
            child.style.backgroundColor = get_section_color(section);
            child.setAttribute('title', `Filter: Section ${1+section}`);

            child.onclick = function() {
                const is_active = this.classList.contains('active-section');

                clear_filter();

                if (!is_active) {
                    this.classList.add('active-section');
                    this.parentElement.classList.add('active-section');
                    prioritized_vocab = section;
                    new_vocab();
                }
            }
        }
    }

    bar_section.style.gridTemplateColumns = sections.map(amount => `${amount}fr`).join(' ');
}
function update_marked_bar() {
    let map_amt_marked_vocab = {};

    for (const marked_type in marked) {
        map_amt_marked_vocab[marked_type] = 0;
    }
    map_amt_marked_vocab[marked.unmarked] = 0;

    for (const voc of vocab) {
        if (voc.marked) {
            map_amt_marked_vocab[voc.marked]++;
        }
        else {
            map_amt_marked_vocab[marked.unmarked]++;
        }
    }

    const bar_marked = document.querySelector('.bar-marked');

    let amt_used_sections = 0;
    for (const marked_type in marked) {
        if (marked_type != marked.unmarked || settings.show_unmarked) {
            amt_used_sections += !!map_amt_marked_vocab[marked_type];
        }
    }

    while (bar_marked.childElementCount > amt_used_sections) {
        bar_marked.removeChild(bar_marked.lastChild);
    }
    while (bar_marked.childElementCount < amt_used_sections) {
        bar_marked.appendChild(document.createElement('div'));
    }

    let sections = [];

    let i = 0;
    for (let marked_index = 0; marked_index < Object.keys(marked).length; marked_index++) {
        const marked_type = Object.keys(marked)[marked_index] || marked.unmarked;

        if (marked_type != marked.unmarked || settings.show_unmarked) {
            if (map_amt_marked_vocab[marked_type] > 0) {
                const child = bar_marked.children[i++];

                child.style.backgroundColor = get_marked_color(marked_type);
                child.setAttribute('title', `Filter: ${marked_type != marked.unmarked ? `Marked ${marked_type}` : 'Unmarked'}`);

                sections.push(map_amt_marked_vocab[marked_type]);

                child.onclick = function() {
                    const is_active = this.classList.contains('active-section');

                    clear_filter();

                    if (!is_active) {
                        this.classList.add('active-section');
                        this.parentElement.classList.add('active-section');
                        prioritized_vocab = ~marked_index;
                        new_vocab();
                    }
                }
            }
        }
    }

    bar_marked.style.gridTemplateColumns = sections.map(amount => `${amount}fr`).join(' ');
}

function update_card_border() {
    const card = document.querySelector('.card');

    const show_info = settings.show_info || current_card.confirm_mistake || current_card.retype_vocab;

    card.style.borderColor
        = settings.use_sections && show_info && current_card.vocab
        ? get_section_color(current_card.vocab.section||0)
        : 'var(--card-border-color)';

    card.style.outline
        = show_info && current_card.vocab
        ? `5px double ${get_marked_color(current_card.vocab.marked)}`
        : '';
}

function clear_filter() {
    const bar_section = document.querySelector('.bar-section');
    const bar_marked = document.querySelector('.bar-marked');

    bar_section.classList.remove('active-section');
    bar_marked.classList.remove('active-section');

    const children = [
        ...bar_section.children,
        ...bar_marked.children,
    ];

    for (const child of children) {
        child.classList.remove('active-section');
    }

    prioritized_vocab = Infinity;
}

function update_display_span() {
    let html;

    try {
        if (!current_card.vocab) {
            current_card.display_span = html = '<span class=\'span-empty\'>&laquo; empty &raquo;</span>';
        }
        else if (current_card.confirm_mistake) {
            html = `<span class='span-italic'>${current_card.display_span}</span><br>`;

            if (!settings.visualize_mistakes) {
                html += `${current_card.compare_against[0]}`;
            }
            else if (current_card.result.diff >= settings.min_diff_hide_mistakes) {
                html += `<span class='span-missing'>${current_card.compare_against[0]}</span>`;
            }
            else {
                html += current_card.result.span;
            }
        }
        else if (current_card.vocab.type == type.gaps) {
            current_card.display_span
                = html
                = current_card.vocab.segments.map(segment => {
                    if (typeof segment == 'string') {
                        return segment;
                    }

                    if (segment.hint) {
                        return `<span class='gap'>____</span> <span class='gap-hint'>(${segment.hint})</span>`;
                    }

                    return `<span class='gap'>____</span>`;
                }).join('');
        }
        else {
            const vocab_ask_lang = current_card.vocab[current_card.ask_lang][0];

            switch (current_card.vocab.type) {
                case type.translation:
                    current_card.display_span
                        = html = `${vocab_ask_lang}`;
                    break;
                case type.synonym:
                    current_card.display_span
                        = html = `${vocab_ask_lang} <span class='span-special'>=</span>`;
                    break;
                case type.antonym:
                    current_card.display_span
                        = html = `${vocab_ask_lang} <span class='span-special'>\u2260</span>`;
                    break;
                case type.form:
                    current_card.display_span
                        = html = `<span class='span-special'>form of</span> ${vocab_ask_lang}`;
                    break;
                case type.collocation:
                    current_card.display_span
                        = html = `<span class='span-special'>collocation of</span> ${vocab_ask_lang}`;
                    break;
            }
        }
    }
    catch (error) {
        console.error(error);
        current_card.display_span = html = '<span class=\'span-empty\'>&laquo; error &raquo;</span>';
    }

    if (current_card.retype_vocab) {
        document.querySelector('.text').innerHTML = `<span class='span-repeat'>${html}</span>`;
    }
    else {
        document.querySelector('.text').innerHTML = html;
    }
}

function convert_to_span(string, err_list) {
    let span = '';

    let err_state = err.none;

    for (let i = 0; i < string.length; i++) {
        let err_match = err_list.find(err => i >= err.index && i < err.index+err.span);

        let new_err_state = err_match ? err_match.err : err.none;

        if (new_err_state != err_state) {
            if (err_state != err.none) {
                span += '</span>';
            }

            if (new_err_state == err.incorrect) {
                span += '<span class=\'span-incorrect\'>';
            }
            if (new_err_state == err.missing) {
                span += '<span class=\'span-missing\'>';
            }
            if (new_err_state == err.extra) {
                span += '<span class=\'span-extra\'>';
            }

            err_state = new_err_state;
        }

        span += string[i];
    }

    if (err_state != err.none) {
        span += '</span>';
    }
    return span;
}
