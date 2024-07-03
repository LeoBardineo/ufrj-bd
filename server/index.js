const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.options('*', cors());

// Configuração da conexão
const connection = mysql.createConnection({
  host: process.env.DATABASE_URL,
  user: 'root',
  password: 'root',
  database: 'cyberattacks'
});

// Conectar ao banco de dados
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados como id', connection.threadId);
});

// Rota para obter todos os usuários
app.get('/usuarios', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  connection.query('SELECT * FROM usuario LIMIT ? OFFSET ?', [limit, offset], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    
    res.json({
      currentPage: page,
      results
    });
  });
});

// Rota para obter um usuário por ID
app.get('/usuarios/:id', (req, res) => {
  const query = "SELECT *, " +
                "(SELECT COUNT(*) FROM pacote p WHERE p.idUsuario = u.id) AS Total_Pacotes " +
                "FROM usuario u WHERE id = ? "
  const id = parseInt(req.params.id);
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results[0]);
  });
});

app.get('/ataques', (req, res) => {
  let query = "SELECT a.idAtaque, p.idUsuario, u.nome, p.pacoteTimestamp, a.severidade, a.tipo, a.acao FROM ataque a " +
                "JOIN pacote p ON p.idAtaque = a.idAtaque " +
                "JOIN usuario u ON p.idUsuario = u.id "
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  let arrArgs = []
  
  const orderBy = req.query.order || null
  const ascDesc = req.query.ascDesc || "ASC"
  if(orderBy != null && ascDesc != null) {
    query += "ORDER BY " + orderBy + " " + ascDesc + " "
  }

  query += "LIMIT ? OFFSET ? "
  arrArgs = [limit, offset]

  connection.query(query, arrArgs, (err, resultado) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    
    res.json({
      paginaAtual: page,
      resultado
    });
  })
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
