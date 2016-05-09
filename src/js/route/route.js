angular.module('todoApp')
.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise("/myCourse");
  //
  // Now set up the states
  $stateProvider
    .state('myCourse', {
      url: "/myCourse",
      templateUrl: "src/view/myCourse.tmpl"
    })
    .state('enroll', {
      url: "/enroll",
      templateUrl: "src/view/enroll.tmpl"
    })
    .state('login', {
      url: "/login",
      templateUrl: "src/view/login.tmpl"
    })
});
