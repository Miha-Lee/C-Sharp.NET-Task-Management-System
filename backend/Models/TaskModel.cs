namespace TaskManagement.Models
{
    public partial class TaskModel
    {
        public int Task_id { get; set; }
        public int User_id { get; set; }
        public string Task_Title { get; set; }
        public string Task_Description { get; set; }
        public string Task_Priority { get; set; }
        public string Task_Status { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime Updated_at { get; set; }

        public TaskModel()
        {
            if (Task_Title == null)
            {
                Task_Title = "";
            }

            if (Task_Description == null)
            {
                Task_Description = "";
            }

            if (Task_Priority == null)
            {
                Task_Priority = "";
            }

            if (Task_Status == null)
            {
                Task_Status = "";
            }
        }
    }
}