// Copyright Epic Games, Inc. All Rights Reserved.

const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

const pages = fs.readdirSync('./src', { withFileTypes: true })
    .filter(item => !item.isDirectory())
    .filter(item => path.parse(item.name).ext === '.html')
    .map(htmlFile => path.parse(htmlFile.name).name);

module.exports = merge(common, {
    mode: 'production',
    optimization: {
      usedExports: true,
      minimize: true,
      minimizer: [new TerserPlugin({
        extractComments: false,
      })],
    },
    stats: 'errors-only',
	performance: {
		hints: false
	},
    entry: {
        player: './src/player.ts',
        login: './src/login.ts',
        viewer: './src/viewer.ts',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'player.html',
            template: './src/player.html',
            chunks: ['player']
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/login.html',
            chunks: ['login']
        }),
        new HtmlWebpackPlugin({
            filename: 'viewer.html',
            template: './src/viewer.html',
            chunks: ['viewer']
        }),
        ...pages.map((page) => new HtmlWebpackPlugin({
            title: `${page}`,
            template: `./src/${page}.html`,
            filename: `${page}.html`,
            chunks: [page],
        }))
    ],
});
