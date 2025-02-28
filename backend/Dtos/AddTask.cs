namespace TaskManagement.Dtos
{
    public partial class AddTask
    {
        public string Task_Title { get; set; }
        public string Task_Description { get; set; }
        public string Task_Priority { get; set; }
        public string Task_Status { get; set; }

        public AddTask()
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