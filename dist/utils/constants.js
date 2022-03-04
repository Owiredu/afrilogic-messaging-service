"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
const Constants = {
    // REGULAR EXPRESSIONS FOR VALIDATION
    EMPTY_STRING_REGEX: /^$/,
    REQUIRED_NAME_REGEX: /^[^\s]{1}.{1,50}[^\s]{1}$/,
    OPTIONAL_NAME_REGEX: /^[^\s]{1}.{1,50}[^\s]{1}$|^$/, // Should be empty or not start with spaces and have from 3 to 50 characters
};
exports.default = Constants;
