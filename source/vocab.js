'use strict';

const err = {
    none      : -1,
    incorrect : 0,
    missing   : 1,
    extra     : 2,
};

function check_current_vocab() {
    const card = document.querySelector('.card');

    if (!current_card.vocab) {
        console.warn('no vocab');
        return;
    }

    if (current_card.confirm_mistake) {
        clear_input();

        update_submit_button();

        current_card.retype_vocab = settings.retype_incorrect_vocab;

        card.classList.remove('card-confirm-mistake');
        current_card.confirm_mistake = false;

        if (!current_card.retype_vocab) {
            new_vocab();
        }
    }
    else {
        const input_text = document.querySelector('.input').value;

        current_card.compare_against = current_card.vocab[current_card.input_lang];
        const result = compare_variants([input_text], current_card.compare_against);

        if (result.diff == 0) {
            clear_input();

            if (settings.use_sections) {
                if (!current_card.retype_vocab) {
                    current_card.vocab.section = Math.max(1, 1 + (current_card.vocab.section||0));
                }
            }
            current_card.retype_vocab = false;

            new_vocab();
        }
        else {
            card.classList.add('card-confirm-mistake');
            current_card.confirm_mistake = true;

            if (settings.use_sections) {
                if (current_card.vocab.section > 0) {
                    current_card.vocab.section = 0;
                }
                else {
                    current_card.vocab.section = (current_card.vocab.section||0) - 1;
                }
            }

            current_card.result = result;
        }

        save_progress();
    }

    update_card();
}

function vocab_active(voc) {
    switch (voc.type) {
        case type.collocation:
            if (!settings.ask_for_collocations) {
                return false;
            }
            break;
        case type.form:
            if (!settings.ask_for_forms) {
                return false;
            }
            break;
        case type.synonym:
        case type.antonym:
            if (!settings.ask_for_synonyms) {
                return false;
            }
            break;
        case type.translation:
            if (!settings.ask_for_english_translations && !settings.ask_for_german_translations) {
                return false;
            }
            break;
    }

    if (voc.marked == marked.ignore) {
        return false;
    }

    return true;
}

function reset_marked() {
    for (const voc of vocab) {
        delete voc.marked;
    }

    update_settings_vocab_marked();
    update_card();
    save_progress();
}
function reset_progress() {
    localStorage.removeItem('vocab');

    vocab = [];

    save_progress();
}
function reset_sections() {
    settings.vocab_index = 0;

    for (const voc of vocab) {
        voc.last_seen = 0;
        voc.section = 0;
    }

    save_settings();
    save_progress();
}
function reset_settings() {
    localStorage.removeItem('settings');
    settings = {};
    Object.assign(settings, default_settings);

    update_switches();
    update_theme();
    save_settings();
}

function reset() {
    reset_progress();
    reset_settings();
    new_vocab();
}

function section_weight(section) {
    const first_section_weight = 0.6;
    return (1-first_section_weight) ** section * first_section_weight;
}

function last_seen_weight(last_seen) {
    return 1-Math.max(0, Math.min(1, last_seen/(settings.vocab_index-settings.amount_vocab_no_repeat) || 0));
}

function marked_weight(marked_type) {
    switch (marked_type) {
        case marked.hard:
            return 2;
        case marked.tough:
            return 1.3;
        case marked.easy:
            return 0.7;
        case marked.ignore:
            return 0;
    }

    return 1;
}

function vocab_weight(voc) {
    return (settings.use_sections && prioritized_vocab>=0 ? section_weight(voc.section||0) : 1)
        * (settings.prioritize_vocab ? last_seen_weight(voc.last_seen||0) * marked_weight(voc.marked) : 1);
}

function get_vocab_marked(marked_as) {
    return vocab.filter(voc => voc.marked && voc.marked == marked_as);
}

function get_filtered_vocab() {
    if (prioritized_vocab >= 0) {
        return vocab.filter(voc => visual_section(voc.section) == prioritized_vocab);
    }
    return vocab.filter(voc =>
        voc.marked
        ? voc.marked == Object.keys(marked)[~prioritized_vocab]
        : prioritized_vocab == -Object.keys(marked).length
    );
}

function random_vocab() {
    let possible_vocab = vocab;

    if (prioritized_vocab != Infinity) {
        let filtered_vocab = get_filtered_vocab();

        if (filtered_vocab.length > 0) {
            possible_vocab = filtered_vocab;
        }
        else {
            console.warn('no prioritized vocab found');
        }
    }

    if (prioritized_vocab == Infinity || prioritized_vocab >= 0) {
        let filtered_vocab = possible_vocab.filter(voc => vocab_active(voc));

        if (filtered_vocab.length > 0) {
            possible_vocab = filtered_vocab;
        }
        else {
            console.warn('no active vocab found');
            return null;
        }
    }

    let weight_sum = 0;
    for (const voc of possible_vocab) {
        weight_sum += vocab_weight(voc);
    }

    if (weight_sum == 0) {
        return [...possible_vocab].sort((a,b) => (a.last_seen||0)-(b.last_seen||0))[0];
    }

    const random_value = Math.random() * weight_sum;

    weight_sum = 0;
    for (const voc of possible_vocab) {
        weight_sum += vocab_weight(voc);

        if (weight_sum > random_value) {
            return voc;
        }
    }

    console.warn('no vocab found');

    return null;
}

