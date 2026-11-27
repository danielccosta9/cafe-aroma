const express = require("express")
const { DatabaseSync } = require("node:sqlite")

const PORTA = process.env.PORT || 3010

const app = express()
app.use(express.json())
app.use(express.static(__dirname))

const db = new DatabaseSync("cafe.db")

db.exec(`
    CREATE TABLE IF NOT EXISTS carrinho(
    id              INTEGER PRIMARY KEY,
    nome            TEXT        NOT NULL,
    preco           REAL        NOT NULL,
    imagem          TEXT,
    quantidade      INTEGER     NOT NULL    
    )
`);

app.get("/api/carrinho", (req, res) => {
    const itens = db.prepare("SELECT * FROM carrinho").all()
    res.json(itens)
})

app.put("/api/carrinho", (req, res) => {
    const itens = req.body
    db.exec("DELETE FROM carrinho")
    const inserir = db.prepare(
        "INSERT INTO carrinho (id, nome, preco, imagem, quantidade) VALUES (?, ?, ?, ?, ?)"
    );

    for (const item of itens) {
        inserir.run(item.id, item.nome, item.preco, item.imagem, item.quantidade)
    }
    res.json({ ok: true })
})

app.listen(PORTA, (erro) => {
    if (erro) {
        console.error(`Não foi possivel iniciar na porta ${PORTA}: ${erro.message}`)
        return
    }
    console.log(`Café Aroma rodando em http://localhost:${PORTA}`)
})