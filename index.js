import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

const host = "0.0.0.0";
const port = 3000;
let listaJogadores = [];
let listaTimes = [];

var logado = false;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: "senha",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000* 60 *15,
        httpOnly: true,
        secure: false
    }
}));

function formatarTelefone(numero) {
    if (!numero) return 'Não informado';
    const ddd = numero.substring(0, 2);
    const parte1 = numero.substring(2, 6);
    const parte2 = numero.substring(6);
    return `(${ddd}) ${parte1}-${parte2}`;
}

app.get("/", (req, res) => {

    const agora = new Date().toLocaleString('pt-BR');
    res.cookie('ultimoAcesso', agora, { maxAge: 900000, httpOnly: true });
    

    const ultimoAcesso = req.cookies.ultimoAcesso || 'Primeiro acesso';

    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <title>Campeonato de Vôlei 2025</title>
                <style>
                    :root {
                        --primary-color: #2c3e50;
                        --secondary-color: #3498db;
                        --accent-color: #e74c3c;
                        --light-color: #ecf0f1;
                        --dark-color: #2c3e50;
                    }
                    
                    body {
                        font-family: 'Open Sans', sans-serif;
                        margin: 0;
                        padding: 0;
                        color: var(--dark-color);
                        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                        min-height: 100vh;
                    }
                    
                    .header {
                        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                        padding: 1rem 0;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        position: relative;
                        z-index: 100;
                    }
                    
                    .navbar-brand {
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 700;
                        font-size: 2.5rem;
                        color: white !important;
                        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
                        transition: all 0.3s ease;
                    }
                    
                    .nav-link {
                        font-weight: 600;
                        color: white !important;
                        padding: 0.5rem 1rem !important;
                        border-radius: 4px;
                        transition: all 0.3s ease;
                        margin: 0 0.2rem;
                    }
                    
                    .main-content {
                        padding: 2rem;
                        position: relative;
                        z-index: 10;
                    }
                    
                    .menu-section {
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 12px;
                        padding: 1.5rem;
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                        margin-bottom: 2rem;
                        transition: all 0.3s ease;
                        height: 100%;
                        backdrop-filter: blur(5px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .menu-section:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
                    }
                    
                    .menu-title {
                        font-family: 'Montserrat', sans-serif;
                        color: var(--primary-color);
                        border-bottom: 2px solid var(--secondary-color);
                        padding-bottom: 0.5rem;
                        margin-bottom: 1.5rem;
                        display: inline-block;
                    }
                    
                    .menu-item {
                        margin-bottom: 1rem;
                        transition: all 0.3s ease;
                    }
                    
                    .menu-item:hover {
                        transform: translateX(5px);
                    }
                    
                    .menu-item a {
                        color: var(--dark-color);
                        text-decoration: none;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                    }
                    
                    .menu-item a:hover {
                        color: var(--secondary-color);
                    }
                    
                    .menu-item i {
                        margin-right: 0.8rem;
                        color: var(--secondary-color);
                        width: 1.5rem;
                        text-align: center;
                    }
                    
                    .last-access {
                        background-color: rgba(255, 255, 255, 0.15);
                        color: white;
                        padding: 0.5rem 1.5rem;
                        border-radius: 20px;
                        font-size: 0.9rem;
                        margin: 1rem auto;
                        display: inline-block;
                        backdrop-filter: blur(5px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                </style>
            </head>
            <body>
                <header class="header">
                    <nav class="navbar navbar-expand-lg">
                        <div class="container">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <a class="nav-link" href="/usuario">
                                    <i class="fas fa-user-circle me-2"></i>ACESSAR CONTA
                                </a>
                                <a class="navbar-brand mx-auto" href="/">
                                    CAMPEONATO AMADOR DE VOLEIBOL 2025
                                </a>
                                <a class="nav-link" href="/logout">
                                    <i class="fas fa-sign-out-alt me-2"></i>SAIR
                                </a>
                            </div>
                        </div>
                    </nav>
                </header>

                <main class="main-content">
                    <div class="container">
                        <div class="text-center">
                            <div class="last-access">
                                <i class="fas fa-clock me-2"></i>Último acesso: ${ultimoAcesso}
                            </div>
                        </div>
                        
                        <div class="row mt-3">
                            <!-- Seção SOBRE -->
                            <div class="col-md-4">
                                <div class="menu-section">
                                    <h3 class="menu-title"><i class="fas fa-info-circle me-2"></i>SOBRE</h3>
                                    <div class="menu-item">
                                        <a href="/sobre-nos">
                                            <i class="fas fa-trophy"></i> Sobre o Campeonato
                                        </a>
                                    </div>
                                    <div class="menu-item">
                                        <a href="/regras">
                                            <i class="fas fa-book"></i> Regras
                                        </a>
                                    </div>
                                    <div class="menu-item">
                                        <a href="/contato">
                                            <i class="fas fa-envelope"></i> Contato
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Seção CADASTRO -->
                            <div class="col-md-4">
                                <div class="menu-section">
                                    <h3 class="menu-title"><i class="fas fa-edit me-2"></i>CADASTRO</h3>
                                    <div class="menu-item">
                                        <a href="/cadastro-time">
                                            <i class="fas fa-users"></i> Cadastro de Time
                                        </a>
                                    </div>
                                    <div class="menu-item">
                                        <a href="/cadastro-jogador">
                                            <i class="fas fa-user-plus"></i> Cadastro de Jogador
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Seção LISTA -->
                            <div class="col-md-4">
                                <div class="menu-section">
                                    <h3 class="menu-title"><i class="fas fa-list me-2"></i>LISTA</h3>
                                    <div class="menu-item">
                                        <a href="/times">
                                            <i class="fas fa-list-ol"></i> Lista de Times
                                        </a>
                                    </div>
                                    <div class="menu-item">
                                        <a href="/lista-jogadores">
                                            <i class="fas fa-users"></i> Lista de Jogadores
                                        </a>
                                    </div>
                                    <div class="menu-item">
                                        <a href="/jogadores-por-time">
                                            <i class="fas fa-layer-group"></i> Jogadores por Time
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
            </body>
        </html>`
    );
});




app.get("/cadastro-jogador", verificarAutenticacao, (req, res) => {
    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Cadastro de Jogador</title>
                <style>
                    .form-section {
                        background-color: #f8f9fa;
                        border-radius: 10px;
                        padding: 2rem;
                        box-shadow: 0 0 15px rgba(0,0,0,0.1);
                    }
                    .form-title {
                        color: #2c3e50;
                        border-bottom: 2px solid #3498db;
                        padding-bottom: 0.5rem;
                        margin-bottom: 1.5rem;
                    }
                    .required-field::after {
                        content: " *";
                        color: red;
                    }
                </style>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="form-section">
                                <form class="row g-3 needs-validation" novalidate method="POST" action="/cadastro-jogador">
                                    <h2 class="form-title text-center">CADASTRO DE JOGADOR</h2>
                                    
                                    <!-- Dados Pessoais -->
                                    <div class="col-md-6">
                                        <label for="nome" class="form-label required-field">Nome Completo</label>
                                        <input type="text" class="form-control" id="nome" name="nome" required>
                                        <div class="invalid-feedback">Por favor, informe o nome do jogador.</div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="numero" class="form-label required-field">Número da Camisa</label>
                                        <input type="number" class="form-control" id="numero" name="numero" min="1" max="99" required>
                                        <div class="invalid-feedback">Número inválido (1-99).</div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="nascimento" class="form-label required-field">Data de Nascimento</label>
                                        <input type="date" class="form-control" id="nascimento" name="nascimento" required>
                                        <div class="invalid-feedback">Informe a data de nascimento.</div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="altura" class="form-label required-field">Altura (cm)</label>
                                        <input type="number" class="form-control" id="altura" name="altura" min="100" max="250" required>
                                        <div class="invalid-feedback">Altura inválida (100-250cm).</div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="genero" class="form-label required-field">Gênero</label>
                                        <select class="form-select" id="genero" name="genero" required>
                                            <option value="" selected disabled>Selecione</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                        <div class="invalid-feedback">Selecione o gênero.</div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="posicao" class="form-label required-field">Posição</label>
                                        <select class="form-select" id="posicao" name="posicao" required>
                                            <option value="" selected disabled>Selecione</option>
                                            <option value="Levantador">Levantador</option>
                                            <option value="Ponteiro">Ponteiro</option>
                                            <option value="Oposto">Oposto</option>
                                            <option value="Central">Central</option>
                                            <option value="Líbero">Líbero</option>
                                        </select>
                                        <div class="invalid-feedback">Selecione a posição.</div>
                                    </div>
                                    
                                    <div class="col-12">
                                        <label for="equipe" class="form-label required-field">Time</label>
                                        <select class="form-select" id="equipe" name="equipe" required>
                                            <option value="" selected disabled>Selecione o time</option>
                                            ${listaTimes.map(time => `<option value="${time.nomeEquipe}">${time.nomeEquipe}</option>`).join('')}
                                            <option value="Sem time">Sem time</option>
                                        </select>
                                        <div class="invalid-feedback">Selecione o time.</div>
                                    </div>
                                    
                                    <div class="col-12 mt-4">
                                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <a href="/" class="btn btn-secondary me-md-2">Cancelar</a>
                                            <button class="btn btn-primary" type="submit">Cadastrar Jogador</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
                <script>
                    (() => {
                        'use strict'
                        const forms = document.querySelectorAll('.needs-validation')
                        Array.from(forms).forEach(form => {
                            form.addEventListener('submit', event => {
                                if (!form.checkValidity()) {
                                    event.preventDefault()
                                    event.stopPropagation()
                                }
                                form.classList.add('was-validated')
                            }, false)
                        })
                    })()
                    
                    (adiciona 'cm' automaticamente)
                    document.getElementById('altura').addEventListener('blur', function() {
    const display = document.getElementById('altura-display');
    if (this.value && !isNaN(this.value)) {
        display.textContent = this.value + 'cm';
    } else {
        display.textContent = '';
    }
});
                </script>
            </body>
        </html>
    `);
});

app.post("/cadastro-jogador", (req, res) => {
    const { nome, numero, nascimento, altura, genero, posicao, equipe } = req.body;

        const alturaNum = parseInt(altura.toString().replace('cm', ''));

    const errors = [];
    if (!nome) errors.push("Nome completo é obrigatório");
    if (!numero || numero < 1 || numero > 99) errors.push("Número da camisa inválido (1-99)");
    if (!nascimento) errors.push("Data de nascimento é obrigatória");
    if (!alturaNum || alturaNum < 100 || alturaNum > 250) {
    errors.push("Altura inválida (deve ser entre 100cm e 250cm)");
    }if (!posicao) errors.push("Posição é obrigatória");
    if (!equipe) errors.push("Equipe é obrigatória");
    
    if (errors.length > 0) {
        return res.status(400).send(`
            <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                    <title>Erro no Cadastro</title>
                </head>
                <body class="bg-light">
                    <div class="container py-5">
                        <div class="alert alert-danger">
                            <h4 class="alert-heading">Erros no formulário:</h4>
                            <ul>
                                ${errors.map(error => `<li>${error}</li>`).join('')}
                            </ul>
                            <hr>
                            <a href="/cadastro-jogador" class="btn btn-danger">Voltar ao formulário</a>
                        </div>
                    </div>
                </body>
            </html>
        `);
    }
    

 const novoJogador = {
        id: listaJogadores.length + 1, 
        nome,
        numero: parseInt(numero),
        nascimento,
        altura: alturaNum,
        genero,
        posicao,
        equipe,
        dataCadastro: new Date().toISOString()
    };
    

    listaJogadores.push(novoJogador);
    

    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Cadastro Concluído</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="card">
                        <div class="card-header bg-success text-white">
                            <h2 class="mb-0">Jogador Cadastrado com Sucesso!</h2>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Nome:</strong> ${nome}</p>
                                    <p><strong>Número:</strong> ${numero}</p>
                                    <p><strong>Posição:</strong> ${posicao}</p>
                                    <p><strong>Equipe:</strong> ${equipe}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Data Nasc.:</strong> ${new Date(nascimento).toLocaleDateString('pt-BR')}</p>
                                    <p><strong>Altura:</strong> ${altura}cm</p>
                                    <p><strong>Gênero:</strong> ${genero}</p>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-center">
                            <a href="/cadastro-jogador" class="btn btn-primary me-2">Novo Cadastro</a>
                            <a href="/" class="btn btn-secondary">Voltar ao Início</a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `);
});
app.use((req, res, next) => {
    if (!req.cookies.ultimoAcesso) {
        res.cookie('ultimoAcesso', new Date().toLocaleString(), { maxAge: 900000 });
    }
    next();
});

app.get("/cadastro-time", verificarAutenticacao,  (req, res) => {
    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Cadastro de Time</title>
                <style>
                    .form-section {
                        background-color: #f8f9fa;
                        border-radius: 10px;
                        padding: 2rem;
                        box-shadow: 0 0 15px rgba(0,0,0,0.1);
                    }
                    .form-title {
                        color: #2c3e50;
                        border-bottom: 2px solid #3498db;
                        padding-bottom: 0.5rem;
                        margin-bottom: 1.5rem;
                    }
                    .required-field::after {
                        content: " *";
                        color: red;
                    }
                </style>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="form-section">
                                <form class="row g-3 needs-validation" novalidate method="POST" action="/cadastro-time">
                                    <h2 class="form-title text-center">CADASTRO DE TIME</h2>
                                    
                                    <div class="col-12">
                                        <label for="nomeEquipe" class="form-label required-field">Nome da Equipe</label>
                                        <input type="text" class="form-control" id="nomeEquipe" name="nomeEquipe" required>
                                        <div class="invalid-feedback">Por favor, informe o nome da equipe.</div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="tecnico" class="form-label required-field">Técnico Responsável</label>
                                        <input type="text" class="form-control" id="tecnico" name="tecnico" required>
                                        <div class="invalid-feedback">Informe o nome do técnico.</div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="telefone" class="form-label required-field">Telefone do Técnico</label>
                                        <input type="tel" class="form-control" id="telefone" name="telefone" pattern="[0-9]{10,11}" required>
                                        <div class="invalid-feedback">Informe um telefone válido (DDD + número).</div>
                                    </div>
                                    
                                    <div class="col-12 mt-4">
                                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <a href="/" class="btn btn-secondary me-md-2">Cancelar</a>
                                            <button class="btn btn-primary" type="submit">Cadastrar Time</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
                <script>

                    (() => {
                        'use strict'
                        const forms = document.querySelectorAll('.needs-validation')
                        Array.from(forms).forEach(form => {
                            form.addEventListener('submit', event => {
                                if (!form.checkValidity()) {
                                    event.preventDefault()
                                    event.stopPropagation()
                                }
                                form.classList.add('was-validated')
                            }, false)
                        })
                    })()
                    

                    document.getElementById('telefone').addEventListener('input', function() {
                        this.value = this.value.replace(/\D/g, '');
                    });
                </script>
            </body>
        </html>
    `);
});

app.post("/cadastro-time", (req, res) => {
    const { nomeEquipe, tecnico, telefone } = req.body;


    const errors = [];
    if (!nomeEquipe || nomeEquipe.length < 3) errors.push("Nome da equipe deve ter pelo menos 3 caracteres");
    if (!tecnico || tecnico.length < 3) errors.push("Nome do técnico deve ter pelo menos 3 caracteres");
    if (!telefone || !/^\d{10,11}$/.test(telefone)) errors.push("Telefone inválido (deve conter DDD + número)");
    
    if (errors.length > 0) {
        return res.status(400).send(`
            <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                    <title>Erro no Cadastro</title>
                </head>
                <body class="bg-light">
                    <div class="container py-5">
                        <div class="alert alert-danger">
                            <h4 class="alert-heading">Erros no formulário:</h4>
                            <ul>
                                ${errors.map(error => `<li>${error}</li>`).join('')}
                            </ul>
                            <hr>
                            <a href="/cadastro-time" class="btn btn-danger">Voltar ao formulário</a>
                        </div>
                    </div>
                </body>
            </html>
        `);
    }
    

    const novoTime = {
        id: listaTimes.length + 1,
        nomeEquipe,
        tecnico,
        telefone,
        dataCadastro: new Date().toISOString()
    };
    

    listaTimes.push(novoTime);
    

    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Cadastro Concluído</title>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <div class="card">
                        <div class="card-header bg-success text-white">
                            <h2 class="mb-0">Time Cadastrado com Sucesso!</h2>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Nome da Equipe:</strong> ${nomeEquipe}</p>
                                    <p><strong>Técnico:</strong> ${tecnico}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Telefone:</strong> ${formatarTelefone(telefone)}</p>
                                    <p><strong>Data Cadastro:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-center">
                            <a href="/cadastro-time" class="btn btn-primary me-2">Novo Cadastro</a>
                            <a href="/" class="btn btn-secondary">Voltar ao Início</a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `);
});

app.get("/lista-jogadores", (req, res) => {
    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <title>Lista de Jogadores | Vôlei 2025</title>
                <style>
                    :root {
                        --primary-dark: #0d1b2a;
                        --primary-light: #1b9ce2;
                        --accent: #00e5ff;
                        --glass: rgba(255, 255, 255, 0.95);
                        --glass-border: rgba(255, 255, 255, 0.1);
                        --text-dark: #2c3e50;
                        --card-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    }
                    
                    body {
                        background: linear-gradient(145deg, var(--primary-dark), var(--primary-light));
                        font-family: 'Inter', system-ui, sans-serif;
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                    }
                    
                    .main-container {
                        background: var(--glass);
                        border-radius: 16px;
                        padding: 2.5rem;
                        box-shadow: var(--card-shadow);
                        border: 1px solid var(--glass-border);
                    }
                    
                    .table-container {
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
                    }
                    
                    .table thead {
                        background: linear-gradient(95deg, var(--primary-dark), var(--primary-light));
                        color: white;
                        font-weight: 600;
                    }
                    
                    .table th {
                        padding: 1.2rem;
                        font-size: 0.85rem;
                        text-transform: uppercase;
                        vertical-align: middle;
                    }
                    
                    .table td {
                        padding: 1.2rem;
                        vertical-align: middle;
                        border-bottom: 1px solid rgba(0, 0, 0, 0.03);
                        background: white;
                    }
                    
                    .table tr:last-child td {
                        border-bottom: none;
                    }
                    
                    .btn-action {
                        width: 38px;
                        height: 38px;
                        border-radius: 10px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 4px;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                        border: none;
                    }
                    
                    .empty-state {
                        background: white;
                        border-radius: 16px;
                        padding: 3rem 2rem;
                        text-align: center;
                    }
                    
                    .title-section {
                        color: var(--text-dark);
                        position: relative;
                        padding-bottom: 1rem;
                        margin-bottom: 2rem;
                        font-weight: 700;
                        font-size: 1.8rem;
                    }
                    
                    .title-section::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 60px;
                        height: 4px;
                        background: var(--accent);
                        border-radius: 2px;
                    }
                    
                    .btn-premium {
                        background: linear-gradient(95deg, var(--accent), var(--primary-light));
                        border: none;
                        color: white;
                        font-weight: 600;
                        padding: 0.9rem 2rem;
                        border-radius: 12px;
                    }
                    
                    .badge-count {
                        background: var(--accent);
                        color: white;
                        font-size: 1rem;
                        padding: 0.4rem 0.9rem;
                        border-radius: 50px;
                        margin-left: 0.8rem;
                    }
                    
                    .btn-back {
                        background: rgba(255, 255, 255, 0.9);
                        border: 1px solid rgba(0, 0, 0, 0.05);
                        color: var(--text-dark);
                        padding: 0.7rem 1.5rem;
                        border-radius: 10px;
                        font-weight: 600;
                    }
                    
                    .btn-view {
                        background: rgba(255, 255, 255, 0.9);
                        border: 1px solid rgba(0, 0, 0, 0.05);
                        color: var(--text-dark);
                        padding: 0.7rem 1.5rem;
                        border-radius: 10px;
                        font-weight: 600;
                        margin-bottom: 1.5rem;
                    }
                    
                    @media (max-width: 768px) {
                        .main-container {
                            padding: 1.5rem;
                        }
                        
                        .table th, .table td {
                            padding: 1rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container py-4">
                    <div class="main-container">
                        <h1 class="title-section">
                            <i class="fas fa-users me-2"></i>Jogadores Cadastrados
                            <span class="badge-count">${listaJogadores.length}</span>
                        </h1>
                        
                        ${listaJogadores.length > 0 ? `
                        <div class="text-center mb-4">
                            <a href="/jogadores-por-time" class="btn btn-view">
                                <i class="fas fa-layer-group me-2"></i>Ver Agrupado por Time
                            </a>
                        </div>
                        <div class="table-responsive table-container">
                            <table class="table align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Número</th>
                                        <th>Posição</th>
                                        <th>Time</th>
                                        <th>Altura</th>
                                        <th class="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${listaJogadores.map(jogador => `
                                    <tr>
                                        <td class="fw-bold">${jogador.id}</td>
                                        <td class="fw-semibold">${jogador.nome}</td>
                                        <td>${jogador.numero}</td>
                                        <td>${jogador.posicao}</td>
                                        <td>${jogador.equipe}</td>
                                        <td>${jogador.altura}cm</td>
                                        <td class="text-center">
                                            <a href="/editar-jogador/${jogador.id}" class="btn btn-warning btn-action" title="Editar">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <button class="btn btn-danger btn-action" onclick="excluirJogador(${jogador.id})" title="Excluir">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ` : `
                        <div class="empty-state">
                            <div class="mb-4" style="font-size: 4rem; color: var(--accent);">
                                <i class="fas fa-user-slash"></i>
                            </div>
                            <h3 class="mb-3 fw-bold">Nenhum jogador cadastrado</h3>
                            <p class="mb-4 text-muted">Comece cadastrando o primeiro jogador do campeonato</p>
                            <a href="/cadastro-jogador" class="btn btn-premium">
                                <i class="fas fa-user-plus me-2"></i>Cadastrar Jogador
                            </a>
                        </div>
                        `}
                        
                        <div class="text-center mt-4">
                            <a href="/" class="btn btn-back">
                                <i class="fas fa-arrow-left me-2"></i>Voltar ao Início
                            </a>
                        </div>
                    </div>
                </div>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
                <script>
                    function excluirJogador(id) {
                        if (confirm('Tem certeza que deseja excluir este jogador?')) {
                            fetch('/excluir-jogador/' + id, { method: 'DELETE' })
                                .then(response => window.location.reload())
                                .catch(error => console.error('Erro:', error));
                        }
                    }
                </script>
            </body>
        </html>
    `);
});

