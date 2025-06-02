// Copyright Epic Games, Inc. All Rights Reserved.

const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = fs.readdirSync('./src', { withFileTypes: true })
    .filter(item => !item.isDirectory())
    .filter(item => path.parse(item.name).ext === '.html')
    .map(htmlFile => path.parse(htmlFile.name).name);

console.log('Webpack entry:', pages.reduce((config, page) => {
    const tsxPath = `./src/${page}.tsx`;
    const tsPath = `./src/${page}.ts`;
    if (fs.existsSync(tsxPath)) {
        config[page] = tsxPath;
    } else if (fs.existsSync(tsPath)) {
        config[page] = tsPath;
    }
    return config;
}, {}));

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        player: './src/player.ts',
        login: './src/login.ts',
        viewer: './src/viewer.ts'
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
