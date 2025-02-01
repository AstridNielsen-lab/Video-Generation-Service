import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração da API Gemini
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

app.use(express.json());

// Função para gerar código binário
async function generateBinaryCode(prompt) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.generatedBinary || "iVBORw0KGgoAAAANSUhEUgAAAPoAAADICAYAAADBXvybAAAAAXNSR0IArs4c6QAAGf5JREFUeF7tXQn8ttWYvq4xzDRGkvAjW0QkEomyTCJKtkSihSSaSGUpjKIhe9EmKiZtKiVZi2RN2ZeUSpItZB0xMeSa3"; // Exemplo de fallback
    } catch (error) {
        console.error("Erro ao gerar código binário:", error);
        throw error;
    }
}

// Função para converter binário em imagem
function binaryToImage(binaryCode, outputPath) {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(binaryCode, 'binary');
        fs.writeFile(outputPath, buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(outputPath);
            }
        });
    });
}

// Endpoint para gerar vídeo
app.post('/generate-video', async (req, res) => {
    try {
        const { prompt } = req.body;
        const binaryCode = await generateBinaryCode(prompt);
        const imagePath = path.join(__dirname, 'output.png');
        await binaryToImage(binaryCode, imagePath);

        res.json({
            message: 'Imagem gerada com sucesso!',
            imageUrl: `http://localhost:${PORT}/image`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Servir a imagem gerada
app.get('/image', (req, res) => {
    const imagePath = path.join(__dirname, 'output.png');
    res.sendFile(imagePath);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
