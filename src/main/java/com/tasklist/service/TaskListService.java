package com.tasklist.service;

import com.tasklist.domain.Task;
import com.tasklist.domain.TaskStatus;

import java.util.List;

public interface TaskListService {

    List<Task> findAll();

    List<Task> findTaskByStatus(TaskStatus status);

    Task createTask(Task task);

    Task editTask(Task task);

    void deleteTask(long id);

    Task changeTaskStatus(long id, TaskStatus status);
}
