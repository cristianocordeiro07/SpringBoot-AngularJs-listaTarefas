package com.tasklist.service.impl;

import com.tasklist.domain.Task;
import com.tasklist.domain.TaskStatus;
import com.tasklist.repository.TaskListRepository;
import com.tasklist.service.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.GregorianCalendar;
import java.util.List;

@Service
public class TaskListServiceImpl implements TaskListService
{
    @Autowired
    private TaskListRepository repository;

    @Override
    final public List<Task> findAll()
    {
        return repository.findAll();
    }

    @Override
    final public List<Task> findTaskByStatus(TaskStatus status)
    {
        return repository.findTaskByStatus(status);
    }


    @Override
    final public Task createTask(Task task)
    {
        //Cria com a data atual
        task.setCreationDate(new GregorianCalendar());
        task.setStatus(TaskStatus.TODO);
        return repository.saveAndFlush(task);
    }

    @Override
    final public Task editTask(Task task)
    {
        return repository.saveAndFlush(task);
    }

    @Override
    final public void deleteTask(long id)
    {
        repository.deleteById(id);
    }

    @Override
    final public Task changeTaskStatus(long id, TaskStatus status)
    {
        Task task = repository.findById(id).orElse(null);
        if(task != null)
        {
            //Se estiver finilizando a tarefa, seta data de conclusão.
            //Se a tarefa foi reaberta, seta a data de conclusão para null.
            if(status.equals(TaskStatus.DONE))
            {
                task.setFinishDate(new GregorianCalendar());
            }
            else
            {
                task.setFinishDate(null);
            }
            task.setStatus(status);

            return repository.saveAndFlush(task);
        }

        return null;
    }
}
