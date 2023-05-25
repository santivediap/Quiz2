// Variables globales

let counter = 0;
let countRightAnswers;
let countWrongAnswers;

let questionsList = []

if(!localStorage.results) {
    localStorage.results = JSON.stringify([])
}

// Función para obtener las preguntas

async function getQuestions() {
    try {
        let response = await fetch ('https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple');
        let data = response.json();
        data.then(val => val);
        return data
    } catch (error) {
        console.log(`ERROR! -> ${error}`);
    }
}

// Función para pintar las preguntas iniciales

async function paintQuestions() {

    if(document.querySelector("#quiz")) {
        try {
            let val = questionsList
                val.forEach((ele, index) => {
        
                    // Pushea la opcion correcta al resto de opciones
                    ele.incorrect_answers.push(ele.correct_answer)
        
                    // Crear nuevas opciones
                    let questionOptions = []
        
                    while(questionOptions.length < 4) {
                        let randomOption = Math.floor(Math.random() * ele.incorrect_answers.length)
                        questionOptions.push(ele.incorrect_answers[randomOption])
                        ele.incorrect_answers.splice(randomOption, 1)
                    }
        
                    let questionContainer = document.createElement("div")
                    questionContainer.className = "hide"
                    questionContainer.setAttribute("id", "question")
        
                    let questionsh3 = document.createElement("h3")
                    let questionsh3text = document.createTextNode(`${index+1}. ${ele.question}`)
                    questionsh3.appendChild(questionsh3text)
        
                    let questionArticle = document.createElement("article")
                    questionArticle.appendChild(questionsh3)
                    
                    // Crear elementos de opciones
                    let optionsContainer = document.createElement("div")
                    optionsContainer.className = "options-container"
        
                    questionOptions.forEach(element => {
                        let optionLabel = document.createElement("label")
                        optionLabel.className = "option"
        
                        let optionParagraph = document.createElement("p")
                        let optionParagraphText = document.createTextNode(element)
                        optionParagraph.appendChild(optionParagraphText)
        
                        let optionInput = document.createElement("input")
                        optionInput.setAttribute("type", "radio")
                        optionInput.setAttribute("name", index)
                        optionInput.setAttribute("value", element)
                        
        
                        optionLabel.appendChild(optionParagraph)
                        optionLabel.appendChild(optionInput)
        
                        optionsContainer.appendChild(optionLabel)
                    });
        
                    questionContainer.appendChild(questionArticle)
                    questionContainer.appendChild(optionsContainer)
        
                    document.querySelector("#quiz").appendChild(questionContainer)
        
                })
                    // Creación del botón
                    let submitButton = document.createElement("button");
                    submitButton.setAttribute("type", "submit");
                    submitButton.className = "button-container";
                    submitButton.setAttribute("id", "submit-quiz")
                    submitButton.textContent = "Siguiente";
            
                    document.querySelector("#quiz").appendChild(submitButton);
                    showQuestion()
            } catch (error){
                console.log(`ERROR! -> ${error}`);
            }
    }
    }


// Función para mostrar 1 pregunta

function showQuestion() {
    let questionsSelector = document.querySelectorAll("#question")

    if(counter < 10) {
        questionsSelector.forEach(question => {
            question.className = "hide"
        })
    
        questionsSelector[counter].className = "question-container"
        counter += 1;
    } else {
        let playerResults = {date: new Date().toJSON(), mark: countRightAnswers}
        let existingResults = JSON.parse(localStorage.results)
        existingResults.push(playerResults)

        localStorage.results = JSON.stringify(existingResults)
        localStorage.summary = JSON.stringify([countRightAnswers, countWrongAnswers])

        // Borrar boton del formulario

        document.querySelector("#submit-quiz").remove()

        // Añadir nuevo anchor para enviar a pagina de resultados

        let resultsButton = document.createElement("a")
        resultsButton.setAttribute("href", "results.html")
        resultsButton.setAttribute("id", "results-anchor")
        resultsButton.textContent = "Resultados"
        resultsButton.className = "button-container"

        document.querySelector("#quiz").appendChild(resultsButton)
    }
}

// Código principal (El que se ejecuta al refrescar o abrir la página)

getQuestions().then(val => {
    questionsList = val.results

    paintQuestions()
    showResults()

    if(document.querySelector(".ct-chart")) {
        paintGraph()
    }
})

// Reinicio de variables con Start Anchor

if(document.getElementById("start-button")) {
    document.getElementById("start-button").addEventListener("click", () => {
        localStorage.summary = JSON.stringify([])

        countRightAnswers = 0;
        countWrongAnswers = 0;
    })
}

// VALIDACION DEL FORMULARIO

    if(document.querySelector("#quiz")) {
        document.querySelector("#quiz").addEventListener("submit", function (event) {
            event.preventDefault();
        
            let selectedOptions = document.querySelectorAll(".options-container input:checked");
        
            let correctCount = 0;
            let incorrectCount = 0;
        
            selectedOptions.forEach((option) => {
              let questionIndex = option.getAttribute("name");
              let question = document.querySelectorAll(".hide")[questionIndex];
        
            if (option.value == questionsList[questionIndex].correct_answer) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }
    
                countRightAnswers = correctCount
                countWrongAnswers = incorrectCount
            })
            showQuestion()
          });
    }

// Sacar informacion de partidas de LocalStorage y pintar Grafica

async function paintGraph () { 

const dateData = [];
const markData = [];

const getGamesData = JSON.parse(localStorage.getItem('results'));
  
    for (let i = 0; i < getGamesData.length; i++) {
      
    const date = getGamesData[i].date;
    const mark = getGamesData[i].mark;
  
    dateData.push(date);
    markData.push(mark);
}
  
new Chartist.Bar('.ct-chart', {
    labels: dateData,
    series: markData
  }, {
    distributeSeries: true
  });
}

// Mostrar resultados de la partida

function showResults() {
    if(document.getElementById("results")) {

        let localResults = JSON.parse(localStorage.summary)

        let resultsP = document.createElement("p")
        resultsP.appendChild(document.createTextNode(`Acertaste ${localResults[0]} preguntas de ${localResults[0]+localResults[1]} preguntas en total!`))

        let backAnchor = document.createElement("a")
        backAnchor.setAttribute("href", "../index.html")
        backAnchor.className = "button-container"
        backAnchor.appendChild(document.createTextNode("Volver"))

        document.getElementById("results").appendChild(resultsP)
        document.getElementById("results").appendChild(backAnchor)
    }
}