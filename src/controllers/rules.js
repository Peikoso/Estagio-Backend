import { RuleService } from '../services/rules.js';
import { ResponseRulesDto } from '../dto/rules/response-rules-dto.js';
import { CreateRulesDto } from '../dto/rules/create-rules-dto.js';

export const RulesController = {
    getAllRules: async (req, res) => {
        const rules = await RuleService.getAllRules();

        const response = ResponseRulesDto.fromArray(rules);

        return res.status(200).json(response);

    },

    getRuleById: async (req, res) =>{

        const id = req.params.id;

        const rule = await RuleService.getRuleById(id);

        const response = new ResponseRulesDto(rule);

        return res.status(200).json(response);

    },

    createRule: async (req, res) => {
        const ruleData = req.body;

        const dto = new CreateRulesDto(ruleData).validate();

        const newRule = await RuleService.createRule(dto);

        const response = new ResponseRulesDto(newRule);

        return res.status(201).json(response);
    },

    updateRule: async (req, res) => {
        const id = req.params.id;
        const ruleData = req.body;
        
        const dto = new CreateRulesDto(ruleData).validate();

        const updatedRule = await RuleService.updateRule(id, dto);

        const response = new ResponseRulesDto(updatedRule);

        return res.status(200).json(response);
    },

    deleteRule: async (req, res) => {
        const id = req.params.id;

        await RuleService.deleteRule(id);

        return res.status(204).send();
    }
};