app.get("/times", (req, res) => {
    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <title>Lista de Times | Vôlei 2025</title>
                <style>
                    :root {
                        --primary-dark: #0d1b2a;
                        --primary-light: #1b9ce2;
                        --accent: #00e5ff;
                        --glass: rgba(255, 255, 255, 0.95);
                        --glass-border: rgba(255, 255, 255, 0.1);
                        --text-dark: #2c3e50;
                        --card-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    }
                    
                    body {
                        background: linear-gradient(145deg, var(--primary-dark), var(--primary-light));
                        font-family: 'Inter', system-ui, sans-serif;
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                    }
                    
                    .main-container {
                        background: var(--glass);
                        border-radius: 16px;
                        padding: 2.5rem;
                        box-shadow: var(--card-shadow);
                        border: 1px solid var(--glass-border);
                    }
                    
                    .table-container {
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
                    }
                    
                    .table thead {
                        background: linear-gradient(95deg, var(--primary-dark), var(--primary-light));
                        color: white;
                        font-weight: 600;
                    }
                    
                    .table th {
                        padding: 1.2rem;
                        font-size: 0.85rem;
                        text-transform: uppercase;
                        vertical-align: middle;
                    }
                    
                    .table td {
                        padding: 1.2rem;
                        vertical-align: middle;
                        border-bottom: 1px solid rgba(0, 0, 0, 0.03);
                        background: white;
                    }
                    
                    .table tr:last-child td {
                        border-bottom: none;
                    }
                    
                    .btn-action {
                        width: 38px;
                        height: 38px;
                        border-radius: 10px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 4px;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                        border: none;
                    }
                    
                    .empty-state {
                        background: white;
                        border-radius: 16px;
                        padding: 3rem 2rem;
                        text-align: center;
                    }
                    
                    .title-section {
                        color: var(--text-dark);
                        position: relative;
                        padding-bottom: 1rem;
                        margin-bottom: 2rem;
                        font-weight: 700;
                        font-size: 1.8rem;
                    }
                    
                    .title-section::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 60px;
                        height: 4px;
                        background: var(--accent);
                        border-radius: 2px;
                    }
                    
                    .btn-premium {
                        background: linear-gradient(95deg, var(--accent), var(--primary-light));
                        border: none;
                        color: white;
                        font-weight: 600;
                        padding: 0.9rem 2rem;
                        border-radius: 12px;
                    }
                    
                    .badge-count {
                        background: var(--accent);
                        color: white;
                        font-size: 1rem;
                        padding: 0.4rem 0.9rem;
                        border-radius: 50px;
                        margin-left: 0.8rem;
                    }
                    
                    .btn-back {
                        background: rgba(255, 255, 255, 0.9);
                        border: 1px solid rgba(0, 0, 0, 0.05);
                        color: var(--text-dark);
                        padding: 0.7rem 1.5rem;
                        border-radius: 10px;
                        font-weight: 600;
                    }
                    
                    @media (max-width: 768px) {
                        .main-container {
                            padding: 1.5rem;
                        }
                        
                        .table th, .table td {
                            padding: 1rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container py-4">
                    <div class="main-container">
                        <h1 class="title-section">
                            <i class="fas fa-users me-2"></i>Times Cadastrados
                            <span class="badge-count">${listaTimes.length}</span>
                        </h1>
                        
                        ${listaTimes.length > 0 ? `
                        <div class="table-responsive table-container">
                            <table class="table align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Equipe</th>
                                        <th>Técnico</th>
                                        <th>Contato</th>
                                        <th>Cadastro</th>
                                        <th class="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${listaTimes.map(time => `
                                    <tr>
                                        <td class="fw-bold">${time.id}</td>
                                        <td class="fw-semibold">${time.nomeEquipe}</td>
                                        <td>${time.tecnico}</td>
                                        <td>${formatarTelefone(time.telefone)}</td>
                                        <td>${new Date(time.dataCadastro).toLocaleDateString('pt-BR')}</td>
                                        <td class="text-center">
                                            <a href="/editar-time/${time.id}" class="btn btn-warning btn-action" title="Editar">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <button class="btn btn-danger btn-action" onclick="excluirTime(${time.id})" title="Excluir">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ` : `
                        <div class="empty-state">
                            <div class="mb-4" style="font-size: 4rem; color: var(--accent);">
                                <i class="fas fa-users-slash"></i>
                            </div>
                            <h3 class="mb-3 fw-bold">Nenhum time cadastrado</h3>
                            <p class="mb-4 text-muted">Comece cadastrando o primeiro time do campeonato</p>
                            <a href="/cadastro-time" class="btn btn-premium">
                                <i class="fas fa-plus-circle me-2"></i>Cadastrar Time
                            </a>
                        </div>
                        `}
                        
                        <div class="text-center mt-4">
                            <a href="/" class="btn btn-back">
                                <i class="fas fa-arrow-left me-2"></i>Voltar ao Início
                            </a>
                        </div>
                    </div>
                </div>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
                <script>
                    function excluirTime(id) {
                        if (confirm('Tem certeza que deseja excluir este time? Todos os jogadores vinculados perderão a referência!')) {
                            fetch('/excluir-time/' + id, { method: 'DELETE' })
                                .then(response => window.location.reload())
                                .catch(error => console.error('Erro:', error));
                        }
                    }
                </script>
            </body>
        </html>
    `);
});

app.get("/jogadores-por-time", (req, res) => {

    const jogadoresPorTime = {};
    
    listaJogadores.forEach(jogador => {
        const time = jogador.equipe || "Sem time";
        if (!jogadoresPorTime[time]) {
            jogadoresPorTime[time] = [];
        }
        jogadoresPorTime[time].push(jogador);
    });


    const timesOrdenados = Object.keys(jogadoresPorTime).sort();

    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <title>Jogadores por Time | Vôlei 2025</title>
                <style>
                    :root {
                        --primary-dark: #0d1b2a;
                        --primary-light: #1b9ce2;
                        --accent: #00e5ff;
                        --glass: rgba(255, 255, 255, 0.95);
                        --glass-border: rgba(255, 255, 255, 0.1);
                        --text-dark: #2c3e50;
                        --card-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    }
                    
                    body {
                        background: linear-gradient(145deg, var(--primary-dark), var(--primary-light));
                        font-family: 'Inter', system-ui, sans-serif;
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                    }
                    
                    .main-container {
                        background: var(--glass);
                        border-radius: 16px;
                        padding: 2.5rem;
                        box-shadow: var(--card-shadow);
                        border: 1px solid var(--glass-border);
                    }
                    
                    .title-section {
                        color: var(--text-dark);
                        position: relative;
                        padding-bottom: 1rem;
                        margin-bottom: 2rem;
                        font-weight: 700;
                        font-size: 1.8rem;
                    }
                    
                    .title-section::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 60px;
                        height: 4px;
                        background: var(--accent);
                        border-radius: 2px;
                    }
                    
                    .team-header {
                        background: linear-gradient(95deg, var(--primary-dark), var(--primary-light));
                        color: white;
                        padding: 1rem 1.5rem;
                        border-radius: 10px;
                        margin: 1.5rem 0;
                        font-weight: 600;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .player-card {
                        background: white;
                        border-radius: 10px;
                        padding: 1.2rem;
                        margin-bottom: 1rem;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    }
                    
                    .badge-posicao {
                        background: #e74c3c;
                        color: white;
                        font-weight: 600;
                        padding: 0.4rem 0.8rem;
                        border-radius: 6px;
                    }
                    
                    .badge-numero {
                        background: #2ecc71;
                        color: white;
                        font-weight: 600;
                        padding: 0.4rem 0.8rem;
                        border-radius: 6px;
                    }
                    
                    .btn-action {
                        width: 36px;
                        height: 36px;
                        border-radius: 8px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 4px;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                        border: none;
                    }
                    
                    .empty-state {
                        background: white;
                        border-radius: 16px;
                        padding: 3rem 2rem;
                        text-align: center;
                    }
                    
                    .btn-premium {
                        background: linear-gradient(95deg, var(--accent), var(--primary-light));
                        border: none;
                        color: white;
                        font-weight: 600;
                        padding: 0.9rem 2rem;
                        border-radius: 10px;
                    }
                    
                    .badge-count {
                        background: var(--accent);
                        color: white;
                        font-size: 0.9rem;
                        padding: 0.3rem 0.8rem;
                        border-radius: 50px;
                    }
                    
                    .btn-view {
                        background: rgba(255, 255, 255, 0.9);
                        border: 1px solid rgba(0, 0, 0, 0.05);
                        color: var(--text-dark);
                        padding: 0.7rem 1.5rem;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 0 0.5rem 1rem 0.5rem;
                    }
                    
                    .player-name {
                        font-weight: 600;
                        color: var(--text-dark);
                    }
                    
                    @media (max-width: 768px) {
                        .main-container {
                            padding: 1.5rem;
                        }
                        
                        .player-card {
                            padding: 1rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container py-4">
                    <div class="main-container">
                        <h1 class="title-section">
                            <i class="fas fa-layer-group me-2"></i>Jogadores por Time
                        </h1>
                        
                        <div class="text-center mb-3">
                            <a href="/lista-jogadores" class="btn btn-view">
                                <i class="fas fa-list me-2"></i>Ver Lista Completa
                            </a>
                            <a href="/" class="btn btn-view">
                                <i class="fas fa-home me-2"></i>Voltar ao Início
                            </a>
                        </div>
                        
                        ${timesOrdenados.length > 0 ? `
                            ${timesOrdenados.map(time => `
                                <div class="team-header">
                                    <div>
                                        <i class="fas fa-users me-2"></i>${time}
                                    </div>
                                    <span class="badge-count">${jogadoresPorTime[time].length} jogador(es)</span>
                                </div>
                                
                                <div class="row">
                                    ${jogadoresPorTime[time].map(jogador => `
                                    <div class="col-md-6 col-lg-4">
                                        <div class="player-card">
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <div class="player-name">
                                                    <i class="fas fa-user me-2"></i>${jogador.nome}
                                                </div>
                                                <span class="badge-numero">Nº ${jogador.numero}</span>
                                            </div>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <span class="badge-posicao">${jogador.posicao}</span>
                                                <div>
                                                    <a href="/editar-jogador/${jogador.id}" class="btn btn-warning btn-action" title="Editar">
                                                        <i class="fas fa-edit"></i>
                                                    </a>
                                                    <button class="btn btn-danger btn-action" onclick="excluirJogador(${jogador.id})" title="Excluir">
                                                        <i class="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    `).join('')}
                                </div>
                            `).join('')}
                        ` : `
                        <div class="empty-state">
                            <div class="mb-4" style="font-size: 4rem; color: var(--accent);">
                                <i class="fas fa-user-slash"></i>
                            </div>
                            <h3 class="mb-3 fw-bold">Nenhum jogador cadastrado</h3>
                            <p class="mb-4 text-muted">Comece cadastrando o primeiro jogador do campeonato</p>
                            <a href="/cadastro-jogador" class="btn btn-premium">
                                <i class="fas fa-user-plus me-2"></i>Cadastrar Jogador
                            </a>
                        </div>
                        `}
                    </div>
                </div>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
                <script>
                    function excluirJogador(id) {
                        if (confirm('Tem certeza que deseja excluir este jogador?')) {
                            fetch('/excluir-jogador/' + id, { method: 'DELETE' })
                                .then(response => window.location.reload())
                                .catch(error => console.error('Erro:', error));
                        }
                    }
                </script>
            </body>
        </html>
    `);
});

app.delete("/excluir-time/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = listaTimes.findIndex(t => t.id === id);
    
    if (index !== -1) {

        listaTimes.splice(index, 1);
        

        listaJogadores = listaJogadores.map(jogador => {
            if (jogador.equipe === listaTimes[index]?.nomeEquipe) {
                return { ...jogador, equipe: "Sem time" };
            }
            return jogador;
        });
        
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.delete("/excluir-jogador/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = listaJogadores.findIndex(j => j.id === id);
    
    if (index !== -1) {
        listaJogadores.splice(index, 1);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});


app.get("/usuario", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Formulário de Acesso | Vôlei 2025</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                :root {
                    --primary-color: #2c3e50;
                    --secondary-color: #3498db;
                }
                
                body {
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                .login-box {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 2.5rem;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    width: 100%;
                    max-width: 500px;
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }
                
                .login-box:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                }
                
                .form-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }
                
                .form-header h2 {
                    color: var(--primary-color);
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }
                
                .form-control {
                    height: 50px;
                    font-size: 1rem;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    padding-left: 15px;
                    transition: all 0.3s;
                }
                
                .form-control:focus {
                    border-color: var(--secondary-color);
                    box-shadow: 0 0 0 0.25rem rgba(52, 152, 219, 0.25);
                }
                
                .btn-login {
                    font-size: 1.1rem;
                    padding: 12px;
                    border-radius: 8px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    transition: all 0.3s;
                }
                
                .btn-primary-custom {
                    background-color: var(--secondary-color);
                    border-color: var(--secondary-color);
                }
                
                .btn-primary-custom:hover {
                    background-color: #2980b9;
                    border-color: #2980b9;
                    transform: translateY(-2px);
                }
                
                .btn-secondary-custom {
                    background-color: #7f8c8d;
                    border-color: #7f8c8d;
                    color: white;
                }
                
                .btn-secondary-custom:hover {
                    background-color: #6c7a7d;
                    border-color: #6c7a7d;
                    transform: translateY(-2px);
                }
                
                .input-icon {
                    position: relative;
                }
                
                .input-icon i {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #95a5a6;
                }
                
                .input-icon input {
                    padding-left: 45px;
                }
                
                .logo {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                
                .logo img {
                    height: 60px;
                }
            </style>
        </head>
        <body>
            <div class="login-box">
                <div class="logo">
                    <i class="fas fa-volleyball-ball fa-3x" style="color: var(--secondary-color);"></i>
                </div>
                
                <div class="form-header">
                    <h2>Acesse sua conta</h2>
                    ${req.session.loginError ? '<div class="alert alert-danger mt-3"><i class="fas fa-exclamation-circle me-2"></i>Usuário ou senha incorretos!</div>' : ''}
                </div>
                
                <form method="POST" action="/login" class="needs-validation" novalidate>
                    <div class="mb-4">
                        <div class="input-icon mb-3">
                            <i class="fas fa-user"></i>
                            <input type="text" class="form-control" id="usuario" name="usuario" placeholder="Usuário" required>
                        </div>
                        <div class="invalid-feedback">Por favor, informe seu usuário.</div>
                    </div>
                    
                    <div class="mb-4">
                        <div class="input-icon mb-3">
                            <i class="fas fa-lock"></i>
                            <input type="password" class="form-control" id="senha" name="senha" placeholder="Senha" required>
                        </div>
                        <div class="invalid-feedback">Por favor, informe sua senha.</div>
                    </div>
                    
                    <div class="d-grid gap-3">
                        <button type="submit" class="btn btn-primary-custom btn-login">
                            <i class="fas fa-sign-in-alt me-2"></i>Acessar
                        </button>
                        <a href="/" class="btn btn-secondary-custom btn-login">
                            <i class="fas fa-arrow-left me-2"></i>Voltar
                        </a>
                    </div>
                    
                    <div class="text-center mt-4">
                        <a href="/esq" class="text-decoration-none" style="color: var(--secondary-color);">Esqueceu sua senha?</a>
                    </div>
                </form>
            </div>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            <script>
                (() => {
                    'use strict'
                    const forms = document.querySelectorAll('.needs-validation')
                    Array.from(forms).forEach(form => {
                        form.addEventListener('submit', event => {
                            if (!form.checkValidity()) {
                                event.preventDefault()
                                event.stopPropagation()
                            }
                            form.classList.add('was-validated')
                        }, false)
                    })
                })()
            </script>
        </body>
        </html>
    `);
});


app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;
    
    if (usuario === "admin" && senha === "123") {
        req.session.logado = true;
        req.session.loginError = false; 
        return res.redirect("/");
    } else {
        req.session.loginError = true; 
        return res.redirect("/usuario"); }
});


function verificarAutenticacao(req, res, next){
    if (req.session.logado){
        next();
    }
    else{
        res.redirect("/usuario");
    }
}



app.get("/logout", (req, res) => {
    req.session.destroy();  
    res.redirect("/usuario");
});




app.listen(port, host, () => {
    console.log(`Servidor em execução: http://${host}:${port}/`);
});
