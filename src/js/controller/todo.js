angular.module('todoApp', ['ui.router'])
  .controller('TodoListController', function($scope, $http, $rootScope, userService, $location) {
    var todoList = this
    if (userService.getId() == "") {
      console.log("Redirect");
      $location.path("/login");
    }
    todoList.selected = userService.getSelect();
    todoList.enrolled = userService.get();
    todoList.subjects = userService.getSub();
    if (todoList.subjects.length == 0) {
      $http.get('https://whsatku.github.io/skecourses/list.json')
        .success(function(data) {
          todoList.subjects = data;

          for (a = 0; a < todoList.subjects.length; a++) {
            todoList.selected[todoList.subjects.id] = {
              ['id']: "---"
            };
            $http.get('https://whsatku.github.io/skecourses/' + todoList.subjects[a].id + '.json')
              .success((function(a) {
                return function(response) {
                  todoList.subjects[a]['description'] = response.description;
                  todoList.subjects[a]['credit'] = response.credit;
                }
              })(a))
              .error(function(data, status, headers, config) {
                //  Do some error handling here
              });
          }


          for (i = 0; i < todoList.subjects.length; i++) {
            $http.get('https://whsatku.github.io/skecourses/sections/' + todoList.subjects[i].id + '.json')
              .success((function(i) {
                return function(response) {
                  todoList.subjects[i]['sections'] = response;
                  todoList.subjects[i]['credit_type'] = 'credit';
                }
              })(i))
              .error((function(i) {
                return function(data, status, headers, config) {
                  todoList.subjects[i]['sections'] = []
                }
              })(i));
          }
        })
        .error(function(data, status, headers, config) {
          //  Do some error handling here
          console.log("Error");
        });
    }
    todoList.select = function(subject, section) {
      todoList.selected[subject.id] = section;
      console.log(todoList.selected[subject.id])
      userService.syncSelect(todoList.selected);
    }
    todoList.getId = function() {
      return userService.getId();
    }

    todoList.enroll = function(obj) {
      userService.add(obj);
      todoList.enrolled = userService.get();
      console.log(todoList.enrolled);
    }

    $(document).ready(function() {
      $('[data-tooltip="true"]').tooltip({
        container: 'body',
        placement: 'bottom'
      });
      $(".search").keyup(function() {
        var searchTerm = $(".search").val();
        var listItem = $('.results tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('")

        $.extend($.expr[':'], {
          'containsi': function(elem, i, match, array) {
            return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
          }
        });

        $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function(e) {
          $(this).attr('visible', 'false');
        });

        $(".results tbody tr:containsi('" + searchSplit + "')").each(function(e) {
          $(this).attr('visible', 'true');
        });

        var jobCount = $('.results tbody tr[visible="true"]').length;
        $('.counter').text(jobCount + ' item');

        if (jobCount == '0') {
          $('.no-result').show();
        } else {
          $('.no-result').hide();
        }
      });
    });

  })
  .controller('homeController', function($scope, $http, $rootScope, userService, $location) {
    var home = this
    if (userService.getId() == "") {
      console.log("Redirect");
      $location.path("/login");
    }
    home.subjects = userService.getSub();
    home.selected = userService.getSelect();
    home.enrolled = userService.get();

    if (home.subjects.length == 0) {
      $http.get('https://whsatku.github.io/skecourses/list.json')
        .success(function(data) {
          home.subjects = data;

          for (a = 0; a < home.subjects.length; a++) {
            home.selected[home.subjects.id] = {
              ['id']: "---"
            };
            $http.get('https://whsatku.github.io/skecourses/' + home.subjects[a].id + '.json')
              .success((function(a) {
                return function(response) {
                  home.subjects[a]['description'] = response.description;
                  home.subjects[a]['credit'] = response.credit;
                }
              })(a))
              .error(function(data, status, headers, config) {
                //  Do some error handling here
              });
          }

          for (i = 0; i < home.subjects.length; i++) {
            $http.get('https://whsatku.github.io/skecourses/sections/' + home.subjects[i].id + '.json')
              .success((function(i) {
                return function(response) {
                  home.subjects[i]['sections'] = response;
                  home.subjects[i]['credit_type'] = 'credit';
                }
              })(i))
              .error((function(i) {
                return function(data, status, headers, config) {
                  home.subjects[i]['sections'] = [];
                }
              })(i));
          }
        })
        .error(function(data, status, headers, config) {
          //  Do some error handling here
          console.log("Error");
        });
    }
    home.drop = function(id) {
      userService.drop(id);
      home.enrolled = userService.get();
    }

    home.getId = function() {
      return userService.getId();
    }
    home.isEmpty = function(obj) {
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      // null and undefined are "empty"
      if (obj == null) return true;

      // Assume if it has a length property with a non-zero value
      // that that property is correct.
      if (obj.length > 0) return false;
      if (obj.length === 0) return true;

      // Otherwise, does it have any properties of its own?
      // Note that this doesn't handle
      // toString and valueOf enumeration bugs in IE < 9
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
      }

      return true;
    }
    home.toJson = function() {
      var temp = [];
      Object.keys(home.enrolled).forEach(function(key, index) {
        var course = home.subjects.filter(function(obj) {
          return obj.id == key;
        })[0];
        var section = course.sections.filter(function(obj) {
          return obj.id == home.enrolled[key];
        })[0];
        temp.push({
          ['course_id']: key,
          ['name']: course.name,
          ['section']: section
        });
      });
      return temp;
    }
    $('[data-tooltip="true"]').tooltip({
      container: 'body',
      placement: 'bottom'
    });

  })
  .controller('loginController', function($scope, userService) {
    var login = this
    login.login = function(user) {
      userService.setId(user);
    }
    login.check = function() {
      return !(userService.getId() == "");
    }
    login.getId = function() {
      return userService.getId();
    }
    login.logout = function() {
      userService.logout();
    }

  })
  .service('userService', function($location) {
    var username = "";
    var subjects = [];
    var enroll = {};
    var selected = {};
    if (username == "") {
      console.log("Redirect");
      $location.path("/login");
    }

    this.add = function(subject) {
      enroll[subject.id] = selected[subject.id].id;
    }
    this.drop = function(id) {
      delete enroll[id];
      selected[id] = {
        ['id']: "---"
      };

    }
    this.get = function() {
      return enroll;
    }
    this.syncSelect = function(select) {
      selected = select;
    }
    this.getSelect = function() {
      return selected;
    }
    this.syncSubject = function(sub) {
      subjects = sub;
    }
    this.getSub = function() {
      return subjects;
    }
    this.setId = function(user) {
      //if(user == "b5610546281"){
      if(true){
        username = user;
        $location.path("/myCourse");
      }
      else $location.path("/login");
    }
    this.logout = function() {
      username = "";
    }
    this.getId = function() {
      return username;
    }
  })
  .directive('tooltip', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $(element).hover(function() {
          // on mouseenter
          $(element).tooltip('show');
          if (tooltips) {
            tooltips.remove();
          }

        }, function() {
          // on mouseleave
          $(element).tooltip('hide');
        });
      }
    };
  });
