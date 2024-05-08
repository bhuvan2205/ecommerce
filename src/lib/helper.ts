const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
	currency: "USD",
	style: "currency",
	minimumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function formatCurrency(amount: number) {
	return CURRENCY_FORMATTER.format(amount);
}

export function formatNumber(number: number) {
	return NUMBER_FORMATTER.format(number);
}

export const isValidPassword = async (
	password: string,
	hashedPassword: string
) => {
	return (await hashPassword(password)) === hashedPassword;
};

const hashPassword = async (password: string) => {
	const arrayBuffer = await crypto.subtle.digest(
		"SHA-512",
		new TextEncoder().encode(password)
	);

	return Buffer.from(arrayBuffer).toString("base64");
};
