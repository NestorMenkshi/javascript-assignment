
const fs = require ('fs')

const readAndCleanText = (filePath) => {
try {   
    const text = fs.readFileSync(filePath , 'utf-8');
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
} catch(error) {
    console.error(`Error reading text file : ${error.message}`)
    return '';
}
};

const splitWords = (text) => {
    return text.split(/\s+/).filter(word => word.length > 1);
};

const loadStopWords = (filePath) => {
try {
    return new Set(fs.readFileSync(filePath,'utf-8').split(',').map(word => word.trim()));
 } catch (error) {
    console.error(`Error reading stop words file : ${error.message}`);
    return new Set();
    }
};

const filterStopWords = (words, stopWords) => {
    return words.filter(word => !stopWords.has(word));
};
const countFrequencies = (words) => {
    const frequencies = {};
    words.forEach(word =>{
        frequencies[word] = (frequencies[word] || 0) + 1;
    });
    return frequencies;
};

const sortByFrequency = (frequencies) => {
    return Object.entries(frequencies).sort((a, b) => b[1] - a[1]);
};

const getTopNWords = (sortedWords,N) => {
    return sortedWords.slice(0, N);
};

const pipeline = (...functions) => (input) => 
    functions.reduce((acc, fn) => fn(acc), input);

const processTermFrequency = (textFilePath, stopWordsFilePath, N) =>
{
    const stopWords = loadStopWords(stopWordsFilePath);

    const process = pipeline(
        readAndCleanText,
        splitWords,
        (words) => filterStopWords(words , stopWords),
        countFrequencies,
        sortByFrequency,
        (sortedWords) => getTopNWords(sortedWords, N)
    );

    const result = process(textFilePath);
    result.forEach(([word, freq]) => console.log(`${word} - ${freq}`));
};

const textFilePath = './input.txt';
const stopWordsFilePath = './stop_words.txt';
const N = parseInt(process.argv[2], 10) || 25;

processTermFrequency(textFilePath, stopWordsFilePath, N);


