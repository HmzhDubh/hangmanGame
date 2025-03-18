import { useState } from 'react'
import Header from './components/Header'
import { languages } from './components/languages'
import { getFarewellText, getRandomWord } from './components/utils'
import { clsx } from "clsx"

import './App.css'

function App() {

    // States
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])

    // Derived
    const wrongGuessesCount = guessedLetters.filter( letter => !currentWord.includes(letter)).length
    const gameWon = currentWord.split("").every( (letter) => guessedLetters.includes(letter))
    const gameLost = wrongGuessesCount >= languages.length - 1
    const isGameOver = gameWon || gameLost
    console.log(gameWon, gameLost, isGameOver)
    const lastGuessedLetter = guessedLetters[guessedLetters.length -1]
    const isLastGuessedLetterIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    // Constant
    const alphabet = "qwertyuiopasdfghjklzxcvbnm"


    const languagesElements = languages.map( (lang, index) => {
        const isLost = index < wrongGuessesCount

        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color

        }
        const className = clsx("chip", isLost && "lost")

        return (
            <span
                className={className}
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    } )


    const letterElement = currentWord.split('').map( (letter, index) => {

        return(
            <span key={index} className="w-10 h-10 border-b-2 justify-center items-center flex bg-gray-700">
                {guessedLetters.includes(letter) || isGameOver ? letter.toUpperCase() : null}
            </span>

        )
    })

    const keyboardElements = alphabet.split('').map( (letter) => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            'bg-green-600': isCorrect,
            'bg-red-600': isWrong,
            'bg-yellow-600': 'bg-yellow-600',
            "w-10": 'w-10',
            "h-10": 'h-10',
            "border-2": 'border-2',
            "text-black": 'text-black',
            "rounded": 'rounded'

        })
        return(

            <button disabled={isGameOver} onClick={() => addGuessedLetter(letter)} key={letter} className={className}>{letter.toUpperCase()}</button>
        )

    } )



    function addGuessedLetter(letter){
        setGuessedLetters(prev => (
            guessedLetters.includes(letter) ?
            prev :
            [...prev, letter]))

    }
    function GameStatus(){
        if(!isGameOver && isLastGuessedLetterIncorrect){

            return(
                <div className="bg-blue-900 ms-46 p-2 me-46 text-center text-white rounded">
                    <p>
                        {getFarewellText(languages[wrongGuessesCount -1].name)}
                    </p>
                </div>
            )
        }
        if(gameWon){

            return(
                <div className="bg-green-700 ms-46 p-2 me-46 text-center text-white rounded">
                    <p>You Win!</p>
                    <p>Well done! 🎉</p>
                </div>
            )
        }else if(gameLost){
            return(
            <div className="bg-red-700 ms-46 p-2 me-46 text-center text-white rounded">
                <p>You Lost!</p>
                <p>Better Learn Assembly! </p>
            </div>
            )
        }

    }
    function newGame(){
        setCurrentWord(getRandomWord())
        setGuessedLetters([])

    }
    return(
        <>
            <main className="m-10 flex flex-col">
                {gameWon && <confetti />}
                <Header />
                    {GameStatus()}
                <div className="flex flex-wrap gap-2 justify-center mt-10">
                    {languagesElements}
                </div>

                <div className="flex justify-center items-center gap-1 text-white mt-10">
                    {letterElement}
                </div>
                <div className="p-3 text-center text-white">
                <p>
                    {currentWord.includes(lastGuessedLetter) ?
                        `Correct! The letter ${lastGuessedLetter} is in the word.` :
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {languages.length - 1} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter =>
                    guessedLetters.includes(letter) ? letter + "." : "blank.")
                    .join(" ")}
                </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-1 text-white mt-3">
                    {keyboardElements}
                </div>
                {isGameOver ? <button onClick={newGame} className="mt-10 bg-blue-500 p-2 rounded block">New Game</button> : null}
            </main>

        </>

    )

}

export default App
