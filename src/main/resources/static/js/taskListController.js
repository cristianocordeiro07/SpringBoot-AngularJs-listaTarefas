const appTaskList = angular.module("appTaskList", []);
appTaskList.controller("taskListController", function ($scope, $http) {

    $scope.taskToDo = [];
    $scope.taskInProgress = [];
    $scope.taskDone = [];

    $scope.task = {};
    $scope.editing = false;
    $scope.controlValidateFields =  {
        title: true,
        description: true
    };

    /**
     * Busca todas as tarefas
     */
    $scope.listTasks = function () {

        $scope.loadTaskByStatus('TODO');
        $scope.loadTaskByStatus('IN_PROGRESS');
        $scope.loadTaskByStatus('DONE');
    };

    /**
     * Carrega uma lista de tarefas com base no status
     * @param status
     */
    $scope.loadTaskByStatus = function (status) {
        $http({method: 'GET', url: 'tasklist/' + status})
            .then(function (response) {
                switch (status) {
                    case 'TODO':
                        $scope.taskToDo = response.data;
                        break;
                    case 'IN_PROGRESS':
                        $scope.taskInProgress = response.data;
                        break;
                    case 'DONE':
                        $scope.taskDone = response.data;
                        break;
                }
            }, function (response) {
            });
    };


    /**
     * Altera o status de uma tarefa
     */
    $scope.changeTaskStatus = function (id, status) {

        $http({method: 'GET', url: 'tasklist/changeTaskStatus/' + id + '/' + status})
            .then(function () {
                $scope.loadTaskByStatus(status);
            }, function (response) {
            });
    };

    /**
     * Abre modal para criação de tarefa
     */
    $scope.openModalTask = function (task) {

        const newTask = !task;

        if(newTask){
            $scope.controlValidateFields =  {
                title: true,
                description: true
            };
            $scope.task = {};
            $scope.editing = false;
        } else {
            $scope.task = angular.copy(task);
            $scope.editing = true;
        }

        $('#modalTask').modal('show');
    };

    /**
     * Salvar tarefa
     */
    $scope.saveTask = function () {
        if(validateFields()){
            if($scope.editing){
                $scope.editTask();
            } else {
                $scope.createTask();
            }
        }
    };

    /**
     * Criação de tarefa
     */
    $scope.createTask = function () {
        $http({method: 'POST', url: 'tasklist/createTask', data: $scope.task})
            .then(function () {
                $scope.listTasks();
                $('#modalTask').modal('hide');
            }, function (response) {
            });
    };

    /**
     * Edição de tarefa
     */
    $scope.editTask = function () {
        $http({method: 'POST', url: 'tasklist/editTask', data: $scope.task})
            .then(function () {
                $('#modalTask').modal('hide');
                $scope.listTasks();
            }, function (response) {
            });
    };

    /**
     * Confirmação de exclusão
     */
    $scope.confirmDeleteTask = function () {
        $('#modalTask').modal('hide');
        $('#modalConfirmDelete').modal('show');
    };


    /**
     * Fecha modal de exclusão
     */
    $scope.closeModalConfirmDeleteTask = function () {
        $('#modalTask').modal('show');
        $('#modalConfirmDelete').modal('hide');
    };


    /**
     * Exclusão de tarefa
     */
    $scope.deleteTask = function () {

        const task = $scope.task;
        $http({method: 'DELETE', url: 'tasklist/' + task.id})
            .then(function () {
                $('#modalTask').modal('hide');
                $('#modalConfirmDelete').modal('hide');
                $scope.listTasks();
            }, function (response) {
            });
    };

    /**
     * Validação de campos
     * @returns {boolean}
     */
    function validateFields(){

        let validate = true;

        //Validação título
        if(!$scope.task.title || $scope.task.title.length > 100) {

            $scope.controlValidateFields.title = false;

            if(!$scope.task.title){
                $scope.controlValidateFields.messageTitle = 'Campo obrigatório.';
            }
            else if($scope.task.title.length > 100){
                $scope.controlValidateFields.messageTitle = 'Máximo de 100 caracteres.';
            }

            validate = false;
        } else {
            $scope.controlValidateFields.title = true;
        }

        //Validação descrição
        if(!$scope.task.description || $scope.task.description.length > 2000) {

            $scope.controlValidateFields.description = false;

            if(!$scope.task.description){
                $scope.controlValidateFields.messageDescription = 'Campo obrigatório.';
            }
            else if($scope.task.description.length > 2000) {
                $scope.controlValidateFields.messageDescription = 'Máximo de 2000 caracteres.';
            }

            validate = false;
        }
        else {
            $scope.controlValidateFields.description = true;
        }

        return validate;
    }

    $scope.init = function () {
        $scope.listTasks();
    };

    $scope.init();

}).directive('dragDrop',  function() {
    return {
        link:function(scope,element){
            if($(element).attr("draggable") != "false"){
                element.attr("draggable", "true");
            }
            element.on('dragover', function(event) {
                event.preventDefault();
            });
            element.on('drop', function(event) {

                const arrayTarget = ['TODO' , 'IN_PROGRESS', 'DONE'];
                arrayTarget.forEach(function (target) {
                    $('#'+target).removeClass('to-drop');
                });

                event.preventDefault();
                const data = JSON.parse(event.originalEvent.dataTransfer.getData("Text"));
                const taskId = data.id;

                //Altera o status, se mover para outra lista
                const statusTarget = $(event.target).closest('.task-list').attr('id');
                const statusFrom = data.from;
                if(statusTarget === statusFrom) {
                    return;
                }

                const getMappedTaskList = function (list) {

                    let listArray;
                    switch (list) {
                        case 'TODO':
                            listArray = scope.taskToDo;
                            break;
                        case 'IN_PROGRESS':
                            listArray = scope.taskInProgress;
                            break;
                        case 'DONE':
                            listArray = scope.taskDone;
                            break;
                    }

                    return listArray;
                };

                //Listas from e target
                let listFrom = getMappedTaskList(statusFrom);
                let listTarget = getMappedTaskList(statusTarget);

                //Retira da lista que arrastou
                const indexToRemove = listFrom.findIndex(obj => obj['id'] == taskId);
                listFrom.splice(indexToRemove, 1);

                scope.changeTaskStatus(taskId, statusTarget);
            });
            element.on('dragstart', function(event) {

                const from = $(event.target).parent().parent().attr('id');
                const id = event.target.getAttribute('id');

                //adiciona estilo
                const arrayTarget = ['TODO' , 'IN_PROGRESS', 'DONE'];
                arrayTarget.forEach(function (target) {

                    if(target !== from){
                        $('#'+target).addClass('to-drop');
                    }
                });

                //Monta objeto de tarefa movimentada
                const taskMoved = {
                    id: id,
                    from: from
                };
                const jsonTask = JSON.stringify(taskMoved);
                event.originalEvent.dataTransfer.setData("Text",jsonTask);
                scope.$apply();
            });
            element.on('mouseup', function() {
                return true;
            });
            element.on('dragend', function() {

                //Remoção de estilo
                const arrayTarget = ['TODO' , 'IN_PROGRESS', 'DONE'];
                arrayTarget.forEach(function (target) {
                    $('#'+target).removeClass('to-drop');
                });
                return true;
            });
        }
    };
}).directive('formatStatus', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            ctrl.$formatters.unshift(function (status) {
                if(status === "TODO") {
                    return "Pendente";
                } else if(status === "IN_PROGRESS") {
                    return "Em progresso";
                } else if(status === "DONE") {
                    return "Concluída";
                }
            });
        }
    };
}]);