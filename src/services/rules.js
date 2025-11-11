import { RulesRepository } from '../repositories/rules.js';
import { ResponseRulesDto } from '../dto/rules/responseRulesDto.js';
import { CreateRulesDto } from '../dto/rules/createRulesDto.js';
import { Rules } from '../models/rules.js';
import { RoleService } from './roles.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { isValidUuid } from '../utils/valid_uuid.js'

export const RuleService = {
    getAllRules: async () => {
        const rules = await RulesRepository.findAll();
        return ResponseRulesDto.fromArray(rules);
    },

    getRuleById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid Rule UUID.')
        }

        const rule = await RulesRepository.findById(id)

        if(!rule){
            throw new NotFoundError('Rule not found.')
        }

        return new ResponseRulesDto(rule);
    },

    createRule: async (ruleData) => {
        const dto = new CreateRulesDto(ruleData).validate();

        const newRule = new Rules(dto);

        for(const roleId of newRule.roles){
            await RoleService.getRoleById(roleId);
        }

        const savedRule = await RulesRepository.create(newRule);
        
        return new ResponseRulesDto(savedRule);
    },

    updateRule: async (id, ruleData) => {
        //Logica a ser implementada
    },

    deleteRule: async (id) => {
        //Logica a ser implementada
    }
};
