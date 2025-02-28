namespace TaskManagement.Dtos
{
    public partial class UserDetail
    {
        public string Email { get; set; }
        public string First_Name { get; set; }
        public string Last_Name { get; set; }

        public UserDetail()
        {
            if (Email == null)
            {
                Email = "";
            }

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