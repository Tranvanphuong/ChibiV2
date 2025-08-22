// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Kanji of the day rotation (simplified)
const kanjiList = [
    { char: '日', reading: 'にち / ひ', meaning: 'Ngày, mặt trời, Nhật Bản', examples: [
        '日本 (にほん) - Nhật Bản',
        '今日 (きょう) - Hôm nay',
        '日曜日 (にちようび) - Chủ nhật'
    ]},
    { char: '月', reading: 'げつ / つき', meaning: 'Tháng, mặt trăng', examples: [
        '月曜日 (げつようび) - Thứ hai',
        '一月 (いちがつ) - Tháng một',
        '月見 (つきみ) - Ngắm trăng'
    ]},
    { char: '水', reading: 'すい / みず', meaning: 'Nước', examples: [
        '水曜日 (すいようび) - Thứ tư',
        '水泳 (すいえい) - Bơi lội',
        '水色 (みずいろ) - Màu xanh nước biển'
    ]}
];

let currentKanji = 0;

function rotateKanji() {
    currentKanji = (currentKanji + 1) % kanjiList.length;
    const kanji = kanjiList[currentKanji];
    
    const kanjiCharElement = document.querySelector('.kanji-character');
    const kanjiReadingElement = document.querySelector('.kanji-reading');
    const kanjiMeaningElement = document.querySelector('.kanji-meaning');
    const kanjiExamplesElement = document.querySelector('.kanji-examples');
    
    if (kanjiCharElement) kanjiCharElement.textContent = kanji.char;
    if (kanjiReadingElement) kanjiReadingElement.textContent = kanji.reading;
    if (kanjiMeaningElement) kanjiMeaningElement.textContent = kanji.meaning;
    
    if (kanjiExamplesElement) {
        kanjiExamplesElement.innerHTML = '';
        kanji.examples.forEach(example => {
            const li = document.createElement('li');
            li.className = 'flex items-start';
            li.innerHTML = `<span class="text-orange-500 mr-2">•</span><span>${example}</span>`;
            kanjiExamplesElement.appendChild(li);
        });
    }
}

// Rotate kanji every 10 seconds
document.addEventListener('DOMContentLoaded', function() {
    setInterval(rotateKanji, 10000);
});
