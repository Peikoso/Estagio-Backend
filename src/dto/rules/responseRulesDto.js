export class ResponseRulesDto {
  constructor(rule) {
    this.id = rule.id;
    this.name = rule.name;
    this.description = rule.description;
    this.sql = rule.sql;
    this.priority = rule.priority;
    this.roles = rule.roles;
    this.execution_interval_ms = rule.execution_interval_ms;
    this.max_error_count = rule.max_error_count;
    this.timeout_ms = rule.timeout_ms;
    this.start_time = rule.start_time;
    this.end_time = rule.end_time;
    this.notification_enabled = rule.notification_enabled;
    this.silence_mode = rule.silence_mode;
    this.postpone_date = rule.postpone_date;
    this.is_active = rule.is_active;
    this.user_creator_id = rule.user_creator_id;
    this.created_at = rule.created_at;
    this.updated_at = rule.updated_at;
  }


  static fromArray(rulesArray) {
    return rulesArray.map((rule) => new ResponseRulesDto(rule));
  }
}
