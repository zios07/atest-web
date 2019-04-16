import { BaseModel } from "../../_base/crud";

export class Account {
    
    id:number;
    username: string;
    password: string;

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }

}