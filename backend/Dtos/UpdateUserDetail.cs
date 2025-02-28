namespace TaskManagement.Dtos
{
    public partial class UpdateUserDetail
    {
        public string First_Name { get; set; }
        public string Last_Name { get; set; }

        public UpdateUserDetail()
        {
            if (First_Name == null)
            {
                First_Name = "";
            }

            if (Last_Name == null)
            {
                Last_Name = "";
            }
        }
    }
}