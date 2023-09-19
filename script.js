let currentPhraseIndex = 0;

async function initGame(index) {
    await populateAnswers(phrases[index]);
    document.getElementById('category').innerText = phrases[index].category;
    document.getElementById('phrase').innerText = phrases[index].phrase;
}

async function populateAnswers(phraseObj) {
    const relatedWords = await fetchRelatedWords(phraseObj.word);
    phraseObj.answers = [...new Set([...phraseObj.answers, ...relatedWords])];
}

async function fetchRelatedWords(word) {
    const response = await fetch(`https://api.datamuse.com/words?ml=${word}`);
    const data = await response.json();
    return data.map(item => item.word);
}

let phrases = [
    {
        category: 'Be more extreme',
        phrase: "That film we saw last night was 'scary'",
        word: 'scary',
        answers: ['frightening', 'ghastly', 'haunting', 'diabolical', 'depraved', 'chilling']
    },
    {
        category: 'Be more respectful',
        phrase: "Your shirt is 'weird'",
        word: 'weird',
        answers: ['strange', 'different', 'odd', 'interesting', 'imaginative', 'original', 'distinctive']
    },
    {
        category: 'Be more forceful',
        phrase: "The teacher told his students to turn in their assignments 'soon'",
        word: 'soon',
        answers: ['asap', 'quickly', 'faster', 'hastily', 'promptly', 'instantly', 'immediately']
    },
    {
        category: 'Be more extreme',
        phrase: "That rollercoaster was 'fun'",
        word: 'fun',
        answers: ['thrilling', 'exhilarating', 'breathtaking', 'electrifying', 'pulse-pounding']
    },
    {
        category: 'Be more respectful',
        phrase: "Your artwork is 'nice'",
        word: 'nice',
        answers: ['beautiful', 'impressive', 'captivating', 'exquisite', 'masterful']
    },
    {
        category: 'Be more forceful',
        phrase: "The project needs to be completed 'eventually'",
        word: 'eventually',
        answers: ['urgently', 'promptly', 'imminently', 'forthwith', 'stat']
    },
    // New categories
    {
        category: 'Be more precise',
        phrase: "I think it's going to 'rain' tomorrow",
        word: 'rain',
        answers: ['drizzle', 'shower', 'pour', 'sprinkle', 'mist']
    },
    {
        category: 'Be more enthusiastic',
        phrase: "The concert was 'good'",
        word: 'good',
        answers: ['amazing', 'incredible', 'fantastic', 'spectacular', 'awe-inspiring']
    },
    {
        category: 'Be more optimistic',
        phrase: "I might 'try' to finish the project",
        word: 'try',
        answers: ['endeavour', 'strive', 'aspire', 'aim', 'commit']
    },
    {
        category: 'Be more diplomatic',
        phrase: "The meeting was 'long'",
        word: 'long',
        answers: ['extended', 'prolonged', 'comprehensive', 'thorough', 'detailed']
    }
];

let score = 0;
let timeLeft = 30;

function handleKeyPress(event) {
    if (event.keyCode === 13) {
        checkAnswer();
    }
}

const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');

const usedWords = new Set();

function updateCorrectWordsList() {
    document.getElementById('correctWordsList').innerText = Array.from(usedWords).join(', ');
}

async function checkAnswer() {
    let userInput = document.getElementById('userInput').value.toLowerCase();
    const relatedWords = await fetchRelatedWords(phrases[currentPhraseIndex].word);

    if (phrases[currentPhraseIndex].answers.includes(userInput) && !usedWords.has(userInput)) {
        score += 10;
        correctSound.play();
        usedWords.add(userInput);
        updateCorrectWordsList();
    } else if (!usedWords.has(userInput)) {
        incorrectSound.play();
    }

    document.getElementById('userInput').value = '';
    document.getElementById('score').innerText = 'Score: ' + score;
}

document.getElementById('userInput').addEventListener('keydown', handleKeyPress);

function nextPhrase() {
    clearInterval(timerInterval);
    timeLeft = 30;
    score = 0; // Reset the score

    document.getElementById('timer').innerText = timeLeft;
    document.getElementById('score').innerText = 'Score: ' + score; // Update the displayed score

    // Reset or hide the creativeWordsDiv here, if needed
    const creativeWordsDiv = document.getElementById('creativeWords');
    creativeWordsDiv.style.display = 'none';
    
    currentPhraseIndex++;
    if (currentPhraseIndex >= phrases.length) {
        currentPhraseIndex = 0;
    }

    usedWords.clear();
    document.getElementById('correctWordsList').innerText = '';

    initGame(currentPhraseIndex).then(() => {
        timerInterval = setInterval(updateTimer, 1000);
    });
}


document.getElementById('nextButton').addEventListener('click', nextPhrase);

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        document.getElementById('timer').innerText = 'Time\'s up!';
        showUnusedTopWords();
    } else {
        document.getElementById('timer').innerText = timeLeft;
    }
    timeLeft -= 1;
}

function showUnusedTopWords() {
    const unusedTopWords = phrases[currentPhraseIndex].answers.filter(word => !usedWords.has(word));
    const creativeWordsDiv = document.getElementById('creativeWords');
    creativeWordsDiv.style.display = 'block';
    creativeWordsDiv.innerHTML = '<h1>Top Unused Words</h1>';
    creativeWordsDiv.innerHTML += unusedTopWords.join(', ');
}

let timerInterval = setInterval(updateTimer, 1000);

initGame(currentPhraseIndex).then(() => {
    // Additional initialization code, if any
});
