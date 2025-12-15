
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling za navigacijske linkove
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            
            const targetId = this.getAttribute('href');
            // Ako je link samo #, ne radi ništa
            if(targetId === '#') return;
            
            // Provjera da li je to link na istoj stranici
            // U jekyllu, na blog stranici linkovi imaju puni URL ili /#id. 
            // Ovdje pojednostavljujemo logiku za statičnu home stranicu.
            if (targetId.startsWith('#')) {
                 e.preventDefault();
                 const targetElement = document.querySelector(targetId);
                 if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                     // Posebno rukovanje za kviz
                    if (targetId === '#mirs-quiz') {
                         const quizSection = document.getElementById('mirs-quiz');
                         if(quizSection) {
                             quizSection.style.display = 'block'; 
                             if(typeof loadQuestion === 'function') loadQuestion(); 
                         }
                    }
                 }
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const mainProductImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if(mainProductImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Ukloni 'active' klasu sa svih sličica
                thumbnails.forEach(t => t.classList.remove('active'));

                // Dodaj 'active' klasu kliknutoj sličici
                this.classList.add('active');

                // Promijeni src glavne slike na temelju data-image atributa kliknute sličice
                mainProductImage.src = this.dataset.image;
            });
        });
    }
});


// Dodatni DOM elementi za kviz
const mirsQuizSection = document.getElementById('mirs-quiz');
const quizContainer = document.getElementById('quiz-container');
const quizQuestionDiv = document.getElementById('quiz-question');
const questionText = document.querySelector('.question-text');
const optionsContainer = document.querySelector('.options-container');
const nextQuestionBtn = document.getElementById('next-question-btn');
const quizResultDiv = document.getElementById('quiz-result');
const resultText = document.querySelector('.result-text');
const restartQuizBtn = document.getElementById('restart-quiz-btn');

let currentQuestionIndex = 0;
let userAnswers = []; // Pohranjuje odabrane odgovore

const quizQuestions = [
    {
        question: "Kada se osjećate najbolje i najsamopouzdanije?",
        options: [
            { text: "U rano jutro, spremni za nove izazove.", score: 2 }, // Svježina, energija (grejp, bergamot)
            { text: "Tijekom dana, kada sam aktivan/aktivna i fokusiran/a.", score: 1 }, // Aromatično (lavanda, ružmarin)
            { text: "Uvečer, opušteno i ugodno, uživajući u miru.", score: 0 } // Drvenasto, zemljano (vetiver, cedar, pačuli)
        ]
    },
    {
        question: "Koji ambijent vas najviše privlači?",
        options: [
            { text: "Prostrane, otvorene livade ispunjene svježim zrakom.", score: 2 }, // Svježe, zračno
            { text: "Borove šume nakon kiše, s mirisom vlažnog drveta.", score: 1 }, // Drvenasto, aromatično
            { text: "Ugodna planinska koliba, uz pucketanje vatre.", score: 0 } // Toplo, zemljano
        ]
    },
    {
        question: "Kako biste opisali svoj idealan stil odijevanja?",
        options: [
            { text: "Svijetlo, prozračno i elegantno.", score: 2 }, // Lakoća, elegancija
            { text: "Udobno, prirodno, s daškom avanture.", score: 1 }, // Prirodno, opušteno
            { text: "Profinjeno, s dubokim tonovima i klasičnim krojevima.", score: 0 } // Dubina, sofisticiranost
        ]
    },
    {
        question: "Koju aktivnost najradije birate za opuštanje?",
        options: [
            { text: "Dugu šetnju uz obalu mora ili kroz park.", score: 2 }, // Osvježavajuće
            { text: "Čitanje knjige uz šalicu čaja u tišini doma.", score: 1 }, // Udobnost, mir
            { text: "Vrtlarenje ili boravak u prirodi, dodirujući zemlju.", score: 0 } // Zemljano, povezanost s prirodom
        ]
    },
    {
        question: "Koji je vaš omiljeni tip pića?",
        options: [
            { text: "Svježe iscijeđen sok od citrusa ili gazirana voda.", score: 2 }, // Citrusi, svježina
            { text: "Biljni čaj ili lagani koktel s biljkama.", score: 1 }, // Aromatično
            { text: "Dobar viski ili jaka kava.", score: 0 } // Dubina, intenzitet
        ]
    }
];

