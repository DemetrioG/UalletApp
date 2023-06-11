/* Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require("path");

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    alias: {
      "@services": path.resolve(__dirname, "src", "services"),
      "@utils": path.resolve(__dirname, "src", "utils"),
      "@styles": path.resolve(__dirname, "src", "styles"),
      "@components": path.resolve(__dirname, "src", "components"),
      "@context": path.resolve(__dirname, "src", "context"),
    },
  },
};
