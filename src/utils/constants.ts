/* eslint-disable max-len */
const Constants = {
    // REGULAR EXPRESSIONS FOR VALIDATION

    EMPTY_STRING_REGEX: /^$/, // Should be an empty string

    REQUIRED_NAME_REGEX: /^[^\s]{1}.{1,50}[^\s]{1}$/, // Should not start with empty spaces and should be from 3 to 50 characters long

    OPTIONAL_NAME_REGEX: /^[^\s]{1}.{1,50}[^\s]{1}$|^$/, // Should be empty or not start with spaces and have from 3 to 50 characters
};

export default Constants;