function loadQuestion() {
    if(!questionText) return;
    const questionData = quizQuestions[currentQuestionIndex];
    questionText.textContent = questionData.question;
    optionsContainer.innerHTML = ''; // Očisti prethodne opcije

    questionData.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('quiz-option');
        optionDiv.textContent = option.text;
        optionDiv.dataset.score = option.score; // Pohrani score u dataset
        optionDiv.dataset.index = index; // Pohrani index opcije
        optionDiv.addEventListener('click', () => selectOption(optionDiv));
        optionsContainer.appendChild(optionDiv);
    });

    nextQuestionBtn.style.display = 'none'; // Sakrij gumb dok opcija nije odabrana
    optionsContainer.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected')); // Očisti selekciju
}

function selectOption(selectedDiv) {
    optionsContainer.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    selectedDiv.classList.add('selected');
    userAnswers[currentQuestionIndex] = parseInt(selectedDiv.dataset.score);
    nextQuestionBtn.style.display = 'block'; // Pokaži gumb nakon odabira
}

function showResult() {
    quizQuestionDiv.style.display = 'none';
    quizResultDiv.style.display = 'flex'; // Koristi flex za centriranje unutar quiz-card

    const totalScore = userAnswers.reduce((sum, score) => sum + score, 0);
    let resultMessage = "";

    const maxScore = quizQuestions.length * 2; // Svako pitanje ima opciju s 2 boda
    const scorePercentage = (totalScore / maxScore) * 100;

    if (scorePercentage >= 65) {
        resultMessage = `Vaša osobnost zrači svježinom, elegancijom i nezaustavljivom energijom. Baš poput MIRS-ovih gornjih nota bergamota i grejpa, vi unosite iskričavost u svaki trenutak. MIRS će naglasiti vašu prozračnost i samopouzdanje, idealan za dinamične dane i nova iskustva.`;
    } else if (scorePercentage >= 35) {
        resultMessage = `Vi ste osoba koja cijeni ravnotežu, prirodnost i smirenost, s daškom divljeg duha. Srednje note lavande i ružmarina u MIRS-u odražavaju vašu sposobnost da balansirate eleganciju s autentičnošću. MIRS će savršeno nadopuniti vašu jedinstvenu individualnost tijekom cijelog dana.`;
    } else {
        resultMessage = `Posjedujete dubinu, sofisticiranost i snažnu povezanost s prirodom. Snažna baza MIRS-a s notama vetivera, cedra i pačulija rezonira s vašom toplom i upečatljivom prisutnošću. MIRS je stvoren da istakne vašu eleganciju i privlačnost u večernjim satima ili posebnim prilikama.`;
    }

    resultText.textContent = resultMessage;
}

if(nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResult();
        }
    });
}

if(restartQuizBtn) {
    restartQuizBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        userAnswers = [];
        quizQuestionDiv.style.display = 'flex'; // Vrati prikaz pitanja
        quizResultDiv.style.display = 'none';
        loadQuestion();
    });
}

// Interaktivna piramida
const noteItems = document.querySelectorAll('.note-item');
const noteDetailsCard = document.getElementById('note-details-card');
const detailName = document.getElementById('detail-name');
const detailImage = document.getElementById('detail-image');
const detailDesc = document.getElementById('detail-desc');
const detailRole = document.getElementById('detail-role');
const perfumeBottleOverlay = document.querySelector('.perfume-bottle-overlay');

if(noteItems.length > 0) {
    noteItems.forEach(item => {
        item.addEventListener('click', function() {
            const infoDiv = this.querySelector('.note-info');
            
            // Ažuriraj karticu s detaljima
            detailName.textContent = this.querySelector('.note-name').textContent;
            detailDesc.textContent = infoDiv.querySelector('.note-desc').textContent;
            detailRole.textContent = infoDiv.querySelector('.note-role').textContent;

            const img = infoDiv.querySelector('.note-image');
            detailImage.src = img.src;
            detailImage.alt = img.alt;
            detailImage.style.display = 'block';
        });
    });
}

function scrollToBuySection(event) {
    event.preventDefault();
    if(perfumeBottleOverlay) {
        perfumeBottleOverlay.classList.add('bottle-clicked');
        setTimeout(() => {
            perfumeBottleOverlay.classList.remove('bottle-clicked');
        }, 500);
    }

    const buySection = document.getElementById('buy');
    if (buySection) {
        // Osiguraj vidljivost ako je skriven
        buySection.style.display = 'block';
        buySection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}
