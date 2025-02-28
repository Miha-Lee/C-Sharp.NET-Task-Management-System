using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Data;
using TaskManagement.Dtos;
using TaskManagement.Models;

namespace TaskManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]

    public class TaskController : ControllerBase
    {
        private readonly DataContextDapper _dapper;

        public TaskController(IConfiguration config)
        {
            _dapper = new DataContextDapper(config);
        }

        [HttpGet]
        public IEnumerable<TaskList> GetTasks()
        {
            string sql = @"
                SELECT 
                    Tasks.Task_id,
                    Users.First_Name + ' ' + Users.Last_Name AS UserName,
                    Tasks.Task_Title,
                    Tasks.Task_Description,
                    Tasks.Task_Priority,
                    Tasks.Task_Status,
                    Tasks.Created_at
                FROM TaskManagementAPP.Tasks
                    JOIN TaskManagementAPP.Users 
                        ON Users.User_id = Tasks.User_id
                ORDER BY Tasks.Task_id ASC 
            ";

            return _dapper.LoadData<TaskList>(sql);
        }

        [HttpGet("{task_id}")]
        public TaskSingleGet GetTask(int task_id)
        {
            string sql = @$"
                SELECT 
                    Task_id,
                    Task_Title,
                    Task_Description,
                    Task_Priority,
                    Task_Status
                FROM
                    TaskManagementAPP.Tasks
                WHERE Task_id = {task_id}
            ";

            return _dapper.LoadDataSingle<TaskSingleGet>(sql);
        }

        [HttpPost]
        public IActionResult AddTask(AddTask addTask)
        {
            string sql = @$"
                INSERT INTO TaskManagementAPP.Tasks
                (
                    User_id,
                    Task_Title,
                    Task_Description,
                    Task_Priority,
                    Task_Status,
                    Created_at,
                    Updated_at
                )
                VALUES(
                    {this.User.FindFirst("userId")?.Value},
                    '{addTask.Task_Title}',
                    '{addTask.Task_Description}',
                    '{addTask.Task_Priority}',
                    '{addTask.Task_Status}',
                    GETDATE(),
                    GETDATE()
                )
            ";

            if (_dapper.ExecuteSql(sql))
            {
                string taskListLatestSql = @$"
                    SELECT 
                        TOP 1
                        Tasks.Task_id,
                        Users.First_Name + ' ' + Users.Last_Name AS UserName,
                        Tasks.Task_Title,
                        Tasks.Task_Description,
                        Tasks.Task_Priority,
                        Tasks.Task_Status,
                        Tasks.Created_at
                    FROM TaskManagementAPP.Tasks
                    JOIN TaskManagementAPP.Users 
                        ON Users.User_id = Tasks.User_id
                    ORDER BY Tasks.Task_id DESC 
                ";

                TaskList taskListLatest = _dapper.LoadDataSingle<TaskList>(taskListLatestSql);

                return Ok(new
                {
                    Success = true,
                    Message = "Create the Task Successfully",
                    TaskItem = taskListLatest
                });
            }

            throw new Exception("Unable to create a new Task");
        }

        [HttpPut("{task_id}")]
        public IActionResult EditTask(int task_id, TaskSingle taskSingle)
        {
            string singleTaskSql = @$"
                SELECT * FROM TaskManagementAPP.Tasks
                WHERE Task_id = {task_id}
            ";

            if (_dapper.LoadDataSingleCheck<TaskModel>(singleTaskSql) == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Edit the Task Failed, because the task has been deleted"
                });
            }

            string sql = @$"
                UPDATE TaskManagementAPP.Tasks 
                    SET 
                        Task_Title = '{taskSingle.Task_Title}',
                        Task_Description = '{taskSingle.Task_Description}',
                        Task_Priority = '{taskSingle.Task_Priority}',
                        Task_Status = '{taskSingle.Task_Status}',
                        Updated_at = GETDATE()
                    WHERE Task_id = {task_id}
            ";

            if (_dapper.ExecuteSql(sql))
            {
                return Ok(new
                {
                    Success = true,
                    Message = "Edit the Task Successfully"
                });
            }

            throw new Exception("Unable to Edit the task");
        }

        [HttpDelete("{task_id}")]
        public IActionResult DeleteTask(int task_id)
        {
            string singleTaskSql = @$"
                SELECT * FROM TaskManagementAPP.Tasks
                WHERE Task_id = {task_id}
            ";

            if (_dapper.LoadDataSingleCheck<TaskModel>(singleTaskSql) == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Delete the Task Failed, because the task has been deleted"
                });
            }

            string sql = @$"
                DELETE FROM TaskManagementAPP.Tasks
                WHERE Task_id = {task_id}
            ";

            if (_dapper.ExecuteSql(sql))
            {
                return Ok(new
                {
                    Success = true,
                    Message = "Delete the Task Successfully"
                });
            }

            throw new Exception("Unable to delete the task");
        }
    }
}