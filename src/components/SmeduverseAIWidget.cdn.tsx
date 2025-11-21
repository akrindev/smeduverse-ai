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
	}, [messages]);

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
				return "bottom-6 left-6 items-start";
			case "bottom-center":
				return "bottom-6 left-1/2 -translate-x-1/2 items-center";
			case "bottom-right":
			default:
				return "bottom-6 right-6 items-end";
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
				"fixed z-[99999] flex flex-col gap-4 font-sans",
				getPositionClasses(),
				darkMode ? "dark" : "",
			)}
			style={getCustomStyles()}
		>
			{/* Chat Window - CSS Transition instead of Framer Motion */}
			<div
				className={cn(
					"bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right",
					"max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]", // Responsive constraints
					isOpen
						? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
						: "opacity-0 translate-y-4 scale-95 pointer-events-none h-0 w-0 overflow-hidden",
				)}
				style={{
					height: isOpen ? (isExpanded ? "80vh" : "600px") : "0px",
					width: isOpen ? (isExpanded ? "920px" : "400px") : "0px",
				}}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30 backdrop-blur-sm">
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
							<Sparkles className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h3 className="font-semibold text-sm text-foreground">{title}</h3>
							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
								Online
							</p>
						</div>
					</div>
					<div className="flex items-center gap-1">
						<button
							onClick={() => setIsExpanded(!isExpanded)}
							type="button"
							className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors hidden sm:flex"
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
							className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full text-muted-foreground transition-colors"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>

				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
					{messages.length === 0 && (
						<div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground space-y-4">
							<div className="h-16 w-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-2">
								<Bot className="h-8 w-8 opacity-50" />
							</div>
							<div>
								<h4 className="font-medium text-foreground mb-1">
									Halo, Bapak/Ibu Guru!
								</h4>
								<p className="text-sm max-w-[240px] mx-auto">
									Saya siap membantu menganalisis nilai siswa, membuat RPP, atau
									menjawab pertanyaan seputar kurikulum.
								</p>
							</div>
							<div className="grid grid-cols-1 gap-2 w-full max-w-xs text-xs">
								<button
									type="button"
									onClick={() => {
										setInput(
											"Buatkan rencana pembelajaran untuk topik Fotosintesis kelas 7",
										);
									}}
									className="p-2 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors text-left"
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
									className="p-2 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors text-left"
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
													"h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
													m.role === "user"
														? "bg-primary text-primary-foreground border-primary"
														: "bg-secondary text-secondary-foreground border-border",
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
													"p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
													m.role === "user"
														? "bg-primary text-primary-foreground rounded-tr-none"
														: "bg-card border border-border rounded-tl-none",
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
						<div className="flex gap-3 max-w-[85%]">
							<div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border">
								<Bot className="h-4 w-4 animate-pulse" />
							</div>
							<div className="p-3 rounded-2xl rounded-tl-none bg-card border border-border text-sm shadow-sm flex items-center gap-1">
								<span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
								<span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
								<span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input Area */}
				<div className="p-4 bg-card border-t border-border">
					<form
						onSubmit={handleSubmit}
						className="relative flex items-end gap-2"
					>
						<button
							type="button"
							onClick={() => setMessages([])}
							className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
							title="Mulai Percakapan Baru"
						>
							<RotateCcw className="h-5 w-5" />
						</button>
						<div className="relative flex-1">
							<input
								ref={inputRef}
								value={input || ""}
								onChange={handleInputChange}
								placeholder="Ketik pesan Anda..."
								className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
							/>
						</div>
						<button
							type="submit"
							disabled={isLoading || !input?.trim()}
							className={cn(
								"p-2.5 rounded-xl transition-all duration-200",
								input?.trim()
									? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
									: "bg-secondary text-muted-foreground cursor-not-allowed",
							)}
						>
							<Send className="h-5 w-5" />
						</button>
					</form>
					<div className="text-[10px] text-center text-muted-foreground mt-2">
						Didukung oleh AI. Mohon verifikasi informasi penting.
					</div>
				</div>
			</div>

			{/* Floating Action Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 hover:scale-105 active:scale-95",
					isOpen
						? "bg-secondary text-foreground rotate-90"
						: "bg-primary text-primary-foreground hover:shadow-primary/25",
				)}
			>
				{isOpen ? (
					<X className="h-6 w-6" />
				) : (
					<div className="relative">
						<Bot className="h-7 w-7" />
						<span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
					</div>
				)}
			</button>
		</div>
	);
}
