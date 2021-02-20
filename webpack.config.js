const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist/js'),
    },
    resolve: {
        alias: {
            'three/OrbitControls': path.join(__dirname, 'node_modules/three/examples/js/controls/OrbitControls.js'),
		    'three/GLTFLoader': path.join(__dirname, 'node_modules/three/examples/js/loaders/GLTFLoader.js'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            THREE: 'three',
        }),
        new CopyPlugin({
            patterns: [{
                from: '**/*',
                to: 'assets',
                context: 'src/assets', 
            }],
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
    ],
    module: {
        rules: [{
            test: /\.(glb|gltf)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: 'assets/models/',
                },
            }],
        }],
    },
};