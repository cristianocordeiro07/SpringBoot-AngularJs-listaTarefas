package com.tasklist.controller;

import com.tasklist.domain.Task;
import com.tasklist.domain.TaskStatus;
import com.tasklist.service.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("tasklist")
public class TaskListController {

    private TaskListService service;

    @Autowired
    public TaskListController(TaskListService service)
    {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Task>> findAll()
    {
        try
        {
            return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
        }
        catch(Exception ex)
        {
            return new ResponseEntity(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{status}")
    public ResponseEntity<List<Task>> findTaskByStatus(@PathVariable("status") final TaskStatus status)
    {
        try
        {
            return new ResponseEntity<>(service.findTaskByStatus(status), HttpStatus.OK);
        }
        catch(Exception ex)
        {
            return new ResponseEntity(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/createTask")
    public ResponseEntity<Task> createTask(@RequestBody Task task)
    {
        try
        {
            return new ResponseEntity<>(service.createTask(task), HttpStatus.CREATED);
        }
        catch(Exception ex)
        {
            return new ResponseEntity(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/editTask")
    public ResponseEntity<Task> editTask(@RequestBody Task task)
    {
        try
        {
            return new ResponseEntity<>(service.editTask(task), HttpStatus.OK);
        }
        catch(Exception ex)
        {
            return new ResponseEntity(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable("id") final long id)
    {
        try
        {
            service.deleteTask(id);
            return new ResponseEntity<>("Task Deleted", HttpStatus.NO_CONTENT);
        }
        catch(Exception ex)
        {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("changeTaskStatus/{id}/{status}")
    public ResponseEntity<Task> changeTaskStatus(@PathVariable("id") final long id, @PathVariable("status") final TaskStatus status)
    {
        try
        {
            return new ResponseEntity<>(service.changeTaskStatus(id, status), HttpStatus.OK);
        }
        catch(Exception ex)
        {
            return new ResponseEntity(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
