// Realizar el fetch a la API de las preguntas y respuestas

async function getQuestions () {
    try {
        let response = await fetch ('https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple');
        let data = response.json();
        let result = data.results;
        let completedResult = [];
        for (let i = 0; i < result.length; i++) {
            completedResult.push(result.question[i])
        }
        return result;

    } catch {
        console.log(`ERROR: ${error.stack}`);
    }
} getQuestions()


// Seleccionamos el formulario de las preguntas y evitamos el refresco de la pagina

const form = document.querySelector('.main-container');

form.addEventListener("submit", function(event){
    event.preventDefault();
})