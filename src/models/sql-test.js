import { sqlValidantion } from '../utils/validations.js'
import { BusinessLogicError } from '../utils/errors.js';

export class SQLTest {
    constructor(sqlTest){
        this.id = sqlTest.id;
        this.ruleId = sqlTest.rule_id ?? sqlTest.ruleId;
        this.userId = sqlTest.user_id ?? sqlTest.userId;
        this.sql = sqlTest.sql;
        this.result = sqlTest.result;
        this.createdAt = sqlTest.created_at ?? sqlTest.createdAt;
    }

    validateBussinessLogic(){
        if(!sqlValidantion(this.sql)){
            throw new BusinessLogicError('SQL contains forbidden commands');
        }
    }

    static fromArray(sqlTests){
        return sqlTests.map(sqlTest => new SQLTest(sqlTest));
    }
};