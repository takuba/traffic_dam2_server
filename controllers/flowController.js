const express = require('express');
const router = express.Router();
const { flowDbModel,flowApiModel,flowFullModel }  = require('../models/flowModel');

exports.getAllDbflowByDate = async (req, res) => {
    try {
    const {year, month, day} = req.params;
    const data = await flowDbModel.getAllDbflowByDate(year, month, day);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllDbflowByMeterId = async (req, res) => {
    try {
    const {year, month, day, meterId} = req.params;
    const data = await flowDbModel.getAllDbflowByMeterId(year, month, day, meterId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllApiflowByDate = async (req, res) => {
    try {
    const {year, month, day, page} = req.params;
    const data = await flowApiModel.getAllApiflowByDate(year, month, day, page);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllApiflowByMeterId = async (req, res) => {
    try {
    const {year, month, day, meterId, page} = req.params;
    const data = await flowApiModel.getAllApiflowByMeterId(year, month, day, meterId, page);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllFlowsByDate = async (req, res) => {
    try {
    const {year, month, day, page} = req.params;
    const data = await flowFullModel.getAllFlowsByDate(year, month, day, page);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllFlowsByMeterId = async (req, res) => {
    try {
        const {year, month, day, meterId, page} = req.params;
        const data = await flowFullModel.getAllFlowsByMeterId(year, month, day, meterId, page);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addNewFlow = async (req, res) => {
    try {
        const {meterDate, timeRank, totalVehicles, speedIntervals, lengthIntervals} = req.body;
        const data = await flowFullModel.addNewFlow(meterDate, timeRank, totalVehicles, speedIntervals, lengthIntervals);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateFlow = async (req, res) => {
    try {
        const meterId = req.params.meterId;
        const data = await flowFullModel.updateFlow(req.body,meterId);
        res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};