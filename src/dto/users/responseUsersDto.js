export class ResponseUsersDto {
    constructor(user){
        this.id = user.id;
        this.firebase_uid = user.firebase_uid;
        this.name = user.name;
        this.matricula = user.matricula;
        this.email = user.email;
        this.phone = user.phone;
        this.picture = user.picture;
        this.profile = user.profile;
        this.roles = user.roles;
        this.pending = user.pending;
        this.push_enabled = user.push_enabled;
        this.email_enabled = user.email_enabled;
        this.comuniq_enabled = user.comuniq_enabled;
        this.push_sound_enabled = user.push_sound_enabled;
    }
    
    static fromArray(usersArray) {
        return usersArray.map((user) => new ResponseUsersDto(user));
    }
}