import express from "express"

const app = express()
app.use(express.json())

let pets = [
    {
        idPet: 1,
        dsNome: "Rex",
        dsEspecie: "cachorro",
        nuIdade: 3,
        fgAdotado: false
    },
    {
        idPet: 2,
        dsNome: "Mimi",
        dsEspecie: "gato",
        nuIdade: 2,
        fgAdotado: false
    },
    {
        idPet: 3,
        dsNome: "Thor",
        dsEspecie: "cachorro",
        nuIdade: 1,
        fgAdotado: false
    }
]

let ultimoId = 3


function buscarTodos() {
    return pets
}


function buscarUm(id) {
    return pets.find((pet) => pet.idPet === id)
}

function criarPet(dados) {
    ultimoId++

    const pet = {
        idPet: ultimoId,
        dsNome: dados.dsNome,
        dsEspecie: dados.dsEspecie,
        nuIdade: dados.nuIdade,
        fgAdotado: false
    }

    pets.push(pet)
    return pet
}

function editarPet(id, dados) {
    const pet = buscarUm(id)
    Object.assign(pet, dados)
    return pet
}


function deletarPet(id) {
    const index = pets.findIndex((pet) => pet.idPet === id)

    if (index === -1) {
        return false
    }

    pets.splice(index, 1)
    return true
}

app.get("/pets", (req, res) => {
    res.status(200).json(buscarTodos())
})


app.get("/pets/:id", (req, res) => {
    const id = parseInt(req.params.id, 10)

    if (isNaN(id) || String(id) !== req.params.id) {
        return res.status(400).json({
            mensagem: "identificador deve ser um numero"
        })
    }

    const pet = buscarUm(id)

    if (!pet) {
        return res.status(404).end()
    }

    res.status(200).json(pet)
})


app.post("/pets", (req, res) => {
    const dados = req.body

    if (
        !dados ||
        typeof dados.dsNome !== "string" ||
        dados.dsNome.trim() === "" ||
        typeof dados.dsEspecie !== "string" ||
        dados.dsEspecie.trim() === ""
    ) {
        return res.status(400).json({
            mensagem: "Nome e especie sao obrigatorios"
        })
    }

    if (
        typeof dados.nuIdade !== "number" ||
        !Number.isFinite(dados.nuIdade) ||
        dados.nuIdade < 0
    ) {
        return res.status(400).json({
            mensagem: "Idade invalida"
        })
    }

    const pet = criarPet({
        dsNome: dados.dsNome.trim(),
        dsEspecie: dados.dsEspecie.trim(),
        nuIdade: dados.nuIdade
    })

    res.status(201).json(pet)
})


app.patch("/pets/:id", (req, res) => {
    const id = parseInt(req.params.id, 10)

    if (isNaN(id) || String(id) !== req.params.id) {
        return res.status(400).json({
            mensagem: "identificador deve ser um numero"
        })
    }

    const pet = buscarUm(id)

    if (!pet) {
        return res.status(404).end()
    }

    const dados = req.body
    const alteracoes = {}

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        return res.status(400).json({
            mensagem: "Dados invalidos"
        })
    }

    if (dados.dsNome !== undefined) {
        if (
            typeof dados.dsNome !== "string" ||
            dados.dsNome.trim() === ""
        ) {
            return res.status(400).json({
                mensagem: "Nome invalido"
            })
        }

        alteracoes.dsNome = dados.dsNome.trim()
    }

    if (dados.dsEspecie !== undefined) {
        if (
            typeof dados.dsEspecie !== "string" ||
            dados.dsEspecie.trim() === ""
        ) {
            return res.status(400).json({
                mensagem: "Especie invalida"
            })
        }

        alteracoes.dsEspecie = dados.dsEspecie.trim()
    }

    if (dados.nuIdade !== undefined) {
        if (
            typeof dados.nuIdade !== "number" ||
            !Number.isFinite(dados.nuIdade) ||
            dados.nuIdade < 0
        ) {
            return res.status(400).json({
                mensagem: "Idade invalida"
            })
        }

        alteracoes.nuIdade = dados.nuIdade
    }

    if (dados.fgAdotado !== undefined) {
        if (typeof dados.fgAdotado !== "boolean") {
            return res.status(400).json({
                mensagem: "Adocao deve ser true ou false"
            })
        }

        alteracoes.fgAdotado = dados.fgAdotado
    }

    if (Object.keys(alteracoes).length === 0) {
        return res.status(400).json({
            mensagem: "Informe um campo valido"
        })
    }

    res.status(200).json(editarPet(id, alteracoes))
})

app.delete("/pets/:id", (req, res) => {
    const id = parseInt(req.params.id, 10)

    if (isNaN(id) || String(id) !== req.params.id) {
        return res.status(400).json({
            mensagem: "identificador deve ser um numero"
        })
    }

    if (!deletarPet(id)) {
        return res.status(404).end()
    }

    res.status(204).end()
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})



mkdir abrigo-de-pets
cd abrigo-de-pets
npm init -y
npm install express