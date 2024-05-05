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
