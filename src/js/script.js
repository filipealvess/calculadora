const tabelaTeclas = document.getElementById('tabelaTeclas');
const resultado = document.getElementById('resultado');
const operadores = ["+", "-", "÷", "×"];
let contador = 0;

/* VERIFICA SE O DIGITO É UM OPERADOR OU PONTO */
function checarDigito(digito) {
    const tamanhoResultado = resultado.textContent.length;
    const ultimoDigito = resultado.textContent.substring(tamanhoResultado - 1, tamanhoResultado);
    let statusPonto = true;

    /* DIGITO SENDO UM 'PONTO' */
    if (digito === ".") {
        contador = 0;
        let posicao;
        for (let i = 0; i < operadores.length; i++) {
            for (let j = 1; j < tamanhoResultado; j++) {
                if (resultado.textContent.charAt(j) === operadores[i]) {
                    contador++;
                    posicao = j;
                }
            }
        }

        if (contador === 0) { // Está digitando o primeiro número (n1)
            for (let i = 0; i < tamanhoResultado; i++) {
                if (resultado.textContent.charAt(i) === ".") {
                    statusPonto = false;
                }
            }
        } else { // Está digitando o segundo número (n2)
            for (let i = posicao + 1; i < tamanhoResultado; i++) {
                if (resultado.textContent.charAt(i) === ".") {
                    statusPonto = false;
                }
            }
        }

        if (tamanhoResultado === 0) {
            resultado.innerText = `0.`;
        } else if (statusPonto) {
            contador = 0;

            operadores.forEach(operador => {
                if (ultimoDigito === operador) {
                    contador++;
                }
            });

            if (contador === 0) {
                resultado.innerText += `.`;
            } else {
                resultado.innerText += `0.`;
            }
        }
    }

    /* DIGITO SENDO UM 'OPERADOR' */
    operadores.forEach(operador => {
        // verifica se o dígito é um operador
        if (digito === operador && ultimoDigito !== ".") {
            // verifica se está no início ou no meio do cálculo
            if (tamanhoResultado === 0) {
                if (digito === operadores[0] || digito === operadores[1]) {
                    resultado.innerText += digito; // adiciona '+' ou '-'
                }
            } else {
                contador = 0;
                // verifica se o último dígito é um operador
                operadores.forEach(operador => {
                    if (ultimoDigito === operador) {
                        contador++;
                    }
                });

                if (contador === 0) { // último dígito não é um operador
                    for (let i = 0; i < operadores.length; i++) {
                        for (let j = 1; j < tamanhoResultado; j++) {
                            if (resultado.textContent.charAt(j) === operadores[i]) {
                                calcular();
                            }
                        }
                    }

                    resultado.innerText += digito;
                } else { // último dígito é um operador
                    apagar("clearError"); // apaga o operador antigo
                    resultado.innerText += digito; // acrescenta o operador atual (dígito)
                }
            }
        }
    });
}

/* EXIBE O DIGITO NA TELA DE RESULTADO */
function exibir(digito, checar) {
    const tamanhoResultado = resultado.textContent.length;

    if (tamanhoResultado <= 11) {
        if (checar) {
            checarDigito(digito);
        } else {
            resultado.innerText += digito;
        }
    }
}

/* APAGA O ÚLTIMO DIGITO OU TODO O CÁLCULO */
function apagar(porcao) {
    if (resultado.textContent.length > 0) {
        if (porcao === "clear") {
            resultado.innerText = "";
        } else if (porcao === "clearError") {
            resultado.innerText = resultado.textContent.substring(0, resultado.textContent.length - 1);
        }
    }
}

/* REALIZA O CÁLCULO (n1 op n2 = r) */
function calcular() {
    const tamanhoResultado = resultado.textContent.length;

    let n1;
    let op;
    let n2;
    let r;

    for (let i = 0; i < operadores.length; i++) {
        for (let j = 1; j < tamanhoResultado; j++) {
            if (resultado.textContent.charAt(j) === operadores[i]) {
                n1 = Number(resultado.textContent.substring(0, j));
                op = operadores[i];
                n2 = Number(resultado.textContent.substring(j + 1, tamanhoResultado));

                switch (op) {
                    case "+":
                        r = n1 + n2;
                        break;

                    case "-":
                        r = n1 - n2;
                        break;

                    case "÷":
                        r = n1 / n2;
                        break;

                    case "×":
                        r = n1 * n2;
                        break;

                    default:
                        break;
                }

                // limita o resultado à 5 caracteres
                if (r.toString().length > 5) {
                    for (let i = 0; i < r.toString().length; i++) {
                        if (r.toString().charAt(i) === ".") {
                            r = r.toString().substring(0, i + 4);
                        }
                    }
                }

                apagar("clear");

                const rString = r.toString().toLowerCase();

                if(rString === "infinity" || rString === "nan" || rString === "-nan" || rString === "-infinity"){
                    r = "Impossivel";
                }
                
                resultado.innerText = `${r}`;
            }
        }
    }
}

/* REALIZA AS OPERAÇÕES DINAMICAMENTE */
tabelaTeclas.addEventListener("click", (event) => {
    const elemento = event.target; // elemento HTML

    switch (elemento.dataset.nome) {
        case "clear":
            apagar("clear");
            break;

        case "clearError":
            apagar("clearError");
            break;

        case "numero":
            exibir(elemento.textContent, false);
            break;

        case "operador":
            exibir(elemento.textContent, true);
            break;

        case "igual":
            for (let i = 0; i < operadores.length; i++) {
                for (let j = 1; j < resultado.textContent.length; j++) {
                    if (resultado.textContent.charAt(j) === operadores[i]) {
                        calcular();
                    }
                }
            }
            break;

        case "ponto":
            exibir(elemento.textContent, true);
            break;

        default:
            break;
    }
});

document.addEventListener("keydown", (event) => {
    const numeros = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const ponto = [".", ","];
    const ops = ["+", "-", "*", "/"];
    const valorTecla = event.key;

    numeros.forEach(numero => {
        if (valorTecla === numero) {
            exibir(valorTecla, false);
        }
    });

    ponto.forEach(p => {
        if (valorTecla === p) {
            exibir(".", true);
        }
    });

    ops.forEach(op => {
        if (valorTecla === op) {
            switch (op) {
                case "+":
                    exibir("+", true);
                    break;

                case "-":
                    exibir("-", true);
                    break;

                case "*":
                    exibir("×", true);
                    break;

                case "/":
                    exibir("÷", true);
                    break;

                default:
                    break;
            }
        }
    });

    if (valorTecla.toLowerCase() === "enter") {
        for (let i = 0; i < operadores.length; i++) {
            for (let j = 1; j < resultado.textContent.length; j++) {
                if (resultado.textContent.charAt(j) === operadores[i]) {
                    calcular();
                }
            }
        }
    }

    if (valorTecla.toLowerCase() === "backspace") {
        apagar("clearError");
    }

    if (valorTecla.toLowerCase() === "delete") {
        apagar("clear");
    }
});