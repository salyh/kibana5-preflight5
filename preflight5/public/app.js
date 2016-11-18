import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import mainTemplate from './templates/index.html';

uiRoutes.enable();
uiRoutes
.when('/', {
  template: mainTemplate,
  controller: 'mainController',
  controllerAs: 'ctrl'
});

uiModules
.get('app/preflight_5', [])
.controller('mainController', function ($scope, $route, $interval, $http) {
  $scope.title = 'Preflight 5e';
  $scope.description = 'An awesome Kibana plugin44';

  console.log("exec");

  $http.get('../api/preflight_5/example').then((response) => {
      console.log(response.data);
      //$scope.indices = response.data;
      this.preflightInfo = response.data;
  });
});
