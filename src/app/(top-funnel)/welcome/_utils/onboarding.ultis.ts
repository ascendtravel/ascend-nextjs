export const REFERRAL_CODE_KEY = 'referral_code';

export function pushReferralCode(referralCode: string | null) {
    if (referralCode) {
        localStorage.setItem(REFERRAL_CODE_KEY, referralCode);
    }
}

export function popReferralCode() {
    const referralCode = localStorage.getItem(REFERRAL_CODE_KEY);
    if (referralCode) {
        localStorage.removeItem(REFERRAL_CODE_KEY);
    }

    return referralCode;
}
