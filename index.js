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



app.get("/", (req, res) => {
    res.send(
        `<html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Página Inicial</title>
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid d-flex flex-column">
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <span class="fs-4 fw-medium" style="font-family: 'Playfair Display', serif; color: #2a5885; letter-spacing: 0.5px;">
                                Dra. A.Cândido
                                </span>
                            </span>
                            <a class="navbar-brand fs-4 mx-auto" href="/" style="background: linear-gradient(90deg, #005b96, #1cb5e0); -webkit-background-clip: text; background-clip: text; color: transparent; font-weight: 700; font-size: 1.1em; font-family: 'Montserrat', sans-serif;">CENTRO DE EXCELÊNCIA EM SAÚDE MENTAL</a>
                           
                            <a class="nav-link" href="/usuario">ACESSAR CONTA<br></br>  </a>
                            <a class="nav-link" href="/logout"><br></br> SAIR</a>
                            <br></br>
                        </div>
                        
                        </div>
                    </div>
                </nav>
                        <div class="d-flex w-100 justify-content-between mt-3">
                                
                                <div class="dropdown ms-1">

                                <a class="nav-link " href="/alguma-rota">SOBRE</a>

                          
                                <a class="nav-link dropdown-toggle mt-2" href="#" data-bs-toggle="dropdown">AGENDAMENTOS</a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="/cadastro">Agendar consulta</a></li>
                                    <li><a class="dropdown-item" href="/agenda">Conferir agenda</a></li>
                                    <li><a class="dropdown-item" href="/produtos">Pedidos de Produtos</a></li>
                                </ul>

                                <a class="nav-link mt-2" href="/alguma-rota">ESPECIALIDADES</a>
                            </div>
    

                
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
        </html>`
    );
});



app.get("/cadastro",  (req, res) => {
    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Cadastro</title>
            </head>
            <body>
                <div class="container w-75 my-5">
                    <form class="row g-3 needs-validation border p-4 rounded" novalidate method="POST" action="/cadastro">
                        <fieldset>
                            <legend class="text-center fs-4 w-100 mb-4">AGENDAR CONSULTA</legend>
                        </fieldset>
                        <div class="col-md-4">
                            <label for="nome" class="form-label">Primeiro Nome</label>
                            <input type="text" class="form-control" id="nome" name="nome" required>
                            <div class="invalid-feedback">Informe seu nome.</div>
                        </div>
                        <div class="col-md-4">
                            <label for="sobrenome" class="form-label">Sobrenome</label>
                            <input type="text" class="form-control" id="sobrenome" name="sobrenome" required>
                            <div class="invalid-feedback">Informe seu sobrenome.</div>
                        </div>
                        <div class="col-md-4">
                            <label for="instagram" class="form-label">Instagram</label>
                            <div class="input-group">
                                <span class="input-group-text">@</span>
                                <input type="text" class="form-control" id="instagram" name="instagram" required>
                                <div class="invalid-feedback">Informe seu usuário do Instagram.</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label for="cidade" class="form-label">Cidade</label>
                            <input type="text" class="form-control" id="cidade" name="cidade" required>
                            <div class="invalid-feedback">Informe sua cidade.</div>
                        </div>
                        <div class="col-md-3">
                            <label for="estado" class="form-label">Estado</label>
                            <select class="form-select" id="estado" name="estado" required>
                                <option selected disabled value="">Escolha o estado</option>
                                <option>SP</option>
                                <option>MG</option>
                                <option>RJ</option>
                            </select>
                            <div class="invalid-feedback">Selecione um estado válido.</div>
                        </div>
                        <div class="col-md-6">
                            <label for="cnpj" class="form-label">CNPJ</label>
                            <input type="text" class="form-control" id="cnpj" name="cnpj" required>
                            <div class="invalid-feedback">Informe o CNPJ.</div>
                        </div>
                        <div class="col-md-6">
                            <label for="razao" class="form-label">Razão Social</label>
                            <input type="text" class="form-control" id="razao" name="razao" required>
                            <div class="invalid-feedback">Informe a razão social.</div>
                        </div>
                        <div class="col-md-6">
                            <label for="email" class="form-label">E-mail</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                            <div class="invalid-feedback">Informe um e-mail válido.</div>
                        </div>
                        <div class="col-md-6">
                            <label for="telefone" class="form-label">Telefone</label>
                            <input type="tel" class="form-control" id="telefone" name="telefone" required>
                            <div class="invalid-feedback">Informe seu telefone.</div>
                        </div>
                        <div class="col-12 d-flex justify-content-center gap-3 mt-3">
                            <button class="btn btn-primary" type="submit">Agendar</button>
                            <a href="/" class="btn btn-secondary">Voltar</a>
                        </div>
                    </form>
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
});

app.post("/cadastro",  (req, res) => {
    const { nome, sobrenome, instagram, cidade, estado, cnpj, razao, email, telefone } = req.body;

    if (!nome || !sobrenome || !instagram || !cidade || !estado || !cnpj || !razao || !email || !telefone) {
        return res.send(`
            <html>
                <head><meta charset="UTF-8"><title>Erro</title></head>
                <body>
                    <h2>Erro no cadastro</h2>
                    <p>Por favor, preencha todos os campos obrigatórios.</p>
                    <a href="/cadastro">Voltar ao formulário</a>
                </body>
            </html>
        `);
    }

    listaUsuarios.push({ nome, sobrenome, instagram, cidade, estado, cnpj, razao, email, telefone });

    res.send(`
        <html lang="pt-br">
            <head><meta charset="UTF-8"><title>Sucesso</title></head>
            <body class="text-center">
                <h2>Consulta agendada com sucesso!</h2>
                <p><strong>Nome:</strong> ${nome} ${sobrenome}</p>
                <p><strong>Instagram:</strong> @${instagram}</p>
                <p><strong>Cidade:</strong> ${cidade} - ${estado}</p>
                <p><strong>CNPJ:</strong> ${cnpj}</p>
                <p><strong>Razão Social:</strong> ${razao}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <a href="/" class="btn btn-primary mt-3">Voltar para Início</a>
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

    // Atualiza o cookie do último acesso
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
