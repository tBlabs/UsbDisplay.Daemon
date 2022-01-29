"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOperation = void 0;
const OperationType_1 = require("../Types/OperationType");
class IsOperation {
    constructor(toCompare) {
        this.toCompare = toCompare;
        this.type = OperationType_1.OperationType.Is;
    }
    toString() {
        return "IsOperation " + this.toCompare.toString(16);
    }
}
exports.IsOperation = IsOperation;
//# sourceMappingURL=IsOperation.js.map