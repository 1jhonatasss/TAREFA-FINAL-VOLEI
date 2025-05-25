import express from "express";

const app = express();

const host = "0.0.0.0";
const port = 3000;
let listaUsuarios = [];

app.use(express.urlencoded({ extended: true }));

app.get("/inicio", (req, res) => {
    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Página Inicial</title>
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand position-absolute start-50 translate-middle-x" style="color:rgb(41, 184, 219)"; href="/">CLÍNICA DE SAÚDE MENTAL</a>
                        <div class="collapse navbar-collapse">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item"><a class="nav-link active" href="/logout">SAIR DA CONTA  </a></li> 
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">AGENDAMENTOS</a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="/cadastro">Agendar consulta</a></li>
                                        <li><a class="dropdown-item" href="/agenda">Conferir agenda</a></li>
                                    </ul>
                                </li>
                            </ul>
                                <div class="ms-auto me-4">
                                    <a class="nav-link active fs-5" style="font-family: 'Dancing Script', cursive;">Dra.ACândido</a>
                                </div>
                        </div>
                    </div>
                </nav>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
        </html>
    `);
});

app.get("/cadastro", (req, res) => {
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
                            <a href="/inicio" class="btn btn-secondary">Voltar</a>
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

app.post("/cadastro", (req, res) => {
    const { nome, sobrenome, instagram, cidade, estado, cnpj, razao, fantasia, email, telefone } = req.body;

    if (!nome || !sobrenome || !instagram || !cidade || !estado || !cnpj || !razao || !fantasia || !email || !telefone) {
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

    listaUsuarios.push({ nome, sobrenome, instagram, cidade, estado, cnpj, razao, fantasia, email, telefone });

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

app.get("/", (req, res) => {
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
                <form class="form-horizontal" method="POST" action="/">
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
                                <input id="senha" name="senha" type="password" placeholder="Senha" class="form-control input-md" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-1 control-label" for="login"></label>
                            <div class="col-md-5">
                                <button id="login" name="login" class="btn btn-block btn-success" type="submit">Acessar</button>
                            </div>
                            <div class="col-md-5">
                                <a href="/esqueci" class="btn btn-block btn-warning">Cadastrar</a>
                            </div>  
                        </div>
                    </fieldset>
                </form>
            </div> <!-- ./row -->
        </div> <!-- ./container -->
    `);
});



app.post("/", (req, res) => {
    const { usuario, senha } = req.body;
    res.redirect("/inicio");
});

app.get("/logout", (req, res) =>{
    
    res.send(`<p> SAINDO DO SISTEMA [...] </p>
        <a href="/" class="btn btn-primary mt-3">Voltar para Início</a>
    `);
});

app.get("/esq", (req, res) =>{
    
    res.send(`<p> CONTA CADASTRADA NO SISTEMA [...] </p>
        <a href="/" class="btn btn-primary mt-3">Acessar sua conta</a>
    `);
});

app.get("/esqueci", (req, res) => {
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
                <div class="page-header"><h2>Formulário de Cadastro</h2></div>
                <form class="form-horizontal" method="POST" action="/esqueci">
                    <fieldset>


                        <div class="form-group">
                            <label class="col-md-1 control-label" for="usuario"></label>  
                            <div class="col-md-12">
                                <input id="usuario" name="usuario" type="text" placeholder="Usuário" class="form-control input-md" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-1 control-label" for="senha"></label>
                            <div class="col-md-12">
                                <input id="senha" name="senha" type="password" placeholder="Senha" class="form-control input-md" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-1 control-label" for="login"></label>
                            <div class="col-md-5">
                                <button id="login" name="login" class="btn btn-block btn-success" type="submit">Cadastrar</button>
                            </div>
                            <div class="col-md-5">
                                <a href="/" class="btn btn-block btn-warning">voltar</a>
                            </div>  
                        </div>
                    </fieldset>
                </form>
            </div> <!-- ./row -->
        </div> <!-- ./container -->
    `);
});
app.post("/esqueci", (req, res) => {
    const { usuario, senha } = req.body;
    res.redirect("/esq");
});


app.get("/agenda", (req, res) => {
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
                    <a href="/inicio" class="btn btn-secondary mb-3">Voltar</a>
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
