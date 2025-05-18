import express from "express";

const app = express();

const host = "0.0.0.0";
const port = 3000;
var listaUsuarios = [];

app.use(express.urlencoded({ extended: true }));

app.get("/", (requisicao, resposta) => {
    resposta.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                <title>Página Inicial</title>
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">MENU DO SISTEMA</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Link</a>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        AAAAAAAAAAA
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="/cadastro">CADASTROSSSSS</a></li>
                                        <li><a class="dropdown-item" href="#">Another action</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                                </li>
                            </ul>
                            <form class="d-flex" role="search">
                                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                                <button class="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </nav>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </html>
    `);
});

app.get("/cadastro", (requisicao, resposta) => {
    resposta.send(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                <title>Cadastro</title>
            </head>
            <body>
                <div class="container w-75 mb-5">
                    <form method="POST" action="/cadastro" class="row gx-3 border p-2">
                        <fieldset>
                            <legend class="text-center">Cadastrim</legend>
                        </fieldset>
                        <div class="col-sm-3">
                            <label class="visually-hidden" for="nome">Nome</label>
                            <input type="text" class="form-control" id="nome" name="nome" placeholder="Jaaane Doe">
                        </div>
                        <div class="col-sm-3">
                            <label class="visually-hidden" for="sobrenome">Sobrenome</label>
                            <div class="input-group">
                                <div class="input-group-text">@</div>
                                <input type="text" class="form-control" id="sobrenome" name="sobrenome" placeholder="Sobrenome">
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                            <select class="form-select" id="specificSizeSelect">
                                <option selected>Choose...</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                        <div class="col-auto">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="autoSizingCheck2">
                                <label class="form-check-label" for="autoSizingCheck2">
                                    Remember me
                                </label>
                            </div>
                        </div>
                        <div class="col-auto">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </html>
    `);
});

app.post("/cadastro", (requisicao, resposta) => {
    const nome = requisicao.body.nome;
    const sobrenome = requisicao.body.sobrenome;

    listaUsuarios.push({
        nome: nome,
        sobrenome: sobrenome
    });

    resposta.send("<p>Usuário cadastrado com sucesso!</p>");
});

app.listen(port, host, () => {
    console.log(`Servidor em execução: http://${host}:${port}/`);
});
