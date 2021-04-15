var express = require("express");
var app = express();

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const cors = require("cors");

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://gustavoborges:2306@cluster0.l3a8r.mongodb.net/db_users?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors());

//Chamada do módulo model de usuários
var User = require("./models/users");

var router = express.Router();
/* *
VERBO HTTP	ROTA		          DESCRIÇÃO
GET			    /api/users	      Listar todos os usuários.
POST			  /api/users	      Cadastrar um usuário.
GET			    /api/users/:id	  Listar dados de um usuário específico.
DELETE			/api/users/:id	  Excluir um usuário específico.
PUT         /api/users/:id	  Editar dados de um usuário específico.
**/

//ROTA DE PERMISSAO DOS METODOS HTTP
router.use(function (req, res, next) {
    console.log("Acesso à primeira camada da aplicação.");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    app.use(cors());
    next();
});

//Rota padrão de acesso à aplicação/
//Acesso GET /
app.get("/", (req, res) => {
    res.send("Acesso a rota padrão da aplicação.");
    res.json({ message: "Acesso a rota padrão da aplicação." })
});

//Rota padrão /api/users
router.route("/users")

    //Acesso GET .../api/users
    .get(function (req, res) {
        User.find({}, function (error, users) {
            if (error) res.send(error);
            res.json(users);
        })
    })

    //Acesso POST .../api/users
    .post(function (req, res) {
        var user = new User();
        user.name = req.body.name;
        user.login = req.body.login;
        user.password = req.body.password;

        user.save(function (error) {
            if (error) res.send(error);
            res.json({ message: "Usuário cadastrado com sucesso!" })
        });
    });


//Rota padrão /api/users/:id
router.route("/users/:id")

    //Acesso GET .../api/users/:id
    .get(function (req, res) {
        User.findById(req.params.id, function (error, user) {
            if (error) res.send(error);
            res.json(user);
        })
    })

    //Acesso DELETE .../api/users/:id
    .delete(function (req, res) {
        User.remove(
            {
                _id: req.params.id
            },
            function (error) {
                if (error) res.send(error);
                res.json({ message: "Usuário excluído com sucesso!" });
            })
    })

    //Acesso PUT .../api/users/:id
    .put(function (req, res) {
        User.findById(req.params.id, function (error, user) {
            if (error) res.send(error);
            user.name = req.body.name;
            user.login = req.body.login;
            user.password = req.body.password;

            user.save(function (error) {
                if (error) res.send(error);
                res.json({ message: "Usuário atualizado com sucesso!" })
            })
        })
    });


//Adiciona o pré-fixo da rota /api nas demais rotas
app.use("/api", router)

//create a server object:
app.listen(8080);
console.log("Iniciando a aplicação na porta 8080...");




