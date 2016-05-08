angular.module('todoApp', ['ui.router'])
.controller('TodoListController', function ($scope, $http, $rootScope, userService) {
  var todoList = this
  todoList.selected = userService.getSelect();
  todoList.enrolled = userService.get();
  todoList.subjects = userService.getSub();
  if(todoList.subjects.length==0){
    $http.get('../../../subjects/list.json')
    .success(function (data) {
      todoList.subjects = data;

      for (a = 0;a < todoList.subjects.length; a++) {
        todoList.selected[todoList.subjects.id] = {['id'] : "---"};
        $http.get('../../../subjects/'+todoList.subjects[a].id+'.json')
        .success((function(a){
          return function(response){
            todoList.subjects[a]['description'] = response.description
          }
        })(a))
        .error(function (data, status, headers, config) {
             //  Do some error handling here
           });
      }

      for (i = 0; i < todoList.subjects.length; i++) {
        $http.get('../../../subjects/sections/'+todoList.subjects[i].id+'.json')
        .success((function(i){
          return function(response){
            todoList.subjects[i]['sections'] = response
            todoList.subjects[i]['credit_type'] = 'credit'
            if(i==todoList.subjects.length-1)useService.syncSubject();
          }
        })(i))
        .error((function(i){
          return function (data, status, headers, config){
            todoList.subjects[i]['sections'] = []
            if(i==todoList.subjects.length-1)useService.syncSubject();
          }
        })(i));
      }
    })
    .error(function (data, status, headers, config) {
             //  Do some error handling here
             console.log("Error");
           });
  }
  todoList.select = function(subject,section){
    todoList.selected[subject.id] = section;
    console.log(todoList.selected[subject.id])
    userService.syncSelect(todoList.selected);
  }

  todoList.enroll = function (obj) {
    userService.add(obj);
    todoList.enrolled = userService.get();
    console.log(todoList.enrolled);
  }

  $(document).ready(function() {
    $(".search").keyup(function () {
      var searchTerm = $(".search").val();
      var listItem = $('.results tbody').children('tr');
      var searchSplit = searchTerm.replace(/ /g, "'):containsi('")

      $.extend($.expr[':'], {'containsi': function(elem, i, match, array){
        return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
      }
    });

      $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function(e){
        $(this).attr('visible','false');
      });

      $(".results tbody tr:containsi('" + searchSplit + "')").each(function(e){
        $(this).attr('visible','true');
      });

      var jobCount = $('.results tbody tr[visible="true"]').length;
      $('.counter').text(jobCount + ' item');

      if(jobCount == '0') {$('.no-result').show();}
      else {$('.no-result').hide();}
    });
  });
})
.controller('homeController', function ($scope, $http, $rootScope, userService) {
  var home = this
  home.subjects = userService.getSub();
  home.selected = userService.getSelect();
  home.enrolled = userService.get();

  if(home.subjects.length==0){
    $http.get('../../../subjects/list.json')
    .success(function (data) {
      home.subjects = data;

      for (a = 0;a < home.subjects.length; a++) {
        home.selected[home.subjects.id] = {['id'] : "---"};
        $http.get('../../../subjects/'+home.subjects[a].id+'.json')
        .success((function(a){
          return function(response){
            home.subjects[a]['description'] = response.description;
          }
        })(a))
        .error(function (data, status, headers, config) {
             //  Do some error handling here
           });
      }

      for (i = 0; i < home.subjects.length; i++) {
        $http.get('../../../subjects/sections/'+home.subjects[i].id+'.json')
        .success((function(i){
          return function(response){
            home.subjects[i]['sections'] = response;
            home.subjects[i]['credit_type'] = 'credit';
          }
        })(i))
        .error((function(i){
          return function (data, status, headers, config){
            home.subjects[i]['sections'] = [];
          }
        })(i));
      }
    })
    .error(function (data, status, headers, config) {
             //  Do some error handling here
             console.log("Error");
           });
  }
  console.log("Home!!!");
  home.drop = function(id){
    userService.drop(id);
    home.enrolled = userService.get();
  }
})
.service('userService', function(){
  var subjects = [];
  var enroll = {};
  var selected = {};
  console.log("Service!!!");

  this.add = function(subject){
    enroll[subject.id] = selected[subject.id].id;
  }
  this.drop = function(id){
    console.log(id);
    console.log(selected[id]);
    delete enroll[id];
    selected[id]={['id'] : "---"};
    
  }
  this.get = function(){
    return enroll;
  }
  this.syncSelect = function(select){
    selected = select;
  }
  this.getSelect = function(){
    return selected;
  }
  this.syncSubject = function(sub){
    subjects = sub;
  }
  this.getSub = function(){
    return subjects;
  }
});
