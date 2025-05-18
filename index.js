import express from "express";

const app = express();

const host = "0.0.0.0";
const port = 3000;
let listaUsuarios = [];

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
                <title>Página Inicial</title>
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">CLÍNICA DE SAÚDE MENTAL</a>
                        <div class="collapse navbar-collapse">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item"><a class="nav-link active" href="/">Início</a></li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Agendamento</a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="/cadastro">Agendar consulta</a></li>
                                        <li><a class="dropdown-item" href="/agenda">Conferir agenda</a></li>
                                    </ul>
                                </li>
                            </ul>
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
                            <legend class="text-center fs-4 w-100 mb-4">AGENDAMENTO DA CONSULTA</legend>
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

app.post("/cadastro", (req, res) => {
    const { nome, sobrenome, instagram, cidade, estado } = req.body;

    if (!nome || !sobrenome || !instagram || !cidade || !estado) {
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

    listaUsuarios.push({ nome, sobrenome, instagram, cidade, estado });

    res.send(`
        <html lang="pt-br">
            <head><meta charset="UTF-8"><title>Sucesso</title></head>
            <body class="text-center">
                <h2>Consulta agendada com sucesso!</h2>
                <p><strong>Nome:</strong> ${nome} ${sobrenome}</p>
                <p><strong>Instagram:</strong> @${instagram}</p>
                <p><strong>Cidade:</strong> ${cidade} - ${estado}</p>
                <a href="/" class="btn btn-primary mt-3">Voltar para Início</a>
            </body>
        </html>
    `);
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
