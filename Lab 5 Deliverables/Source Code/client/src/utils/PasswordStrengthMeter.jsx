//PasswordStrengthMeter.jsx
import React, { useEffect, useState } from 'react';
import { evaluatePasswordStrength } from './passwordUtils';

/**
 * A component that visually represents the strength of a password.
 * 
 * It utilizes the `evaluatePasswordStrength` function from `passwordUtils` to determine the
 * strength of the provided password, which is then displayed as a colored bar. The length and color
 * of the bar indicate the password's strength level, ranging from 'Very Weak' to 'Strong'.
 * 
 * Props:
 *  - password: The password string whose strength is to be evaluated.
 * 
 * The component makes use of `useEffect` to react to changes in the `password` prop, ensuring the
 * strength evaluation is always up to date. The visual representation is achieved using nested `div` elements
 * with dynamic styles that reflect the current password strength level.
 */
const PasswordStrengthMeterComponent = ({ password }) => {
    const [strength, setStrength] = useState({ score: 0, level: 'None' });

    // Update the strength state whenever the password prop changes
    useEffect(() => {
       
        setStrength(evaluatePasswordStrength(password));
    }, [password]);

            /**
     * Determines the color associated with the current password strength level.
     * 
     * @returns {string} The hexadecimal color code corresponding to the strength level.
     */
    const getStrengthColor = () => {
        switch(strength.level) {
            case 'Strong':
                return '#0f9d58'; 
            case 'Good':
                return '#f4b400'; 
            case 'Weak':
                return '#db4437'; 
            case 'Very Weak':
                return '#e91e63'; 
            default:
                return '#e0e0e0'; 
        }
    };

            /**
     * Determines the width of the strength indicator bar based on the current password strength level.
     * 
     * @returns {string} The width percentage of the bar to represent the strength level.
     */
    const getStrengthWidth = () => {
        switch(strength.level) {
            case 'Strong':
                return '100%';
            case 'Good':
                return '75%';
            case 'Weak':
                return '50%';
            case 'Very Weak':
                return '25%';
            default:
                return '0%';
        }
    };

    return (
        <div>
            <div style={{ marginTop: '10px' }}>
                <div style={{
                    height: '10px',
                    width: '100%',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '5px',
                }}>
                    <div style={{
                        height: '100%',
                        width: getStrengthWidth(),
                        backgroundColor: getStrengthColor(),
                        borderRadius: '5px',
                        transition: 'width 0.5s ease-in-out'
                    }}></div>
                </div>
                <div style={{ marginTop: '5px', textAlign: 'right' }}>
                    {strength.level}
                </div>
            </div>
        </div>
    );
};

export default PasswordStrengthMeterComponent