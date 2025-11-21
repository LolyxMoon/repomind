import { RepoCard } from "./RepoCard";
import { DeveloperCard } from "./DeveloperCard";
import ReactMarkdown from "react-markdown";

interface ParsedContent {
    type: "markdown" | "repo-card" | "developer-card";
    content: string | Record<string, string>;
}

export function parseCardContent(text: string): ParsedContent[] {
    const parts: ParsedContent[] = [];
    let currentIndex = 0;

    // Regex to match custom cards
    const cardRegex = /:::(repo-card|developer-card)\n([\s\S]*?):::/g;
    let match;

    while ((match = cardRegex.exec(text)) !== null) {
        // Add markdown before the card
        if (match.index > currentIndex) {
            const markdownText = text.slice(currentIndex, match.index).trim();
            if (markdownText) {
                parts.push({ type: "markdown", content: markdownText });
            }
        }

        // Parse card data
        const cardType = match[1] as "repo-card" | "developer-card";
        const cardContent = match[2];
        const cardData: Record<string, string> = {};

        cardContent.split("\n").forEach((line) => {
            const [key, ...values] = line.split(":");
            if (key && values.length > 0) {
                cardData[key.trim()] = values.join(":").trim();
            }
        });

        parts.push({ type: cardType, content: cardData });
        currentIndex = match.index + match[0].length;
    }

    // Add remaining markdown after the last card
    if (currentIndex < text.length) {
        const markdownText = text.slice(currentIndex).trim();
        if (markdownText) {
            parts.push({ type: "markdown", content: markdownText });
        }
    }

    return parts;
}

interface EnhancedMarkdownProps {
    content: string;
    components?: any;
}

export function EnhancedMarkdown({ content, components }: EnhancedMarkdownProps) {
    const parts = parseCardContent(content);

    return (
        <>
            {parts.map((part, index) => {
                if (part.type === "markdown") {
                    return (
                        <ReactMarkdown key={index} components={components}>
                            {part.content as string}
                        </ReactMarkdown>
                    );
                } else if (part.type === "repo-card") {
                    const data = part.content as Record<string, string>;
                    return (
                        <RepoCard
                            key={index}
                            owner={data.owner || ""}
                            name={data.name || ""}
                            description={data.description}
                            stars={data.stars ? parseInt(data.stars) : undefined}
                            forks={data.forks ? parseInt(data.forks) : undefined}
                            language={data.language}
                        />
                    );
                } else if (part.type === "developer-card") {
                    const data = part.content as Record<string, string>;
                    return (
                        <DeveloperCard
                            key={index}
                            username={data.username || ""}
                            name={data.name}
                            avatar={data.avatar}
                            bio={data.bio}
                            location={data.location}
                            blog={data.blog}
                        />
                    );
                }
                return null;
            })}
        </>
    );
}
