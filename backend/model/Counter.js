const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const counterSchema = new Schema({
    _id: String,
    collectionCounter: Number
});

const Counter = model('Counter', counterSchema);
module.exports = Counter;
// export default Counter;