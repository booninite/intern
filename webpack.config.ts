import { join } from 'path';
import { Configuration } from 'webpack';

const mode =
  process.env['NODE_ENV'] === 'production' ||
  process.env['INTERN_BUILD'] === 'release'
    ? 'production'
    : 'development';

const common: Configuration = {
  mode,
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.ts/,
        use: {
          loader: 'ts-loader',
          options: {
            silent: true,
            configFile: 'tsconfig-browser.json'
          }
        }
      }
    ],
    // benchmark's code makes webpack sad; tell webpack not to look at it
    noParse: /benchmark\.js/
  },
  performance: {
    // Hides a warning about large bundles.
    hints: false
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  stats: 'errors-warnings'
};

module.exports = [
  {
    ...common,
    entry: getEntries(),
    output: {
      filename: '[name].js',
      path: join(__dirname, '_build', 'browser')
    }
  }
];

function getEntries() {
  const baseDir = join(__dirname, 'src', 'core', 'browser');
  return {
    intern: join(baseDir, 'intern.ts'),
    remote: join(baseDir, 'remote.ts'),
    config: join(baseDir, 'config.ts')
  };
}
