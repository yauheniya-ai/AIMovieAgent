module.exports = function override(config, env) {
  // Remove or replace the plugin-related code if not needed
  // const MarkdownItPlugin = require('markdown-it-plugin');

  // Example: Modify rules without using any extra plugins
  config.module.rules.push({
    test: /\.md$/,
    use: 'raw-loader', // Or a different loader for markdown files
  });

  return config;
};
