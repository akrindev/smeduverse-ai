"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type ConversationProps = ComponentProps<"div">;

export const Conversation = ({ className, ...props }: ConversationProps) => (
	<div className={cn("smeduverse-conversation", className)} {...props} />
);

export type ConversationContentProps = ComponentProps<"div">;

export const ConversationContent = ({
	className,
	...props
}: ConversationContentProps) => (
	<div
		className={cn("smeduverse-conversation-content", className)}
		{...props}
	/>
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
	<div className={cn("smeduverse-conversation-empty", className)} {...props}>
		{children ?? (
			<>
				{icon && <div className="smeduverse-text-muted">{icon}</div>}
				<div className="smeduverse-spacing-sm">
					<h3 className="smeduverse-font-medium smeduverse-text-sm">{title}</h3>
					{description && (
						<p className="smeduverse-text-muted smeduverse-text-sm">
							{description}
						</p>
					)}
				</div>
			</>
		)}
	</div>
);

// No-op scroll button for CDN version (handled by parent auto-scroll)
export const ConversationScrollButton = () => null;
