const vocab_environment = [
    {
        en: 'term [(of office)|of office]',
        de: 'Amtszeit',
    },
    {
        en: 'acid rain',
        de: 'saurer Regen',
    },
    {
        en: 'to affect',
        de: '[betreffen, sich auswirken auf]',
    },
    {
        en: 'alternative',
        de: '[Alternative, andere Möglichkeit]',
    },
    {
        en: 'appliance',
        de: 'Gerät',
    },
    {
        en: 'atmosphere',
        de: 'Atmosphäre',
    },
    {
        en: 'average',
        de: '[durchschnittlich, Durchschnitts-]',
    },
    {
        en: 'aware',
        de: 'bewusst',
        antonym: 'unaware',
    },
    {
        en: 'to be aware',
        de: '[sich] bewusst sein',
    },
    {
        en: 'balance',
        de: 'Gleichgewicht',
    },
    {
        en: 'biofuel',
        de: 'Biokraftstoff',
        synonym: '[renewable fuel, biomass fuel]',
    },
    {
        en: 'bottle bank',
        de: 'Glascontainer',
    },
    {
        en: 'carbon dioxide',
        de: 'Kohlendioxid',
    },
    {
        en: 'catastrophe',
        de: 'Katastrophe',
        synonym: 'disaster',
    },
    {
        en: 'climate',
        de: 'Klima',
    },
    {
        en: 'climate change',
        de: 'Klimawandel',
    },
    {
        en: 'to consume',
        de: 'verbrauchen',
    },
    {
        en: 'consumer',
        de: '[Verbraucher(in)|Verbraucher|Verbraucherin]',
    },
    {
        en: 'consumption',
        de: 'Verbrauch',
    },
    {
        en: 'to contaminate',
        de: 'verseuchen',
        synonym: 'to pollute',
    },
    {
        en: 'contamination',
        de: '[Verunreinigung, Verseuchung]',
    },
    {
        en: 'creature',
        de: 'Lebewesen',
    },
    {
        en: 'create',
        de: '[(er)schaffen|erschaffen|schaffen]',
    },
    {
        en: 'to depend on',
        de: '[abhängen/abhängig sein] von',
    },
    {
        en: '[dependency, dependence]',
        de: 'Abhängigkeit',
        antonym: 'independence',
    },
    {
        en: 'dependent',
        de: 'abhängig',
        antonym: 'independent',
    },
    {
        en: 'to destroy',
        de: 'zerstören',
    },
    {
        en: 'destruction',
        de: 'Zerstörung',
    },
    {
        en: 'destructive',
        de: 'zerstörerisch',
    },
    {
        en: 'detergent',
        de: 'Reinigungsmittel',
    },
    {
        en: 'developed countries',
        de: '[Industriestaaten, Industrieländer]',
        synonym: 'industrialised countries',
        antonym: '[developing countries, Third World countries]',
    },
    {
        en: 'to die out',
        de: 'aussterben',
        synonym: 'to become extinct',
    },
    {
        en: 'to disappear',
        de: 'verschwinden',
    },
    {
        en: 'disappearance',
        de: 'Verschwinden',
    },
    {
        en: 'disaster',
        de: '[Unglück, Katastrophe]',
    },
    {
        en: 'disposable bottle',
        de: 'Einwegflasche',
        antonym: 'returnable bottle',
    },
    {
        en: 'disposal',
        de: '[Beseitigung, Entsorgung]',
    },
    {
        en: 'drought',
        de: 'Dürre',
        antonym: 'flood',
    },
    {
        en: 'to dry up',
        de: '[austrocknen, vertrocknen]',
    },
    {
        en: 'dump',
        de: 'Müllhalde',
        synonym: 'rubbish tip',
    },
    {
        en: 'to dump',
        de: '[abladen, ablagern]',
    },
    {
        en: 'dumping ground',
        de: '[Müllhalde, Müllkippe]',
    },
    {
        en: 'earthquake',
        de: 'Erdbeben',
    },
    {
        en: 'effect',
        de: '[Wirkung, Auswirkung]',
        synonym: 'consequence',
    },
    {
        en: 'to effect',
        de: 'bewirken',
    },
    {
        en: 'effective',
        de: 'wirkungsvoll',
    },
    {
        en: 'emission',
        de: 'Ausstoß',
    },
    {
        en: 'energy conservation',
        de: 'Energieeinsparung',
    },
    {
        en: 'energy consumption',
        de: 'Energieverbrauch',
    },
    {
        en: 'energy efficiency',
        de: 'Energieeffizienz',
    },
    {
        en: 'energy source',
        de: 'Energiequelle',
    },
    {
        en: 'energy transition',
        de: 'Energiewende',
    },
    {
        en: 'environment',
        de: 'Umwelt',
        synonym: 'surroundings',
    },
    {
        en: 'environmental studies',
        de: 'Umweltforschung',
    },
    {
        en: 'environmentalist',
        de: '[Umweltschützer(in)|Umweltschützer|Umweltschützerin]',
        synonym: 'conservationist',
    },
    {
        en: 'environmentally aware',
        de: 'umweltbewusst',
    },
    {
        en: 'environmentally friendly',
        de: 'umweltfreundlich',
        antonym: 'polluting',
    },
    {
        en: 'evolution',
        de: '[Entwicklung, Evolution]',
    },
    {
        en: 'to evolve',
        de: 'sich entwickeln',
    },
    {
        en: 'exhaust',
        de: 'Auspuff',
    },
    {
        en: 'exhaust fumes',
        de: '[[Autoabgase, Abgase]|Autoabgase|Abgase]',
    },
    {
        en: 'to forbid',
        de: 'verbieten',
        antonym: '[to permit, to allow]',
    },
    {
        en: 'fossil fuel',
        de: 'fossiler Brennstoff',
    },
    {
        en: 'global warming',
        de: 'Erderwärmung',
    },
    {
        en: 'greenhouse effect',
        de: 'Treibhauseffekt',
    },
    {
        en: 'greenhouse gases',
        de: 'Treibhausgase',
    },
    {
        en: 'hygiene',
        de: 'Hygiene',
    },
    {
        en: 'industrial waste',
        de: 'Industrieabfall',
    },
    {
        en: 'junk',
        de: '[Müll, Abfall]',
        synonym: '[trash, litter, refuse, waste]',
    },
    {
        en: 'to load',
        de: 'belasten',
    },
    {
        en: 'load',
        de: 'Last',
        synonym: 'burden',
    },
    {
        en: 'marine life',
        de: '[Meeresfauna, Meeresflora]',
    },
    {
        en: 'natural gas',
        de: 'Erdgas',
    },
    {
        en: 'nuclear power plant',
        de: 'Atomkraftwerk',
        synonym: '[nuclear, atomic] power station',
    },
    {
        en: 'nuclear waste',
        de: 'Atommüll',
    },
    {
        en: 'oil slick',
        de: 'Ölteppich',
    },
    {
        en: 'overpopulation',
        de: 'Überbevölkerung',
    },
    {
        en: 'ozone layer',
        de: 'Ozonschicht',
    },
    {
        en: 'to persuade',
        de: 'überzeugen',
    },
    {
        en: 'pesticide',
        de: '[Schädlingsbekämpfungsmittel, Pflanzenschutzmittel]',
    },
    {
        en: 'petrol',
        de: 'Benzin',
        synonym: 'gas',
    },
    {
        en: 'petroleum',
        de: 'Rohöl',
    },
    {
        en: 'poisonous',
        de: 'giftig',
        synonym: 'toxic',
    },
    {
        en: 'polar ice cap',
        de: 'Polkappen',
    },
    {
        en: 'to pollute',
        de: 'verschmutzen',
        antonym: 'to clean',
    },
    {
        en: 'polluting',
        de: 'umweltschädlich',
    },
    {
        en: 'pollution',
        de: 'Verschmutzung',
    },
    {
        en: 'power station',
        de: 'Kraftwerk',
        synonym: 'power plant',
    },
    {
        en: 'to protect',
        de: 'schützen',
        synonym: '[to guard, to safeguard]',
    },
    {
        en: 'rainforest',
        de: 'Regenwald',
    },
    {
        en: 'raw material',
        de: 'Rohstoff',
        synonym: 'resources',
    },
    {
        en: 'to recycle',
        de: '[recyceln, wieder ausbereiten]',
    },
    {
        en: 'recycling',
        de: 'Wiederverwertung',
    },
    {
        en: 'to reduce',
        de: 'verringern',
    },
    {
        en: 'reduction',
        de: 'Verringerung',
    },
    {
        en: 'to release',
        de: '[freisetzen, freilassen]',
        synonym: 'to set free',
    },
    {
        en: 'renewable',
        de: 'erneuerbar',
    },
    {
        en: 'to repair',
        de: 'reparieren',
    },
    {
        en: 'resources',
        de: '[Bodenschätze, Ressourcen]',
        synonym: 'raw material',
    },
    {
        en: 'returnable bottle',
        de: 'Mehrwegflasche',
    },
    {
        en: 'reusable',
        de: 'wiederverwertbar',
    },
    {
        en: 'to reuse',
        de: 'wiederverwenden',
    },
    {
        en: 'rubbish',
        de: '[Müll, Abfall]',
        synonym: '[litter, refuse, garbage]',
    },
    {
        en: 'to save',
        de: '[sparen, retten]',
    },
    {
        en: 'scientist',
        de: '[Wissenschaftler(in)|Wissenschaftler|Wissenschaftlerin]',
    },
    {
        en: 'skin cancer',
        de: 'Hautkrebs',
    },
    {
        en: 'solar energy',
        de: 'Sonnenenergie',
    },
    {
        en: 'solar system',
        de: 'Sonnensystem',
    },
    {
        en: 'source',
        de: 'Quelle',
    },
    {
        en: 'source of energy',
        de: 'Energiequelle',
    },
    {
        en: 'species',
        de: '[Art, Spezies]',
    },
    {
        en: 'surface',
        de: 'Oberfläche',
    },
    {
        en: 'survival',
        de: 'Überleben',
    },
    {
        en: 'to survive',
        de: 'überleben',
    },
    {
        en: 'threat',
        de: 'Bedrohung',
        synonym: '[menace, hazard, risk]',
    },
    {
        en: 'to threaten',
        de: 'bedrohen',
        synonym: 'to endanger',
    },
    {
        en: 'toxic waste',
        de: 'Giftmüll',
        synonym: 'poisonous rubbish',
    },
    {
        en: 'village',
        de: 'Dorf',
    },
    {
        en: 'waste',
        de: 'Abfall',
        synonym: '[junk, litter, rubbish, refuse]',
    },
    {
        en: 'to waste',
        de: 'vergeuden',
    },
    {
        en: 'waste paper',
        de: 'Altpapier',
    },
    {
        en: 'waste separation',
        de: 'Mülltrennung',
    },
    {
        en: 'waste water',
        de: 'Abwasser',
        synonym: 'sewage',
    },
    {
        en: 'wind energy',
        de: 'Windenergie',
    },
    {
        en: 'wind farm',
        de: 'Windpark',
        synonym: 'wind park',
    },
];
