var ultimoDigito = '';
var tipoUltimoDigito = ''; // Especial ou Número //
var statusPonto = true;
const especiais = ['.', '+', '-', '×', '÷'];

// 1(n1) +(op) 1(n2) = 2(r) //
var n1;
var n2;
var op;
var r = 0;

var vezesOp = 0; // Quantidade de vezes que um operador foi clicado

function mostrar(digito) { // Mostra o dígito selecionado no painel //
    let res = document.getElementById('res'); // Obtém o elemento 'div#res' //

    // Verificação do dígito atual //
    if (res.textContent.length < 12) { // 12 -> limite de dígitos no painel de cálculo //
        var c1 = 0;
        var tipo; // Guarda o tipo do dígito (especial ou número) //
        for (let i = 0; i < especiais.length; i++) {
            if (digito === especiais[i]) {
                c1 = 1;
            }
        }
        if (c1 === 0) {
            tipo = 'numero';
        } else {
            tipo = 'especial';
        }

        // Dígito é número //
        if (tipo === 'numero') {
            res.innerText += digito;
            ultimoDigito = digito;
            tipoUltimoDigito = 'numero';
        }

        // Dígito é especial //
        if (tipo === 'especial') {
            // Verifica se o dígito é '.' //
            if (digito === '.' && statusPonto === true) {
                if (res.textContent.length === 0 || tipoUltimoDigito === 'especial') { // No início ou após um dígito especial //
                    res.innerText += `0${digito}`;
                } else {
                    res.innerText += digito;
                }
                statusPonto = false;
                ultimoDigito = digito;
                tipoUltimoDigito = 'especial';
            }

            // Verifica se o dígito é '+' ou '-' //
            else if (digito === '+' || digito === '-') {
                if (tipoUltimoDigito === 'especial' && ultimoDigito !== '.') { // Após '+', '-', '×' ou '÷' //
                    limpar('ultimo');
                    res.innerText += digito;
                    if (res.textContent.length === 1) { // No início //
                        vezesOp = 0;
                    } else {
                        vezesOp = 1;
                    }
                    statusPonto = true;
                    ultimoDigito = digito;
                    tipoUltimoDigito = 'especial';
                } else if (res.textContent.length === 0 || tipoUltimoDigito === 'numero') { // No início ou após um número //
                    if (vezesOp === 0 && res.textContent.length !== 0) {
                        vezesOp = 1;
                    } else if (vezesOp === 1) {
                        calcular();
                        res.innerText = `${r}`;
                        op = digito;
                        vezesOp = 1;
                    }
                    res.innerText += digito;
                    statusPonto = true;
                    ultimoDigito = digito;
                    tipoUltimoDigito = 'especial';
                }
            }

            // Verifica se o dígito é '×' ou '÷' //
            else if (digito === '×' || digito === '÷') {
                if (res.textContent.length !== 0) { // Não pode está no início //
                    if (tipoUltimoDigito === 'numero') { // Após um número //
                        if (vezesOp === 0) {
                            vezesOp = 1;
                        } else if (vezesOp === 1) {
                            calcular();
                            res.innerText = `${r}`;
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

function calcular() { // Realiza o cálculo //
    const operadores = ['+', '-', '×', '÷'];
    /*
     * n1 = primeiro número digitado;
     * n2 = segundo número digitado;
     * op = operador;
     * r = resultado do cálculo;
     */
    var p = 0; // Verifica se o primeiro dígito é '-'
    if (res.textContent.charAt(0) === '-') {
        p = 1;
    }

    for (let i = 0; i < operadores.length; i++) { // Percorre o array de operadores //
        for (let j = p; j < res.textContent.length; j++) { // Percorre o texto da div 'res' //
            if (res.textContent.charAt(j) === operadores[i]) {
                n1 = Number(res.textContent.substring(0, j));
                n2 = Number(res.textContent.substring(j + 1, res.textContent.length));
                op = operadores[i];
            }
        }
    }

    switch (op) {
        case '+':
            r = n1 + n2;
            break;
        case '-':
            r = n1 - n2;
            break;
        case '×':
            r = n1 * n2;
            break;
        case '÷':
            r = n1 / n2;
            break;
    }

    // Limita o resultado para 4 casas após o ponto ('.') //
    for (let i = 0; i < r.toString().length; i++) {
        if (r.toString().charAt(i) === '.') {
            r = Number(r.toString().substring(0, i + 5));
        }
    }

    vezesOp = 0;
}

function igual() { // Exibe o resultado (botão de '=') //
    let res = document.getElementById('res');

    calcular();
    res.innerText = `${r}`;
}

function limpar(porcao) { // Apaga dígitos do painel //
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
            // Verifica se o último dígito é um '.' //
            if (ultimoDigito === '.') {
                statusPonto = true;
            }

            // Atualiza os dígitos do painel //
            res.innerText = res.textContent.substring(0, res.textContent.length - 1);

            // Atualiza as variáveis 'ultimoDigito' e 'tipoUltimoDigito' //
            ultimoDigito = res.textContent.substring((res.textContent.length - 1), res.textContent.length);
            let c2 = 0;
            for (let i = 0; i < especiais[i]; i++) {
                if (ultimoDigito === especiais[i]) {
                    c2 = 1;
                }
            }
            if (c2 === 0) {
                tipoUltimoDigito = 'numero';
            } else {
                tipoUltimoDigito = 'especial';
            }

            // Atualiza a variável 'vezesOp' //
            let c3 = 0;
            var p = 0; // Verifica se o primeiro dígito é '-'
            if (res.textContent.charAt(0) === '-') {
                p = 1;
            }
            for (let i = 0; i < operadores.length; i++) { // Percorre o array de operadores //
                for (let j = p; j < res.textContent.length; j++) { // Percorre o texto da div 'res' //
                    if (res.textContent.charAt(j) === operadores[i]) {
                        c3 = 1;
                    }
                }
            }
            if (c3 === 0) {
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