function new_vocab() {
    current_card = {vocab: random_vocab()};

    if (!current_card.vocab) {
        update_card();
        return;
    }

    current_card.vocab.last_seen = settings.vocab_index++;
    save_settings();

    document.querySelector('.input').value = '';
    document.querySelector('.card').classList.remove('card-confirm-mistake');
    current_card.confirm_mistake = false;

    current_card.ask_lang = 'de';
    current_card.input_lang = 'en';

    if (swap_lang(current_card.vocab.type)) {
        current_card.ask_lang = 'en';
        current_card.input_lang = 'de';
    }

    update_card();
}

function swap_lang(vocab_type) {
    switch (vocab_type) {
        case type.translation:
            if (settings.ask_for_english_translations) {
                if (settings.ask_for_german_translations) {
                    return Math.random() < .5;
                }

                return true;
            }

            console.assert(settings.ask_for_german_translations);

            if (settings.ask_for_german_translations) {
                return false;
            }

            return false;

        case type.synonym:
        case type.antonym:
            return Math.random() < .5;

        case type.form:
            return true;

        default:
        case type.collocation:
            return false;
    }
}

///

function get_gaps_text(text) {
    const gaps_text = [];

    let previous_match_end = 0;

    for (const gap_match of text.matchAll(/(?<=[^\\]|^)_((?:.|\n)*?)(?<=[^\\])_(?:\s*\((.*?)\))?/g)) {
        const [match_text, gap_text, optional_hint_text] = gap_match;
        const {index} = gap_match;

        gaps_text.push(text.substring(previous_match_end,index));
        previous_match_end = index + match_text.length;
        gaps_text.push({gap:gap_text, hint:optional_hint_text||null});
    }

    gaps_text.push(text.substr(previous_match_end));

    return gaps_text;
}

const TXT = 'txt';
const LST = 'lst';
const SET = 'set';
const VAR = 'var';
const ANY = 'any';

function parse(vocab) {
    if (typeof vocab != 'string') {
        throw `Vocab must be a string`;
    }

    const root_node = {type: LST, value: []};

    const node_tree = [root_node];

    let current_node = root_node;

    let escape_next = false;

    function previous_node() {
        node_tree.pop();
        current_node = node_tree[node_tree.length-1];
    }

    function new_node(node, parent_node) {
        parent_node.value.push(node);
        node_tree.push(node);
        current_node = node;
        return node;
    }

    for (const char of vocab) {
        if (escape_next) {
            escape_next = false;
        }
        else {
            switch (char) {
                case '[':
                case ']':
                case '{':
                case '}':
                case '/':
                case ',':
                case '|':
                    if (current_node.type == TXT) {
                        previous_node();
                    }
            }

            const parent_node = node_tree[node_tree.length-2];

            switch (char) {
                case '[':
                    new_node({type: ANY, value: []}, current_node);
                    continue;

                case ']':
                    if (!parent_node) {
                        throw `Unexpected char '${char}'`;
                    }

                    if (parent_node.type == SET || parent_node.type == VAR) {
                        previous_node();
                    }

                    if (current_node.type == ANY) {
                        current_node.optional = true;
                        current_node.type = LST;
                    }

                    if (current_node) {
                        if (current_node.type == VAR || current_node.type == SET) {
                            for (const list of parent_node.value) {
                                trim_whitespace(list.value);
                            }
                        }
                    }

                    if (current_node.type == LST && current_node.optional) {
                        trim_whitespace(current_node.value);
                    }

                    if (current_node.value.length == 1) {
                        if (current_node.type != LST) {
                            throw `'${current_node.type}' node with only one child node`;
                        }
                    }

                    if (current_node.value.length == 0) {
                        throw `Empty '${current_node.type}' node`;
                    }

                    previous_node();
                    continue;

                case '/':
                case ',':
                    if (!parent_node) {
                        break;
                    }

                    if (parent_node.open_list) {
                        previous_node();
                    }

                    if (current_node.type == ANY) {
                        current_node.type = SET;
                        current_node.separator = char;

                        const first_list = {type: LST, value: current_node.value};
                        current_node.value = [first_list];
                    }
                    else if (current_node.type == SET) {
                        if (current_node.separator != char) {
                            throw `Two different separators in '${SET}' node`;
                        }
                    }
                    else {
                        throw `Unexpected char '${char}' in '${current_node.type}' node`;
                        break;
                    }

                    current_node.open_list = new_node({type: LST, value: []}, current_node);
                    continue;

                case '|':
                    if (parent_node.open_list) {
                        previous_node();
                    }

                    if (current_node.type == ANY) {
                        current_node.type = VAR;

                        const first_list = {type: LST, value: current_node.value};
                        current_node.value = [first_list];
                    }
                    else if (current_node.type != VAR) {
                        throw `Unexpected char '${char}' in '${current_node.type}' node`;
                    }

                    current_node.open_list = new_node({type: LST, value: []}, current_node);
                    continue;

                case '\\':
                    escape_next = true;
                    continue;
            }
        }

        if (current_node.type == TXT) {
            current_node.value += char;
        }
        else {
            const next_node = {type: TXT, value: char};
            current_node.value.push(next_node);

            current_node = next_node;
            node_tree.push(next_node);
        }
    }

    return root_node;
}

