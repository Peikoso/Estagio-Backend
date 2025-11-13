import { RulesRepository } from '../repositories/rules.js';
import { Rules } from '../models/rules.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { isValidUuid } from '../utils/validations.js'
import { UserService } from './users.js';
import { RoleService } from './roles.js';
import { RunnerService } from './runners.js';

export const RuleService = {
    getAllRules: async () => {
        const rules = await RulesRepository.findAll();

        return rules;
    },

    getRuleById: async (id) => {
        if(!isValidUuid(id)){
            throw new ValidationError('Invalid Rule UUID.')
        }

        const rule = await RulesRepository.findById(id)

        if(!rule){
            throw new NotFoundError('Rule not found.')
        }

        return rule;
    },

    createRule: async (dto) => {
        const newRule = new Rules(dto).validateBusinessLogic();

        await UserService.getUserById(newRule.userCreatorId);

        for(const roleId of newRule.roles){
            await RoleService.getRoleById(roleId);
        }

        const savedRule = await RulesRepository.create(newRule);

        await RunnerService.createRunner(savedRule.id, 'active');

        return savedRule;
    },

    updateRule: async (id, ruleData) => {
        //Logica a ser implementada
    },

    deleteRule: async (id) => {
        //Logica a ser implementada
    }
};
