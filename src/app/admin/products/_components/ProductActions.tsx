"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React, { useTransition } from "react";
import {
	deleteProduct,
	toggleProductAvailability,
} from "../../_actions/products";

export function ActiveProductDropdownItem({
	id,
	isAvailableForPurchase,
}: {
	id: string;
	isAvailableForPurchase: boolean;
}) {
	const [isPending, startTransition] = useTransition();
	return (
		<DropdownMenuItem
			disabled={isPending}
			onClick={() => {
				startTransition(async () => {
					await toggleProductAvailability(id, !isAvailableForPurchase);
				});
			}}>
			{isAvailableForPurchase ? "Deactivate" : "Activate"}
		</DropdownMenuItem>
	);
}

export function DeleteProductDropdownItem({
	id,
	disabled,
}: {
	id: string;
	disabled: boolean;
}) {
	const [isPending, startTransition] = useTransition();
	return (
		<DropdownMenuItem
			variant="destructive"
			disabled={disabled || isPending}
			onClick={() => {
				startTransition(async () => {
					await deleteProduct(id);
				});
			}}>
			Delete
		</DropdownMenuItem>
	);
}
