import { RuleService } from '../services/rules.js';
import { ResponseRulesDto } from '../dto/rules/response-rules-dto.js';
import { CreateRulesDto } from '../dto/rules/create-rules-dto.js';

export const RulesController = {
    getAllRules: async (req, res) => {
        try {
            const rules = await RuleService.getAllRules();

            const response = ResponseRulesDto.fromArray(rules);

            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getRuleById: async (req, res) =>{
        try{
            const id = req.params.id;

            const rule = await RuleService.getRuleById(id);

            const response = new ResponseRulesDto(rule);

            return res.status(200).json(response);
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

            const dto = new CreateRulesDto(ruleData).validate();

            const newRule = await RuleService.createRule(dto);

            const response = new ResponseRulesDto(newRule);

            return res.status(201).json(response);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(error.status).json({ error: error.message });
            }
            if(error.name === 'NotFoundError'){
                return res.status(error.status).json({ error: error.message });
            }
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

};