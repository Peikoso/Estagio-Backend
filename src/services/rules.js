import { RuleRepository } from '../repositories/rules.js';
import { ResponseRulesDto } from '../dto/rules/responseRulesDto.js';
import { CreateRulesDto } from '../dto/rules/createRulesDto.js';
import { Rules } from '../models/rules.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { isValidUuid } from '../utils/valid_uuid.js'

export const RuleService = {
    getAllRules: async () => {
        const rules = await RuleRepository.findAll();
        return ResponseRulesDto.fromArray(rules);
    },

    getRuleById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid UUID.')
        }

        const rule = await RuleRepository.findById(id)

        if(!rule){
            throw new NotFoundError('Rule not found.')
        }

        return new ResponseRulesDto(rule);
    },

    createRule: async (ruleData) => {
       const dto = new CreateRulesDto(ruleData).validate();

       new Rules(dto).validateBusinessRules();

       const newRule = await RuleRepository.create(dto);

       return new ResponseRulesDto(newRule);
    },

    updateRule: async (id, ruleData) => {
        //Logica a ser implementada
    },

    deleteRule: async (id) => {
        //Logica a ser implementada
    }
};
