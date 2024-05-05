//inputValidation.js

/**
 * Checks if a given postal code is a valid Singapore postal code.
 * 
 * Singapore postal codes are composed of exactly six digits, with no additional
 * characters or spaces. This function validates a postal code based on these criteria
 * using a regular expression that matches a sequence of exactly six digits.
 *
 * @param {string} postalCode - The postal code to be validated.
 * @returns {boolean} - Returns `true` if the postal code is a valid Singapore postal code,
 *                      otherwise returns `false`.
 */
export const isValidSingaporePostalCode=(postalCode)=> {
    const postalCodePattern = /^\d{6}$/;
    return postalCodePattern.test(postalCode);
  }