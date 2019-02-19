var FaLookup;

FaLookup = (function() {
  class FaLookup {};

  FaLookup.icons = {
    "fas fa-network-wired": "\uf6ff",
    "fas fa-infinity": "\uf534",
    "fas fa-satellite": "\uf7bf",
    "fas fa-chalkboard-teacher": "\uf51c",
    "fas fa-landmark": "\uf66f",
    "fas fa-brain": "\uf5dc",
    "fas fa-shapes": "\uf61f",
    "fas fa-hot-tub": "\uf593",
    "fas fa-pen-fancy": "\uf5ac",
    "fab fa-galactic-republic": "\uf50c",
    "fas fa-address-book": "\uf2b9",
    "fas fa-address-card": "\uf2bb",
    "fas fa-adjust": "\uf042",
    "fas fa-align-center": "\uf037",
    "fas fa-align-justify": "\uf039",
    "fas fa-align-left": "\uf036",
    "fas fa-align-right": "\uf038",
    "fas fa-allergies": "\uf461",
    "fas fa-ambulance": "\uf0f9",
    "fas fa-american-sign-language-interpreting": "\uf2a3",
    "fas fa-anchor": "\uf13d",
    "fas fa-angle-double-down": "\uf103",
    "fas fa-angle-double-left": "\uf100",
    "fas fa-angle-double-right": "\uf101",
    "fas fa-angle-double-up": "\uf102",
    "fas fa-angle-down": "\uf107",
    "fas fa-angle-left": "\uf104",
    "fas fa-angle-right": "\uf105",
    "fas fa-angle-up": "\uf106",
    "fas fa-archive": "\uf187",
    "fas fa-arrow-alt-circle-down": "\uf358",
    "fas fa-arrow-alt-circle-left": "\uf359",
    "fas fa-arrow-alt-circle-right": "\uf35a",
    "fas fa-arrow-alt-circle-up": "\uf35b",
    "fas fa-arrow-circle-down": "\uf0ab",
    "fas fa-arrow-circle-left": "\uf0a8",
    "fas fa-arrow-circle-right": "\uf0a9",
    "fas fa-arrow-circle-up": "\uf0aa",
    "fas fa-arrow-down": "\uf063",
    "fas fa-arrow-left": "\uf060",
    "fas fa-arrow-right": "\uf061",
    "fas fa-arrow-up": "\uf062",
    "fas fa-arrows-alt": "\uf0b2",
    "fas fa-arrows-alt-h": "\uf337",
    "fas fa-arrows-alt-v": "\uf338",
    "fas fa-assistive-listening-systems": "\uf2a2",
    "fas fa-asterisk": "\uf069",
    "fas fa-at": "\uf1fa",
    "fas fa-atom": "\uf5d2",
    "fas fa-atom fa-spin": "\uf5d2",
    "fas fa-audio-description": "\uf29e",
    "fas fa-backward": "\uf04a",
    "fas fa-balance-scale": "\uf24e",
    "fas fa-ban": "\uf05e",
    "fas fa-band-aid": "\uf462",
    "fas fa-barcode": "\uf02a",
    "fas fa-bars": "\uf0c9",
    "fas fa-baseball-ball": "\uf433",
    "fas fa-basketball-ball": "\uf434",
    "fas fa-bath": "\uf2cd",
    "fas fa-battery-empty": "\uf244",
    "fas fa-battery-full": "\uf240",
    "fas fa-battery-half": "\uf242",
    "fas fa-battery-quarter": "\uf243",
    "fas fa-battery-three-quarters": "\uf241",
    "fas fa-bed": "\uf236",
    "fas fa-beer": "\uf0fc",
    "fas fa-bell": "\uf0f3",
    "fas fa-bell-slash": "\uf1f6",
    "fas fa-bicycle": "\uf206",
    "fas fa-binoculars": "\uf1e5",
    "fas fa-birthday-cake": "\uf1fd",
    "fas fa-blind": "\uf29d",
    "fas fa-bold": "\uf032",
    "fas fa-bolt": "\uf0e7",
    "fas fa-bomb": "\uf1e2",
    "fas fa-book": "\uf02d",
    "fas fa-bookmark": "\uf02e",
    "fas fa-bowling-ball": "\uf436",
    "fas fa-box": "\uf466",
    "fas fa-box-open": "\uf49e",
    "fas fa-boxes": "\uf468",
    "fas fa-braille": "\uf2a1",
    "fas fa-briefcase": "\uf0b1",
    "fas fa-briefcase-medical": "\uf469",
    "fas fa-bug": "\uf188",
    "fas fa-building": "\uf1ad",
    "fas fa-bullhorn": "\uf0a1",
    "fas fa-bullseye": "\uf140",
    "fas fa-burn": "\uf46a",
    "fas fa-bus": "\uf207",
    "fas fa-calculator": "\uf1ec",
    "fas fa-calendar": "\uf133",
    "fas fa-calendar-alt": "\uf073",
    "fas fa-calendar-check": "\uf274",
    "fas fa-calendar-minus": "\uf272",
    "fas fa-calendar-plus": "\uf271",
    "fas fa-calendar-times": "\uf273",
    "fas fa-camera": "\uf030",
    "fas fa-camera-retro": "\uf083",
    "fas fa-capsules": "\uf46b",
    "fas fa-car": "\uf1b9",
    "fas fa-caret-down": "\uf0d7",
    "fas fa-caret-left": "\uf0d9",
    "fas fa-caret-right": "\uf0da",
    "fas fa-caret-square-down": "\uf150",
    "fas fa-caret-square-left": "\uf191",
    "fas fa-caret-square-right": "\uf152",
    "fas fa-caret-square-up": "\uf151",
    "fas fa-caret-up": "\uf0d8",
    "fas fa-cart-arrow-down": "\uf218",
    "fas fa-cart-plus": "\uf217",
    "fas fa-certificate": "\uf0a3",
    "fas fa-chart-area": "\uf1fe",
    "fas fa-chart-bar": "\uf080",
    "fas fa-chart-line": "\uf201",
    "fas fa-chart-pie": "\uf200",
    "fas fa-check": "\uf00c",
    "fas fa-check-circle": "\uf058",
    "fas fa-check-square": "\uf14a",
    "fas fa-chess": "\uf439",
    "fas fa-chess-bishop": "\uf43a",
    "fas fa-chess-board": "\uf43c",
    "fas fa-chess-king": "\uf43f",
    "fas fa-chess-knight": "\uf441",
    "fas fa-chess-pawn": "\uf443",
    "fas fa-chess-queen": "\uf445",
    "fas fa-chess-rook": "\uf447",
    "fas fa-chevron-circle-down": "\uf13a",
    "fas fa-chevron-circle-left": "\uf137",
    "fas fa-chevron-circle-right": "\uf138",
    "fas fa-chevron-circle-up": "\uf139",
    "fas fa-chevron-down": "\uf078",
    "fas fa-chevron-left": "\uf053",
    "fas fa-chevron-right": "\uf054",
    "fas fa-chevron-up": "\uf077",
    "fas fa-child": "\uf1ae",
    "fas fa-circle": "\uf111",
    "fas fa-circle-notch": "\uf1ce",
    "fas fa-clipboard": "\uf328",
    "fas fa-clipboard-check": "\uf46c",
    "fas fa-clipboard-list": "\uf46d",
    "fas fa-clock": "\uf017",
    "fas fa-clone": "\uf24d",
    "fas fa-closed-captioning": "\uf20a",
    "fas fa-cloud": "\uf0c2",
    "fas fa-cloud-download-alt": "\uf381",
    "fas fa-cloud-upload-alt": "\uf382",
    "fas fa-code": "\uf121",
    "fas fa-code-branch": "\uf126",
    "fas fa-coffee": "\uf0f4",
    "fas fa-cog": "\uf013",
    "fas fa-cogs": "\uf085",
    "fas fa-columns": "\uf0db",
    "fas fa-comment": "\uf075",
    "fas fa-comment-alt": "\uf27a",
    "fas fa-comment-dots": "\uf4ad",
    "fas fa-comment-slash": "\uf4b3",
    "fas fa-comments": "\uf086",
    "fas fa-compass": "\uf14e",
    "fas fa-compress": "\uf066",
    "fas fa-copy": "\uf0c5",
    "fas fa-copyright": "\uf1f9",
    "fas fa-couch": "\uf4b8",
    "fas fa-credit-card": "\uf09d",
    "fas fa-crop": "\uf125",
    "fas fa-crosshairs": "\uf05b",
    "fas fa-cube": "\uf1b2",
    "fas fa-cubes": "\uf1b3",
    "fas fa-cut": "\uf0c4",
    "fas fa-database": "\uf1c0",
    "fas fa-deaf": "\uf2a4",
    "fas fa-desktop": "\uf108",
    "fas fa-diagnoses": "\uf470",
    "fas fa-dna": "\uf471",
    "fas fa-dollar-sign": "\uf155",
    "fas fa-dolly": "\uf472",
    "fas fa-dolly-flatbed": "\uf474",
    "fas fa-donate": "\uf4b9",
    "fas fa-dot-circle": "\uf192",
    "fas fa-dove": "\uf4ba",
    "fas fa-download": "\uf019",
    "fas fa-edit": "\uf044",
    "fas fa-eject": "\uf052",
    "fas fa-ellipsis-h": "\uf141",
    "fas fa-ellipsis-v": "\uf142",
    "fas fa-envelope": "\uf0e0",
    "fas fa-envelope-open": "\uf2b6",
    "fas fa-envelope-square": "\uf199",
    "fas fa-eraser": "\uf12d",
    "fas fa-euro-sign": "\uf153",
    "fas fa-exchange-alt": "\uf362",
    "fas fa-exclamation": "\uf12a",
    "fas fa-exclamation-circle": "\uf06a",
    "fas fa-exclamation-triangle": "\uf071",
    "fas fa-expand": "\uf065",
    "fas fa-expand-arrows-alt": "\uf31e",
    "fas fa-external-link-alt": "\uf35d",
    "fas fa-external-link-square-alt": "\uf360",
    "fas fa-eye": "\uf06e",
    "fas fa-eye-dropper": "\uf1fb",
    "fas fa-eye-slash": "\uf070",
    "fas fa-fast-backward": "\uf049",
    "fas fa-fast-forward": "\uf050",
    "fas fa-fax": "\uf1ac",
    "fas fa-female": "\uf182",
    "fas fa-fighter-jet": "\uf0fb",
    "fas fa-file": "\uf15b",
    "fas fa-file-alt": "\uf15c",
    "fas fa-file-archive": "\uf1c6",
    "fas fa-file-audio": "\uf1c7",
    "fas fa-file-code": "\uf1c9",
    "fas fa-file-excel": "\uf1c3",
    "fas fa-file-image": "\uf1c5",
    "fas fa-file-medical": "\uf477",
    "fas fa-file-medical-alt": "\uf478",
    "fas fa-file-pdf": "\uf1c1",
    "fas fa-file-powerpoint": "\uf1c4",
    "fas fa-file-video": "\uf1c8",
    "fas fa-file-word": "\uf1c2",
    "fas fa-film": "\uf008",
    "fas fa-filter": "\uf0b0",
    "fas fa-fire": "\uf06d",
    "fas fa-fire-extinguisher": "\uf134",
    "fas fa-first-aid": "\uf479",
    "fas fa-flag": "\uf024",
    "fas fa-flag-checkered": "\uf11e",
    "fas fa-flask": "\uf0c3",
    "fas fa-folder": "\uf07b",
    "fas fa-folder-open": "\uf07c",
    "fas fa-font": "\uf031",
    "fas fa-football-ball": "\uf44e",
    "fas fa-forward": "\uf04e",
    "fas fa-frown": "\uf119",
    "fas fa-futbol": "\uf1e3",
    "fas fa-gamepad": "\uf11b",
    "fas fa-gavel": "\uf0e3",
    "fas fa-gem": "\uf3a5",
    "fas fa-genderless": "\uf22d",
    "fas fa-gift": "\uf06b",
    "fas fa-glass-martini": "\uf000",
    "fas fa-globe": "\uf0ac",
    "fas fa-golf-ball": "\uf450",
    "fas fa-graduation-cap": "\uf19d",
    "fas fa-h-square": "\uf0fd",
    "fas fa-hand-holding": "\uf4bd",
    "fas fa-hand-holding-heart": "\uf4be",
    "fas fa-hand-holding-usd": "\uf4c0",
    "fas fa-hand-lizard": "\uf258",
    "fas fa-hand-paper": "\uf256",
    "fas fa-hand-peace": "\uf25b",
    "fas fa-hand-point-down": "\uf0a7",
    "fas fa-hand-point-left": "\uf0a5",
    "fas fa-hand-point-right": "\uf0a4",
    "fas fa-hand-point-up": "\uf0a6",
    "fas fa-hand-pointer": "\uf25a",
    "fas fa-hand-rock": "\uf255",
    "fas fa-hand-scissors": "\uf257",
    "fas fa-hand-spock": "\uf259",
    "fas fa-hands": "\uf4c2",
    "fas fa-hands-helping": "\uf4c4",
    "fas fa-handshake": "\uf2b5",
    "fas fa-hashtag": "\uf292",
    "fas fa-hdd": "\uf0a0",
    "fas fa-heading": "\uf1dc",
    "fas fa-headphones": "\uf025",
    "fas fa-heart": "\uf004",
    "fas fa-heartbeat": "\uf21e",
    "fas fa-history": "\uf1da",
    "fas fa-hockey-puck": "\uf453",
    "fas fa-home": "\uf015",
    "fas fa-hospital": "\uf0f8",
    "fas fa-hospital-alt": "\uf47d",
    "fas fa-hospital-symbol": "\uf47e",
    "fas fa-hourglass": "\uf254",
    "fas fa-hourglass-end": "\uf253",
    "fas fa-hourglass-half": "\uf252",
    "fas fa-hourglass-start": "\uf251",
    "fas fa-i-cursor": "\uf246",
    "fas fa-id-badge": "\uf2c1",
    "fas fa-id-card": "\uf2c2",
    "fas fa-id-card-alt": "\uf47f",
    "fas fa-image": "\uf03e",
    "fas fa-images": "\uf302",
    "fas fa-inbox": "\uf01c",
    "fas fa-indent": "\uf03c",
    "fas fa-industry": "\uf275",
    "fas fa-info": "\uf129",
    "fas fa-info-circle": "\uf05a",
    "fas fa-italic": "\uf033",
    "fas fa-key": "\uf084",
    "fas fa-keyboard": "\uf11c",
    "fas fa-language": "\uf1ab",
    "fas fa-laptop": "\uf109",
    "fas fa-leaf": "\uf06c",
    "fas fa-lemon": "\uf094",
    "fas fa-level-down-alt": "\uf3be",
    "fas fa-level-up-alt": "\uf3bf",
    "fas fa-life-ring": "\uf1cd",
    "fas fa-lightbulb": "\uf0eb",
    "fas fa-link": "\uf0c1",
    "fas fa-lira-sign": "\uf195",
    "fas fa-list": "\uf03a",
    "fas fa-list-alt": "\uf022",
    "fas fa-list-ol": "\uf0cb",
    "fas fa-list-ul": "\uf0ca",
    "fas fa-location-arrow": "\uf124",
    "fas fa-lock": "\uf023",
    "fas fa-lock-open": "\uf3c1",
    "fas fa-long-arrow-alt-down": "\uf309",
    "fas fa-long-arrow-alt-left": "\uf30a",
    "fas fa-long-arrow-alt-right": "\uf30b",
    "fas fa-long-arrow-alt-up": "\uf30c",
    "fas fa-low-vision": "\uf2a8",
    "fas fa-magic": "\uf0d0",
    "fas fa-magnet": "\uf076",
    "fas fa-male": "\uf183",
    "fas fa-map": "\uf279",
    "fas fa-map-marker": "\uf041",
    "fas fa-map-marker-alt": "\uf3c5",
    "fas fa-map-pin": "\uf276",
    "fas fa-map-signs": "\uf277",
    "fas fa-mars": "\uf222",
    "fas fa-mars-double": "\uf227",
    "fas fa-mars-stroke": "\uf229",
    "fas fa-mars-stroke-h": "\uf22b",
    "fas fa-mars-stroke-v": "\uf22a",
    "fas fa-medkit": "\uf0fa",
    "fas fa-meh": "\uf11a",
    "fas fa-mercury": "\uf223",
    "fas fa-microchip": "\uf2db",
    "fas fa-microphone": "\uf130",
    "fas fa-microphone-slash": "\uf131",
    "fas fa-minus": "\uf068",
    "fas fa-minus-circle": "\uf056",
    "fas fa-minus-square": "\uf146",
    "fas fa-mobile": "\uf10b",
    "fas fa-mobile-alt": "\uf3cd",
    "fas fa-money-bill-alt": "\uf3d1",
    "fas fa-moon": "\uf186",
    "fas fa-motorcycle": "\uf21c",
    "fas fa-mouse-pointer": "\uf245",
    "fas fa-music": "\uf001",
    "fas fa-neuter": "\uf22c",
    "fas fa-newspaper": "\uf1ea",
    "fas fa-notes-medical": "\uf481",
    "fas fa-object-group": "\uf247",
    "fas fa-object-ungroup": "\uf248",
    "fas fa-outdent": "\uf03b",
    "fas fa-paint-brush": "\uf1fc",
    "fas fa-pallet": "\uf482",
    "fas fa-paper-plane": "\uf1d8",
    "fas fa-paperclip": "\uf0c6",
    "fas fa-parachute-box": "\uf4cd",
    "fas fa-paragraph": "\uf1dd",
    "fas fa-paste": "\uf0ea",
    "fas fa-pause": "\uf04c",
    "fas fa-pause-circle": "\uf28b",
    "fas fa-paw": "\uf1b0",
    "fas fa-pen-square": "\uf14b",
    "fas fa-pencil-alt": "\uf303",
    "fas fa-people-carry": "\uf4ce",
    "fas fa-percent": "\uf295",
    "fas fa-phone": "\uf095",
    "fas fa-phone-slash": "\uf3dd",
    "fas fa-phone-square": "\uf098",
    "fas fa-phone-volume": "\uf2a0",
    "fas fa-piggy-bank": "\uf4d3",
    "fas fa-pills": "\uf484",
    "fas fa-plane": "\uf072",
    "fas fa-play": "\uf04b",
    "fas fa-play-circle": "\uf144",
    "fas fa-plug": "\uf1e6",
    "fas fa-plus": "\uf067",
    "fas fa-plus-circle": "\uf055",
    "fas fa-plus-square": "\uf0fe",
    "fas fa-podcast": "\uf2ce",
    "fas fa-poo": "\uf2fe",
    "fas fa-pound-sign": "\uf154",
    "fas fa-power-off": "\uf011",
    "fas fa-prescription-bottle": "\uf485",
    "fas fa-prescription-bottle-alt": "\uf486",
    "fas fa-print": "\uf02f",
    "fas fa-procedures": "\uf487",
    "fas fa-puzzle-piece": "\uf12e",
    "fas fa-qrcode": "\uf029",
    "fas fa-question": "\uf128",
    "fas fa-question-circle": "\uf059",
    "fas fa-quidditch": "\uf458",
    "fas fa-quote-left": "\uf10d",
    "fas fa-quote-right": "\uf10e",
    "fas fa-random": "\uf074",
    "fas fa-recycle": "\uf1b8",
    "fas fa-redo": "\uf01e",
    "fas fa-redo-alt": "\uf2f9",
    "fas fa-registered": "\uf25d",
    "fas fa-reply": "\uf3e5",
    "fas fa-reply-all": "\uf122",
    "fas fa-retweet": "\uf079",
    "fas fa-ribbon": "\uf4d6",
    "fas fa-road": "\uf018",
    "fas fa-rocket": "\uf135",
    "fas fa-rss": "\uf09e",
    "fas fa-rss-square": "\uf143",
    "fas fa-ruble-sign": "\uf158",
    "fas fa-rupee-sign": "\uf156",
    "fas fa-save": "\uf0c7",
    "fas fa-search": "\uf002",
    "fas fa-search-minus": "\uf010",
    "fas fa-search-plus": "\uf00e",
    "fas fa-seedling": "\uf4d8",
    "fas fa-server": "\uf233",
    "fas fa-share": "\uf064",
    "fas fa-share-alt": "\uf1e0",
    "fas fa-share-alt-square": "\uf1e1",
    "fas fa-share-square": "\uf14d",
    "fas fa-shekel-sign": "\uf20b",
    "fas fa-shield-alt": "\uf3ed",
    "fas fa-ship": "\uf21a",
    "fas fa-shipping-fast": "\uf48b",
    "fas fa-shopping-bag": "\uf290",
    "fas fa-shopping-basket": "\uf291",
    "fas fa-shopping-cart": "\uf07a",
    "fas fa-shower": "\uf2cc",
    "fas fa-sign": "\uf4d9",
    "fas fa-sign-in-alt": "\uf2f6",
    "fas fa-sign-language": "\uf2a7",
    "fas fa-sign-out-alt": "\uf2f5",
    "fas fa-signal": "\uf012",
    "fas fa-sitemap": "\uf0e8",
    "fas fa-sliders-h": "\uf1de",
    "fas fa-smile": "\uf118",
    "fas fa-smoking": "\uf48d",
    "fas fa-snowflake": "\uf2dc",
    "fas fa-sort": "\uf0dc",
    "fas fa-sort-alpha-down": "\uf15d",
    "fas fa-sort-alpha-up": "\uf15e",
    "fas fa-sort-amount-down": "\uf160",
    "fas fa-sort-amount-up": "\uf161",
    "fas fa-sort-down": "\uf0dd",
    "fas fa-sort-numeric-down": "\uf162",
    "fas fa-sort-numeric-up": "\uf163",
    "fas fa-sort-up": "\uf0de",
    "fas fa-space-shuttle": "\uf197",
    "fas fa-spinner": "\uf110",
    "fas fa-spinner fa-pulse": "\uf110",
    "fas fa-square": "\uf0c8",
    "fas fa-square-full": "\uf45c",
    "fas fa-star": "\uf005",
    "fas fa-star-half": "\uf089",
    "fas fa-step-backward": "\uf048",
    "fas fa-step-forward": "\uf051",
    "fas fa-stethoscope": "\uf0f1",
    "fas fa-sticky-note": "\uf249",
    "fas fa-stop": "\uf04d",
    "fas fa-stop-circle": "\uf28d",
    "fas fa-stopwatch": "\uf2f2",
    "fas fa-street-view": "\uf21d",
    "fas fa-strikethrough": "\uf0cc",
    "fas fa-subscript": "\uf12c",
    "fas fa-subway": "\uf239",
    "fas fa-suitcase": "\uf0f2",
    "fas fa-sun": "\uf185",
    "fas fa-superscript": "\uf12b",
    "fas fa-sync": "\uf021",
    "fas fa-sync fa-spin": "\uf021",
    "fas fa-sync-alt": "\uf2f1",
    "fas fa-syringe": "\uf48e",
    "fas fa-table": "\uf0ce",
    "fas fa-table-tennis": "\uf45d",
    "fas fa-tablet": "\uf10a",
    "fas fa-tablet-alt": "\uf3fa",
    "fas fa-tablets": "\uf490",
    "fas fa-tachometer-alt": "\uf3fd",
    "fas fa-tag": "\uf02b",
    "fas fa-tags": "\uf02c",
    "fas fa-tape": "\uf4db",
    "fas fa-tasks": "\uf0ae",
    "fas fa-taxi": "\uf1ba",
    "fas fa-terminal": "\uf120",
    "fas fa-text-height": "\uf034",
    "fas fa-text-width": "\uf035",
    "fas fa-th": "\uf00a",
    "fas fa-th-large": "\uf009",
    "fas fa-th-list": "\uf00b",
    "fas fa-thermometer": "\uf491",
    "fas fa-thermometer-empty": "\uf2cb",
    "fas fa-thermometer-full": "\uf2c7",
    "fas fa-thermometer-half": "\uf2c9",
    "fas fa-thermometer-quarter": "\uf2ca",
    "fas fa-thermometer-three-quarters": "\uf2c8",
    "fas fa-thumbs-down": "\uf165",
    "fas fa-thumbs-up": "\uf164",
    "fas fa-thumbtack": "\uf08d",
    "fas fa-ticket-alt": "\uf3ff",
    "fas fa-times": "\uf00d",
    "fas fa-times-circle": "\uf057",
    "fas fa-tint": "\uf043",
    "fas fa-toggle-off": "\uf204",
    "fas fa-toggle-on": "\uf205",
    "fas fa-trademark": "\uf25c",
    "fas fa-train": "\uf238",
    "fas fa-transgender": "\uf224",
    "fas fa-transgender-alt": "\uf225",
    "fas fa-trash": "\uf1f8",
    "fas fa-trash-alt": "\uf2ed",
    "fas fa-tree": "\uf1bb",
    "fas fa-trophy": "\uf091",
    "fas fa-truck": "\uf0d1",
    "fas fa-truck-loading": "\uf4de",
    "fas fa-truck-moving": "\uf4df",
    "fas fa-tty": "\uf1e4",
    "fas fa-tv": "\uf26c",
    "fas fa-umbrella": "\uf0e9",
    "fas fa-underline": "\uf0cd",
    "fas fa-undo": "\uf0e2",
    "fas fa-undo-alt": "\uf2ea",
    "fas fa-universal-access": "\uf29a",
    "fas fa-university": "\uf19c",
    "fas fa-unlink": "\uf127",
    "fas fa-unlock": "\uf09c",
    "fas fa-unlock-alt": "\uf13e",
    "fas fa-upload": "\uf093",
    "fas fa-user": "\uf007",
    "fas fa-user-circle": "\uf2bd",
    "fas fa-user-md": "\uf0f0",
    "fas fa-user-plus": "\uf234",
    "fas fa-user-secret": "\uf21b",
    "fas fa-user-times": "\uf235",
    "fas fa-user-friends": "\uf500",
    "fas fa-users": "\uf0c0",
    "fas fa-utensil-spoon": "\uf2e5",
    "fas fa-utensils": "\uf2e7",
    "fas fa-venus": "\uf221",
    "fas fa-venus-double": "\uf226",
    "fas fa-venus-mars": "\uf228",
    "fas fa-vial": "\uf492",
    "fas fa-vials": "\uf493",
    "fas fa-video": "\uf03d",
    "fas fa-video-slash": "\uf4e2",
    "fas fa-volleyball-ball": "\uf45f",
    "fas fa-volume-down": "\uf027",
    "fas fa-volume-off": "\uf026",
    "fas fa-volume-up": "\uf028",
    "fas fa-warehouse": "\uf494",
    "fas fa-weight": "\uf496",
    "fas fa-wheelchair": "\uf193",
    "fas fa-wifi": "\uf1eb",
    "fas fa-window-close": "\uf410",
    "fas fa-window-maximize": "\uf2d0",
    "fas fa-window-minimize": "\uf2d1",
    "fas fa-window-restore": "\uf2d2",
    "fas fa-wine-glass": "\uf4e3",
    "fas fa-won-sign": "\uf159",
    "fas fa-wrench": "\uf0ad",
    "fas fa-x-ray": "\uf497",
    "fas fa-yen-sign": "\uf157",
    "fab fa-500px": "\uf26e",
    "fab fa-accessible-icon": "\uf368",
    "fab fa-accusoft": "\uf369",
    "fab fa-adn": "\uf170",
    "fab fa-adversal": "\uf36a",
    "fab fa-affiliatetheme": "\uf36b",
    "fab fa-algolia": "\uf36c",
    "fab fa-amazon": "\uf270",
    "fab fa-amazon-pay": "\uf42c",
    "fab fa-amilia": "\uf36d",
    "fab fa-android": "\uf17b",
    "fab fa-angellist": "\uf209",
    "fab fa-angrycreative": "\uf36e",
    "fab fa-angular": "\uf420",
    "fab fa-app-store": "\uf36f",
    "fab fa-app-store-ios": "\uf370",
    "fab fa-apper": "\uf371",
    "fab fa-apple": "\uf179",
    "fab fa-apple-pay": "\uf415",
    "fab fa-asymmetrik": "\uf372",
    "fab fa-audible": "\uf373",
    "fab fa-autoprefixer": "\uf41c",
    "fab fa-avianex": "\uf374",
    "fab fa-aviato": "\uf421",
    "fab fa-aws": "\uf375",
    "fab fa-bandcamp": "\uf2d5",
    "fab fa-behance": "\uf1b4",
    "fab fa-behance-square": "\uf1b5",
    "fab fa-bimobject": "\uf378",
    "fab fa-bitbucket": "\uf171",
    "fab fa-bitcoin": "\uf379",
    "fab fa-bity": "\uf37a",
    "fab fa-black-tie": "\uf27e",
    "fab fa-blackberry": "\uf37b",
    "fab fa-blogger": "\uf37c",
    "fab fa-blogger-b": "\uf37d",
    "fab fa-bluetooth": "\uf293",
    "fab fa-bluetooth-b": "\uf294",
    "fab fa-btc": "\uf15a",
    "fab fa-buromobelexperte": "\uf37f",
    "fab fa-buysellads": "\uf20d",
    "fab fa-cc-amazon-pay": "\uf42d",
    "fab fa-cc-amex": "\uf1f3",
    "fab fa-cc-apple-pay": "\uf416",
    "fab fa-cc-diners-club": "\uf24c",
    "fab fa-cc-discover": "\uf1f2",
    "fab fa-cc-jcb": "\uf24b",
    "fab fa-cc-mastercard": "\uf1f1",
    "fab fa-cc-paypal": "\uf1f4",
    "fab fa-cc-stripe": "\uf1f5",
    "fab fa-cc-visa": "\uf1f0",
    "fab fa-centercode": "\uf380",
    "fab fa-chrome": "\uf268",
    "fab fa-cloudscale": "\uf383",
    "fab fa-cloudsmith": "\uf384",
    "fab fa-cloudversify": "\uf385",
    "fab fa-codepen": "\uf1cb",
    "fab fa-codiepie": "\uf284",
    "fab fa-connectdevelop": "\uf20e",
    "fab fa-contao": "\uf26d",
    "fab fa-cpanel": "\uf388",
    "fab fa-creative-commons": "\uf25e",
    "fab fa-css3": "\uf13c",
    "fab fa-css3-alt": "\uf38b",
    "fab fa-cuttlefish": "\uf38c",
    "fab fa-d-and-d": "\uf38d",
    "fab fa-dashcube": "\uf210",
    "fab fa-delicious": "\uf1a5",
    "fab fa-deploydog": "\uf38e",
    "fab fa-deskpro": "\uf38f",
    "fab fa-deviantart": "\uf1bd",
    "fab fa-digg": "\uf1a6",
    "fab fa-digital-ocean": "\uf391",
    "fab fa-discord": "\uf392",
    "fab fa-discourse": "\uf393",
    "fab fa-dochub": "\uf394",
    "fab fa-docker": "\uf395",
    "fab fa-draft2digital": "\uf396",
    "fab fa-dribbble": "\uf17d",
    "fab fa-dribbble-square": "\uf397",
    "fab fa-dropbox": "\uf16b",
    "fab fa-drupal": "\uf1a9",
    "fab fa-dyalog": "\uf399",
    "fab fa-earlybirds": "\uf39a",
    "fab fa-edge": "\uf282",
    "fab fa-elementor": "\uf430",
    "fab fa-ember": "\uf423",
    "fab fa-empire": "\uf1d1",
    "fab fa-envira": "\uf299",
    "fab fa-erlang": "\uf39d",
    "fab fa-ethereum": "\uf42e",
    "fab fa-etsy": "\uf2d7",
    "fab fa-expeditedssl": "\uf23e",
    "fab fa-facebook": "\uf09a",
    "fab fa-facebook-f": "\uf39e",
    "fab fa-facebook-messenger": "\uf39f",
    "fab fa-facebook-square": "\uf082",
    "fab fa-firefox": "\uf269",
    "fab fa-first-order": "\uf2b0",
    "fab fa-firstdraft": "\uf3a1",
    "fab fa-flickr": "\uf16e",
    "fab fa-flipboard": "\uf44d",
    "fab fa-fly": "\uf417",
    "fab fa-font-awesome": "\uf2b4",
    "fab fa-font-awesome-alt": "\uf35c",
    "fab fa-font-awesome-flag": "\uf425",
    "fab fa-fonticons": "\uf280",
    "fab fa-fonticons-fi": "\uf3a2",
    "fab fa-fort-awesome": "\uf286",
    "fab fa-fort-awesome-alt": "\uf3a3",
    "fab fa-forumbee": "\uf211",
    "fab fa-foursquare": "\uf180",
    "fab fa-free-code-camp": "\uf2c5",
    "fab fa-freebsd": "\uf3a4",
    "fab fa-get-pocket": "\uf265",
    "fab fa-gg": "\uf260",
    "fab fa-gg-circle": "\uf261",
    "fab fa-git": "\uf1d3",
    "fab fa-git-square": "\uf1d2",
    "fab fa-github": "\uf09b",
    "fab fa-github-alt": "\uf113",
    "fab fa-github-square": "\uf092",
    "fab fa-gitkraken": "\uf3a6",
    "fab fa-gitlab": "\uf296",
    "fab fa-gitter": "\uf426",
    "fab fa-glide": "\uf2a5",
    "fab fa-glide-g": "\uf2a6",
    "fab fa-gofore": "\uf3a7",
    "fab fa-goodreads": "\uf3a8",
    "fab fa-goodreads-g": "\uf3a9",
    "fab fa-google": "\uf1a0",
    "fab fa-google-drive": "\uf3aa",
    "fab fa-google-play": "\uf3ab",
    "fab fa-google-plus": "\uf2b3",
    "fab fa-google-plus-g": "\uf0d5",
    "fab fa-google-plus-square": "\uf0d4",
    "fab fa-google-wallet": "\uf1ee",
    "fab fa-gratipay": "\uf184",
    "fab fa-grav": "\uf2d6",
    "fab fa-gripfire": "\uf3ac",
    "fab fa-grunt": "\uf3ad",
    "fab fa-gulp": "\uf3ae",
    "fab fa-hacker-news": "\uf1d4",
    "fab fa-hacker-news-square": "\uf3af",
    "fab fa-hips": "\uf452",
    "fab fa-hire-a-helper": "\uf3b0",
    "fab fa-hooli": "\uf427",
    "fab fa-hotjar": "\uf3b1",
    "fab fa-houzz": "\uf27c",
    "fab fa-html5": "\uf13b",
    "fab fa-hubspot": "\uf3b2",
    "fab fa-imdb": "\uf2d8",
    "fab fa-instagram": "\uf16d",
    "fab fa-internet-explorer": "\uf26b",
    "fab fa-ioxhost": "\uf208",
    "fab fa-itunes": "\uf3b4",
    "fab fa-itunes-note": "\uf3b5",
    "fab fa-java": "\uf4e4",
    "fab fa-jenkins": "\uf3b6",
    "fab fa-joget": "\uf3b7",
    "fab fa-joomla": "\uf1aa",
    "fab fa-js": "\uf3b8",
    "fab fa-js-square": "\uf3b9",
    "fab fa-jsfiddle": "\uf1cc",
    "fab fa-keycdn": "\uf3ba",
    "fab fa-kickstarter": "\uf3bb",
    "fab fa-kickstarter-k": "\uf3bc",
    "fab fa-korvue": "\uf42f",
    "fab fa-laravel": "\uf3bd",
    "fab fa-lastfm": "\uf202",
    "fab fa-lastfm-square": "\uf203",
    "fab fa-leanpub": "\uf212",
    "fab fa-less": "\uf41d",
    "fab fa-line": "\uf3c0",
    "fab fa-linkedin": "\uf08c",
    "fab fa-linkedin-in": "\uf0e1",
    "fab fa-linode": "\uf2b8",
    "fab fa-linux": "\uf17c",
    "fab fa-lyft": "\uf3c3",
    "fab fa-magento": "\uf3c4",
    "fab fa-maxcdn": "\uf136",
    "fab fa-medapps": "\uf3c6",
    "fab fa-medium": "\uf23a",
    "fab fa-medium-m": "\uf3c7",
    "fab fa-medrt": "\uf3c8",
    "fab fa-meetup": "\uf2e0",
    "fab fa-microsoft": "\uf3ca",
    "fab fa-mix": "\uf3cb",
    "fab fa-mixcloud": "\uf289",
    "fab fa-mizuni": "\uf3cc",
    "fab fa-modx": "\uf285",
    "fab fa-monero": "\uf3d0",
    "fab fa-napster": "\uf3d2",
    "fab fa-nintendo-switch": "\uf418",
    "fab fa-node": "\uf419",
    "fab fa-node-js": "\uf3d3",
    "fab fa-npm": "\uf3d4",
    "fab fa-ns8": "\uf3d5",
    "fab fa-nutritionix": "\uf3d6",
    "fab fa-odnoklassniki": "\uf263",
    "fab fa-odnoklassniki-square": "\uf264",
    "fab fa-opencart": "\uf23d",
    "fab fa-openid": "\uf19b",
    "fab fa-opera": "\uf26a",
    "fab fa-optin-monster": "\uf23c",
    "fab fa-osi": "\uf41a",
    "fab fa-page4": "\uf3d7",
    "fab fa-pagelines": "\uf18c",
    "fab fa-palfed": "\uf3d8",
    "fab fa-patreon": "\uf3d9",
    "fab fa-paypal": "\uf1ed",
    "fab fa-periscope": "\uf3da",
    "fab fa-phabricator": "\uf3db",
    "fab fa-phoenix-framework": "\uf3dc",
    "fab fa-php": "\uf457",
    "fab fa-pied-piper": "\uf2ae",
    "fab fa-pied-piper-alt": "\uf1a8",
    "fab fa-pied-piper-hat": "\uf4e5",
    "fab fa-pied-piper-pp": "\uf1a7",
    "fab fa-pinterest": "\uf0d2",
    "fab fa-pinterest-p": "\uf231",
    "fab fa-pinterest-square": "\uf0d3",
    "fab fa-playstation": "\uf3df",
    "fab fa-product-hunt": "\uf288",
    "fab fa-pushed": "\uf3e1",
    "fab fa-python": "\uf3e2",
    "fab fa-qq": "\uf1d6",
    "fab fa-quinscape": "\uf459",
    "fab fa-quora": "\uf2c4",
    "fab fa-ravelry": "\uf2d9",
    "fab fa-react": "\uf41b",
    "fab fa-readme": "\uf4d5",
    "fab fa-rebel": "\uf1d0",
    "fab fa-red-river": "\uf3e3",
    "fab fa-reddit": "\uf1a1",
    "fab fa-reddit-alien": "\uf281",
    "fab fa-reddit-square": "\uf1a2",
    "fab fa-rendact": "\uf3e4",
    "fab fa-renren": "\uf18b",
    "fab fa-replyd": "\uf3e6",
    "fab fa-resolving": "\uf3e7",
    "fab fa-rocketchat": "\uf3e8",
    "fab fa-rockrms": "\uf3e9",
    "fab fa-safari": "\uf267",
    "fab fa-sass": "\uf41e",
    "fab fa-schlix": "\uf3ea",
    "fab fa-scribd": "\uf28a",
    "fab fa-searchengin": "\uf3eb",
    "fab fa-sellcast": "\uf2da",
    "fab fa-sellsy": "\uf213",
    "fab fa-servicestack": "\uf3ec",
    "fab fa-shirtsinbulk": "\uf214",
    "fab fa-simplybuilt": "\uf215",
    "fab fa-sistrix": "\uf3ee",
    "fab fa-skyatlas": "\uf216",
    "fab fa-skype": "\uf17e",
    "fab fa-slack": "\uf198",
    "fab fa-slack-hash": "\uf3ef",
    "fab fa-slideshare": "\uf1e7",
    "fab fa-snapchat": "\uf2ab",
    "fab fa-snapchat-ghost": "\uf2ac",
    "fab fa-snapchat-square": "\uf2ad",
    "fab fa-soundcloud": "\uf1be",
    "fab fa-speakap": "\uf3f3",
    "fab fa-spotify": "\uf1bc",
    "fab fa-stack-exchange": "\uf18d",
    "fab fa-stack-overflow": "\uf16c",
    "fab fa-staylinked": "\uf3f5",
    "fab fa-steam": "\uf1b6",
    "fab fa-steam-square": "\uf1b7",
    "fab fa-steam-symbol": "\uf3f6",
    "fab fa-sticker-mule": "\uf3f7",
    "fab fa-strava": "\uf428",
    "fab fa-stripe": "\uf429",
    "fab fa-stripe-s": "\uf42a",
    "fab fa-studiovinari": "\uf3f8",
    "fab fa-stumbleupon": "\uf1a4",
    "fab fa-stumbleupon-circle": "\uf1a3",
    "fab fa-superpowers": "\uf2dd",
    "fab fa-supple": "\uf3f9",
    "fab fa-telegram": "\uf2c6",
    "fab fa-telegram-plane": "\uf3fe",
    "fab fa-tencent-weibo": "\uf1d5",
    "fab fa-themeisle": "\uf2b2",
    "fab fa-trello": "\uf181",
    "fab fa-tripadvisor": "\uf262",
    "fab fa-tumblr": "\uf173",
    "fab fa-tumblr-square": "\uf174",
    "fab fa-twitch": "\uf1e8",
    "fab fa-twitter": "\uf099",
    "fab fa-twitter-square": "\uf081",
    "fab fa-typo3": "\uf42b",
    "fab fa-uber": "\uf402",
    "fab fa-uikit": "\uf403",
    "fab fa-uniregistry": "\uf404",
    "fab fa-untappd": "\uf405",
    "fab fa-usb": "\uf287",
    "fab fa-ussunnah": "\uf407",
    "fab fa-vaadin": "\uf408",
    "fab fa-viacoin": "\uf237",
    "fab fa-viadeo": "\uf2a9",
    "fab fa-viadeo-square": "\uf2aa",
    "fab fa-viber": "\uf409",
    "fab fa-vimeo": "\uf40a",
    "fab fa-vimeo-square": "\uf194",
    "fab fa-vimeo-v": "\uf27d",
    "fab fa-vine": "\uf1ca",
    "fab fa-vk": "\uf189",
    "fab fa-vnv": "\uf40b",
    "fab fa-vuejs": "\uf41f",
    "fab fa-weibo": "\uf18a",
    "fab fa-weixin": "\uf1d7",
    "fab fa-whatsapp": "\uf232",
    "fab fa-whatsapp-square": "\uf40c",
    "fab fa-whmcs": "\uf40d",
    "fab fa-wikipedia-w": "\uf266",
    "fab fa-windows": "\uf17a",
    "fab fa-wordpress": "\uf19a",
    "fab fa-wordpress-simple": "\uf411",
    "fab fa-wpbeginner": "\uf297",
    "fab fa-wpexplorer": "\uf2de",
    "fab fa-wpforms": "\uf298",
    "fab fa-xbox": "\uf412",
    "fab fa-xing": "\uf168",
    "fab fa-xing-square": "\uf169",
    "fab fa-y-combinator": "\uf23b",
    "fab fa-yahoo": "\uf19e",
    "fab fa-yandex": "\uf413",
    "fab fa-yandex-international": "\uf414",
    "fab fa-yelp": "\uf1e9",
    "fab fa-yoast": "\uf2b1",
    "fab fa-youtube": "\uf167",
    "fab fa-youtube-square": "\uf431"
  };

  return FaLookup;

}).call(this);

export default FaLookup;
