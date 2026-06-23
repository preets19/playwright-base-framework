import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

const targets = [
  { file: 'src/actions/uiActions.ts', defaultCategory: 'interaction' },
  { file: 'src/core/basePage.ts', defaultCategory: 'core' },
  { file: 'src/core/waits.ts', defaultCategory: 'readiness' }
];

const records = [];

for (const target of targets) {
  const filePath = join(repoRoot, target.file);
  const sourceText = readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);

  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isClassDeclaration(node) || !node.name || !isExported(node)) {
      return;
    }

    const className = node.name.text;

    for (const member of node.members) {
      if (!ts.isMethodDeclaration(member) || !member.name || ts.isPrivateIdentifier(member.name)) {
        continue;
      }

      if (isPrivateOrProtected(member)) {
        continue;
      }

      const { description, categoryTag } = readJsDoc(member);

      records.push({
        name: member.name.getText(sourceFile),
        class: className,
        file: target.file,
        parameters: member.parameters.map((param) => ({
          name: param.name.getText(sourceFile),
          type: param.type ? param.type.getText(sourceFile) : ''
        })),
        returnType: member.type ? member.type.getText(sourceFile) : '',
        description,
        category: categoryTag ?? target.defaultCategory,
        categorySource: categoryTag ? 'explicit' : 'inferred'
      });
    }
  });
}

records.sort((left, right) =>
  left.file.localeCompare(right.file) || left.class.localeCompare(right.class) || left.name.localeCompare(right.name)
);

const outputPath = join(repoRoot, '.ai', 'framework-capabilities.json');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(records, null, 2)}\n`, 'utf-8');

console.log(`Wrote ${records.length} method record(s) to .ai/framework-capabilities.json`);

function isExported(node) {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }
  return !!ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
}

function isPrivateOrProtected(member) {
  if (!ts.canHaveModifiers(member)) {
    return false;
  }
  return !!ts
    .getModifiers(member)
    ?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword || modifier.kind === ts.SyntaxKind.ProtectedKeyword
    );
}

function readJsDoc(member) {
  const nodesAndTags = ts.getJSDocCommentsAndTags(member);
  let description = '';
  let categoryTag = null;

  for (const node of nodesAndTags) {
    if (ts.isJSDoc(node)) {
      description = commentToText(node.comment);
      // A single /** ... */ block keeps its @tags nested under .tags, not as separate
      // sibling entries in getJSDocCommentsAndTags' result.
      for (const tag of node.tags ?? []) {
        if (tag.tagName.getText() === 'category') {
          categoryTag = commentToText(tag.comment).trim() || categoryTag;
        }
      }
    } else if (ts.isJSDocTag(node) && node.tagName.getText() === 'category') {
      categoryTag = commentToText(node.comment).trim() || categoryTag;
    }
  }

  return { description, categoryTag };
}

function commentToText(comment) {
  if (comment == null) {
    return '';
  }
  if (typeof comment === 'string') {
    return comment.trim();
  }
  return comment
    .map((part) => part.text ?? '')
    .join('')
    .trim();
}