function trim_whitespace(list_node) {
    while (list_node.length) {
        const node = list_node[0];

        if (node.type != TXT) {
            break;
        }

        if ((node.value = node.value.trimLeft()) != '') {
            break;
        }

        list_node.shift();
    }

    while (list_node.length) {
        const node = list_node[list_node.length-1];

        if (node.type != TXT) {
            break;
        }

        if ((node.value = node.value.trimRight()) != '') {
            break;
        }

        list_node.pop();
    }
}

function node_get_variants(node) {
    switch (node.type) {
        case TXT:
            return [node.value];
        case LST:
            {
                const values = node.value.map(node => node_get_variants(node));
                const permutations = combine_permutations(values).map(perm => perm.join('')).map(perm => perm.trim());
                return node.optional ? ['', ...permutations] : permutations;
            }
        case SET:
            {
                const separator = node.separator==',' ? ', ' : node.separator;
                const values = node.value.map(node => node_get_variants(node));
                return array_flat(every_permutation(values).map(perm => combine_permutations(perm))).map(perm => perm.join(separator));
            }
        case VAR:
            return node.value.flatMap(node => node_get_variants(node));
    }
}

function combine_permutations(permutations) {
    if (permutations.length == 0) {
        return [[]];
    }

    const combinations = [];

    for (const value of permutations[0]) {
        for (const rest of combine_permutations(permutations.slice(1))) {
            combinations.push([value, ...rest]);
        }
    }

    return combinations;
}

function every_permutation(array) {
    if (array.length == 1) {
        return [array];
    }

    const permutations = [];

    for (let i = 0; i < array.length; i++) {
        const rest = [...array];
        rest.splice(i, 1);

        for (const perm of every_permutation(rest)) {
            permutations.push([array[i], ...perm]);
        }
    }

    return permutations;
}

function get_variants(vocab) {
    return node_get_variants(parse(vocab));
}

function compare_variants(variants_a, variants_b) {
    let max_diff = Infinity;
    let best_result;

    for (let var_a of variants_a) {
        for (let var_b of variants_b) {
            const result = compare(var_a, var_b);

            if (result.diff < max_diff) {
                max_diff = result.diff;
                best_result = result;
            }
        }
    }

    return best_result;
}

function compare(input, template) {
    const a = input;
    const b = template;

    let diff = 0;
    let err_list = [];
    let err_string = '';

    let ia = 0;
    let ib = 0;
    let ii = 0;

    let current_iter = 0;

    while (current_iter++ < 1e3) {
        if (a[ia] != b[ib]) {
            let off = 1;
            let match = -1;

            while (current_iter++ < 1e3) {
                let steps_max = 0;

                for (let i = 0; i < 3; i++) {
                    let off_a = ia + off * !(i&1);
                    let off_b = ib + off * !(i&2);

                    if (off_a > a.length && off_b > b.length) {
                        match = 0;
                        off = 1;
                        break;
                    }

                    let steps = 0;
                    while (a[off_a+steps] == b[off_b+steps] && off_a+steps <= a.length && off_b+steps <= b.length) {
                        steps++;
                    }
                    if (steps > steps_max) {
                        steps_max = steps;
                        match = i;
                    }
                }

                if (match >= 0) {
                    break;
                }

                off++;
            }

            const substr = match != 2 ? b.substr(ib, off) : a.substr(ia, off);

            err_string += substr;
            err_list.push({index: ii, span: off, err: match});
            ii += off;

            ia += off * !(match&1);
            ib += off * !(match&2);

            diff += off;

            continue;
        }
        if (ia >= a.length && ib >= b.length) {
            break;
        }
        err_string += a[ia];

        ia++;
        ib++;
        ii++;
    }

    return {diff, span: convert_to_span(err_string, err_list)};
}
