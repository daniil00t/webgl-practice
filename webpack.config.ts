import * as path from 'path';
import 'webpack';
const HTMLWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
import 'webpack-dev-server';

const config = {
	mode: 'development',
	context: path.resolve(__dirname, 'src'),
	entry: '/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[contenthash].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			 },
			 {
				test: /\.s[ac]ss$/i,
				use: [
				  // Creates `style` nodes from JS strings
				  "style-loader",
				  // Translates CSS into CommonJS
				  "css-loader",
				  // Compiles Sass to CSS
				  "sass-loader",
				],
			 },
		]
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js', ".scss", ".css"],
		alias: {
			"@core": path.resolve(__dirname, "src/core"),
			"@shaders": path.resolve(__dirname, "src/shaders"),
			"@modules": path.resolve(__dirname, "src/modules"),
			"@styles": path.resolve(__dirname, "src/styles"),
		}
	},
	devtool: "source-map",
	target: ["web", "es6"], // combining targets
	devServer: {
		port: 4200,
		hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
		https: false, // true for self-signed, object for cert authority
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: './index.html',
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
			  {
				 from: path.resolve(__dirname, 'src/libs'),
				 to: path.resolve(__dirname, 'dist/libs')
			  }
			]
		 }),
	],
	
};

export default config;