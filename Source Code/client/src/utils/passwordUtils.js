
export const evaluatePasswordStrength = (password) => {
    let score = 0;

    if (!password) {
        return { score: 0, level: "None" };
    }

    // Award every unique letter until 5 repetitions
    let letters = new Object();
    for (let i=0; i<password.length; i++) {
        letters[password[i]] = (letters[password[i]] || 0) + 1;
        score += 5.0 / letters[password[i]];
    }

    // Bonus points for mixing it up
    var variations = {
        digits: /\d/.test(password),
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        nonWords: /\W/.test(password),
    }

    let variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    if(score > 80) return { score, level: "Strong" };
    if(score > 60) return { score, level: "Good" };
    if(score >= 30) return { score, level: "Weak" };

    return { score, level: "Very Weak" };
};
