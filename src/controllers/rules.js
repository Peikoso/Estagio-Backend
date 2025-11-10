import { RuleService } from '../services/rules.js';

export const RulesController = {
    getAllRules: async (req, res) => {
        try {
            const rules = await RuleService.getAllRules();
            return res.status(200).json(rules);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getRuleById: async (req, res) =>{
        try{
            const id = req.params.id;

            const rule = await RuleService.getRuleById(id);
            return res.status(200).json(rule);
        } catch (error){
            if(error.name === 'NotFoundError'){
                return res.status(error.status).json({ error: error.message });
            }
            if(error.name === 'ValidationError'){
                return res.status(error.status).json({ error: error.message });
            }
            console.error(error)
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createRule: async (req, res) => {
        try {
            const ruleData = req.body;
            const newRule = await RuleService.createRule(ruleData);
            return res.status(201).json(newRule);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(error.status).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

};