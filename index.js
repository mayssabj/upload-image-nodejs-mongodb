
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://mayssa:mayssa@cluster0.ckpide7.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(() => console.log('Connexion à MongoDB échouée'));

// Définition du schéma pour l'objet image
const imageSchema = new mongoose.Schema({
    name: String,
    image: {
        data: Buffer,
        contentType: String
    }
});

const Image = mongoose.model('Image', imageSchema);

// Configuration de Multer pour stocker les fichiers dans la mémoire tampon
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Affichage du formulaire d'upload d'image
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Traitement de l'upload d'image
app.post('/upload', upload.single('image'), function (req, res) {
    const newImage = new Image({
        name: req.file.originalname,
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
    });

    newImage.save()
        .then(() => res.send('Image uploadée et sauvegardée dans la base de données !'))
        .catch(() => res.send('Erreur lors de l\'upload et de la sauvegarde de l\'image dans la base de données.'));
});

// Suppression d'une image
app.post('/delete/:id', function (req, res) {
    Image.findByIdAndDelete(req.params.id, function (err, image) {
        if (err || !image) {
            return res.send('Impossible de supprimer l\'image.');
        }

        res.send('Image supprimée avec succès.');
    });
});

app.listen(3000, function () {
    console.log('Serveur lancé sur le port 3000');
});
