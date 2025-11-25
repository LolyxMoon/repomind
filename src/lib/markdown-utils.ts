/**
 * Repairs markdown content by ensuring code blocks with nested backticks
 * have sufficiently long outer fences to prevent fragmentation.
 */
export function repairMarkdown(content: string): string {
    if (!content.includes('```')) {
        return content;
    }

    const lines = content.split('\n');
    let changesMade = false;

    for (let pass = 0; pass < 3; pass++) {
        changesMade = false;

        const fenceLines = lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed.startsWith('```')) return null;

            const match = trimmed.match(/^(`+)(.*)$/);
            if (!match) return null;

            return {
                index: idx,
                length: match[1].length,
                info: match[2].trim(),
                raw: line
            };
        }).filter(Boolean) as { index: number; length: number; info: string; raw: string }[];

        const blocks: { start: number; end: number; fenceLength: number }[] = [];
        let currentBlockStartFence: { index: number; length: number; info: string; raw: string } | null = null;

        for (let i = 0; i < fenceLines.length; i++) {
            const fence = fenceLines[i];

            if (currentBlockStartFence === null) {
                currentBlockStartFence = fence;
            } else {
                if (fence.length >= currentBlockStartFence.length && fence.info === '') {
                    blocks.push({
                        start: currentBlockStartFence.index,
                        end: fence.index,
                        fenceLength: currentBlockStartFence.length
                    });
                    currentBlockStartFence = null;
                }
            }
        }
        // 3. Reactive Repair (Fragmentation)
        // Check for premature closing first!
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const nextFence = fenceLines.find(f => f.index > block.end);
            if (!nextFence) continue;

            // Check if nextFence is the start of another block
            const isNextFenceStart = blocks.some(b => b.start === nextFence.index);
            const contentBetween = lines.slice(block.end + 1, nextFence.index).join('').trim();

            // Heuristic: Merge if:
            // 1. nextFence is dangling (not a start) - handles "Deep Nesting"
            // 2. OR contentBetween is empty (adjacent) - handles "Multiple Broken Blocks"
            // AND nextFence looks like a closer (no info)
            if ((!isNextFenceStart || contentBetween === '') && nextFence.info === '') {
                const newLength = block.fenceLength + 1;
                const newFenceStr = '`'.repeat(newLength);

                const startLine = lines[block.start];
                // Match leading whitespace, backticks, and info string
                const startMatch = startLine.match(/^(\s*)(`+)(.*)$/);

                if (startMatch) {
                    const indent = startMatch[1];
                    const info = startMatch[3];
                    lines[block.start] = indent + newFenceStr + (info || '');

                    // For the end fence, we should try to match its indentation too,
                    // or just use the same indentation as the start fence?
                    // Usually end fence has same indentation.
                    // Let's check the end fence line.
                    const endLine = lines[nextFence.index];
                    const endMatch = endLine.match(/^(\s*)(`+)/);
                    const endIndent = endMatch ? endMatch[1] : indent;

                    lines[nextFence.index] = endIndent + newFenceStr;

                    changesMade = true;
                    break;
                }
            }
        }

        if (changesMade) continue;

        // 4. Proactive Repair: Check for nested backticks inside blocks
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];

            let maxInnerBackticks = 0;
            for (let j = block.start + 1; j < block.end; j++) {
                const line = lines[j].trim();
                const match = line.match(/^(`{3,})/);
                if (match) {
                    maxInnerBackticks = Math.max(maxInnerBackticks, match[1].length);
                }
            }

            if (maxInnerBackticks >= block.fenceLength) {
                const newLength = maxInnerBackticks + 1;
                const newFenceStr = '`'.repeat(newLength);

                const startLine = lines[block.start];
                const startMatch = startLine.match(/^(\s*)(`+)(.*)$/);

                if (startMatch) {
                    const indent = startMatch[1];
                    const info = startMatch[3];
                    lines[block.start] = indent + newFenceStr + (info || '');

                    // Update end fence
                    const endLine = lines[block.end];
                    const endMatch = endLine.match(/^(\s*)(`+)/);
                    const endIndent = endMatch ? endMatch[1] : indent;

                    lines[block.end] = endIndent + newFenceStr;

                    changesMade = true;
                    break;
                }
            }
        }

        if (changesMade) continue;

        break;
    }

    return lines.join('\n');
}
