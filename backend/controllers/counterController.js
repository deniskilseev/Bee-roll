const mongoose = require('mongoose')
const express = require('express')
const Counter = require('../model/Counter.js')

const counterController = {

    async getController(req, res) {
        const {collection} = req.body;
        try {
            const counter = await Counter.findOne({_iud: collection})
            res.json(counter[collectionCounter])
            
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}