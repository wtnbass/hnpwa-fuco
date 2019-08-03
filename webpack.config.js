const pkg = require("./package.json");
const path = require("path");

const postcssPresetEnv = require("postcss-preset-env");
const cssnano = require("cssnano");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AssetsManifestPlugin = require("webpack-assets-manifest");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const prod = {
  mode: "production"
};

const dev = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "dist"
  }
};

const htmlMinifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true
};

function postcssPlugins() {
  const plugins = [
    postcssPresetEnv({
      autoprefixer: {
        grid: "autoplace",
        flexbox: "no-2009"
      }
    })
  ];

  if (isProduction) {
    plugins.push(
      cssnano({
        preset: "default"
      })
    );
  }
  return plugins;
}

module.exports = Object.assign({}, isProduction ? prod : dev, {
  entry: "./src/hnpwa-app.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[contenthash:8].chunk.js"
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: [{ loader: "eslint-loader", options: { formatter: "codeframe" } }]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.css$/,
        use: [
          "to-string-loader",
          "css-loader",
          { loader: "postcss-loader", options: { plugins: postcssPlugins } }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: "public",
        to: "",
        ignore: ["index.html"]
      }
    ]),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      inject: true,
      minify: isProduction ? htmlMinifyOptions : false,
      isProduction
    }),
    new AssetsManifestPlugin({
      output: "assets-manifest.json",
      publicPath: "dist"
    }),
    isProduction &&
      new SWPrecacheWebpackPlugin({
        cacheId: `${pkg.name}-v${pkg.version}-${Date.now()}`,
        filename: "service-worker.js",
        minify: true,
        staticFileGlobsIgnorePatterns: [/\.map$/, /assets-manifest\.json$/]
      })
  ].filter(Boolean),
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          warning: false,
          mangle: true,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      })
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          priority: -10
        }
      }
    }
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
});
