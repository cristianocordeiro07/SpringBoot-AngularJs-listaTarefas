package com.tasklist.repository;

import com.tasklist.domain.Task;
import com.tasklist.domain.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskListRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.status = ?1")
    List<Task> findTaskByStatus(TaskStatus status);

    Optional<Task> findById(long id);
}
