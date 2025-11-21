"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
	Bot,
	Maximize2,
	Minimize2,
	RotateCcw,
	Send,
	Sparkles,
	User,
	X,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
// Import CDN versions of components
import { Conversation, ConversationContent } from "./ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
} from "./ai-elements/message.cdn";

type WidgetConfig = {
	apiEndpoint: string;
	position?: "bottom-right" | "bottom-left" | "bottom-center";
	primaryColor?: string;
	title?: string;
	darkMode?: boolean;
};

export function SmeduverseAIWidget({
	apiEndpoint,
	position = "bottom-right",
	primaryColor,
	title = "Smeduverse AI",
	darkMode = false,
}: WidgetConfig) {
	const [isOpen, setIsOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [input, setInput] = useState("");
	const { messages, sendMessage, status, setMessages } = useChat({
		transport: new DefaultChatTransport({
			api: apiEndpoint,
		}),
	});
	const isLoading = status === "submitted" || status === "streaming";
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } },
	) => {
		setInput(e.target.value);
	};

	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (input.trim()) {
			sendMessage({ text: input });
			setInput("");
		}
	};

	// Auto-scroll to bottom
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages.length]);

	// Focus input when opened
	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [isOpen]);

	// Helper for position classes
	const getPositionClasses = () => {
		switch (position) {
			case "bottom-left":
				return "bottom-left";
			case "bottom-center":
				return "bottom-center";
			case "bottom-right":
			default:
				return "bottom-right";
		}
	};

	// Helper for custom styles
	const getCustomStyles = () => {
		// Provide ShadCN theme variables for CDN compatibility
		const baseStyles: Record<string, any> = {
			"--radius": "0.625rem",
			"--background": "#fff",
			"--foreground": "#0a0a0a",
			"--card": "#fff",
			"--card-foreground": "#0a0a0a",
			"--popover": "#fff",
			"--popover-foreground": "#0a0a0a",
			"--primary": "#171717",
			"--primary-foreground": "#fafafa",
			"--secondary": "#f5f5f5",
			"--secondary-foreground": "#171717",
			"--muted": "#f5f5f5",
			"--muted-foreground": "#737373",
			"--accent": "#f5f5f5",
			"--accent-foreground": "#171717",
			"--destructive": "#e40014",
			"--border": "#e5e5e5",
			"--input": "#e5e5e5",
			"--ring": "#a1a1a1",
		};

		if (darkMode) {
			baseStyles["--background"] = "#0a0a0a";
			baseStyles["--foreground"] = "#fafafa";
			baseStyles["--card"] = "#171717";
			baseStyles["--card-foreground"] = "#fafafa";
			baseStyles["--popover"] = "#171717";
			baseStyles["--popover-foreground"] = "#fafafa";
			baseStyles["--primary"] = "#e5e5e5";
			baseStyles["--primary-foreground"] = "#171717";
			baseStyles["--secondary"] = "#262626";
			baseStyles["--secondary-foreground"] = "#fafafa";
			baseStyles["--muted"] = "#262626";
			baseStyles["--muted-foreground"] = "#a1a1a1";
			baseStyles["--accent"] = "#262626";
			baseStyles["--accent-foreground"] = "#fafafa";
			baseStyles["--destructive"] = "#ff6568";
			baseStyles["--border"] = "#ffffff1a";
			baseStyles["--input"] = "#ffffff26";
			baseStyles["--ring"] = "#737373";
		}

		if (primaryColor) {
			baseStyles["--primary"] = primaryColor;
		}

		return baseStyles as React.CSSProperties;
	};

	return (
		<div
			className={cn(
				"smeduverse-widget",
				getPositionClasses(),
				darkMode ? "dark" : "",
			)}
			style={getCustomStyles()}
		>
			{/* Chat Window */}
			<div
				className={cn("smeduverse-chat-window", isOpen ? "open" : "closed")}
				style={{
					height: isOpen ? (isExpanded ? "80vh" : "600px") : "0px",
					width: isOpen ? (isExpanded ? "920px" : "400px") : "0px",
				}}
			>
				{/* Header */}
				<div className="smeduverse-header">
					<div className="smeduverse-header-left">
						<div className="smeduverse-avatar">
							<Sparkles className="h-4 w-4" />
						</div>
						<div>
							<h3 className="smeduverse-title">{title}</h3>
							<p className="smeduverse-status">
								<span className="smeduverse-status-dot" />
								Online
							</p>
						</div>
					</div>
					<div className="smeduverse-header-actions">
						<button
							onClick={() => setIsExpanded(!isExpanded)}
							type="button"
							className="smeduverse-header-button expand"
						>
							{isExpanded ? (
								<Minimize2 className="h-4 w-4" />
							) : (
								<Maximize2 className="h-4 w-4" />
							)}
						</button>
						<button
							onClick={() => setIsOpen(false)}
							type="button"
							className="smeduverse-header-button danger"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>

				{/* Messages Area */}
				<div className="smeduverse-messages">
					{messages.length === 0 && (
						<div className="smeduverse-welcome">
							<div className="smeduverse-welcome-icon">
								<Bot className="h-8 w-8 opacity-50" />
							</div>
							<div>
								<h4>Halo, Bapak/Ibu Guru!</h4>
								<p>
									Saya siap membantu menganalisis nilai siswa, membuat RPP, atau
									menjawab pertanyaan seputar kurikulum.
								</p>
							</div>
							<div className="smeduverse-suggestions">
								<button
									type="button"
									onClick={() => {
										setInput(
											"Buatkan rencana pembelajaran untuk topik Fotosintesis kelas 7",
										);
									}}
									className="smeduverse-suggestion"
								>
									"Buatkan RPP Fotosintesis kelas 7"
								</button>
								<button
									type="button"
									onClick={() => {
										setInput(
											"Bagaimana cara meningkatkan motivasi siswa yang rendah?",
										);
									}}
									className="smeduverse-suggestion"
								>
									"Tips motivasi siswa"
								</button>
							</div>
						</div>
					)}

					<Conversation>
						<ConversationContent>
							{messages.map((m) => (
								<Fragment key={m.id}>
									<Message from={m.role} className="max-w-[90%]">
										<MessageContent
											className={cn(
												"flex gap-3 max-w-full",
												m.role === "user" ? "ml-auto flex-row-reverse" : "",
											)}
										>
											<div
												className={cn(
													"smeduverse-message-avatar",
													m.role === "user" ? "user" : "assistant",
												)}
											>
												{m.role === "user" ? (
													<User className="h-4 w-4" />
												) : (
													<Bot className="h-4 w-4" />
												)}
											</div>
											<div
												className={cn(
													"smeduverse-message-bubble",
													m.role === "user" ? "user" : "assistant",
												)}
											>
												{m.parts.map((part, i) => {
													switch (part.type) {
														case "text":
															return (
																<MessageResponse key={`${m.role}-${i}`}>
																	{part.text}
																</MessageResponse>
															);
													}
												})}
											</div>
										</MessageContent>
									</Message>
								</Fragment>
							))}
						</ConversationContent>
					</Conversation>

					{isLoading && (
						<div className="smeduverse-loading">
							<div className="smeduverse-loading-avatar">
								<Bot className="h-4 w-4 animate-pulse" />
							</div>
							<div className="smeduverse-loading-dots">
								<span className="smeduverse-loading-dot" />
								<span className="smeduverse-loading-dot" />
								<span className="smeduverse-loading-dot" />
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input Area */}
				<div className="smeduverse-input">
					<form onSubmit={handleSubmit} className="smeduverse-input-form">
						<button
							type="button"
							onClick={() => setMessages([])}
							className="smeduverse-input-clear"
							title="Mulai Percakapan Baru"
						>
							<RotateCcw className="h-5 w-5" />
						</button>
						<div className="smeduverse-input-field">
							<input
								ref={inputRef}
								value={input || ""}
								onChange={handleInputChange}
								placeholder="Ketik pesan Anda..."
								className="smeduverse-input-text"
							/>
						</div>
						<button
							type="submit"
							disabled={isLoading || !input?.trim()}
							className={cn(
								"smeduverse-input-send",
								input?.trim() ? "enabled" : "disabled",
							)}
						>
							<Send className="h-5 w-5" />
						</button>
					</form>
					<div className="smeduverse-input-footer">
						Didukung oleh AI. Mohon verifikasi informasi penting.
					</div>
				</div>
			</div>

			{/* Floating Action Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn("smeduverse-fab", isOpen ? "open" : "closed")}
			>
				{isOpen ? (
					<X className="h-6 w-6" />
				) : (
					<div className="relative">
						<Bot className="h-7 w-7" />
						<span className="smeduverse-fab-status" />
					</div>
				)}
			</button>
		</div>
	);
}
