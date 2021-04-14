//ARQUIVO DE CONFIGURAÇÃO DA APLICAÇÃO

var http = require('http');
var express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://gustavoborges:2306@cluster0.l3a8r.mongodb.net/db_users?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

var app = express();

var user = require("./models/users");
var router = express.Router();

router.use(function (req, res, next) {
    console.log("Acesso a primeira camada da aplicação")
    res.header("Access-Control-Allow-Methods", GET, POST, DELETE, PUT);
    app.use(cors());
    next();
});

app.get("/", (req, res) => {
    console.log("Acesso a rota padrão.");
    res.send("Acesso a rota padrão da aplicação");
});

//Rota padrão dos usuários
router.route("/users")
.get(function (req, res) {
    User.find(function(error, users) {
        res.json(users);
    });
})
.post(function (req, res) {
    var user = new User();
    user.name = req.body.name;
    user.login = req.body.login;
    user.password = req.body.password;
    user.save(function(error) {
        if(error) res.send(error);
        res.json({ message: "Cadastrado com sucesso!" });
    });
});

//ROTA PADRAO /API/USERS/:ID
router.route("/users/:id")
.get(function(req, res) {
    User.findById(req.params.id);
    if(error) res.send(error);
    res.json(user);
})
.put(function(req, res) {
    User.findById(req.params.id);
    user.name = req.body.name;
    user.login = req.body.login;
    user.password = req.body.password;
    user.save(function(error) {
        if(error) res.send(error);
        res.json({ message: "Editado com sucesso!" });
    });
})
.delete(function(req, res) {
    User.remove({
        _id: req.params.id
    });
});

//Rota Padrão: /api/users