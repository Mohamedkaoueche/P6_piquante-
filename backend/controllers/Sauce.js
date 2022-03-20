const sauce = require('../models/sauce');
const SauceModel = require('../models/sauce');

const getSauces = async (req, res, next) => {
    try {
        const sauces = await SauceModel.find();
        res.status(201).json(sauces);
    } catch (e) {
        res.status(400).json({ error: 'Impossible de trouver la sauce' })
    }
    return next();
}

const getSauce = async (req, res, next) => {
    try {
        const sauce = await SauceModel.findOne({_id: req.params.id});
        res.status(201).json(sauce);
    } catch (e) {
        res.status(400).json({ error: 'Impossible de trouver la sauce' });
    }
    return next();
}

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

const updateSauce = async (req, res, next) => {
    try {
        const sauce = await SauceModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).json({
            message: 'Sauce modifiée'
        });
    } catch (e) {
        res.status(400).json({ error: 'Impossible de modifier la sauce' });
    }
    return next();
}

const deleteSauce = async (req, res, next) => {
    try {
        const sauce = await SauceModel.findByIdAndRemove(req.params.id);
        res.status(201).json({
            message: 'Sauce supprimée'
        });
    } catch (e) {
        res.status(400).json({ error: 'Impossible de supprimer la sauce' });
    }
    return next();
}

module.exports = {
    getSauces: getSauces,
    getSauce: getSauce,
    addSauce: addSauce,
    updateSauce: updateSauce,
    deleteSauce: deleteSauce
}