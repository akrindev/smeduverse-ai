"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type ConversationProps = ComponentProps<"div">;

export const Conversation = ({ className, ...props }: ConversationProps) => (
	<div
		className={cn("relative flex-1 overflow-y-hidden", className)}
		{...props}
	/>
);

export type ConversationContentProps = ComponentProps<"div">;

export const ConversationContent = ({
	className,
	...props
}: ConversationContentProps) => (
	<div className={cn("flex flex-col gap-8 p-4", className)} {...props} />
);

// Simplified empty state
export type ConversationEmptyStateProps = ComponentProps<"div"> & {
	title?: string;
	description?: string;
	icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
	className,
	title = "No messages yet",
	description = "Start a conversation to see messages here",
	icon,
	children,
	...props
}: ConversationEmptyStateProps) => (
	<div
		className={cn(
			"flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
			className,
		)}
		{...props}
	>
		{children ?? (
			<>
				{icon && <div className="text-muted-foreground">{icon}</div>}
				<div className="space-y-1">
					<h3 className="font-medium text-sm">{title}</h3>
					{description && (
						<p className="text-muted-foreground text-sm">{description}</p>
					)}
				</div>
			</>
		)}
	</div>
);

// No-op scroll button for CDN version (handled by parent auto-scroll)
export const ConversationScrollButton = () => null;
