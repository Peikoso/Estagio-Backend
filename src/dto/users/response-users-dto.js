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
        this.pushEnabled = user.pushEnabled;
        this.emailEnabled = user.emailEnabled;
        this.comuniqEnabled = user.comuniqEnabled;
        this.pushSoundEnabled = user.pushSoundEnabled;
    }
    
    static fromArray(usersArray) {
        return usersArray.map((user) => new ResponseUsersDto(user));
    }
}