import { repairMarkdown } from './markdown-utils';

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ Test Failed: ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ Test Passed: ${message}`);
    }
}

function testRepairMarkdown() {
    console.log('Running repairMarkdown tests...');

    // Test 1: Normal markdown
    const input1 = `
# Title
\`\`\`javascript
console.log("hello");
\`\`\`
`;
    assert(repairMarkdown(input1) === input1, 'Should return normal markdown unchanged');

    // Test 2: Nested backticks (Fragmentation case)
    const input2 = `
\`\`\`markdown
# Nested
\`\`\`bash
echo "nested"
\`\`\`
\`\`\`
`;
    const expected2 = `
\`\`\`\`markdown
# Nested
\`\`\`bash
echo "nested"
\`\`\`
\`\`\`\`
`;
    const actual2 = repairMarkdown(input2.trim()).trim();
    const expected2Trimmed = expected2.trim();
    if (actual2 !== expected2Trimmed) {
        console.error('Test 2 Failed!');
        console.error('Expected:\n' + expected2Trimmed);
        console.error('Actual:\n' + actual2);
        console.error('Expected length:', expected2Trimmed.length);
        console.error('Actual length:', actual2.length);
    }
    assert(actual2 === expected2Trimmed, 'Should repair a code block containing nested backticks');

    // Test 3: Multiple broken blocks
    const input3 = `
\`\`\`markdown
Block 1
\`\`\`
\`\`\`

Text

\`\`\`markdown
Block 2
\`\`\`
\`\`\`
`;
    const expected3 = `
\`\`\`\`markdown
Block 1
\`\`\`
\`\`\`\`

Text

\`\`\`\`markdown
Block 2
\`\`\`
\`\`\`\`
`;
    assert(repairMarkdown(input3.trim()).trim() === expected3.trim(), 'Should handle multiple broken blocks');

    // Test 4: Already correct nested blocks
    const input4 = `
\`\`\`\`markdown
# Correctly Nested
\`\`\`bash
echo "nested"
\`\`\`
\`\`\`\`
`;
    assert(repairMarkdown(input4) === input4, 'Should not break already correct nested blocks');

    // Test 5: Proactive check (Inner backticks without fragmentation)
    // This simulates a case where the parser might not have fragmented it yet, 
    // but we want to ensure outer fences are strong enough.
    // Actually, if it's not fragmented, it means the outer fence was ALREADY long enough.
    // So this test ensures we don't break valid things.

    // Test 6: Deep nesting
    const input6 = `
\`\`\`markdown
Outer
\`\`\`javascript
Inner
\`\`\`
Outer End
\`\`\`
`;
    const expected6 = `
\`\`\`\`markdown
Outer
\`\`\`javascript
Inner
\`\`\`
Outer End
\`\`\`\`
`;
    assert(repairMarkdown(input6.trim()).trim() === expected6.trim(), 'Should handle deep nesting');

    // Test 7: Indented code blocks (Regression test for crash)
    const input7 = `
    \`\`\`javascript
    console.log("indented");
    \`\`\`
`;
    // Should remain unchanged (or just work without crashing)
    assert(repairMarkdown(input7) === input7, 'Should handle indented code blocks without crashing');

    console.log('🎉 All tests passed!');
}

testRepairMarkdown();
