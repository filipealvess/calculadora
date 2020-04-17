let ultimoDigito = '';
let tipoUltimoDigito = ''; // Especial ou Número //
let statusPonto = true;
const especiais = ['.', '+', '-', '×', '÷'];

let resultado = 0;

let contador = 0;

let vezesOp = 0; // Quantidade de vezes que um operador foi clicado

function mostrar(digito) { // Mostra o dígito selecionado no painel //
    let res = document.getElementById('res');

    // Verificação do dígito atual //
    if (res.textContent.length < 12) {
        contador = 0;
        var tipo;
        for (let i = 0; i < especiais.length; i++) {
            if (digito === especiais[i]) {
                contador = 1;
            }
        }
        if (contador === 0) {
            tipo = 'numero';
        } else {
            tipo = 'especial';
        }

        if (tipo === 'numero') {
            res.innerText += digito;
            ultimoDigito = digito;
            tipoUltimoDigito = 'numero';
        }

        if (tipo === 'especial') {
            if (statusPonto === true) {
                if (digito === '.' && tipoUltimoDigito !== 'especial') {
                    if (res.textContent.length === 0 || tipoUltimoDigito === 'especial') {
                        res.innerText += `0${digito}`;
                    } else {
                        res.innerText += digito;
                    }
                    statusPonto = false;
                    ultimoDigito = digito;
                    tipoUltimoDigito = 'especial';
                }
            }

            else if (digito === '+' || digito === '-') {
                if (tipoUltimoDigito === 'especial' && ultimoDigito !== '.') {
                    limpar('ultimo');
                    res.innerText += digito;
                    if (res.textContent.length === 1) {
                        vezesOp = 0;
                    } else {
                        vezesOp = 1;
                    }
                    statusPonto = true;
                    ultimoDigito = digito;
                    tipoUltimoDigito = 'especial';
                } else if (res.textContent.length === 0 || tipoUltimoDigito === 'numero') {
                    if (vezesOp === 0 && res.textContent.length !== 0) {
                        vezesOp = 1;
                    } else if (vezesOp === 1) {
                        calcular();
                        res.innerText = `${resultado}`;
                        op = digito;
                        vezesOp = 1;
                    }
                    res.innerText += digito;
                    statusPonto = true;
                    ultimoDigito = digito;
                    tipoUltimoDigito = 'especial';
                }
            }

            else if (digito === '×' || digito === '÷') {
                if (res.textContent.length !== 0) {
                    if (tipoUltimoDigito === 'numero') {
                        if (vezesOp === 0) {
                            vezesOp = 1;
                        } else if (vezesOp === 1) {
                            calcular();
                            res.innerText = `${resultado}`;
                            op = digito;
                            vezesOp = 1;
                        }
                        res.innerText += digito;
                        statusPonto = true;
                        ultimoDigito = digito;
                        tipoUltimoDigito = 'especial';
                    } else if (ultimoDigito !== '.' && res.textContent.length > 1) {
                        limpar('ultimo');
                        res.innerText += digito;
                        vezesOp = 1;
                        statusPonto = true;
                        ultimoDigito = digito;
                        tipoUltimoDigito = 'especial';
                    }
                }
            }
        }
    }
}

function calcular() {
    const operadores = ['+', '-', '×', '÷'];

    // 1 + 1 = 2 -> n1 op n2 = r //
    let n1;
    let n2;
    let op;

    var p = 0; // Verifica se o primeiro dígito é '-'
    if (res.textContent.charAt(0) === '-') {
        p = 1;
    }

    for (let i = 0; i < operadores.length; i++) {
        for (let j = p; j < res.textContent.length; j++) {
            if (res.textContent.charAt(j) === operadores[i]) {
                n1 = Number(res.textContent.substring(0, j));
                n2 = Number(res.textContent.substring(j + 1, res.textContent.length));
                op = operadores[i];
            }
        }
    }

    switch (op) {
        case '+':
            resultado = n1 + n2;
            break;
        case '-':
            resultado = n1 - n2;
            break;
        case '×':
            resultado = n1 * n2;
            break;
        case '÷':
            resultado = n1 / n2;
            break;
    }

    // Limita o resultado para 4 casas após o ponto ('.') //
    for (let i = 0; i < resultado.toString().length; i++) {
        if (resultado.toString().charAt(i) === '.') {
            resultado = Number(resultado.toString().substring(0, i + 5));
        }
    }

    vezesOp = 0;
}

function verResultado() {
    let res = document.getElementById('res');

    calcular();
    res.innerText = `${resultado}`;

    contador = 0;
    for (let i = 0; i < resultado.toString().length; i++) {
        if (resultado.toString().charAt(i) === '.') {
            contador = 1;
        }
    }

    if (contador === 0) {
        statusPonto = true;
    } else {
        statusPonto = false;
    }
}

function limpar(porcao) {
    let res = document.getElementById('res');
    const operadores = ['+', '-', '×', '÷'];

    // Apaga todos os dígitos do painel //
    if (porcao === 'tudo') {
        res.innerText = '';
        ultimoDigito = '';
        tipoUltimoDigito = '';

        statusPonto = true;
        vezesOp = 0;
    }

    // Apaga o último dígito do painel //
    else {
        if (res.textContent.length !== 0) {
            if (ultimoDigito === '.') {
                statusPonto = true;
            }

            contador = 0;
            if (tipoUltimoDigito === 'especial' && ultimoDigito !== '.') {
                for (let i = 0; i < res.textContent.length; i++) {
                    if (res.textContent.charAt(i) === '.') {
                        contador = 1;
                    }
                }
            }

            if (contador === 0) {
                statusPonto = true;
            } else {
                statusPonto = false;
            }

            // Atualiza os dígitos do painel //
            res.innerText = res.textContent.substring(0, res.textContent.length - 1);

            // Atualiza as variáveis 'ultimoDigito' e 'tipoUltimoDigito' //
            ultimoDigito = res.textContent.substring((res.textContent.length - 1), res.textContent.length);
            contador = 0;
            for (let i = 0; i < especiais.length; i++) {
                if (ultimoDigito === especiais[i]) {
                    contador = 1;
                }
            }
            if (contador === 0) {
                tipoUltimoDigito = 'numero';
            } else {
                tipoUltimoDigito = 'especial';
            }

            // Atualiza a variável 'vezesOp' //
            contador = 0;
            var p = 0; // Verifica se o primeiro dígito é '-'
            if (res.textContent.charAt(0) === '-') {
                p = 1;
            }
            for (let i = 0; i < operadores.length; i++) { // Percorre o array de operadores //
                for (let j = p; j < res.textContent.length; j++) { // Percorre o texto da div 'res' //
                    if (res.textContent.charAt(j) === operadores[i]) {
                        contador = 1;
                    }
                }
            }
            if (contador === 0) {
                vezesOp = 0;
            } else {
                vezesOp = 1;
            }
        }
    }

    if (res.textContent.length === 0) {
        vezesOp = 0;
    }
}