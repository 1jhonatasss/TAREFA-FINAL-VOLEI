import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

const host = "0.0.0.0";
const port = 3000;
let listaUsuarios = [];
let listaProdutos = []; 

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

const listaJogadores = [];

app.get("/", (req, res) => {
    res.send(
        `<html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
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
                        background-color: var(--light-color);
                    }
                    
                    .header {
                        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                        padding: 1rem 0;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    
                    .navbar-brand {
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 700;
                        font-size: 1.5rem;
                        color: white !important;
                        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
                        transition: all 0.3s ease;
                    }
                    
                    .navbar-brand:hover {
                        transform: scale(1.03);
                    }
                    
                    .nav-link {
                        font-weight: 600;
                        color: white !important;
                        padding: 0.5rem 1rem !important;
                        border-radius: 4px;
                        transition: all 0.3s ease;
                        margin: 0 0.2rem;
                    }
                    
                    .nav-link:hover {
                        background-color: rgba(255, 255, 255, 0.2);
                        transform: translateY(-2px);
                    }
                    
                    .main-content {
                        min-height: 100vh;
                        padding: 2rem;
                    }
                    
                    .menu-section {
                        background-color: white;
                        border-radius: 8px;
                        padding: 1.5rem;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                        margin-bottom: 2rem;
                        transition: all 0.3s ease;
                        height: 100%; /* Ajuste de altura */
                    }
                    
                    .menu-section:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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
                        <div class="row">
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
                            
                            <!-- Seção AGENDAMENTOS (agora CADASTRO) -->
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
                            
                            <!-- Nova Seção LISTA -->
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




app.get("/cadastro-jogador", (req, res) => {
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
                                        <label for="equipe" class="form-label required-field">Equipe</label>
                                        <input type="text" class="form-control" id="equipe" name="equipe" required>
                                        <div class="invalid-feedback">Informe o nome da equipe.</div>
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
                    // Validação do formulário
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
                    
                    // Máscara para altura (adiciona 'cm' automaticamente)
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
    // Validação no servidor
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
    
    // Aqui você normalmente salvaria no banco de dados
    // Vamos simular com um array em memória
 const novoJogador = {
        id: listaJogadores.length + 1,  // ID sequencial
        nome,
        numero: parseInt(numero),
        nascimento,
        altura: alturaNum,
        genero,
        posicao,
        equipe,
        dataCadastro: new Date().toISOString()
    };
    
    // Adiciona à lista (substitua por seu banco de dados real)
    listaJogadores.push(novoJogador);
    
    // Página de sucesso
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

app.get("/lista-jogadores", (req, res) => {
    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <title>Lista de Jogadores</title>
                <style>
                    .table-responsive { max-height: 70vh; overflow-y: auto; }
                    .table thead th { position: sticky; top: 0; background: white; }
                </style>
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <h1 class="text-center mb-4">
                        <i class="fas fa-users"></i> Jogadores Cadastrados
                        <span class="badge bg-primary">${listaJogadores.length}</span>
                    </h1>
                    
                    ${listaJogadores.length > 0 ? `
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Número</th>
                                    <th>Posição</th>
                                    <th>Equipe</th>
                                    <th>Altura</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${listaJogadores.map(jogador => `
                                <tr>
                                    <td>${jogador.id}</td>
                                    <td>${jogador.nome}</td>
                                    <td>${jogador.numero}</td>
                                    <td>${jogador.posicao}</td>
                                    <td>${jogador.equipe}</td>
                                    <td>${jogador.altura}cm</td>
                                    <td>
                                        <a href="/editar-jogador/${jogador.id}" class="btn btn-sm btn-warning">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <button class="btn btn-sm btn-danger" onclick="excluirJogador(${jogador.id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : `
                    <div class="alert alert-info text-center">
                        <i class="fas fa-info-circle fa-2x mb-3"></i>
                        <h4>Nenhum jogador cadastrado ainda!</h4>
                        <a href="/cadastro-jogador" class="btn btn-primary mt-3">
                            <i class="fas fa-user-plus"></i> Cadastrar Primeiro Jogador
                        </a>
                    </div>
                    `}
                    
                    <div class="text-center mt-4">
                        <a href="/" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Voltar ao Início
                        </a>
                    </div>
                </div>

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


app.get("/produtos", verificarAutenticacao, (req, res) => {
    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Cadastro de Produtos</title>
            </head>
            <body>
                <div class="container w-75 my-5">
                    <div class="row">
                        <div class="col-md-6">
                            <form class="row g-3 needs-validation border p-4 rounded" novalidate method="POST" action="/produtos">
                                <fieldset>
                                    <legend class="text-center fs-4 w-100 mb-4">CADASTRAR PRODUTO</legend>
                                </fieldset>
                                <div class="col-md-12">
                                    <label for="codigoBarras" class="form-label">Código de Barras</label>
                                    <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" required>
                                </div>
                                <div class="col-md-12">
                                    <label for="descricao" class="form-label">Descrição do Produto</label>
                                    <input type="text" class="form-control" id="descricao" name="descricao" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="precoCusto" class="form-label">Preço de Custo</label>
                                    <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="precoVenda" class="form-label">Preço de Venda</label>
                                    <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="dataValidade" class="form-label">Data de Validade</label>
                                    <input type="date" class="form-control" id="dataValidade" name="dataValidade" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="quantidade" class="form-label">Quantidade em Estoque</label>
                                    <input type="number" class="form-control" id="quantidade" name="quantidade" required>
                                </div>
                                <div class="col-md-12">
                                    <label for="fabricante" class="form-label">Fabricante</label>
                                    <input type="text" class="form-control" id="fabricante" name="fabricante" required>
                                </div>
                                <div class="col-12 d-flex justify-content-center gap-3 mt-3">
                                    <button class="btn btn-primary" type="submit">Cadastrar</button>
                                    <a href="/" class="btn btn-secondary">Voltar</a>
                                </div>
                            </form>
                        </div>
                        <div class="col-md-6">
                            ${renderizarTabelaProdutos()}
                        </div>
                    </div>
                </div>
                <script>
                    (() => {
                        'use strict';
                        const forms = document.querySelectorAll('.needs-validation');
                        Array.from(forms).forEach(form => {
                            form.addEventListener('submit', event => {
                                if (!form.checkValidity()) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                                form.classList.add('was-validated');
                            }, false);
                        });
                    })();
                </script>
            </body>
        </html>
    `);

    function renderizarTabelaProdutos() {
        if (listaProdutos.length === 0) {
            return `<div class="alert alert-info">Nenhum produto cadastrado ainda.</div>`;
        }

        let tabela = `
            <div class="border p-3 rounded">
                <h5 class="text-center mb-3">Produtos Cadastrados</h5>
                <p class="text-muted small">Último acesso: ${req.cookies.ultimoAcesso || 'Nunca'}</p>
                <div class="table-responsive">
                    <table class="table table-bordered table-striped table-hover">
                        <thead class="table-primary">
                            <tr>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Preço Venda</th>
                                <th>Estoque</th>
                                <th>Validade</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        listaProdutos.forEach(produto => {
            tabela += `
                <tr>
                    <td>${produto.codigoBarras}</td>
                    <td>${produto.descricao}</td>
                    <td>R$ ${produto.precoVenda.toFixed(2)}</td>
                    <td>${produto.quantidade}</td>
                    <td>${new Date(produto.dataValidade).toLocaleDateString('pt-BR')}</td>
                </tr>
            `;
        });

        tabela += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return tabela;
    }
});

app.post("/produtos", verificarAutenticacao, (req, res) => {
    const { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, quantidade, fabricante } = req.body;

    res.cookie('ultimoAcesso', new Date().toLocaleString(), { maxAge: 900000 });

    listaProdutos.push({
        codigoBarras,
        descricao,
        precoCusto: parseFloat(precoCusto),
        precoVenda: parseFloat(precoVenda),
        dataValidade,
        quantidade: parseInt(quantidade),
        fabricante
    });

    res.redirect("/produtos");
});


app.get("/usuario", (req, res) => {
    res.send(`
        <style>
            .page-header {
                border-bottom: 1px solid #FFFFFF;
                margin: 20px 0;
                padding-bottom: 9px;
                text-align: center;
            }
            .form-control {
                border: 1px solid #D6D6D6;
                border-radius: 0;
                box-shadow: none;
                height: 50px;
                padding: 6px 15px;
                font-size: 16px;
            }
            body {
                background-color: #ee7778;
            }
            .row {
                background: #ededed;
                padding: 30px;
                max-width: 500px;
                margin-top: 130px;
                margin-bottom: 0;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                position: relative;
                left: 250px;
            }
            legend {
                border: medium none;
                color: #7F7F7F;
                display: block;
                font-size: 20px;
                line-height: inherit;
                margin-bottom: 15px;
                padding: 0;
                text-align: center;
                width: 100%;
            }
            .btn {
                padding: 10px;
                border-radius: 0;
                border: none;
                font-size: 21px;
            }
        </style>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet">
        <script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>
        <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
        <div class="container">
            <div class="row">
                <div class="page-header"><h2>Formulário de Acesso</h2></div>
                ${req.session.loginError ? '<div class="alert alert-danger">Usuário ou senha incorretos!</div>' : ''}
                <form class="form-horizontal" method="POST" action="/login">
                    <fieldset>
                        <legend><h3>Já tem uma conta? Acesse</h3></legend>
                        <div class="form-group">
                            <label class="col-md-1 control-label" for="usuario"></label>  
                            <div class="col-md-12">
                                <input id="usuario" name="usuario" type="text" placeholder="Usuário" class="form-control input-md" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-1 control-label" for="senha"></label>
                            <div class="col-md-12">
                                <input id="senha" name="senha" type="password" placeholder="senha" class="form-control input-md" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-1 control-label" for="login"></label>
                            <div class="col-md-5">
                                <button id="login" name="login" class="btn btn-block btn-success" type="submit">Acessar</button>
                            </div>
                            <div class="col-md-5">
                                <a href="/" class="btn btn-block btn-warning">Voltar</a>
                            </div>  
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
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

app.get("/esq", (req, res) =>{
    
    res.send(`<p> CONTA CADASTRADA NO SISTEMA [...] </p>
        <a href="/" class="btn btn-primary mt-3">Acessar sua conta</a>
    `);
});


app.get("/agenda", verificarAutenticacao, (req, res) => {
    let tabela = `
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Agenda de Consultas</title>
            </head>
            <body>
                <div class="container mt-5">
                    <h2 class="mb-4 text-center">Agenda de Consultas</h2>
                    <a href="/" class="btn btn-secondary mb-3">Voltar</a>
    `;

    if (listaUsuarios.length === 0) {
        tabela += `<p class="text-center">Nenhum cliente agendado até o momento.</p>`;
    } else {
        tabela += `
            <table class="table table-bordered table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Instagram</th>
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>Email</th>
                        <th>Telefone</th>
                    </tr>
                </thead>
                <tbody>
        `;

        listaUsuarios.forEach((usuario, index) => {
            tabela += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${usuario.nome} ${usuario.sobrenome}</td>
                    <td>@${usuario.instagram}</td>
                    <td>${usuario.cidade}</td>
                    <td>${usuario.estado}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                </tr>
            `;
        });

        tabela += `
                </tbody>
            </table>
        `;
    }

    tabela += `
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
            </body>
        </html>
    `;

    res.send(tabela);
});

app.listen(port, host, () => {
    console.log(`Servidor em execução: http://${host}:${port}/`);
});
