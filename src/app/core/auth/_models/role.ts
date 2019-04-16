import { BaseModel } from "../../_base/crud";

export class Role {
    id:number;
    roleCode: string;
    roleLabel: string;

    getRoleCode() {
        return this.roleCode;
    }

    getRoleLabel() {
        return this.roleLabel;
    }
}