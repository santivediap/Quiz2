let counter = 0;

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

async function paintQuestions() {

    try {
    let val = await getQuestions();
        val.results.forEach((ele, index) => {

            let questionOptions = []

            while(questionOptions.length < 4) {
                let randomOption = Math.floor(Math.random() * ele.incorrect_answers.length)
                questionOptions.push(ele.incorrect_answers[randomOption])
                ele.incorrect_answers.splice(randomOption, 1)

            }

            // ele.incorrect_answers.push(ele.correct_answer)

            let questionContainer = document.createElement("div")
            questionContainer.className = "hide"
            questionContainer.setAttribute("id", "question")

            let questionsh3 = document.createElement("h3")
            let questionsh3text = document.createTextNode(ele.question)
            questionsh3.appendChild(questionsh3text)

            let questionArticle = document.createElement("article")
            questionArticle.appendChild(questionsh3)
            
            // Crear opciones
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
            submitButton.textContent = "Comprobar respuestas";
    
            document.querySelector("#quiz").appendChild(submitButton);
            showQuestion()
    } catch (error){
        console.log(`ERROR! -> ${error}`);
    }
    }

paintQuestions()

function showQuestion() {
    let questionsSelector = document.querySelectorAll("#question")

    if(counter < 10) {
        questionsSelector.forEach(question => {
            question.className = "hide"
        })
    
        questionsSelector[counter].className = "question-container"
        counter += 1;
    }
}

// VALIDACION DEL FORMULARIO

document.querySelector("#quiz").addEventListener("submit", function (event) {
    event.preventDefault();
  
    let selectedOptions = document.querySelectorAll(".options-container input:checked");
  
    let correctCount = 0;
    let incorrectCount = 0;
  
    selectedOptions.forEach((option) => {
      let questionIndex = option.getAttribute("name");
      let question = document.querySelectorAll(".hide")[questionIndex];
      let correctAnswer = question.querySelector("label.option input[data-correct-answer]");
  
      if (option === correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });
  
    console.log("Respuestas correctas: " + correctCount);
    console.log("Respuestas incorrectas: " + incorrectCount);
  });






