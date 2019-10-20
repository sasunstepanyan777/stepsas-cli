import { join } from 'path';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

export interface IWebpackConfig extends Configuration {
	readonly devServer?: DevServerConfiguration;
}

export default (env: any): IWebpackConfig => {

	const devMode = env.development ? true : env.production ? false : true;

	return {

		mode: devMode ? 'development' : 'production',

		context: join(__dirname, 'src'),

		entry: {
			main: './main.ts',
			styles: './styles.scss'
		},

		output: {
			path: join(__dirname, 'dist'),
			filename: '[name].[hash].js'
		},

		resolve: {
			extensions: ['.tsx', '.ts', '.js']
		},

		module: {
			rules: [
				{
					test: /.ts$/,
					exclude: /(node_modules|custom-elements)/,
					loader: require.resolve('ts-loader')
				},
				{
					test: /.html$/,
					loader: require.resolve('html-loader')
				},
				{
					test: /(sa|sc|c)ss$/,
					use: [
						{
							loader: devMode ? require.resolve('style-loader') : MiniCssExtractPlugin.loader
						},
						{
							loader: require.resolve('css-loader'),
							options: {
								sourceMap: true
							}
						},
						{
							loader: require.resolve('sass-loader'),
							options: {
								sourceMap: true
							}
						}
					]
				}
			]
		},

		devServer: {
			publicPath: '/',
			overlay: true,
			historyApiFallback: true,
			stats: {
				colors: true,
				assets: false,
				modules: false,
				entrypoints: false,
				builtAt: false,
				version: false,
				hash: false
			}
		},

		plugins: [
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: './index.html'
			}),
			new MiniCssExtractPlugin({
				filename: 'styles-[contenthash].css'
			}),
			new HotModuleReplacementPlugin()
		],

		watch: devMode
	};
};
