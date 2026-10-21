/* TictAC – built-in content: occasions, gradients, stickers, wordings, fonts */

const FONTS = ['Fredoka', 'Pacifico', 'Lobster', 'Bangers', 'Playfair Display', 'Orbitron', 'Dancing Script',
  'Caveat', 'Righteous', 'Anton', 'Poppins', 'Chewy', 'Creepster', 'Mountains of Christmas', 'Great Vibes',
  'Luckiest Guy', 'Press Start 2P', 'Permanent Marker'];

const LANGS = {
  en: { name: 'English', tag: 'en-GB', d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds', w: 'Weeks', mo: 'Months', togo: 'to go', only: 'Only', done: "It's here! 🎉" },
  af: { name: 'Afrikaans', tag: 'af-ZA', d: 'Dae', h: 'Uur', m: 'Minute', s: 'Sekondes', w: 'Weke', mo: 'Maande', togo: 'oor', only: 'Net', done: 'Dis hier! 🎉' },
  es: { name: 'Español', tag: 'es-ES', d: 'Días', h: 'Horas', m: 'Minutos', s: 'Segundos', w: 'Semanas', mo: 'Meses', togo: 'restantes', only: 'Solo', done: '¡Ya llegó! 🎉' },
  fr: { name: 'Français', tag: 'fr-FR', d: 'Jours', h: 'Heures', m: 'Minutes', s: 'Secondes', w: 'Semaines', mo: 'Mois', togo: 'restants', only: 'Plus que', done: 'Ça y est ! 🎉' },
  de: { name: 'Deutsch', tag: 'de-DE', d: 'Tage', h: 'Stunden', m: 'Minuten', s: 'Sekunden', w: 'Wochen', mo: 'Monate', togo: 'übrig', only: 'Nur noch', done: 'Es ist soweit! 🎉' },
  pt: { name: 'Português', tag: 'pt-PT', d: 'Dias', h: 'Horas', m: 'Minutos', s: 'Segundos', w: 'Semanas', mo: 'Meses', togo: 'restantes', only: 'Faltam', done: 'Chegou! 🎉' },
  nl: { name: 'Nederlands', tag: 'nl-NL', d: 'Dagen', h: 'Uren', m: 'Minuten', s: 'Seconden', w: 'Weken', mo: 'Maanden', togo: 'te gaan', only: 'Nog', done: 'Het is zover! 🎉' },
};

/* [name, c1, c2, angle] */
const GRADIENTS = [
  ['Purple Pop', '#8b5cf6', '#14c9b8', 135], ['Sunset', '#ff7e5f', '#feb47b', 160], ['Berry', '#c471ed', '#f64f59', 135],
  ['Ocean', '#2193b0', '#6dd5ed', 160], ['Midnight', '#0f0c29', '#302b63', 160], ['Candy', '#ff9a9e', '#fad0c4', 135],
  ['Forest', '#134e5e', '#71b280', 150], ['Gold', '#f7971e', '#ffd200', 135], ['Rose', '#ee9ca7', '#ffdde1', 135],
  ['Aurora', '#00c6ff', '#7b2ff7', 140], ['Fire', '#f12711', '#f5af19', 150], ['Mint', '#11998e', '#38ef7d', 135],
  ['Royal', '#141e30', '#243b55', 170], ['Peach', '#ffecd2', '#fcb69f', 135], ['Lavender', '#a18cd1', '#fbc2eb', 135],
  ['Sky', '#74ebd5', '#acb6e5', 135], ['Cherry', '#eb3349', '#f45c43', 135], ['Night Sky', '#000428', '#004e92', 180],
  ['Sherbet', '#ff9966', '#ff5e62', 135], ['Spring', '#d4fc79', '#96e6a1', 135], ['Cotton', '#ffc3a0', '#ffafbd', 135],
  ['Steel', '#485563', '#29323c', 160], ['Neon', '#ff00cc', '#3333ff', 135], ['Ice', '#e0eafc', '#cfdef3', 160],
  ['Pride', '#e40303', '#732982', 90], ['Sahara', '#c79081', '#dfa579', 160], ['Tropical', '#00d2ff', '#3a7bd5', 135],
  ['Black', '#111111', '#2b2b2b', 160],
];

const PATTERNS = ['none', 'dots', 'stripes', 'checks', 'grid', 'rays', 'stars', 'hearts', 'waves', 'zigzag', 'confetti', 'bokeh', 'plus'];

const PARTICLES = ['none', 'confetti', 'snow', 'flakes', 'stars', 'sparkles', 'hearts', 'bubbles', 'petals', 'leaves',
  'balloons', 'spooky', 'fireworks', 'fireflies', 'lanterns', 'easter', 'clover', 'gifts', 'party', 'rain'];

const FRAMES = ['none', 'line', 'double', 'dashed', 'white', 'lights', 'scallop'];

const SIZES = [
  { id: 'square', g: 'Instagram', name: 'Instagram post – square', w: 1080, h: 1080 },
  { id: 'portrait', g: 'Instagram', name: 'Instagram post – portrait 4:5', w: 1080, h: 1350 },
  { id: 'story', g: 'Instagram', name: 'Instagram story / reel cover', w: 1080, h: 1920 },
  { id: 'tiktok', g: 'TikTok', name: 'TikTok video / photo', w: 1080, h: 1920 },
  { id: 'fbfeed', g: 'Facebook', name: 'Facebook news feed – landscape', w: 1200, h: 630 },
  { id: 'fbsquare', g: 'Facebook', name: 'Facebook news feed – square', w: 1080, h: 1080 },
  { id: 'fbportrait', g: 'Facebook', name: 'Facebook news feed – portrait 4:5', w: 1080, h: 1350 },
  { id: 'fbstory', g: 'Facebook', name: 'Facebook story', w: 1080, h: 1920 },
  { id: 'fbcover', g: 'Facebook', name: 'Facebook page cover', w: 1640, h: 624 },
  { id: 'fbevent', g: 'Facebook', name: 'Facebook event cover', w: 1920, h: 1005 },
  { id: 'wastatus', g: 'WhatsApp', name: 'WhatsApp status', w: 1080, h: 1920 },
  { id: 'waprofile', g: 'WhatsApp', name: 'WhatsApp profile picture', w: 1080, h: 1080 },
  { id: 'wide', g: 'Other', name: 'X / Twitter post – 16:9', w: 1920, h: 1080 },
  { id: 'xheader', g: 'Other', name: 'X / Twitter header', w: 1500, h: 500 },
  { id: 'ytthumb', g: 'Other', name: 'YouTube thumbnail', w: 1280, h: 720 },
  { id: 'lipost', g: 'Other', name: 'LinkedIn post', w: 1200, h: 627 },
  { id: 'libanner', g: 'Other', name: 'LinkedIn banner', w: 1584, h: 396 },
  { id: 'pin', g: 'Other', name: 'Pinterest pin 2:3', w: 1000, h: 1500 },
];

/* Occasion keys → wording stickers: [English, Afrikaans|null] */
const PHRASES = {
  general: [['Countdown!', 'Aftelling!'], ['Almost there!', 'Amper daar!'], ['Can’t wait!', 'Kan nie wag nie!'], ['Get ready!', 'Maak gereed!'], ['Mark the date!', 'Merk die datum!'], ['Days to go!', 'Dae om te gaan!'], ['So excited!', 'So opgewonde!'], ['Coming soon…', 'Binnekort…']],
  birthday: [['Happy Birthday!', 'Gelukkige Verjaarsdag!'], ['Birthday Countdown', 'Verjaarsdag Aftelling'], ['Another year older!', 'Nog ’n jaar ouer!'], ['Let’s party!', 'Kom ons partytjie!'], ['Make a wish!', 'Maak ’n wens!'], ['Cake time!', 'Koek tyd!'], ['Level up!', null], ['Born to celebrate', null]],
  wedding: [['Getting married!', 'Ons trou!'], ['Save the date', 'Hou die datum oop'], ['Mr & Mrs', 'Mnr & Mev'], ['Till death do us part', null], ['Love is in the air', 'Liefde is in die lug'], ['Forever starts soon', null], ['The big day', 'Die groot dag'], ['I do!', 'Ek doen!']],
  baby: [['Baby on the way!', 'Baba is op pad!'], ['Hello little one', 'Hallo kleintjie'], ['Oh baby!', null], ['Due date', 'Verwagte datum'], ['Meet our baby soon', null], ['It’s a…?', null], ['Bundle of joy', 'Bondeltjie vreugde'], ['Tiny toes coming', null]],
  christmas: [['Merry Christmas!', 'Gesëende Kersfees!'], ['Ho ho ho!', null], ['Santa is coming', 'Kersvader kom!'], ['Sleeps till Christmas', 'Slape tot Kersfees'], ['Season’s Greetings', 'Seëngroete'], ['Jingle all the way', null], ['Joy to the world', 'Vreugde vir die wêreld'], ['Let it snow', null]],
  newyear: [['Happy New Year!', 'Voorspoedige Nuwe Jaar!'], ['Cheers to the new year', 'Gesondheid!'], ['New year, new me', 'Nuwe jaar, nuwe ek'], ['Let’s go 2027!', null], ['Goodbye old year', 'Totsiens ou jaar'], ['Fresh start', 'Nuwe begin'], ['Midnight magic', null], ['Make it count', null]],
  valentine: [['Be my Valentine', 'Wees my Valentyn'], ['Love is in the air', 'Liefde is in die lug'], ['XOXO', null], ['Forever yours', 'Vir ewig joune'], ['You + Me', 'Jy + Ek'], ['Hugs & kisses', 'Drukkies en soentjies'], ['Sweetheart', 'Skat'], ['Be mine', 'Wees myne']],
  christian: [['Blessed and grateful', 'Geseënd en dankbaar'], ['God is good', 'God is goed'], ['He is risen!', 'Hy het opgestaan!'], ['Faith, hope & love', 'Geloof, hoop en liefde'], ['Praise the Lord', 'Prys die Here'], ['Amen', null], ['Trust in Him', 'Vertrou op Hom'], ['Grace upon grace', 'Genade op genade']],
  easter: [['Happy Easter!', 'Geseënde Paasfees!'], ['Hop hop hooray!', null], ['Egg-cited!', null], ['He is risen', 'Hy het opgestaan'], ['Easter bunny’s coming', null], ['Spring has sprung', 'Lente is hier'], ['Chocolate time', 'Sjokolade tyd'], ['Blessed Easter', 'Geseënde Paastyd']],
  halloween: [['Happy Halloween!', null], ['Trick or Treat', 'Kry of Gryp'], ['Boo!', null], ['Spooky season', null], ['Stay creepy', null], ['Fright night', null], ['Witching hour', null], ['Haunted countdown', null]],
  thanksgiving: [['Happy Thanksgiving!', null], ['Grateful & blessed', 'Dankbaar en geseën'], ['Turkey time', null], ['Give thanks', 'Gee dank'], ['Feast mode', null], ['Pumpkin season', null], ['Count your blessings', 'Tel jou seëninge'], ['Gobble gobble', null]],
  diwali: [['Happy Diwali!', null], ['Festival of Lights', 'Fees van Lig'], ['Shubh Deepavali', null], ['Light up your life', null], ['Sparkle & shine', null], ['Rangoli time', null], ['Sweets & lights', null], ['Joy & prosperity', null]],
  eid: [['Eid Mubarak!', null], ['Ramadan Kareem', null], ['Blessed Eid', 'Geseënde Eid'], ['Moon sighting soon', null], ['Peace & blessings', 'Vrede en seëninge'], ['Taqabbal Allah', null], ['Celebrate & give', null], ['Crescent moon', null]],
  hanukkah: [['Happy Hanukkah!', null], ['Chag Sameach', null], ['Festival of Lights', 'Fees van Lig'], ['Light the menorah', null], ['Spin the dreidel', null], ['8 crazy nights', null], ['Miracle of lights', null], ['Shalom', null]],
  chinese: [['Happy Lunar New Year!', null], ['Gong Xi Fa Cai', null], ['Year of luck', null], ['Red envelopes!', null], ['Prosperity & joy', null], ['Reunion time', null], ['Dragon dance', null], ['Xin Nian Kuai Le', null]],
  vacation: [['Holiday mode ON', 'Vakansie modus AAN'], ['Beach bound', 'Strand toe'], ['Adventure awaits', 'Avontuur wag'], ['Out of office', 'Buite kantoor'], ['Sun, sea & sand', 'Son, see en sand'], ['Pack your bags', 'Pak jou tasse'], ['Wanderlust', null], ['Take me away', 'Vat my weg']],
  graduation: [['Graduation day!', 'Gradueerdag!'], ['She believed she could', null], ['Class of 2027', null], ['Dream big', 'Droom groot'], ['Cap & gown', null], ['Hard work pays off', 'Harde werk loon'], ['Proud of you', 'Trots op jou'], ['The future is bright', 'Die toekoms is helder']],
  anniversary: [['Happy Anniversary!', 'Gelukkige Herdenking!'], ['Still choosing you', null], ['Years of love', 'Jare van liefde'], ['Cheers to us', 'Gesondheid vir ons'], ['Together forever', 'Vir altyd saam'], ['My person', null], ['Love story', 'Liefdesverhaal'], ['Celebrating us', null]],
  school: [['Back to school', 'Terug skool toe'], ['Last day of school', 'Laaste skooldag'], ['Exam time!', 'Eksamentyd!'], ['Study hard', 'Leer hard'], ['Holidays soon', 'Vakansie binnekort'], ['Class dismissed', null], ['Brain mode ON', null], ['You got this!', 'Jy kan dit doen!']],
  party: [['Party time!', 'Partytjie tyd!'], ['You’re invited', 'Jy is uitgenooi'], ['Let’s celebrate', 'Kom ons vier fees'], ['Turn up!', null], ['Dance all night', null], ['Good vibes only', null], ['Save the date', 'Hou die datum oop'], ['It’s going to be epic', null]],
  sports: [['Game day!', 'Wedstryd dag!'], ['Go team!', 'Kom span!'], ['Race day', 'Wedloop dag'], ['Champions!', null], ['Train hard', null], ['Finish line', null], ['Kick-off', null], ['No pain no gain', null]],
  patriotic: [['Happy Independence Day!', null], ['Proud of our nation', 'Trots op ons land'], ['Freedom!', 'Vryheid!'], ['Heritage Day', 'Erfenisdag'], ['Braai time!', 'Braai tyd!'], ['Celebrate our country', null], ['National pride', null], ['Happy Holiday', 'Gelukkige Vakansiedag']],
  love: [['I love you', 'Ek is lief vir jou'], ['Me & you', 'Ek en jy'], ['Missing you', 'Ek mis jou'], ['See you soon', 'Sien jou binnekort'], ['Reunion countdown', null], ['Countdown to hugs', 'Aftelling tot drukkies'], ['Long distance love', null], ['Almost together', 'Amper saam']],
  work: [['Launch day', 'Bekendstelling'], ['Deadline', null], ['Big announcement', null], ['Ship it!', null], ['Retirement time', 'Aftreetyd'], ['Last day at work', null], ['New job starts', 'Nuwe werk begin'], ['Freedom Friday', null]],
};

/* Emoji sticker library */
const STICKERS = {
  '🎉 Party': ['🎉', '🎊', '🥳', '🎈', '🎁', '🎂', '🧁', '🍰', '🥂', '🍾', '🪅', '🎀', '🎶', '🪩', '🎇', '🎆', '✨', '🎵', '🍭', '🍬'],
  '⏳ Time': ['⏳', '⌛', '⏰', '🕰️', '⏱️', '⏲️', '📅', '🗓️', '🔔', '📣', '🚨', '💥', '🔥', '⚡', '💯', '🆕', '🔜', '🏁', '🎯', '🚀'],
  '😍 Faces': ['😍', '🥰', '🤩', '😎', '🥹', '😁', '🤗', '😜', '🥲', '😭', '😱', '🤯', '🙌', '👏', '💪', '🙏', '👀', '🤞', '✌️', '🫶'],
  '❤️ Love': ['❤️', '💕', '💖', '💘', '💝', '💌', '🌹', '😘', '💋', '💍', '👰', '🤵', '💒', '🥂', '💐', '🫶', '💞', '💓', '🧡', '💜'],
  '✝️ Christian': ['✝️', '🕊️', '🙏', '📖', '🕯️', '⛪', '😇', '👼', '🌿', '🍞', '🍷', '💧', '⭐', '🕎', '🌅', '❤️'],
  '🎄 Christmas': ['🎄', '🎅', '🤶', '🦌', '⛄', '☃️', '❄️', '🎁', '🔔', '🕯️', '🧦', '🍪', '🥛', '⭐', '🌟', '🛷', '🧑‍🎄', '🍷', '🎶', '🧣'],
  '🎆 New Year': ['🎆', '🎇', '🥂', '🍾', '🕛', '🎉', '🪩', '✨', '🎊', '🥳', '🎩', '🎵'],
  '🐣 Easter': ['🐣', '🐰', '🐇', '🥚', '🌷', '🐥', '🌼', '🍫', '🧺', '🌱', '🦋', '✝️'],
  '🎃 Halloween': ['🎃', '👻', '🦇', '🕷️', '🕸️', '💀', '☠️', '🧙', '🧛', '🧟', '🍬', '🍭', '🌙', '🔮', '🪦', '🐈‍⬛'],
  '🦃 Thanksgiving': ['🦃', '🍂', '🍁', '🥧', '🌽', '🍽️', '🧡', '🌾', '🍠', '🙏'],
  '🪔 Diwali & Holi': ['🪔', '🎇', '🪷', '🪁', '🎨', '🌸', '🍬', '✨', '🔆', '🏵️'],
  '🌙 Eid & Ramadan': ['🌙', '⭐', '🕌', '🕋', '🤲', '🌟', '🏮', '🍇', '🥙', '☪️'],
  '🕎 Hanukkah': ['🕎', '✡️', '🕯️', '🌟', '🍩', '🎁', '💙'],
  '🧧 Lunar New Year': ['🧧', '🏮', '🐉', '🥠', '🎆', '🥟', '🍊', '🐲', '🎋', '🪭'],
  '🏖️ Summer & Travel': ['☀️', '🏖️', '🌴', '🏝️', '🌊', '🍹', '🕶️', '🩴', '🧳', '✈️', '🚗', '🚢', '🗺️', '🧭', '🏕️', '⛺', '🚂', '🛫', '📸', '🍦', '🏄', '🤿'],
  '❄️ Winter': ['⛷️', '🏂', '❄️', '☃️', '🧤', '🧣', '☕', '🔥', '🛷', '🥶'],
  '🎓 School & Work': ['🎓', '📚', '✏️', '🏫', '🎒', '📝', '🔬', '🧪', '💼', '💻', '📈', '🏆', '🥇', '💡', '🧠', '📌'],
  '⚽ Sports': ['⚽', '🏀', '🏈', '🏉', '🏏', '🎾', '🏐', '⛳', '🏆', '🥇', '🏅', '🏁', '🏃', '🚴', '🏊', '🥊'],
  '🎤 Music & Events': ['🎤', '🎸', '🎧', '🥁', '🎹', '🎷', '🎟️', '🎫', '🎭', '🎬', '📺', '🎮', '🪩', '🎺'],
  '👶 Baby & Family': ['👶', '🍼', '🧸', '🐣', '👣', '🎀', '🧷', '🛁', '👪', '🤱', '💙', '💗', '🌈', '☁️'],
  '🐶 Animals': ['🐶', '🐱', '🐾', '🐻', '🦁', '🐼', '🦄', '🐸', '🦋', '🐝', '🐘', '🦒', '🐧', '🦉', '🐬', '🐢'],
  '🌸 Nature': ['🌸', '🌺', '🌻', '🌹', '🌷', '🍀', '☘️', '🌈', '☀️', '🌙', '⭐', '☁️', '🌍', '🍃', '🌿', '🌵', '🍄', '🌊'],
  '🍔 Food & Drink': ['🍔', '🍕', '🌮', '🍩', '🍦', '🍓', '🍉', '🍺', '🍷', '🥂', '☕', '🧋', '🥘', '🍖', '🌭', '🍿'],
  '🇿🇦 SA & Braai': ['🔥', '🥩', '🌭', '🍖', '🦁', '🦓', '🏉', '🏏', '✊', '🌅', '🏔️', '🌍'],
};

/* Occasions. d: date rule – f:'MM-DD' | nth:[month,weekday(0=Sun),n(-1=last)] (+off days) | easter:offset | tbl:{year:'MM-DD'}
   b:[c1,c2,angle] pa:pattern pt:particles ac:accent f:font occ:wording key st:emoji stickers tc:text colour */
const EVENTS = [
  // Personal moments (no fixed date)
  { id: 'custom', cat: 'Personal', name: 'My Big Day', e: '🎯', occ: 'general', b: ['#8b5cf6', '#14c9b8', 135], pt: 'confetti', pa: 'none', ac: '#ffe066', f: 'Fredoka', st: ['🎉', '⏳', '🚀', '✨'] },
  { id: 'birthday', cat: 'Personal', name: 'Birthday', e: '🎂', occ: 'birthday', b: ['#ff9a9e', '#a18cd1', 135], pt: 'confetti', pa: 'dots', ac: '#fff3a0', f: 'Pacifico', st: ['🎂', '🎈', '🎁', '🥳'] },
  { id: 'wedding', cat: 'Personal', name: 'Our Wedding', e: '💍', occ: 'wedding', b: ['#fdfbfb', '#ebedee', 160], pt: 'petals', pa: 'none', ac: '#c9a24b', f: 'Great Vibes', tc: '#4a3b2a', st: ['💍', '💐', '🕊️', '💕'] },
  { id: 'engagement', cat: 'Personal', name: 'Engagement Party', e: '💍', occ: 'wedding', b: ['#f6d365', '#fda085', 135], pt: 'sparkles', pa: 'none', ac: '#ffffff', f: 'Dancing Script', st: ['💍', '🥂', '✨', '💖'] },
  { id: 'anniversary', cat: 'Personal', name: 'Anniversary', e: '💞', occ: 'anniversary', b: ['#c471f5', '#fa71cd', 135], pt: 'hearts', pa: 'none', ac: '#ffe0f0', f: 'Dancing Script', st: ['💞', '🥂', '🌹', '❤️'] },
  { id: 'baby', cat: 'Personal', name: 'Baby Arrives', e: '👶', occ: 'baby', b: ['#a1c4fd', '#c2e9fb', 135], pt: 'bubbles', pa: 'dots', ac: '#ffffff', f: 'Chewy', tc: '#2d4b73', st: ['👶', '🍼', '🧸', '🐣'] },
  { id: 'graduation', cat: 'Personal', name: 'Graduation', e: '🎓', occ: 'graduation', b: ['#141e30', '#243b55', 160], pt: 'confetti', pa: 'none', ac: '#ffd200', f: 'Playfair Display', st: ['🎓', '📚', '🏆', '🎉'] },
  { id: 'vacation', cat: 'Personal', name: 'Holiday Trip', e: '🏖️', occ: 'vacation', b: ['#00d2ff', '#3a7bd5', 160], pt: 'bubbles', pa: 'waves', ac: '#ffe066', f: 'Pacifico', st: ['🏖️', '✈️', '🌴', '🕶️'] },
  { id: 'flight', cat: 'Personal', name: 'Flight Day', e: '✈️', occ: 'vacation', b: ['#4facfe', '#00f2fe', 160], pt: 'stars', pa: 'none', ac: '#ffffff', f: 'Righteous', st: ['✈️', '🧳', '🗺️', '🌍'] },
  { id: 'retire', cat: 'Personal', name: 'Retirement', e: '🏝️', occ: 'work', b: ['#f7971e', '#ffd200', 135], pt: 'balloons', pa: 'rays', ac: '#ffffff', f: 'Lobster', st: ['🏝️', '⛳', '🎣', '🥳'] },
  { id: 'exam', cat: 'Personal', name: 'Exam Day', e: '📝', occ: 'school', b: ['#ee0979', '#ff6a00', 135], pt: 'none', pa: 'grid', ac: '#fff176', f: 'Anton', st: ['📝', '✏️', '🧠', '💪'] },
  { id: 'school', cat: 'Personal', name: 'School Starts', e: '🎒', occ: 'school', b: ['#11998e', '#38ef7d', 135], pt: 'stars', pa: 'checks', ac: '#fff176', f: 'Chewy', st: ['🎒', '📚', '✏️', '🏫'] },
  { id: 'holidays', cat: 'Personal', name: 'School Holidays', e: '🏄', occ: 'vacation', b: ['#f12711', '#f5af19', 150], pt: 'bubbles', pa: 'rays', ac: '#ffffff', f: 'Luckiest Guy', st: ['☀️', '🏄', '🍦', '🏖️'] },
  { id: 'party', cat: 'Personal', name: 'The Party', e: '🪩', occ: 'party', b: ['#ff00cc', '#3333ff', 135], pt: 'sparkles', pa: 'bokeh', ac: '#fff176', f: 'Righteous', st: ['🪩', '🎶', '🥳', '🍾'] },
  { id: 'concert', cat: 'Personal', name: 'The Concert', e: '🎤', occ: 'party', b: ['#0f0c29', '#7b2ff7', 160], pt: 'stars', pa: 'rays', ac: '#ff7ad9', f: 'Permanent Marker', st: ['🎤', '🎸', '🎧', '🎟️'] },
  { id: 'race', cat: 'Personal', name: 'Race Day', e: '🏃', occ: 'sports', b: ['#232526', '#414345', 160], pt: 'none', pa: 'stripes', ac: '#ff5252', f: 'Anton', st: ['🏃', '🏁', '🏅', '💪'] },
  { id: 'match', cat: 'Personal', name: 'Big Match', e: '🏉', occ: 'sports', b: ['#134e5e', '#71b280', 150], pt: 'confetti', pa: 'stripes', ac: '#ffe066', f: 'Bangers', st: ['🏉', '⚽', '🏆', '🔥'] },
  { id: 'launch', cat: 'Personal', name: 'Launch Day', e: '🚀', occ: 'work', b: ['#141e30', '#243b55', 160], pt: 'stars', pa: 'grid', ac: '#14c9b8', f: 'Orbitron', st: ['🚀', '💡', '📈', '🔥'] },
  { id: 'newjob', cat: 'Personal', name: 'First Day at Work', e: '💼', occ: 'work', b: ['#2193b0', '#6dd5ed', 160], pt: 'sparkles', pa: 'dots', ac: '#ffffff', f: 'Poppins', st: ['💼', '💻', '🎉', '💪'] },
  { id: 'moving', cat: 'Personal', name: 'Moving Day', e: '🏡', occ: 'general', b: ['#ffecd2', '#fcb69f', 135], pt: 'bubbles', pa: 'none', ac: '#ff6f61', f: 'Fredoka', tc: '#6b3e2e', st: ['🏡', '📦', '🔑', '🎉'] },
  { id: 'reunion', cat: 'Personal', name: 'See You Soon', e: '🤗', occ: 'love', b: ['#ff9a9e', '#fecfef', 135], pt: 'hearts', pa: 'none', ac: '#ffffff', f: 'Dancing Script', st: ['🤗', '💞', '✈️', '🏠'] },
  { id: 'pregnant', cat: 'Personal', name: 'Due Date', e: '🤰', occ: 'baby', b: ['#fbc2eb', '#a6c1ee', 135], pt: 'petals', pa: 'none', ac: '#ffffff', f: 'Dancing Script', st: ['🤰', '👣', '🍼', '💗'] },

  // Christian calendar
  { id: 'epiphany', cat: 'Christian', name: 'Epiphany', e: '⭐', d: { f: '01-06' }, occ: 'christmas', b: ['#141e30', '#243b55', 170], pt: 'stars', pa: 'none', ac: '#ffd700', f: 'Playfair Display', st: ['⭐', '👑', '🐪', '🎁'] },
  { id: 'ashwed', cat: 'Christian', name: 'Ash Wednesday', e: '✝️', d: { easter: -46 }, occ: 'christian', b: ['#485563', '#29323c', 160], pt: 'none', pa: 'none', ac: '#e0d5c1', f: 'Playfair Display', st: ['✝️', '🙏', '🕊️', '🕯️'] },
  { id: 'palmsun', cat: 'Christian', name: 'Palm Sunday', e: '🌿', d: { easter: -7 }, occ: 'christian', b: ['#56ab2f', '#a8e063', 150], pt: 'leaves', pa: 'none', ac: '#ffffff', f: 'Playfair Display', st: ['🌿', '✝️', '🕊️', '🙏'] },
  { id: 'maundy', cat: 'Christian', name: 'Maundy Thursday', e: '🍞', d: { easter: -3 }, occ: 'christian', b: ['#3a1c71', '#d76d77', 150], pt: 'sparkles', pa: 'none', ac: '#ffd9a0', f: 'Playfair Display', st: ['🍞', '🍷', '🕯️', '🙏'] },
  { id: 'eastermon', cat: 'Christian', name: 'Easter Monday / Family Day', e: '🐰', d: { easter: 1 }, occ: 'easter', b: ['#fbc2eb', '#a6c1ee', 135], pt: 'easter', pa: 'dots', ac: '#ffffff', f: 'Pacifico', st: ['🐰', '🧺', '🌷', '👪'] },
  { id: 'ascension', cat: 'Christian', name: 'Ascension Day', e: '☁️', d: { easter: 39 }, occ: 'christian', b: ['#74ebd5', '#acb6e5', 160], pt: 'sparkles', pa: 'none', ac: '#ffffff', f: 'Dancing Script', tc: '#2d4b73', st: ['☁️', '🕊️', '✨', '🙏'] },
  { id: 'pentecost', cat: 'Christian', name: 'Pentecost', e: '🔥', d: { easter: 49 }, occ: 'christian', b: ['#cb2d3e', '#ef473a', 150], pt: 'sparkles', pa: 'rays', ac: '#ffe066', f: 'Playfair Display', st: ['🔥', '🕊️', '📖', '🙏'] },
  { id: 'advent', cat: 'Christian', name: 'Advent Begins', e: '🕯️', d: { advent: 1 }, occ: 'christmas', b: ['#42275a', '#734b6d', 160], pt: 'sparkles', pa: 'none', ac: '#ffd700', f: 'Mountains of Christmas', st: ['🕯️', '⭐', '🎄', '🙏'] },
  { id: 'vow', cat: 'Christian', name: 'Day of the Vow / Reconciliation (16 Dec)', e: '🕊️', d: { f: '12-16' }, occ: 'patriotic', b: ['#007749', '#002395', 135], pt: 'sparkles', pa: 'none', ac: '#ffb81c', f: 'Playfair Display', st: ['🕊️', '🙏', '🌍', '✝️'] },
  { id: 'allsaints', cat: 'Christian', name: "All Saints' Day", e: '😇', d: { f: '11-01' }, occ: 'christian', b: ['#e0eafc', '#cfdef3', 160], pt: 'sparkles', pa: 'none', ac: '#b8860b', f: 'Playfair Display', tc: '#2d3a55', st: ['😇', '🕯️', '🙏', '✨'] },
  { id: 'reformation', cat: 'Christian', name: 'Reformation Day', e: '📖', d: { f: '10-31' }, occ: 'christian', b: ['#8e0e00', '#1f1c18', 160], pt: 'none', pa: 'none', ac: '#ffd9a0', f: 'Playfair Display', st: ['📖', '✝️', '🕯️', '🙏'] },
  { id: 'churchcamp', cat: 'Christian', name: 'Church Camp / Retreat', e: '⛺', occ: 'christian', b: ['#134e5e', '#71b280', 150], pt: 'fireflies', pa: 'none', ac: '#ffe066', f: 'Fredoka', st: ['⛺', '🔥', '🎸', '🙏'] },
  { id: 'baptism', cat: 'Christian', name: 'Baptism / Dedication', e: '💧', occ: 'christian', b: ['#a1c4fd', '#c2e9fb', 135], pt: 'bubbles', pa: 'none', ac: '#ffffff', f: 'Dancing Script', tc: '#2d4b73', st: ['💧', '🕊️', '✝️', '👶'] },
  { id: 'confirmation', cat: 'Christian', name: 'Confirmation / First Communion', e: '🕊️', occ: 'christian', b: ['#fdfbfb', '#ebedee', 160], pt: 'sparkles', pa: 'none', ac: '#c9a24b', f: 'Great Vibes', tc: '#4a3b2a', st: ['🕊️', '✝️', '🕯️', '🙏'] },

  // Fixed-date holidays
  { id: 'newyear', cat: 'Holidays', name: 'New Year', e: '🎆', d: { f: '01-01' }, occ: 'newyear', b: ['#0f0c29', '#302b63', 160], pt: 'fireworks', pa: 'none', ac: '#ffd700', f: 'Righteous', st: ['🥂', '🎆', '🍾', '🕛'] },
  { id: 'nye', cat: 'Holidays', name: "New Year's Eve", e: '🍾', d: { f: '12-31' }, occ: 'newyear', b: ['#000428', '#004e92', 180], pt: 'fireworks', pa: 'none', ac: '#ffd700', f: 'Righteous', st: ['🍾', '🥂', '🎇', '🕛'] },
  { id: 'australia', cat: 'Holidays', name: 'Australia Day', e: '🦘', d: { f: '01-26' }, occ: 'patriotic', b: ['#00247d', '#cf142b', 135], pt: 'fireworks', pa: 'stars', ac: '#ffffff', f: 'Poppins', st: ['🦘', '🏖️', '🎆', '🍖'] },
  { id: 'valentine', cat: 'Holidays', name: "Valentine's Day", e: '💘', d: { f: '02-14' }, occ: 'valentine', b: ['#ff5f6d', '#c471ed', 135], pt: 'hearts', pa: 'hearts', ac: '#ffe0f0', f: 'Pacifico', st: ['💘', '🌹', '💌', '😍'] },
  { id: 'pi', cat: 'Holidays', name: 'Pi Day', e: '🥧', d: { f: '03-14' }, occ: 'general', b: ['#f7971e', '#ffd200', 135], pt: 'confetti', pa: 'dots', ac: '#ffffff', f: 'Chewy', st: ['🥧', '🧮', '🤓', '✨'] },
  { id: 'womensday', cat: 'Holidays', name: "Women's Day (8 Mar)", e: '💐', d: { f: '03-08' }, occ: 'general', b: ['#8e2de2', '#f953c6', 135], pt: 'petals', pa: 'none', ac: '#ffffff', f: 'Dancing Script', st: ['💐', '💪', '👑', '💜'] },
  { id: 'stpat', cat: 'Holidays', name: "St Patrick's Day", e: '☘️', d: { f: '03-17' }, occ: 'general', b: ['#134e5e', '#71b280', 150], pt: 'clover', pa: 'none', ac: '#ffd700', f: 'Lobster', st: ['☘️', '🍺', '🌈', '🍀'] },
  { id: 'fools', cat: 'Holidays', name: 'April Fools', e: '🤡', d: { f: '04-01' }, occ: 'party', b: ['#fc466b', '#3f5efb', 135], pt: 'confetti', pa: 'checks', ac: '#ffee58', f: 'Bangers', st: ['🤡', '🃏', '😜', '🎈'] },
  { id: 'earth', cat: 'Holidays', name: 'Earth Day', e: '🌍', d: { f: '04-22' }, occ: 'general', b: ['#2193b0', '#6dd5ed', 160], pt: 'leaves', pa: 'none', ac: '#ffffff', f: 'Fredoka', st: ['🌍', '🌱', '♻️', '🌳'] },
  { id: 'freedom', cat: 'Holidays', name: 'Freedom Day (SA)', e: '✊', d: { f: '04-27' }, occ: 'patriotic', b: ['#007749', '#002395', 135], pt: 'confetti', pa: 'stripes', ac: '#ffb81c', f: 'Anton', st: ['✊', '🌅', '🦁', '🎉'] },
  { id: 'labour', cat: 'Holidays', name: 'Workers’ Day (1 May)', e: '🛠️', d: { f: '05-01' }, occ: 'work', b: ['#cb2d3e', '#ef473a', 135], pt: 'none', pa: 'stripes', ac: '#ffffff', f: 'Anton', st: ['🛠️', '💪', '✊', '🌹'] },
  { id: 'may4', cat: 'Holidays', name: 'Star Wars Day (May 4th)', e: '🚀', d: { f: '05-04' }, occ: 'general', b: ['#000000', '#434343', 160], pt: 'stars', pa: 'none', ac: '#ffe81f', f: 'Orbitron', st: ['🚀', '⭐', '🌌', '⚔️'] },
  { id: 'cinco', cat: 'Holidays', name: 'Cinco de Mayo', e: '🌮', d: { f: '05-05' }, occ: 'party', b: ['#006847', '#ce1126', 135], pt: 'confetti', pa: 'zigzag', ac: '#ffe066', f: 'Luckiest Guy', st: ['🌮', '🎺', '🌶️', '🪇'] },
  { id: 'mothers', cat: 'Holidays', name: "Mother's Day", e: '💐', d: { nth: [5, 0, 2] }, occ: 'love', b: ['#ee9ca7', '#ffdde1', 135], pt: 'petals', pa: 'none', ac: '#d6336c', f: 'Dancing Script', tc: '#7a2850', st: ['💐', '🌸', '❤️', '🤱'] },
  { id: 'fathers', cat: 'Holidays', name: "Father's Day", e: '👔', d: { nth: [6, 0, 3] }, occ: 'love', b: ['#2193b0', '#6dd5ed', 160], pt: 'bubbles', pa: 'stripes', ac: '#ffffff', f: 'Anton', st: ['👔', '🏆', '🍖', '❤️'] },
  { id: 'pride', cat: 'Holidays', name: 'Pride Month', e: '🌈', d: { f: '06-01' }, occ: 'party', b: ['#e40303', '#732982', 90], pt: 'confetti', pa: 'none', ac: '#ffffff', f: 'Fredoka', st: ['🌈', '💖', '✨', '🦄'] },
  { id: 'youth', cat: 'Holidays', name: 'Youth Day (SA)', e: '✊', d: { f: '06-16' }, occ: 'patriotic', b: ['#002395', '#de3831', 135], pt: 'confetti', pa: 'rays', ac: '#ffb81c', f: 'Anton', st: ['✊', '🎓', '🌍', '🔥'] },
  { id: 'canada', cat: 'Holidays', name: 'Canada Day', e: '🍁', d: { f: '07-01' }, occ: 'patriotic', b: ['#d80621', '#ff5f6d', 135], pt: 'leaves', pa: 'none', ac: '#ffffff', f: 'Poppins', st: ['🍁', '🏒', '🎆', '🦫'] },
  { id: 'july4', cat: 'Holidays', name: '4th of July', e: '🎆', d: { f: '07-04' }, occ: 'patriotic', b: ['#002868', '#bf0a30', 135], pt: 'fireworks', pa: 'stars', ac: '#ffffff', f: 'Bangers', st: ['🎆', '🍔', '🎇', '🦅'] },
  { id: 'bastille', cat: 'Holidays', name: 'Bastille Day', e: '🥖', d: { f: '07-14' }, occ: 'patriotic', b: ['#0055a4', '#ef4135', 135], pt: 'fireworks', pa: 'stripes', ac: '#ffffff', f: 'Playfair Display', st: ['🥖', '🎆', '🍷', '🗼'] },
  { id: 'sawomen', cat: 'Holidays', name: "Women's Day (SA, 9 Aug)", e: '💪', d: { f: '08-09' }, occ: 'general', b: ['#8e2de2', '#4a00e0', 135], pt: 'petals', pa: 'none', ac: '#ffd1f0', f: 'Dancing Script', st: ['💪', '👑', '🌸', '💜'] },
  { id: 'india', cat: 'Holidays', name: 'Independence Day (India)', e: '🪁', d: { f: '08-15' }, occ: 'patriotic', b: ['#ff9933', '#138808', 180], pt: 'confetti', pa: 'none', ac: '#ffffff', f: 'Poppins', st: ['🪁', '🎆', '🪷', '🎉'] },
  { id: 'spring', cat: 'Holidays', name: 'Spring Day (1 Sep)', e: '🌸', d: { f: '09-01' }, occ: 'general', b: ['#d4fc79', '#96e6a1', 135], pt: 'petals', pa: 'none', ac: '#ff6f91', f: 'Fredoka', tc: '#2e5d34', st: ['🌸', '🌷', '🦋', '🐝'] },
  { id: 'oktober', cat: 'Holidays', name: 'Oktoberfest', e: '🍺', d: { f: '09-19' }, occ: 'party', b: ['#f7971e', '#ffd200', 135], pt: 'bubbles', pa: 'checks', ac: '#ffffff', f: 'Luckiest Guy', st: ['🍺', '🥨', '🌭', '🎶'] },
  { id: 'heritage', cat: 'Holidays', name: 'Heritage / Braai Day', e: '🔥', d: { f: '09-24' }, occ: 'patriotic', b: ['#f12711', '#f5af19', 150], pt: 'fireflies', pa: 'none', ac: '#ffffff', f: 'Luckiest Guy', st: ['🔥', '🥩', '🌭', '🍖'] },
  { id: 'halloween', cat: 'Holidays', name: 'Halloween', e: '🎃', d: { f: '10-31' }, occ: 'halloween', b: ['#1a0033', '#ff6a00', 160], pt: 'spooky', pa: 'none', ac: '#ff9f1c', f: 'Creepster', st: ['🎃', '👻', '🦇', '🕸️'] },
  { id: 'dead', cat: 'Holidays', name: 'Day of the Dead', e: '💀', d: { f: '11-02' }, occ: 'halloween', b: ['#42275a', '#734b6d', 135], pt: 'petals', pa: 'zigzag', ac: '#ffb347', f: 'Lobster', st: ['💀', '🌼', '🕯️', '🎨'] },
  { id: 'guy', cat: 'Holidays', name: 'Guy Fawkes / Bonfire Night', e: '🎇', d: { f: '11-05' }, occ: 'party', b: ['#141e30', '#e44d26', 170], pt: 'fireworks', pa: 'none', ac: '#ffd166', f: 'Bangers', st: ['🎇', '🔥', '🧨', '✨'] },
  { id: 'singles', cat: 'Holidays', name: "Singles' Day (11.11)", e: '🛍️', d: { f: '11-11' }, occ: 'general', b: ['#ff416c', '#ff4b2b', 135], pt: 'confetti', pa: 'dots', ac: '#fff176', f: 'Anton', st: ['🛍️', '🛒', '💥', '🔥'] },
  { id: 'thanks', cat: 'Holidays', name: 'Thanksgiving (US)', e: '🦃', d: { nth: [11, 4, 4] }, occ: 'thanksgiving', b: ['#d38312', '#a83279', 135], pt: 'leaves', pa: 'none', ac: '#ffe0a3', f: 'Lobster', st: ['🦃', '🍂', '🥧', '🌽'] },
  { id: 'blackfriday', cat: 'Holidays', name: 'Black Friday', e: '🛒', d: { nth: [11, 4, 4], off: 1 }, occ: 'general', b: ['#000000', '#434343', 160], pt: 'confetti', pa: 'stripes', ac: '#ffd200', f: 'Anton', st: ['🛒', '🏷️', '💥', '🔥'] },
  { id: 'cybermon', cat: 'Holidays', name: 'Cyber Monday', e: '💻', d: { nth: [11, 4, 4], off: 4 }, occ: 'general', b: ['#0f2027', '#2c5364', 160], pt: 'stars', pa: 'grid', ac: '#00e5ff', f: 'Orbitron', st: ['💻', '🛒', '⚡', '💸'] },
  { id: 'xmaseve', cat: 'Christian', name: 'Christmas Eve', e: '🌟', d: { f: '12-24' }, occ: 'christmas', b: ['#0f2027', '#2c5364', 160], pt: 'snow', pa: 'none', ac: '#ffd700', f: 'Mountains of Christmas', st: ['🌟', '🎄', '🕯️', '🎁'] },
  { id: 'christmas', cat: 'Christian', name: 'Christmas', e: '🎄', d: { f: '12-25' }, occ: 'christmas', b: ['#0b6e4f', '#c1121f', 135], pt: 'snow', pa: 'dots', ac: '#ffd700', f: 'Mountains of Christmas', st: ['🎄', '🎅', '🎁', '⛄'] },
  { id: 'boxing', cat: 'Holidays', name: 'Boxing Day / Day of Goodwill', e: '🎁', d: { f: '12-26' }, occ: 'christmas', b: ['#c1121f', '#780000', 135], pt: 'gifts', pa: 'none', ac: '#ffd700', f: 'Lobster', st: ['🎁', '🛍️', '🎀', '🎉'] },
  { id: 'kwanzaa', cat: 'Holidays', name: 'Kwanzaa', e: '🕯️', d: { f: '12-26' }, occ: 'general', b: ['#1b5e20', '#b71c1c', 135], pt: 'sparkles', pa: 'zigzag', ac: '#ffd54f', f: 'Poppins', st: ['🕯️', '🌽', '✨', '🌍'] },

  // Moving / religious / lunar holidays (approximate – check the exact date)
  { id: 'easter', cat: 'Christian', name: 'Easter Sunday', e: '🐣', d: { easter: 0 }, occ: 'easter', b: ['#fbc2eb', '#a6c1ee', 135], pt: 'easter', pa: 'dots', ac: '#ffffff', f: 'Pacifico', st: ['🐣', '🐰', '🌷', '🥚'] },
  { id: 'goodfri', cat: 'Christian', name: 'Good Friday', e: '✝️', d: { easter: -2 }, occ: 'easter', b: ['#485563', '#29323c', 160], pt: 'none', pa: 'none', ac: '#ffffff', f: 'Playfair Display', st: ['✝️', '🕊️', '🙏', '🕯️'] },
  { id: 'carnival', cat: 'Religious & Lunar', name: 'Mardi Gras / Carnival', e: '🎭', d: { easter: -47 }, occ: 'party', b: ['#7b2ff7', '#f107a3', 135], pt: 'confetti', pa: 'zigzag', ac: '#ffd700', f: 'Bangers', st: ['🎭', '🪇', '🎺', '🎊'] },
  { id: 'cny', cat: 'Religious & Lunar', name: 'Lunar New Year', e: '🧧', d: { tbl: { 2026: '02-17', 2027: '02-06', 2028: '01-26', 2029: '02-13', 2030: '02-03', 2031: '01-23' } }, occ: 'chinese', b: ['#b71c1c', '#e53935', 135], pt: 'lanterns', pa: 'dots', ac: '#ffd700', f: 'Lobster', st: ['🧧', '🏮', '🐉', '🎆'] },
  { id: 'ramadan', cat: 'Religious & Lunar', name: 'Ramadan Begins', e: '🌙', d: { tbl: { 2027: '02-08', 2028: '01-28', 2029: '01-16', 2030: '01-05', 2031: '12-26' } }, occ: 'eid', b: ['#141e30', '#243b55', 170], pt: 'stars', pa: 'none', ac: '#ffd700', f: 'Dancing Script', st: ['🌙', '🕌', '⭐', '🏮'] },
  { id: 'eidfitr', cat: 'Religious & Lunar', name: 'Eid al-Fitr', e: '🕌', d: { tbl: { 2027: '03-09', 2028: '02-26', 2029: '02-14', 2030: '02-04', 2031: '01-24' } }, occ: 'eid', b: ['#0f9b8e', '#134e5e', 150], pt: 'sparkles', pa: 'stars', ac: '#ffd700', f: 'Dancing Script', st: ['🌙', '🕌', '✨', '🍬'] },
  { id: 'eidadha', cat: 'Religious & Lunar', name: 'Eid al-Adha', e: '🐑', d: { tbl: { 2027: '05-16', 2028: '05-05', 2029: '04-24', 2030: '04-13', 2031: '04-02' } }, occ: 'eid', b: ['#134e5e', '#71b280', 150], pt: 'sparkles', pa: 'stars', ac: '#ffd700', f: 'Dancing Script', st: ['🕋', '🌙', '🐑', '🤲'] },
  { id: 'holi', cat: 'Religious & Lunar', name: 'Holi', e: '🎨', d: { tbl: { 2027: '03-22', 2028: '03-11', 2029: '03-01', 2030: '03-20' } }, occ: 'party', b: ['#ff0080', '#7928ca', 135], pt: 'confetti', pa: 'bokeh', ac: '#ffee58', f: 'Chewy', st: ['🎨', '🌈', '💦', '😄'] },
  { id: 'diwali', cat: 'Religious & Lunar', name: 'Diwali', e: '🪔', d: { tbl: { 2026: '11-08', 2027: '10-29', 2028: '10-17', 2029: '11-05', 2030: '10-26' } }, occ: 'diwali', b: ['#1a0033', '#ff6a00', 160], pt: 'fireworks', pa: 'bokeh', ac: '#ffd166', f: 'Lobster', st: ['🪔', '🎇', '🪷', '✨'] },
  { id: 'hanukkah', cat: 'Religious & Lunar', name: 'Hanukkah', e: '🕎', d: { tbl: { 2026: '12-04', 2027: '12-24', 2028: '12-12', 2029: '12-01', 2030: '12-20' } }, occ: 'hanukkah', b: ['#0d47a1', '#1976d2', 160], pt: 'snow', pa: 'none', ac: '#ffffff', f: 'Playfair Display', st: ['🕎', '✡️', '🕯️', '🍩'] },
  { id: 'roshhash', cat: 'Religious & Lunar', name: 'Rosh Hashanah', e: '🍎', d: { tbl: { 2027: '10-02', 2028: '09-21', 2029: '09-10', 2030: '09-28' } }, occ: 'general', b: ['#c94b4b', '#4b134f', 135], pt: 'leaves', pa: 'none', ac: '#ffd166', f: 'Playfair Display', st: ['🍎', '🍯', '🌟', '🎺'] },
];

/* ---- date helpers for the occasion rules ---- */
function easterDate(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
    g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
    l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
    mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, mo - 1, da);
}
function nthWeekday(y, mo, wd, n) {
  if (n > 0) {
    const first = new Date(y, mo - 1, 1);
    return new Date(y, mo - 1, 1 + ((wd - first.getDay() + 7) % 7) + (n - 1) * 7);
  }
  const last = new Date(y, mo, 0);
  return new Date(y, mo - 1, last.getDate() - ((last.getDay() - wd + 7) % 7));
}
function ruleDate(ev, y) {
  const r = ev.d;
  if (!r) return null;
  let dt = null;
  if (r.f) { const [m, d] = r.f.split('-').map(Number); dt = new Date(y, m - 1, d); }
  else if (r.nth) dt = nthWeekday(y, r.nth[0], r.nth[1], r.nth[2]);
  else if (r.easter !== undefined) { dt = easterDate(y); dt.setDate(dt.getDate() + r.easter); }
  else if (r.advent) { const x = new Date(y, 11, 25), dow = x.getDay(); dt = new Date(y, 11, 25 - (dow || 7) - 21); }
  else if (r.tbl) { const v = r.tbl[y]; if (v) { const [m, d] = v.split('-').map(Number); dt = new Date(y, m - 1, d); } }
  if (dt && r.off) dt.setDate(dt.getDate() + r.off);
  return dt;
}
function nextOccurrence(ev, from) {
  if (!ev.d) return null;
  const today = new Date((from || new Date()).getFullYear(), (from || new Date()).getMonth(), (from || new Date()).getDate());
  for (let y = today.getFullYear(); y <= today.getFullYear() + 5; y++) {
    const dt = ruleDate(ev, y);
    if (dt && dt >= today) return dt;
  }
  return null;
}
