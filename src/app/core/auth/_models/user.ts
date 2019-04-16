import { Role } from "./role";
import { Account } from "./account";
import { BaseModel } from "../../_base/crud";

export class UserAuth {
    
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    account: Account;
    role: Role;
    bDate: Date;

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getEmail() {
        return this.email;
    }

    getAccount() {
        return this.account;
    }

    getRole() {
        return this.role; 
    }

    getBDate() {
        return this.bDate;
    }

    setAccount(ac: Account) {
        this.account = ac;
    }

    setRole(rl: Role) {
        this.role = rl;
    }

}