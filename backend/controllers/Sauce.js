const sauce = require('../models/sauce');
const SauceModel = require('../models/sauce');

// récupérer toutes les sauces
const getSauces = async (req, res, next) => {
    try {
        const sauces = await SauceModel.find();
        res.status(201).json(sauces);
    } catch (e) {
        res.status(400).json({ error: 'Impossible de trouver la sauce' })
    }
    return next();
}


// récupérer une sauce à travers son id
const getSauce = async (req, res, next) => {
    try {
        const sauce = await SauceModel.findOne({_id: req.params.id});
        res.status(201).json(sauce);
    } catch (e) {
        res.status(400).json({ error: 'Impossible de trouver la sauce' });
    }
    return next();
}


// ajouter une sauce
const addSauce = async (req, res, next) => {
    try {
        const data = JSON.parse(req.body.sauce);
        data.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        const sauce = new SauceModel(data);
        const result = await sauce.save();
        res.status(201).json({
            message: 'Sauce enregistrée'
        });
    } catch (e) {
        res.status(400).json({ error: 'Impossible de sauvegarder la sauce' });
    }
    return next();
}


// mettre à jour une sauce
const updateSauce = async (req, res, next) => {
    try {
        let data = null;
        if (req.body.sauce) {
            data = JSON.parse(req.body.sauce);
        } else {
            data = req.body;
        }
        
        if (req.file) {
            data.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }
        
        const sauce = await SauceModel.findById(req.params.id);
        if (sauce.userId == data.userId) {
            await SauceModel.findByIdAndUpdate(req.params.id, data);
            res.status(201).json({
                message: 'Sauce modifiée'
            });
        }
    } catch (e) {
        res.status(400).json({ error: 'Impossible de modifier la sauce' });
    }
    return next();
}


// supprimer une sauce
const deleteSauce = async (req, res, next) => {
    try {
        await SauceModel.findByIdAndRemove(req.params.id);
        res.status(201).json({
            message: 'Sauce supprimée'
        });
    } catch (e) {
        res.status(400).json({ error: 'Impossible de supprimer la sauce' });
    }
    return next();
}


// liker ou disliker une sauce
const like = async (req, res, next) => {
    try {
        const like = req.body.like;
        const userId = req.body.userId;
        const sauce = await SauceModel.findById(req.params.id);
        if (like == 1) {
            if (!(userId in sauce.usersLiked)) {
                // vérfier que le user n'a pas déjà liké pour l'ajouter
                sauce.likes += 1;
                sauce.usersLiked.push(userId);
            }
        }
        else if (like == -1) {
            // vérfier que le user n'a pas déjà disliké pour l'ajouter
            if (!(userId in sauce.usersDisliked)) {
                sauce.dislikes += 1;
                sauce.usersDisliked.push(userId);
            }
        }
        else { 
            // like == 0
            // filtrer la liste likes et dislikes en supprimant le userid pour annuler son like
            sauce.usersLiked = sauce.usersLiked.filter(id => id != userId);
            sauce.likes = sauce.usersLiked.length;
            sauce.usersDisliked = sauce.usersDisliked.filter(id => id != userId);
            sauce.dislikes = sauce.usersDisliked.length;
            
        }
        // mettre à jour la sauce
        await SauceModel.findByIdAndUpdate(req.params.id, sauce);
        res.status(201).json({
            message: 'Sauce likée ou dislikée'
        });
    } catch (e) {
        res.status(400).json({ error: 'Impossible d\'aimer ou non la sauce' });
    }
}


module.exports = {
    getSauces: getSauces,
    getSauce: getSauce,
    addSauce: addSauce,
    updateSauce: updateSauce,
    deleteSauce: deleteSauce,
    like: like
}