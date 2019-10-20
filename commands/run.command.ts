import webpack, { Compiler } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { resolve } from 'path';
import webpackConfigFunction, { IWebpackConfig } from '../webpack/webpack.config';
import { DevServer } from '../constants/constants';

export default function() {
  const webpackConfig: IWebpackConfig = webpackConfigFunction({
    development: true
  });

  webpackConfig.context = resolve(process.cwd(), 'src');
  (webpackConfig.entry as any).polyfills = [resolve(process.cwd(), 'node_modules/@webcomponents/custom-elements/custom-elements.min.js')];
  webpackConfig.output.path = resolve(process.cwd(), 'dist');

  const devServerOptions = Object.assign({}, webpackConfig.devServer, {
    contentBase: resolve(process.cwd(), 'dist'),
  });

  const compiler: Compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, devServerOptions);

  server.listen(DevServer.PORT, DevServer.HOST, () => {
    console.log(`Starting server on http://${DevServer.HOST}:${DevServer.PORT}`);
  });
}
