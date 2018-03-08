exports.config = {
  namespace: 'mycomponent',
  generateDistribution: true,
  serviceWorker: false,
  buildDir: '../../angular-app/src/assets/stencil-build'
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
