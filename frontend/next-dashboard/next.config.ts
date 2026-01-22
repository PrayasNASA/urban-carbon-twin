import type { NextConfig } from "next";
import path from "path";
const CopyWebpackPlugin = require("copy-webpack-plugin");

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, "node_modules/cesium/Build/Cesium/Workers"),
              to: "../public/cesium/Workers",
            },
            {
              from: path.join(__dirname, "node_modules/cesium/Build/Cesium/ThirdParty"),
              to: "../public/cesium/ThirdParty",
            },
            {
              from: path.join(__dirname, "node_modules/cesium/Build/Cesium/Assets"),
              to: "../public/cesium/Assets",
            },
            {
              from: path.join(__dirname, "node_modules/cesium/Build/Cesium/Widgets"),
              to: "../public/cesium/Widgets",
            },
          ],
        })
      );
      config.plugins.push(
        new webpack.DefinePlugin({
          CESIUM_BASE_URL: JSON.stringify("/cesium"),
        })
      );
    }
    return config;
  },
};

export default nextConfig;
