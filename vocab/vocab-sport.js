const vocab_sport = [
    {
        en: 'ability',
        de: 'Fähigkeit',
        synonym: '[skill, talent]',
        antonym: 'inability',
    },
    {
        en: 'to be able',
        de: '[fähig sein, können]',
    },
    {
        en: 'abroad',
        de: '[ins, im] Ausland',
        synonym: 'overseas',
        antonym: 'at home',
    },
    {
        en: 'achievement',
        de: 'Leistung',
    },
    {
        en: 'to achieve',
        de: '[erreichen, leisten]',
    },
    {
        en: 'activity',
        de: '[Beschäftigung, Aktivität]',
        antonym: 'inactivity',
    },
    {
        en: 'to act',
        de: 'handeln',
    },
    {
        en: 'action',
        de: 'Handlung',
    },
    {
        en: 'active',
        de: '[aktiv, lebhaft]',
    },
    {
        en: 'to admire',
        de: 'bewundern',
        antonym: 'to scorn',
    },
    {
        en: 'admiration',
        de: 'Bewunderung',
    },
    {
        en: 'to adopt',
        de: '[übernehmen, annehmen]',
    },
    {
        en: 'adoption',
        de: 'Übernahme',
    },
    {
        en: 'aerobics',
        de: 'Aerobic',
    },
    {
        en: 'to do aerobics',
        de: 'Aerobic machen',
    },
    {
        en: 'against',
        de: 'gegen',
        synonym: 'versus',
    },
    {
        en: 'amateur',
        de: '[Amateur/-in|Amateur|Amateurin]',
        antonym: '[professional, pro]',
    },
    {
        en: 'angry',
        de: '[zornig, wütend]',
        synonym: '[furious, mad]',
        antonym: 'pleased',
    },
    {
        en: 'anger',
        de: '[Zorn, Ärger, Wut]',
    },
    {
        en: 'arrow',
        de: 'Pfeil',
    },
    {
        en: 'association',
        de: 'Verband',
    },
    {
        en: 'to assume',
        de: '[glauben, annehmen]',
        synonym: '[[to suppose, to believe]|to [suppose, belive]]',
    },
    {
        en: 'to assure',
        de: '[versichern, zusichern, beteuern]',
        synonym: 'to make [sth|something] [sure or certain|certain or sure]',
    },
    {
        en: 'athlete',
        de: '[Athlet/-in|Athlet|Athletin|[Athlet, Athletin]]',
        synonym: '[sportsman, sportswoman]',
    },
    {
        en: 'athletics',
        de: 'Leichtathletik',
    },
    {
        en: 'attack',
        de: 'Angriff',
        antonym: 'defence',
    },
    {
        en: 'to attack',
        de: 'angreifen',
    },
    {
        en: 'to attend',
        de: '[besuchen, anwesend sein]',
        synonym: 'to be present at',
    },
    {
        en: 'audience',
        de: '[Zuschauer, Publikum]',
    },
    {
        en: 'awful',
        de: 'schrecklich',
        synonym: 'terrible',
    },
    {
        en: 'to behave',
        de: 'sich benehmen',
    },
    {
        en: 'to bet',
        de: 'wetten',
    },
    {
        en: 'boring',
        de: 'langweilig',
    },
    {
        en: 'box office',
        de: 'Kasse',
    },
    {
        en: 'buisness',
        de: 'Geschäft',
    },
    {
        en: 'to challenge',
        de: 'herausfordern',
    },
    {
        en: 'challenge',
        de: 'Herausforderung',
    },
    {
        en: 'champion',
        de: '[[Sieger\\/-in|Sieger|Siegerin|[Siegerin, Sieger]], Champion]',
    },
    {
        en: 'championship',
        de: 'Meisterschaft',
    },
    {
        en: 'to cheer',
        de: 'anfeuern',
    },
    {
        en: 'competition',
        de: 'Wettbewerb',
    },
    {
        en: 'to compete',
        de: 'konkurrieren',
    },
    {
        en: 'competitive',
        de: 'koonkurrenzfähig',
    },
    {
        en: 'crowd',
        de: 'Menge',
    },
    {
        en: 'defeat',
        de: 'Niederlage',
        antonym: '[victory, triumph]',
    },
    {
        en: 'to defend',
        de: 'verteidigen',
    },
    {
        en: 'defence',
        de: 'Verteidigung',
    },
    {
        en: 'defensive',
        de: 'defensiv',
    },
    {
        en: 'to deserve',
        de: 'verdienen',
    },
    {
        en: 'to do sport',
        de: 'Sport treiben',
    },
    {
        en: 'doping',
        de: 'Doping',
    },
    {
        en: 'draw',
        de: 'Unentschieden',
    },
    {
        en: 'effort',
        de: 'Anstrengung',
    },
    {
        en: 'entertainment',
        de: 'Unterhaltung',
    },
    {
        en: 'to entertain',
        de: 'unterhalten',
    },
    {
        en: 'equipment',
        de: 'Ausrüstung',
    },
    {
        en: 'to equip',
        de: 'ausstatten',
    },
    {
        en: 'to exercise',
        de: '[trainieren, üben]',
        synonym: 'to train',
    },
    {
        en: 'fight',
        de: 'Kampf',
    },
    {
        en: 'to fight',
        de: 'kämpfen',
    },
    {
        en: 'final',
        de: 'Endspiel',
    },
    {
        en: 'to gain',
        de: '[erlangen, gewinnen]',
        synonym: 'to win',
    },
    {
        en: 'to get rid of',
        de: 'loswerden',
    },
    {
        en: 'goalkeeper',
        de: '[[Torwart\\/-in, Torhüter\\/-in]|[[Torwart|Torwartin], [Torhüter|Torhüterin]]]',
        synonym: 'goalie',
    },
    {
        en: 'ground',
        de: 'Stadion',
        synonym: 'stadium',
    },
    {
        en: 'healty',
        de: 'gesund',
        antonym: 'unhealthy',
    },
    {
        en: 'health',
        de: 'Gesundheit',
        antonym: 'illness',
    },
    {
        en: 'hooligan',
        de: '[Rowdy, Hooligan]',
    },
    {
        en: 'hooliganism',
        de: 'Rowdytum',
    },
    {
        en: 'to injure',
        de: 'verletzen',
    },
    {
        en: 'injury',
        de: 'Verletzung',
    },
    {
        en: 'to last',
        de: 'dauern',
    },
    {
        en: 'manager',
        de: '[Trainer\\/-in|[Trainer, Trainerin]',
        synonym: '[trainer, coach]',
    },
    {
        en: 'match',
        de: 'Spiel',
        synonym: 'game',
    },
    {
        en: 'muscle',
        de: 'Muskel',
    },
    {
        en: 'Olympic Games',
        de: 'Olympische Spiele',
    },
    {
        en: 'penalty',
        de: '[Elfmeter, Strafstoß]',
    },
    {
        en: 'physical',
        de: 'körperlich',
        antonym: 'mental',
    },
    {
        en: 'pitch',
        de: 'Spielfeld',
        synonym: '[field, sports, ground]',
    },
    {
        en: 'pleasure',
        de: 'Vergnügen',
        synonym: '[joy, enjoyment, delight]',
    },
    {
        en: 'to please',
        de: 'gefallen',
    },
    {
        en: 'pleasant',
        de: 'angenehm',
    },
    {
        en: 'popular',
        de: 'beliebt',
        synonym: 'well-liked',
        antonym: 'unpopular',
    },
    {
        en: 'popularity',
        de: 'Beliebtheit',
    },
    {
        en: 'power',
        de: '[Kraft, Stärke, Macht]',
        synonym: 'strength',
        antonym: 'weakness',
    },
    {
        en: 'powerful',
        de: '[stark, mächtig]',
    },
    {
        en: 'prestige',
        de: 'Ansehen',
        synonym: 'status',
    },
    {
        en: 'professional',
        de: '[Profi-, Berufs-(sportler\\/-in)]',
        antonym: 'amateur',
    },
    {
        en: 'record',
        de: 'Rekord',
    },
    {
        en: 'referee',
        de: '[Schiedsrichter\\/-in|[Schiedsrichter, Schiedsrichterin]',
    },
    {
        en: 'reputation',
        de: 'Ruf',
    },
    {
        en: 'riot',
        de: '[(Straßen-)Schlacht|Straßenschlacht|Schlacht]',
    },
    {
        en: 'rival',
        de: '[Konkurrent\\/-in|[Konkurrent, Konkurrentin]',
        synonym: 'competitor',
        antonym: 'partner',
    },
    {
        en: 'rule',
        de: '[Bestimmung, Verbot, Vorschrift]',
    },
    {
        en: 'to score a [goal/point]',
        de: '[ein Tor schießen, einen Punkt erzielen]',
    },
    {
        en: 'to shout',
        de: 'schreien',
        synonym: 'to scream',
    },
    {
        en: 'to sign a contract',
        de: 'einen Vertrag unterschreiben',
    },
    {
        en: 'soccer',
        de: '[(europäischer)|europäischer] Fußball',
        synonym: 'football',
    },
    {
        en: 'spectator',
        de: '[Zuschauer\\/-in|[Zuschauer, Zuschauerin]',
    },
    {
        en: 'sports event',
        de: 'Sportveranstaltung',
    },
    {
        en: 'sportsman',
        de: 'Sportler',
        synonym: 'athlete',
    },
    {
        en: 'sportswoman',
        de: 'Sportlerin',
        synonym: 'athlete',
    },
    {
        en: 'stimulant',
        de: 'Aufputschmittel',
        synonym: 'drug',
    },
    {
        en: 'success',
        de: 'Erfolg',
    },
    {
        en: 'to succeed',
        de: 'Erfolg haben',
    },
    {
        en: 'successful',
        de: 'erfolgreich',
    },
    {
        en: 'supporter',
        de: '[[Anhänger\\/-in|Anhänger|Anhängerin], Fan]',
        synonym: 'fan',
    },
    {
        en: 'tournament',
        de: 'Turnier',
    },
    {
        en: 'track',
        de: '[(Renn-)Bahn|Rennbahn]',
        synonym: 'race track',
    },
    {
        en: 'to train',
        de: 'trainieren',
    },
    {
        en: 'trainer',
        de: 'Trainer',
    },
    {
        en: 'training',
        de: 'Training',
    },
    {
        en: 'to vandalise',
        de: 'zerstören',
        synonym: 'to destroy',
    },
    {
        en: 'vandalism',
        de: 'Zerstörungswut',
    },
    {
        en: 'victory',
        de: 'Sieg',
    },
    {
        en: 'victorious',
        de: 'siegreich',
    },
    {
        en: 'whistle',
        de: 'Pfeife',
    },
    {
        en: 'to whistle',
        de: 'pfeifen',
    },
    {
        en: 'world championship',
        de: 'Weltmeisterschaft',
        synonym: 'world cup',
    }
];
