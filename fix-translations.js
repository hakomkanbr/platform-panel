const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'packages/apps/ecommerce/src/commerce/app/catalog/products/variants-workspace.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace t("key", "Default value") with t("key") || "Default value"
content = content.replace(/t\((["'][^"']+["']),\s*(["'][^"']+["'])\)/g, 't($1) || $2');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed translations in variants-workspace.tsx');
